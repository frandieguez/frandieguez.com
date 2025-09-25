---
id: 287
title: Getting things done algorithm
description: Getting things done algorithm
publishDate: 2009-09-04T18:51:07+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=262
permalink: /blog/2009/09/getting-things-done-algorithm/
dsq_thread_id:
  - "668106293"
categories:
  - Uncategorized
---
```ruby
# Make sure all inboxes are empty.
def process (inboxes)
  inboxes.each { |inbox|
    inbox.each { |item|
      if item.requires_action? then
        if item.takes_epsilon_time? then
          item.do()
        elsif item.can_be_delegated? then
          item.delegate
          waiting_for.append(item)
        else
          deferred.append(item)
        end
      elsif item.is_needed_later? then
        filing_system.append(item)
      elsif item.maybe_wanted_later?
        someday_maybe.append(item)
      else
        trash.append(time)
      end
    }
  }
end
```
<div class="aligncenter">
Taked from http://paste.ubuntu.com/263929/ and translated to <a title="Ruby Language Web site" href="http://www.ruby-lang.org/es/">Ruby language</a>.
</div>
