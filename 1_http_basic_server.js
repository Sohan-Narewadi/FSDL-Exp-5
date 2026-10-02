// Basic Node.js server using the built-in http module.
// Demonstrates: basic routing + serving HTML/JSON + using a callback (fs.readFile).
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const patientsFile = path.join(__dirname, "data", "patients.json");

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);

  if (req.url === "/" || req.url === "/home") {
    // Basic route returning a simple HTML page
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <head><title>Urine Strip Reader - Node HTTP Server</title></head>
        <body>
          <h1>Urine Test Strip Reader (Point-of-Care)</h1>
          <p>Basic Node.js http server is running.</p>
          <p>Try <a href="/api/patients">/api/patients</a> for the JSON report.</p>
        </body>
      </html>
    `);
  } else if (req.url === "/api/patients") {
    // Demonstrates the callback pattern: fs.readFile takes a callback
    // that runs once the file has finished loading (asynchronously).
    fs.readFile(patientsFile, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Could not read patient data" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Route not found");
  }
});

server.listen(PORT, () => {
  console.log(`Basic http server running at http://localhost:${PORT}/`);
});
