/*
 * script.js – ROI Calculator logic
 *
 * Formulas used:
 *   Net Profit      = Amount Returned − Amount Invested
 *   ROI (%)         = (Net Profit / Amount Invested) × 100
 *   Annualized ROI  = ((Amount Returned / Amount Invested) ^ (1 / Years)) − 1
 *
 * All numeric inputs are validated; invalid / empty values are treated as 0
 * so the page never crashes — it just shows "--" or 0 where appropriate.
 */

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------
const investedInput  = document.getElementById("amount-invested");
const returnedInput  = document.getElementById("amount-returned");
const yearsSelect   = document.getElementById("investment-years");

const netProfitEl    = document.getElementById("net-profit");
const roiEl         = document.getElementById("roi-percent");
const annualizedEl  = document.getElementById("annualized-roi");

const resetBtn      = document.getElementById("reset-btn");

// ---------------------------------------------------------------------------
// Utility: format a number as locale-aware currency (USD)
// ---------------------------------------------------------------------------
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Utility: format a number as a percentage with 2 decimals
// ---------------------------------------------------------------------------
function formatPercent(value) {
  return value.toFixed(2) + "%";
}

// ---------------------------------------------------------------------------
// Core calculation — called on every input change
// ---------------------------------------------------------------------------
function calculateROI() {
  // 1. Read raw values
  const invested = parseFloat(investedInput.value) || 0;
  const returned = parseFloat(returnedInput.value) || 0;
  const years    = parseInt(yearsSelect.value, 10) || 1;

  // 2. Compute results
  const netProfit = returned - invested;

  let roiPercent = 0;
  if (invested !== 0) {
    roiPercent = (netProfit / invested) * 100;
  }

  let annualized = 0;
  if (invested !== 0 && returned >= 0 && years > 0) {
    annualized = (Math.pow(returned / invested, 1 / years) - 1) * 100;
  }

  // 3. Update the DOM with formatted values
  //    Use a tiny animation class for visual feedback
  [netProfitEl, roiEl, annualizedEl].forEach((el) => {
    el.classList.remove("result-updating");
    // Force reflow so the animation re-triggers
    void el.offsetWidth;
    el.classList.add("result-updating");
  });

  netProfitEl.textContent   = formatCurrency(netProfit);
  roiEl.textContent        = formatPercent(roiPercent);

  // Annualized ROI: show "--" when invested is 0
  if (invested === 0) {
    annualizedEl.textContent = "--";
  } else {
    annualizedEl.textContent = formatPercent(annualized);
  }

  // 4. Color-code net-profit & ROI
  if (netProfit >= 0) {
    netProfitEl.className = "result-card text-2xl font-bold text-green-600";
    roiEl.className       = "result-card text-2xl font-bold text-green-600";
  } else {
    netProfitEl.className = "result-card text-2xl font-bold text-red-600";
    roiEl.className       = "result-card text-2xl font-bold text-red-600";
  }
}

// ---------------------------------------------------------------------------
// Reset all fields to defaults
// ---------------------------------------------------------------------------
function resetForm() {
  investedInput.value = "";
  returnedInput.value = "";
  yearsSelect.value   = "1";
  calculateROI();
}

// ---------------------------------------------------------------------------
// Attach event listeners
// ---------------------------------------------------------------------------
// "input" fires on every keystroke so results update live
investedInput.addEventListener("input", calculateROI);
returnedInput.addEventListener("input", calculateROI);
yearsSelect.addEventListener("change", calculateROI);

resetBtn.addEventListener("click", resetForm);

// ---------------------------------------------------------------------------
// Run once on page load so the UI shows initial (empty) state
// ---------------------------------------------------------------------------
calculateROI();
