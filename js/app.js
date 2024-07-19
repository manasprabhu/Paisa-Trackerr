// Transaction Management
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const netIncomeEl = document.getElementById('netIncome');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const renderTransactions = () => {
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${transaction.date} - ${transaction.description} - ${transaction.category} - ${transaction.amount}
            <button onclick="deleteTransaction(${index})">Delete</button>
        `;
        transactionList.appendChild(li);
    });
    calculateSummary();
};

const addTransaction = (transaction) => {
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
};

const deleteTransaction = (index) => {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
};

const calculateSummary = () => {
    const totalIncome = transactions
        .filter(transaction => transaction.category === 'Income')
        .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
    const totalExpenses = transactions
        .filter(transaction => transaction.category !== 'Income')
        .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
    const netIncome = totalIncome - totalExpenses;

    totalIncomeEl.textContent = totalIncome.toFixed(2);
    totalExpensesEl.textContent = totalExpenses.toFixed(2);
    netIncomeEl.textContent = netIncome.toFixed(2);
};

transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;

    if (date && description && category && amount) {
        const transaction = {
            date,
            description,
            category,
            amount: parseFloat(amount)
        };
        addTransaction(transaction);
        transactionForm.reset();
    } else {
        alert('Please fill in all fields');
    }
});

renderTransactions();