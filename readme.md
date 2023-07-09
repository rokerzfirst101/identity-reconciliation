## Identity Reconciliation Service

This service reconciles identity data as per the problem specificaation provided [here](https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-53392ab01fe149fab989422300423199).

The backend server is developed using ```TypeScript using Express.js```.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)

## Prerequisites
Before you begin make sure you have met the following requirements:
- You have installed [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/).

## Getting Started
Clone the repository to your local machine:

```bash
git clone https://github.com/rokerzfirst101/identity-reconcilliation.git
```

Navigate to the project directory:

```bash
cd identity-reconcilliation
```

## Configuration
Update the environment variables in the `.env` file at the root of the project.

Following are the required and configurable env values:

```env
SERVER_PORT=8000 # The port for the service

DB_HOST=localhost # Not to be used with the container, For development purpose only
DB_PORT=4455 # The external port for the mysql container
DB_USER=root # The username required to connect to DB
DB_PASSWORD=password # The password required to connect to DB
```

## Running the Application
To start the application, run the following command:

```bash
docker compose up
```

This will build and run the Docker containers defined in `docker-compose.yml`