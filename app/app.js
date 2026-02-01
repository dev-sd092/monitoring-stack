const express = require("express");
const client = require("prom-client");
const fs = require("fs");

const app = express();
const port = 3000;

/* ---------- METRICS ---------- */
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

/* ---------- LOGGING ---------- */
const logStream = fs.createWriteStream("/var/log/app.log", { flags: "a" });

app.use((req, res, next) => {
  res.on("finish", () => {
    const log = `${req.method} ${req.path} ${res.statusCode}`;
    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });
    logStream.write(log + "\n");
    console.log(log);
  });
  next();
});

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("Monitoring stack working");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
