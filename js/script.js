      // Global Chart References
      let propertyChartInstance = null;
      let waterfallChartInstance = null;

      // Initialize Page & Dynamic Calculations
      document.addEventListener("DOMContentLoaded", () => {
        setupMobileNavigation();
        initPropertyChart();
        initWaterfallChart();
        setupInteractiveCalculator();
      });

      // Chart 1: Property Value & Debt Comparison
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

      // Chart 2: Capital Waterfall Chart
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
                  "#10b981", // Sale: Green
                  "#ef4444", // Discharge: Red
                  "#059669", // Equity: Dark Green
                  "#6366f1", // Purchase: Indigo
                  "#3b82f6", // New Loan: Blue
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

      // Setup Interactive Calculator Sliders
      function setupInteractiveCalculator() {
        const sliderSale = document.getElementById("slider-sale");
        const sliderPurchase = document.getElementById("slider-purchase");

        function updateCalculations() {
          const saleVal = parseInt(sliderSale.value);
          const purchaseVal = parseInt(sliderPurchase.value);

          // Update Slider Labels
          document.getElementById("slider-sale-val").textContent =
            "$" + saleVal.toLocaleString();
          document.getElementById("slider-purchase-val").textContent =
            "$" + purchaseVal.toLocaleString();

          // Financial Formulas
          const sellingCosts = Math.round(saleVal * 0.02);
          const totalDebt = 358000;
          const netEquity = saleVal - sellingCosts - totalDebt;

          const stampDuty = 54300; // Fixed estimate for $950k bracket
          const totalAcquisitionRequired = purchaseVal + stampDuty;
          const newLoanRequired = totalAcquisitionRequired - netEquity;

          const newLVR = ((newLoanRequired / purchaseVal) * 100).toFixed(2);

          // Update KPI Elements
          document.getElementById("kpi-target-price").textContent =
            "$" + purchaseVal.toLocaleString();
          document.getElementById("kpi-sale-price").textContent =
            "$" + saleVal.toLocaleString();
          document.getElementById("kpi-lvr").textContent = newLVR + "%";

          // Update Card Breakdown
          document.getElementById("calc-sale-price").textContent =
            "$" + saleVal.toLocaleString();
          document.getElementById("calc-selling-costs").textContent =
            "-$" + sellingCosts.toLocaleString();
          document.getElementById("calc-net-equity").textContent =
            "$" + netEquity.toLocaleString();
          document.getElementById("calc-purchase-price").textContent =
            "$" + purchaseVal.toLocaleString();
          document.getElementById("calc-stamp-duty").textContent =
            "+$" + stampDuty.toLocaleString();
          document.getElementById("calc-new-loan").textContent =
            "$" + newLoanRequired.toLocaleString();

          // Update Charts Dynamically
          if (propertyChartInstance) {
            propertyChartInstance.data.datasets[0].data = [
              saleVal,
              purchaseVal,
            ];
            propertyChartInstance.data.datasets[1].data = [
              totalDebt,
              newLoanRequired,
            ];
            propertyChartInstance.update();
          }

          if (waterfallChartInstance) {
            waterfallChartInstance.data.datasets[0].data = [
              saleVal,
              -totalDebt,
              netEquity,
              -totalAcquisitionRequired,
              newLoanRequired,
            ];
            waterfallChartInstance.update();
          }
        }

        sliderSale.addEventListener("input", updateCalculations);
        sliderPurchase.addEventListener("input", updateCalculations);
      }
