// Demonstrates a custom module built for the Urine Test Strip Reader use case.
const analyteMath = require("./customModules/analyteMath");

console.log("=== Custom Module Demo: analyteMath.js ===\n");

// 1. average() - e.g. averaging repeated RGB brightness readings of one pad
const sampleRgbReadings = [118, 121, 119, 124];
console.log(
  "Average RGB reading for Glucose pad:",
  analyteMath.average(sampleRgbReadings)
);

// 2. unit conversion
console.log(
  "Glucose 250 mg/dL in mmol/L:",
  analyteMath.glucoseMgdlToMmol(250)
);

// 3. abnormal flagging for a single value
console.log(
  "Is Glucose = 250 mg/dL abnormal?",
  analyteMath.isAbnormal("Glucose", 250)
);

// 4. full flagged report for a patient
const patientAnalytes = {
  Glucose: 250,
  Protein: 100,
  pH: 8.5,
  Ketones: 40,
  Blood: 10
};

console.log("\nFull flagged report for patient KJS-P002:");
console.table(analyteMath.buildFlaggedReport(patientAnalytes));
