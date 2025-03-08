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

## The Challenge  
The issue is that **Docker Desktop on Mac with Apple Sillicon cannot run images that are not built for arm64 architectures**. While it can sometimes emulate amd64-based images, it comes with a warning that performance may be unstable.  

Fortunately, technology moves fast, and now there's a solution! I'll show you **how to install Oracle XE on Apple Sillicon**.  

## The Solution: Using Colima  

The key is **Colima**, a lightweight Linux virtual machine that runs on Apple Silicon Macs and enables compatibility with x86-based Docker images.  

## Steps to Install Oracle XE on Mac M1/M2  

### 1️⃣ Install **Homebrew** (if you haven't already)  
👉 [Homebrew Installation Guide](https://brew.sh/index_es)  

### 2️⃣ Install **Colima** using Homebrew  
```sh
brew install colima
```

### 3️⃣ Install Docker

```sh
brew install docker
```


### 4️⃣ Start Colima with the following parameters

```sh
colima start --arch x86_64 --memory 4
```

This ensures that Colima runs in x86_64 mode, allowing us to use non-arm64 images.


### 5️⃣ From the same terminal where Colima is running, pull the Oracle XE image from Docker Hub

```sh
docker pull gvenzl/oracle-xe
```

### 6️⃣ Run the container with persistent storage to keep your database data after a restart

```sh
docker run -d --name oracle_database -p 1521:1521 -e ORACLE_PASSWORD=<your_password> -v oracle-volume:/opt/oracle/oradata gvenzl/oracle-xe
```

This setup ensures that database modifications remain saved, even if you stop and restart the container.

### Accessing the Database

The container is already configured for direct access using the SYS user and the password you set when running docker run.

```sh
docker exec -it oracle_database sqlplus
```

⸻

And that’s it! 🚀 Now you have Oracle Database XE running on your Mac M1/M2 with a simple and efficient setup.