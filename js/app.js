document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");
    const transactionList = document.getElementById("transactionList");
    const totalIncomeEl = document.getElementById("totalIncome");
    const totalExpensesEl = document.getElementById("totalExpenses");
    const netIncomeEl = document.getElementById("netIncome");
    const downloadPdfBtn = document.getElementById("downloadPdf");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function updateSummary() {
        let totalIncome = transactions.filter(t => t.category === "Income").reduce((sum, t) => sum + t.amount, 0);
        let totalExpenses = transactions.filter(t => t.category !== "Income").reduce((sum, t) => sum + t.amount, 0);

        totalIncomeEl.textContent = `₹${totalIncome}`;
        totalExpensesEl.textContent = `₹${totalExpenses}`;
        netIncomeEl.textContent = `₹${totalIncome - totalExpenses}`;
    }

    function addTransactionToUI(transaction) {
        const li = document.createElement("li");
        li.innerHTML = `${transaction.date} - ${transaction.description} 
            <strong>₹${transaction.amount}</strong> (${transaction.category})
            <button class="delete-btn">X</button>`;

        li.querySelector(".delete-btn").addEventListener("click", () => {
            deleteTransaction(transaction.id);
        });

        transactionList.appendChild(li);
    }

    function deleteTransaction(id) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateUI();
    }

    function updateUI() {
        transactionList.innerHTML = "";
        transactions.forEach(addTransactionToUI);
        updateSummary();
    }

    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const transaction = {
            id: Date.now().toString(),
            date: document.getElementById("date").value,
            description: document.getElementById("description").value,
            category: document.getElementById("category").value,
            amount: parseFloat(document.getElementById("amount").value)
        };

        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateUI();
        transactionForm.reset();
    });

    downloadPdfBtn.addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Expense Report", 20, 20);
        transactions.forEach((t, i) => doc.text(`${t.date} - ${t.description}: ₹${t.amount} (${t.category})`, 20, 40 + i * 10));
        doc.save("Expense_Report.pdf");
    });

    updateUI();
});