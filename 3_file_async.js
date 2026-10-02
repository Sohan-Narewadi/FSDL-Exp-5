// Asynchronous file operations demo.
// Writing/reading the report does NOT block the rest of the program -
// notice "This line runs immediately" prints before the file callbacks fire.
const fs = require("fs");
const path = require("path");

const reportPath = path.join(__dirname, "data", "latest_report_async.json");

const report = {
  patientId: "KJS-P004",
  timestamp: new Date().toISOString(),
  analytes: { Glucose: 250, Protein: 100, pH: 8.5 }
};

console.log("1. Starting asynchronous write...");
fs.writeFile(reportPath, JSON.stringify(report, null, 2), (err) => {
  if (err) throw err;
  console.log("3. Write finished (callback fired).");

  console.log("4. Starting asynchronous read...");
  fs.readFile(reportPath, "utf-8", (err, data) => {
    if (err) throw err;
    console.log("5. Read finished (callback fired). Contents:");
    console.log(data);
  });
});

console.log("2. This line runs immediately, before the write finishes.");
