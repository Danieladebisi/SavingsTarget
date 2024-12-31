document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('savings-form');
    const goalSelect = document.getElementById('goal');
    const otherGoalContainer = document.getElementById('other-goal-container');
    const existingLoanSelect = document.getElementById('existing-loan');
    const existingLoanDetails = document.getElementById('existing-loan-details');
    const newLoanSelect = document.getElementById('new-loan');
    const newLoanDetails = document.getElementById('new-loan-details');
    const resultsSection = document.getElementById('results');
    const recalculateButton = document.getElementById('recalculate');
    const readBlogButton = document.getElementById('read-blog');
    const saveResultsButton = document.getElementById('save-results');
    const printResultsButton = document.getElementById('print-results');
    const savingsChartElement = document.getElementById('savings-chart');

    goalSelect.addEventListener('change', function() {
        otherGoalContainer.classList.toggle('hidden', this.value !== 'other');
    });

    existingLoanSelect.addEventListener('change', function() {
        existingLoanDetails.classList.toggle('hidden', this.value !== 'yes');
    });

    newLoanSelect.addEventListener('change', function() {
        newLoanDetails.classList.toggle('hidden', this.value !== 'yes');
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        calculateSavings();
    });

    recalculateButton.addEventListener('click', function() {
        resultsSection.classList.add('hidden');
        form.reset();
        window.scrollTo(0, 0);
    });

    readBlogButton.addEventListener('click', function() {
        window.location.href = 'https://blog.savingstarget.com';
    });

    saveResultsButton.addEventListener('click', saveResults);
    printResultsButton.addEventListener('click', printResults);

    function calculateSavings() {
        const goal = goalSelect.value;
        const otherGoal = document.getElementById('other-goal').value;
        const price = parseFloat(document.getElementById('price').value);
        const income = parseFloat(document.getElementById('income').value);
        const expenses = parseFloat(document.getElementById('expenses').value);
        const hasExistingLoan = existingLoanSelect.value === 'yes';
        const hasNewLoan = newLoanSelect.value === 'yes';
        const initialSavings = parseFloat(document.getElementById('initial-savings').value) || 0;
        const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
        const compoundFrequency = document.getElementById('compound-frequency').value;
        const inflationRate = parseFloat(document.getElementById('inflation-rate').value) || 0;

        let existingLoanAmount = 0, existingLoanMonthlyPayment = 0, existingLoanInterest = 0, existingLoanTerm = 0;
        let newLoanAmount = 0, newLoanInterest = 0, newLoanTerm = 0;

        if (hasExistingLoan) {
            existingLoanAmount = parseFloat(document.getElementById('existing-loan-amount').value);
            existingLoanMonthlyPayment = parseFloat(document.getElementById('existing-loan-monthly-payment').value);
            existingLoanInterest = parseFloat(document.getElementById('existing-loan-interest').value);
            existingLoanTerm = parseFloat(document.getElementById('existing-loan-term').value);
        }

        if (hasNewLoan) {
            newLoanAmount = parseFloat(document.getElementById('new-loan-amount').value);
            newLoanInterest = parseFloat(document.getElementById('new-loan-interest').value);
            newLoanTerm = parseFloat(document.getElementById('new-loan-term').value);
        }

        const monthlySavings = income - expenses - existingLoanMonthlyPayment;
        const totalSavingsNeeded = price - newLoanAmount;
        const monthsToSave = Math.ceil(totalSavingsNeeded / monthlySavings);

        const totalSavings = calculateTotalSavings(initialSavings, monthlySavings, interestRate, compoundFrequency, monthsToSave);
        const inflationAdjustedSavings = calculateInflationAdjustedSavings(totalSavingsNeeded, inflationRate, monthsToSave);

        displayResults(goal, otherGoal, monthlySavings, monthsToSave, hasExistingLoan, existingLoanAmount, existingLoanInterest, existingLoanTerm, hasNewLoan, newLoanAmount, newLoanInterest, newLoanTerm, totalSavings, inflationAdjustedSavings);
        createSavingsChart(initialSavings, monthlySavings, interestRate, compoundFrequency, monthsToSave);
    }

    function displayResults(goal, otherGoal, monthlySavings, monthsToSave, hasExistingLoan, existingLoanAmount, existingLoanInterest, existingLoanTerm, hasNewLoan, newLoanAmount, newLoanInterest, newLoanTerm, totalSavings, inflationAdjustedSavings) {
        const savingsGoal = document.getElementById('savings-goal');
        const monthlySavingsElement = document.getElementById('monthly-savings');
        const monthsToSaveElement = document.getElementById('months-to-save');
        const existingLoanInfo = document.getElementById('existing-loan-info');
        const newLoanInfo = document.getElementById('new-loan-info');
        const totalSavingsElement = document.getElementById('total-savings');
        const inflationAdjustedSavingsElement = document.getElementById('inflation-adjusted-savings');

        const goalName = goal === 'other' ? otherGoal : goal;

        savingsGoal.textContent = `To buy your ${goalName}, you will need to save:`;
        monthlySavingsElement.textContent = `$${monthlySavings.toFixed(2)} every month`;
        monthsToSaveElement.textContent = `for ${monthsToSave} months (${(monthsToSave / 12).toFixed(1)} years)`;
        totalSavingsElement.textContent = `Total savings: $${totalSavings.toFixed(2)}`;
        inflationAdjustedSavingsElement.textContent = `Total savings needed (inflation-adjusted): $${inflationAdjustedSavings.toFixed(2)}`;

        if (hasExistingLoan) {
            existingLoanInfo.textContent = `Existing Loan: $${existingLoanAmount.toFixed(2)} at ${existingLoanInterest}% interest for ${existingLoanTerm} months`;
        } else {
            existingLoanInfo.textContent = '';
        }

        if (hasNewLoan) {
            const monthlyPayment = calculateMonthlyPayment(newLoanAmount, newLoanInterest, newLoanTerm);
            newLoanInfo.textContent = `New Loan: $${newLoanAmount.toFixed(2)} at ${newLoanInterest}% interest for ${newLoanTerm} months. Monthly payment: $${monthlyPayment.toFixed(2)}`;
        } else {
            newLoanInfo.textContent = '';
        }

        resultsSection.classList.remove('hidden');
        alert(`Total Savings: $${totalSavings.toFixed(2)}\nPrincipal Amount: $${(initialSavings + (monthlySavings * monthsToSave)).toFixed(2)}\nTotal Interest Earned: $${(totalSavings - initialSavings - (monthlySavings * monthsToSave)).toFixed(2)}`);
    }

    function calculateMonthlyPayment(loanAmount, interestRate, loanTerm) {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm;
        return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    function calculateTotalSavings(initialSavings, monthlySavings, interestRate, compoundFrequency, months) {
        const r = interestRate / 100;
        const n = getCompoundFrequency(compoundFrequency);
        const t = months / 12;
        const compoundFactor = Math.pow(1 + r/n, n*t);
        return initialSavings * compoundFactor + monthlySavings * ((compoundFactor - 1) / (r/n));
    }

    function calculateInflationAdjustedSavings(totalSavings, inflationRate, months) {
        const years = months / 12;
        return totalSavings * Math.pow(1 + inflationRate/100, years);
    }

    function getCompoundFrequency(frequency) {
        switch(frequency) {
            case 'daily': return 365;
            case 'monthly': return 12;
            case 'quarterly': return 4;
            case 'annually': return 1;
            default: return 12;
        }
    }

    function createSavingsChart(initialSavings, monthlySavings, interestRate, compoundFrequency, months) {
        const ctx = savingsChartElement.getContext('2d');
        const labels = Array.from({length: months + 1}, (_, i) => i);
        const data = labels.map(month => calculateTotalSavings(initialSavings, monthlySavings, interestRate, compoundFrequency, month));

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Savings Growth',
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Savings ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    }
                }
            }
        });
    }

    function saveResults() {
        const resultsText = resultsSection.innerText;
        const blob = new Blob([resultsText], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'savings_results.txt';
        a.click();
    }

    function printResults() {
        window.print();
    }

    // JavaScript for Savings Calculator
    document.getElementById("calculate").addEventListener("click", function(e) {
        e.preventDefault();

        // Retrieve input values
        const initialSavings = parseFloat(document.getElementById("initialSavings").value) || 0;
        const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
        const interestRate = parseFloat(document.getElementById("interestRate").value) / 100 || 0;
        const timePeriod = parseInt(document.getElementById("timePeriod").value) || 0;
        const interestType = document.getElementById("interestType").value;
        const compoundingFrequency = parseInt(document.getElementById("compoundingFrequency").value) || 1;

        // Validation
        if (timePeriod <= 0) {
            alert("Please enter a valid time period.");
            return;
        }

        // Calculation
        let totalSavings = initialSavings;
        let totalInterest = 0;

        if (interestType === "simple") {
            totalInterest = (initialSavings + (monthlyContribution * timePeriod)) * interestRate * timePeriod;
            totalSavings += totalInterest + (monthlyContribution * timePeriod);
        } else if (interestType === "compound") {
            for (let month = 1; month <= timePeriod * 12; month++) {
                totalSavings += monthlyContribution;
                totalSavings += (totalSavings * (interestRate / compoundingFrequency));
            }
            totalInterest = totalSavings - (initialSavings + (monthlyContribution * timePeriod * 12));
        }

        // Display Results
        document.getElementById("resultDisplay").innerHTML = `
            <p><strong>Total Savings:</strong> $${totalSavings.toFixed(2)}</p>
            <p><strong>Principal Amount:</strong> $${(initialSavings + (monthlyContribution * timePeriod * 12)).toFixed(2)}</p>
            <p><strong>Total Interest Earned:</strong> $${totalInterest.toFixed(2)}</p>
        `;

        // Update Chart (if implemented)
        if (typeof updateChart === "function") {
            updateChart(totalSavings, totalInterest);
        }

        alert(`Total Savings: $${totalSavings.toFixed(2)}\nPrincipal Amount: $${(initialSavings + (monthlyContribution * timePeriod * 12)).toFixed(2)}\nTotal Interest Earned: $${totalInterest.toFixed(2)}`);
    });

    // Clear Inputs
    document.getElementById("clear").addEventListener("click", function(e) {
        e.preventDefault();

        document.getElementById("calculatorForm").reset();
        document.getElementById("resultDisplay").innerHTML = "";

        // Clear Chart (if implemented)
        if (typeof clearChart === "function") {
            clearChart();
        }
    });
});