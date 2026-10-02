// Synchronous file operations demo.
// The device would use this to save a completed urinalysis report to disk
// and immediately re-read it to confirm the write - blocking until each
// operation finishes.
const fs = require("fs");
const path = require("path");

const reportPath = path.join(__dirname, "data", "latest_report_sync.json");

const report = {
  patientId: "KJS-P003",
  timestamp: new Date().toISOString(),
  analytes: { Glucose: 100, Protein: 15, pH: 6.5 }
};

console.log("1. Writing report synchronously...");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log("2. Write finished.");

console.log("3. Reading report synchronously...");
const savedReport = fs.readFileSync(reportPath, "utf-8");
console.log("4. Read finished. Contents:");
console.log(savedReport);

console.log("5. This line only runs after both operations complete (blocking).");
