// Mortgage Calculator
(function() {
  let mortgageChart = null;

  // Format currency
  function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Calculate monthly mortgage payment
  function calculateMortgagePayment(principal, annualRate, years) {
    if (principal <= 0 || annualRate < 0 || years <= 0) return 0;

    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;

    if (monthlyRate === 0) {
      return principal / numPayments;
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                          (Math.pow(1 + monthlyRate, numPayments) - 1);

    return monthlyPayment;
  }

  // Get input values
  function getInputValues() {
    return {
      totalAmount: parseFloat(document.getElementById('totalAmount').value) || 0,
      downPaymentPercent: parseFloat(document.getElementById('downPaymentPercent').value) || 0,
      interestRate: parseFloat(document.getElementById('interestRate').value) || 0,
      loanTerm: parseFloat(document.getElementById('loanTerm').value) || 0,
      propertyTaxPercent: parseFloat(document.getElementById('propertyTaxPercent').value) || 0,
      homeInsurance: parseFloat(document.getElementById('homeInsurance').value) || 0,
      hoaFees: parseFloat(document.getElementById('hoaFees').value) || 0,
      pmiPercent: parseFloat(document.getElementById('pmiPercent').value) || 0
    };
  }

  // Calculate all mortgage values
  function calculateMortgage() {
    const inputs = getInputValues();

    // Calculate down payment and loan amount
    const downPayment = (inputs.totalAmount * inputs.downPaymentPercent) / 100;
    const loanAmount = inputs.totalAmount - downPayment;

    // Calculate monthly mortgage payment
    const monthlyMortgagePayment = calculateMortgagePayment(loanAmount, inputs.interestRate, inputs.loanTerm);

    // Calculate monthly property tax
    const annualPropertyTax = (inputs.totalAmount * inputs.propertyTaxPercent) / 100;
    const monthlyPropertyTax = annualPropertyTax / 12;

    // Calculate monthly home insurance
    const monthlyHomeInsurance = inputs.homeInsurance / 12;

    // Calculate PMI (only if down payment is less than 20%)
    let monthlyPMI = 0;
    if (inputs.downPaymentPercent < 20 && loanAmount > 0) {
      const annualPMI = (loanAmount * inputs.pmiPercent) / 100;
      monthlyPMI = annualPMI / 12;
    }

    // Monthly HOA fees
    const monthlyHOA = inputs.hoaFees;

    // Total monthly payment
    const monthlyTotal = monthlyMortgagePayment + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + monthlyHOA;

    return {
      downPayment,
      loanAmount,
      monthlyMortgagePayment,
      monthlyPropertyTax,
      monthlyHomeInsurance,
      monthlyPMI,
      monthlyHOA,
      monthlyTotal
    };
  }

  // Update display values
  function updateDisplay(calculations) {
    document.getElementById('downPaymentValue').textContent = formatCurrency(calculations.downPayment);
    document.getElementById('loanAmountValue').textContent = formatCurrency(calculations.loanAmount);
    document.getElementById('mortgagePaymentValue').textContent = formatCurrency(calculations.monthlyMortgagePayment);
    document.getElementById('propertyTaxValue').textContent = formatCurrency(calculations.monthlyPropertyTax);
    document.getElementById('homeInsuranceValue').textContent = formatCurrency(calculations.monthlyHomeInsurance);
    document.getElementById('pmiValue').textContent = formatCurrency(calculations.monthlyPMI);
    document.getElementById('hoaFeesValue').textContent = formatCurrency(calculations.monthlyHOA);
    document.getElementById('monthlyTotal').textContent = formatCurrency(calculations.monthlyTotal);
  }

  // Update chart
  function updateChart(calculations) {
    const ctx = document.getElementById('mortgageChart');
    if (!ctx) return;

    const chartData = {
      labels: ['Down Payment', 'Loan Amount', 'Monthly Mortgage Payment', 'Property Tax', 'Home Insurance', 'PMI', 'Monthly HOA Fees'],
      datasets: [{
        data: [
          calculations.downPayment,
          calculations.loanAmount,
          calculations.monthlyMortgagePayment,
          calculations.monthlyPropertyTax,
          calculations.monthlyHomeInsurance,
          calculations.monthlyPMI,
          calculations.monthlyHOA
        ],
        backgroundColor: ['#ff4d7e', '#3399ff', '#ffcc33', '#36a2eb', '#99cc33', '#00cccc', '#ff9900'],
        borderWidth: 0
      }]
    };

    const options = {
      cutout: '75%',
      plugins: {
        legend: { display: false }
      }
    };

    if (mortgageChart) {
      mortgageChart.data = chartData;
      mortgageChart.update();
    } else {
      mortgageChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: chartData,
        options: options
      });
    }
  }

  // Recalculate and update everything
  function recalculate() {
    const calculations = calculateMortgage();
    updateDisplay(calculations);
    updateChart(calculations);
  }

  // Initialize calculator
  function initCalculator() {
    // Get all input fields
    const inputs = [
      'totalAmount',
      'downPaymentPercent',
      'interestRate',
      'loanTerm',
      'propertyTaxPercent',
      'homeInsurance',
      'hoaFees',
      'pmiPercent'
    ];

    // Add event listeners to all inputs
    inputs.forEach(function(inputId) {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', recalculate);
        input.addEventListener('change', recalculate);
      }
    });

    // Initial calculation
    recalculate();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }
})();

