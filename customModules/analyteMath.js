// Custom module: math functions used to turn raw colorimetry readings
// into a clinically useful report for the Urine Test Strip Reader use case.

// Normal reference ranges for the 10 reagent pads (mg/dL, pH units, etc.)
const REFERENCE_RANGES = {
  Glucose: { min: 0, max: 15 },
  Protein: { min: 0, max: 15 },
  pH: { min: 4.5, max: 8 },
  Ketones: { min: 0, max: 5 },
  Blood: { min: 0, max: 0 },
  Bilirubin: { min: 0, max: 0 },
  Urobilinogen: { min: 0.1, max: 1 },
  Nitrite: { min: 0, max: 0 },
  Leucocytes: { min: 0, max: 0 },
  SpecificGravity: { min: 1.005, max: 1.03 }
};

// average of an array of numbers, e.g. RGB channel readings for one pad
function average(numbers) {
  const sum = numbers.reduce((total, n) => total + n, 0);
  return sum / numbers.length;
}

// mg/dL -> mmol/L conversion for glucose (basic unit-conversion maths)
function glucoseMgdlToMmol(mgdl) {
  return Number((mgdl / 18.016).toFixed(2));
}

// flags whether a single analyte value falls outside its clinical reference range
function isAbnormal(analyte, value) {
  const range = REFERENCE_RANGES[analyte];
  if (!range) return false;
  return value < range.min || value > range.max;
}

// builds a full flagged report for one patient's 10 analyte readings
function buildFlaggedReport(analytes) {
  return Object.entries(analytes).map(([analyte, value]) => ({
    analyte,
    value,
    range: REFERENCE_RANGES[analyte],
    status: isAbnormal(analyte, value) ? "Abnormal" : "Normal"
  }));
}

module.exports = {
  REFERENCE_RANGES,
  average,
  glucoseMgdlToMmol,
  isAbnormal,
  buildFlaggedReport
};
