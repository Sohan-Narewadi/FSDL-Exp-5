// Pre-renders the Express/EJS app into plain HTML in /docs so it can be hosted on GitHub Pages.
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const analyteMath = require("./customModules/analyteMath");

const patients = JSON.parse(fs.readFileSync("data/patients.json", "utf-8"));
const views = path.join(__dirname, "expressApp", "views");
const out = path.join(__dirname, "docs");

const write = (file, content) => {
  const f = path.join(out, file);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};

const banner = (prefix) => `
  <p style="background:#eef;padding:8px"><em>Static GitHub Pages build of the Express + EJS app (Experiment 5).
  Source: <code>expressApp/server.js</code>. See also the <a href="${prefix}screenshots.html">output screenshots</a>.</em></p>`;

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
fs.mkdirSync(path.join(out, "screenshots"), { recursive: true });
const shots = fs.readdirSync("screenshots").filter((f) => f.endsWith(".png"));
shots.forEach((f) => fs.copyFileSync(path.join("screenshots", f), path.join(out, "screenshots", f)));
write("screenshots.html", `<!DOCTYPE html><html><head><title>Experiment 5 - Output Screenshots</title></head><body>
<a href="index.html">&larr; Back to dashboard</a><h1>Output Screenshots</h1>
${shots.map((f) => `<h3>${f}</h3><img src="screenshots/${f}" style="max-width:100%;border:1px solid #ccc">`).join("\n")}
</body></html>`);
write(".nojekyll", "");
console.log("Static site written to docs/");
