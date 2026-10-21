      // Global Debt State Variables
      let currentDischargeDebt = 358000; // Default scenario

      function switchScenario(amount) {
        currentDischargeDebt = amount;
        const alertBox = document.getElementById("combined-debt-alert");
        const subText = document.getElementById("kpi-discharge-sub");
        const tableDebt = document.getElementById("table-existing-debt");

        if (amount === 658000) {
          alertBox.classList.remove("hidden");
          subText.textContent =
            "Includes BOTH Split Facilities ($358k + $300k)";
          tableDebt.textContent = "$658,000 (Split 1 + Split 2)";
        } else {
          alertBox.classList.add("hidden");
          subText.textContent = "Includes $330k Beerwah IP Split";
          tableDebt.textContent = "$358,000 (Split 1)";
        }

        updateCalculations();
      }

      let propertyChartInstance = null;
      let waterfallChartInstance = null;

      document.addEventListener("DOMContentLoaded", () => {
        setupMobileNavigation();
        initPropertyChart();
        initWaterfallChart();
        setupInteractiveCalculator();
      });

      function initPropertyChart() {
        const ctx = document.getElementById("propertyChart").getContext("2d");
        propertyChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["37 Kilmarnock Way", "4 Terra Firma Cir"],
            datasets: [
              {
                label: "Estimated Valuation",
                data: [730000, 950000],
                backgroundColor: "#3b82f6",
                borderRadius: 6,
              },
              {
                label: "Associated Debt",
                data: [358000, 646900],
                backgroundColor: "#f59e0b",
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { boxWidth: 12, font: { size: 11 } },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return (
                      context.dataset.label +
                      ": $" +
                      context.raw.toLocaleString()
                    );
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return "$" + value / 1000 + "k";
                  },
                },
              },
            },
          },
        });
      }

      function initWaterfallChart() {
        const ctx = document.getElementById("waterfallChart").getContext("2d");
        waterfallChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
              "Sale Proceeds",
              "Discharge Debt",
              "Net Equity",
              "Acquisition Cost",
              "New Loan",
            ],
            datasets: [
              {
                label: "Capital Amount ($)",
                data: [730000, -358000, 357400, -1004300, 646900],
                backgroundColor: [
                  "#10b981",
                  "#ef4444",
                  "#059669",
                  "#6366f1",
                  "#3b82f6",
                ],
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return "$" + Math.abs(context.raw).toLocaleString();
                  },
                },
              },
            },
            scales: {
              y: {
                ticks: {
                  callback: function (value) {
                    return "$" + value / 1000 + "k";
                  },
                },
              },
            },
          },
        });
      }

      function setupInteractiveCalculator() {
        const sliderSale = document.getElementById("slider-sale");
        const sliderPurchase = document.getElementById("slider-purchase");

        sliderSale.addEventListener("input", updateCalculations);
        sliderPurchase.addEventListener("input", updateCalculations);
      }

      function updateCalculations() {
        const sliderSale = document.getElementById("slider-sale");
        const sliderPurchase = document.getElementById("slider-purchase");

        const saleVal = parseInt(sliderSale.value);
        const purchaseVal = parseInt(sliderPurchase.value);

        document.getElementById("slider-sale-val").textContent =
          "$" + saleVal.toLocaleString();
        document.getElementById("slider-purchase-val").textContent =
          "$" + purchaseVal.toLocaleString();

        const sellingCosts = Math.round(saleVal * 0.02);
        const netEquity = saleVal - sellingCosts - currentDischargeDebt;

        const stampDuty = 54300;
        const totalAcquisitionRequired = purchaseVal + stampDuty;
        const newLoanRequired = totalAcquisitionRequired - netEquity;

        const newLVR = ((newLoanRequired / purchaseVal) * 100).toFixed(2);

        // Update KPI Box Elements
        document.getElementById("kpi-target-price").textContent =
          "$" + purchaseVal.toLocaleString();
        document.getElementById("kpi-sale-price").textContent =
          "$" + saleVal.toLocaleString();
        document.getElementById("kpi-discharge-debt").textContent =
          "$" + currentDischargeDebt.toLocaleString();
        document.getElementById("kpi-lvr").textContent = newLVR + "%";

        // LMI Warning Logic
        const lvrBadge = document.getElementById("kpi-lmi-status");
        const lvrBox = document.getElementById("kpi-lvr-box");
        if (newLVR > 80) {
          lvrBadge.textContent = "⚠️ High LVR (>80% Ceiling - LMI Applicable)";
          lvrBadge.className = "text-xs text-red-700 font-bold mt-1";
          lvrBox.className = "bg-red-50 rounded-xl p-4 border border-red-200";
        } else {
          lvrBadge.textContent = "✓ No LMI (<80% Ceiling)";
          lvrBadge.className = "text-xs text-emerald-800 font-semibold mt-1";
          lvrBox.className =
            "bg-stone-50 rounded-xl p-4 border border-stone-200";
        }

        // Update Card Breakdown
        document.getElementById("calc-sale-price").textContent =
          "$" + saleVal.toLocaleString();
        document.getElementById("calc-selling-costs").textContent =
          "-$" + sellingCosts.toLocaleString();
        document.getElementById("calc-discharge-debt").textContent =
          "-$" + currentDischargeDebt.toLocaleString();
        document.getElementById("calc-net-equity").textContent =
          "$" + netEquity.toLocaleString();
        document.getElementById("calc-purchase-price").textContent =
          "$" + purchaseVal.toLocaleString();
        document.getElementById("calc-stamp-duty").textContent =
          "+$" + stampDuty.toLocaleString();
        document.getElementById("calc-new-loan").textContent =
          "$" + newLoanRequired.toLocaleString();

        // Cooling off penalty update
        document.getElementById("cooling-purchase-price").textContent =
          "$" + purchaseVal.toLocaleString();
        document.getElementById("cooling-penalty-val").textContent =
          "$" + Math.round(purchaseVal * 0.002).toLocaleString();

        // Update Charts Dynamically
        if (propertyChartInstance) {
          propertyChartInstance.data.datasets[0].data = [saleVal, purchaseVal];
          propertyChartInstance.data.datasets[1].data = [
            currentDischargeDebt,
            newLoanRequired,
          ];
          propertyChartInstance.update();
        }

        if (waterfallChartInstance) {
          waterfallChartInstance.data.datasets[0].data = [
            saleVal,
            -currentDischargeDebt,
            netEquity,
            -totalAcquisitionRequired,
            newLoanRequired,
          ];
          waterfallChartInstance.update();
        }
      }
