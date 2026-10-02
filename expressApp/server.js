const express = require("express");
const path = require("path");
const fs = require("fs");
const analyteMath = require("../customModules/analyteMath");

const app = express();
const PORT = 3001;

// Built-in middleware to serve static files (CSS) from /public
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const patients = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "patients.json"), "utf-8")
);

function findPatient(id) {
  return patients.find((p) => p.patientId === id);
}

app.get("/", (req, res) => {
  res.render("index", { patients });
});

app.get("/patients/:id", (req, res) => {
  const patient = findPatient(req.params.id);
  if (!patient) {
    return res.status(404).send("Patient not found");
  }

  const flaggedReport = analyteMath.buildFlaggedReport(patient.analytes);
  res.render("report", { patient, flaggedReport });
});

app.get("/api/patients/:id", (req, res) => {
  const patient = findPatient(req.params.id);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }
  res.json(patient);
});

app.listen(PORT, () => {
  console.log(`Express app running at http://localhost:${PORT}/`);
});
