# Node.js Keycloak OAuth 2.0 Demo

This project is a simple, from-scratch Node.js and Express server that demonstrates the complete **OAuth 2.0 Authorization Code Flow** using a self-hosted **Keycloak** server.

Its purpose is to show the bare-metal mechanics of modern authentication without relying on "magic" libraries.

What This Project Does

This app demonstrates the core loop of a **CIAM (Customer Identity and Access Management)** platform:

1.  A user visits the app and clicks "Log in".
2.  The app redirects the user to a Keycloak (Authorization Server) login page.
3.  The user logs in, and Keycloak redirects them back to the app with a temporary `code`.
4.  The app's backend (server) secretly exchanges that `code` (plus a `client_secret`) for an `access_token`.
5.  The app can then use that `access_token` to access protected API endpoints.

Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [Podman](https://podman.io/) (or Docker)
* A running **Keycloak** instance

---

How to Run This Project

1. Start Keycloak

First, get your Keycloak auth server running. This command starts Keycloak in "dev" mode, running on `http://localhost:8080`.

```bash
podman run \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev
