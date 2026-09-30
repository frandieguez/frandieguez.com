---
id: 1717
title: Hardening SSL encryption in an nginx server
description: "POODLE killed SSLv3 for good. The nginx configuration that follows from that — protocols, cipher suite, forward secrecy, OCSP stapling and HSTS — and the two lines that matter more than the cipher list everyone copies."
publishDate: 2014-12-17T00:55:53+00:00
author: Fran Dieguez
layout: post
published: false
tags: ["nginx", "security", "web-servers", "sysadmin"]
guid: http://www.mabishu.com/?p=1717
permalink: /?p=1717
categories:
  - Uncategorized
---
This has been a bad year for SSL. Heartbleed in April, POODLE in October, and a steady trickle of downgrade attacks in between.

The practical upshot of POODLE in particular is not subtle: SSLv3 is broken in a way that cannot be configured around, and the only fix is to stop speaking it. Given the trouble it took to establish that, it is worth going through the whole nginx TLS configuration rather than just deleting one protocol and moving on.

## Protocols

```nginx
ssl on;
ssl_certificate     /usr/share/nginx/conf/server.crt;
ssl_certificate_key /usr/share/nginx/conf/server.key;

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
```

No SSLv3 and no SSLv2. That line is the whole POODLE mitigation.

The objection is always the same: this breaks Internet Explorer 6 on Windows XP, which cannot do TLS at all. That is true, and in December 2014 it is no longer an argument. XP has been unsupported for eight months, and a browser that can only negotiate a protocol with a known padding-oracle attack is not being served by your compatibility — it is being exposed by it.

TLSv1 is still in the list, and it is the line I expect to delete next. It is not broken the way SSLv3 is, but it is old, and everything that matters has supported 1.2 for years now.

## Ciphers

```nginx
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH EDH+aRSA !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";
```

Two things to read here rather than copy.

`ssl_prefer_server_ciphers on` is the more important of the two lines. Without it the *client* chooses from the list, and an attacker who can influence the handshake picks the weakest thing you allow. With it, your ordering wins, which is the only reason ordering the list carefully is worth anything.

The `EECDH` prefixes select ephemeral elliptic-curve Diffie-Hellman — forward secrecy. The session key is derived per connection and thrown away, so recovering the server's private key later does not decrypt traffic captured today. After this year, that stopped being a nicety.

Note `!RC4` at the end. Twelve months ago RC4 was the standard advice as a BEAST workaround; the biases found in it since make that advice obsolete, and following it now leaves you worse off than the attack it was meant to avoid. Cipher lists are not configuration you write once — this one has a shelf life measured in months.

`!3DES` goes further than some guides, and it is the one I would revisit if you have unusual clients.

## Forward secrecy needs a DH parameter file

The `EDH+aRSA` suites need Diffie-Hellman parameters, and nginx defaults to a 1024-bit group — well below what the rest of this configuration is aiming at.

```bash
$ openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

```nginx
ssl_dhparam /etc/nginx/dhparam.pem;
```

That command takes a few minutes and looks like it has hung. It has not; generating primes is genuinely slow.

## Sessions

```nginx
ssl_session_cache   shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;
```

The handshake is the expensive part of TLS, and a shared cache means a resumed connection skips it. 10MB holds roughly 40,000 sessions.

`ssl_session_tickets off` is the one that surprises people. Tickets are a resumption mechanism where the server encrypts the session state and hands it to the client — but nginx generates the ticket key at startup and never rotates it, so a server up for six months has been protecting every ticket with the same key for six months. Recovering that one key retroactively breaks the forward secrecy the cipher list works so hard for. Off until rotation exists.

## OCSP stapling

```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /usr/share/nginx/conf/ca-chain.crt;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

Without stapling, a browser checking whether your certificate has been revoked contacts the CA directly — which is slow, and tells the CA which sites that user is visiting. Stapling has the server fetch the signed response periodically and include it in the handshake.

`resolver` is required and easy to miss: nginx needs to resolve the OCSP responder's hostname itself, and it does not use the system resolver for this. Omit it and stapling silently does nothing, with no error anywhere. Check it explicitly:

```bash
$ openssl s_client -connect example.com:443 -status < /dev/null 2>&1 | grep -A2 'OCSP response'
```

## HSTS

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

Everything above protects a connection that is already HTTPS. HSTS is what stops the connection being plain HTTP in the first place — after the first visit, the browser refuses to speak HTTP to you at all, which closes the redirect window that `sslstrip` lives in.

:::caution
Commit to this before you set it. `includeSubDomains` with a one-year max-age means every subdomain must serve valid HTTPS for a year, and there is no way to take it back — a browser that has seen the header will not talk to you over HTTP again until it expires. Test with `max-age=300` first.
:::

## Then go and measure it

```
https://www.ssllabs.com/ssltest/analyze.html?d=example.com
```

This is the part I would not skip. Reasoning about a cipher list is not the same as knowing what your server negotiates, and SSL Labs tells you which clients you have just locked out — which is the question the whole "but IE6" argument was really about, answered with a list of actual user agents instead of a feeling.

Run it again in six months. The grade will have gone down without you touching anything, because the goalposts move, and that is the correct behaviour for a test of something this year has treated so badly.
