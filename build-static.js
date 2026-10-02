// Pre-renders the Express/EJS app into plain HTML in the repo root so it can be hosted on GitHub Pages.
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const analyteMath = require("./customModules/analyteMath");

const patients = JSON.parse(fs.readFileSync("data/patients.json", "utf-8"));
const views = path.join(__dirname, "expressApp", "views");
const out = __dirname;

const write = (file, content) => {
  const f = path.join(out, file);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};

let index = ejs.render(fs.readFileSync(path.join(views, "index.ejs"), "utf-8"), { patients });
index = index.replace(/href="\/patients\/([^"]+)"/g, 'href="patients/$1.html"').replace("<h1>", banner("") + "<h1>");
write("index.html", index);

for (const patient of patients) {
  const flaggedReport = analyteMath.buildFlaggedReport(patient.analytes);
  let html = ejs.render(fs.readFileSync(path.join(views, "report.ejs"), "utf-8"), { patient, flaggedReport });
  html = html.replace('href="/"', 'href="../index.html"');
  write(`patients/${patient.patientId}.html`, html);
  write(`api/patients/${patient.patientId}.json`, JSON.stringify(patient, null, 2));
}

fs.copyFileSync("expressApp/public/device-photo.jpeg", path.join(out, "device-photo.jpeg"));
write(".nojekyll", "");
console.log("Static site written to the repo root");
