document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('savings-form');
    const goalSelect = document.getElementById('goal');
    const otherGoalContainer = document.getElementById('other-goal-container');
    const existingLoanSelect = document.getElementById('existing-loan');
    const existingLoanDetails = document.getElementById('existing-loan-details');
    const newLoanSelect = document.getElementById('new-loan');
    const newLoanDetails = document.getElementById('new-loan-details');
    const loadingElement = document.getElementById('loading');
    const resultsSection = document.getElementById('results');
    const recalculateButton = document.getElementById('recalculate');
    const readBlogButton = document.getElementById('read-blog');

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
        window.scrollTo(0, 0); // Scroll to top of the page
    });

    readBlogButton.addEventListener('click', function() {
        window.location.href = 'https://example.com/savings-tips'; // Replace with your blog URL
    });

    function calculateSavings() {
        const goal = goalSelect.value;
        const otherGoal = document.getElementById('other-goal').value;
        const price = parseFloat(document.getElementById('price').value);
        const income = parseFloat(document.getElementById('income').value);
        const expenses = parseFloat(document.getElementById('expenses').value);
        const hasExistingLoan = existingLoanSelect.value === 'yes';
        const hasNewLoan = newLoanSelect.value === 'yes';

        let existingLoanAmount = 0;
        let existingLoanMonthlyPayment = 0;
        let existingLoanInterest = 0;
        let existingLoanTerm = 0;
        let newLoanAmount = 0;
        let newLoanInterest = 0;
        let newLoanTerm = 0;

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

        displayResults(goal, otherGoal, monthlySavings, monthsToSave, hasExistingLoan, existingLoanAmount, existingLoanInterest, existingLoanTerm, hasNewLoan, newLoanAmount, newLoanInterest, newLoanTerm);
    }

    function displayResults(goal, otherGoal, monthlySavings, monthsToSave, hasExistingLoan, existingLoanAmount, existingLoanInterest, existingLoanTerm, hasNewLoan, newLoanAmount, newLoanInterest, newLoanTerm) {
        const savingsGoal = document.getElementById('savings-goal');
        const monthlySavingsElement = document.getElementById('monthly-savings');
        const monthsToSaveElement = document.getElementById('months-to-save');
        const existingLoanInfo = document.getElementById('existing-loan-info');
        const newLoanInfo = document.getElementById('new-loan-info');

        const goalName = goal === 'other' ? otherGoal : goal;

        savingsGoal.textContent = `To buy your ${goalName}, you will need to save:`;
        monthlySavingsElement.textContent = `$${monthlySavings.toFixed(2)} every month`;
        monthsToSaveElement.textContent = `for ${monthsToSave} months (${(monthsToSave / 12).toFixed(1)} years)`;

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
    }

    function calculateMonthlyPayment(loanAmount, interestRate, loanTerm) {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm;
        return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
});