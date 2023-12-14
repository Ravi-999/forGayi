// server.js
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { users, invalidatedTokens } = require("./users");

const controller = require("./serverController")();
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

const middlewareFunction = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Token not provided" })
      .end();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Token not provided" })
      .end();
  }
  jwt.verify(token, secretKey, (err) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
    next();
  });
};

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.some((user) => user.username === username)) {
    res.status(400).json("user already exists").end();
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { username, password: hashedPassword };
    users.push(user);

    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user) {
    res.status(401).json("Invalid username or password").end();
    return;
  }
  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json("Invalid username or password").end();
      return;
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/auth/logout", (req, res) => {
  const { token } = req.body;
  invalidatedTokens.push(token);
  res.status(200).json("logged out Successfully").end();
});

app.use("/api/protected", middlewareFunction, controller);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
