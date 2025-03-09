---
id: 1696
title: Install Oracle Database XE on Apple Sillicon
date: 2024-11-17T18:34:00+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1696
categories:
  - Software Development
  - Databases
tags:
  - Oracle XE
  - Mac M1
  - Mac M2
  - Apple Sillicon
  - Docker
  - Colima
  - Software Engineering
  - Database Management
  - Developer Tools
---

For the past year, I've had the privilege of working with MacBook Pro computers, and incredible machine like M3 PRO. I have to say they're  outstanding: fast, efficient, incredible battery life, ...  

But I had a problem… while tinkering with Oracle Database, **it wasn't possible to install Oracle Database XE on Mac computers with M1 chips**.  

The issue is that **Docker Desktop on Mac with Apple Sillicon cannot run images that are not built for arm64 architectures**. While it can sometimes emulate amd64-based images, it comes with a warning that performance may be unstable.  

Fortunately, open source comes in handy, and now there's a solution! The key is **[Colima](https://github.com/abiosoft/colima)**, a lightweight Linux virtual machine that runs on Apple Silicon Macs and enables compatibility with x86-based Docker images.  

## Install the required software

- Install **Homebrew** (if you haven't already)  👉 [Homebrew Installation Guide](https://brew.sh/index_es)  
- Install **Colima** using Homebrew  `brew install colima`
- Install Docker `brew install docker`

## Start Colima

```sh
colima start --arch x86_64 --memory 4
```
These parameters ensure that Colima runs in x86_64 mode, allowing us to use non-arm64 images.

## Run the container 

We now have to run the container with persistent storage to keep your database data after a restart, pass the default database
password, as well as expose the database port to our machine.

```sh
docker run -d --name oracle_database -p 1521:1521 -e ORACLE_PASSWORD=<your_password> -v oracle-volume:/opt/oracle/oradata gvenzl/oracle-xe
```

This setup ensures that database modifications remain saved, even if you stop and restart the container.

### Accessing the Database

The container is already configured for direct access using the SYS user and the password you set when running docker run.

```sh
docker exec -it oracle_database sqlplus
```

For sure you can use [SQLDeveloper](https://www.oracle.com/database/sqldeveloper/) as well to connect to the database.

⸻

And that’s it! 🚀 Now you have Oracle Database XE running on your Mac with Apple Sillicon with a simple and efficient setup.