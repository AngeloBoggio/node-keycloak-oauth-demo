require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { checkAuth } = require("./auth");

const app = express();
const port = 8005;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const SCOPES = "read:user user:email";

// root request
app.get("/", (req, res) => {
  res.send('Hello, World! <a href="/login">Log in with Keycloak</a>');
});

//
app.get("/login", (req, res) => {
  const authUrl = `http://localhost:8080/realms/my-test-world/protocol/openid-connect/auth?client_id=${CLIENT_ID}&scope=openid&redirect_uri=http://localhost:8005/keycloak/callback&response_type=code`;
  console.log("Redirecting user to Keycloak...");
  console.log(`${CLIENT_ID} id: ${CLIENT_SECRET}`);
  res.redirect(authUrl);
});

app.get("/keycloak/callback", async (req, res) => {
  const user_token = req.query.code;

  if (!user_token) {
    console.error("Token was invalid");
    return res.status(400).json({ error: "Missing authorization code" });
  }

  console.log("Caught the code:", user_token);

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("code", user_token);
    params.append("redirect_uri", "http://localhost:8005/keycloak/callback");

    const tokenResponse = await axios.post(
      "http://localhost:8080/realms/my-test-world/protocol/openid-connect/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    res.json({
      message: "Login successful! Copy this token.",
      acces_token: accessToken,
    });
  } catch (error) {
    console.error("Error during token exchange:", error.message);

    if (error.response) {
      console.error("Error data:", error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  }
});

app.get("/test-auth", checkAuth, (req, res) => {
  res.json({
    message: "Middleware passed! Token decoded",
    user_payload: req.user,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
