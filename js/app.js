document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded!"); // Debugging

    const transactionForm = document.getElementById("transactionForm");
    const transactionList = document.getElementById("transactionList");
    const totalIncomeEl = document.getElementById("totalIncome");
    const totalExpensesEl = document.getElementById("totalExpenses");
    const netIncomeEl = document.getElementById("netIncome");
    const downloadPdfBtn = document.getElementById("downloadPdf");
    const resetDataBtn = document.createElement("button");  // Creating Reset Button

    resetDataBtn.textContent = "Reset Data";
    resetDataBtn.classList.add("reset-btn");
    resetDataBtn.style.background = "red";
    resetDataBtn.style.color = "white";
    resetDataBtn.style.border = "none";
    resetDataBtn.style.padding = "10px";
    resetDataBtn.style.marginTop = "10px";
    resetDataBtn.style.cursor = "pointer";
    document.querySelector(".summary-section").appendChild(resetDataBtn);

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function updateSummary() {
        console.log("Updating Summary...");
        let totalIncome = transactions.filter(t => t.category === "Income").reduce((sum, t) => sum + t.amount, 0);
        let totalExpenses = transactions.filter(t => t.category !== "Income").reduce((sum, t) => sum + t.amount, 0);

        totalIncomeEl.textContent = `₹${totalIncome}`;
        totalExpensesEl.textContent = `₹${totalExpenses}`;
        netIncomeEl.textContent = `₹${totalIncome - totalExpenses}`;
    }

    function addTransactionToUI(transaction) {
        const li = document.createElement("li");
        li.id = `transaction-${transaction.id}`;
        li.innerHTML = `
            <span class="transaction-item" data-id="${transaction.id}">
                ${transaction.date} - ${transaction.description} 
                <strong>₹${transaction.amount}</strong> (${transaction.category})
            </span>
            <button class="delete-btn" data-id="${transaction.id}">Delete</button>
        `;

        // Clicking on the transaction redirects to details page
        li.querySelector(".transaction-item").addEventListener("click", function () {
            window.location.href = `transaction.html?id=${transaction.id}`;
        });

        // Delete button functionality
        li.querySelector(".delete-btn").addEventListener("click", function (event) {
            event.stopPropagation(); // Prevents redirection when clicking delete
            deleteTransaction(event.target.dataset.id);
        });

        transactionList.appendChild(li);
    }

    function deleteTransaction(id) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateUI();
    }

    function updateUI() {
        console.log("Updating UI...", transactions);
        transactionList.innerHTML = "";
        transactions.forEach(addTransactionToUI);
        updateSummary();
    }

    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault(); // 🚀 Fixing Refresh Issue!
        console.log("Form Submitted!"); // Debugging

        const date = document.getElementById("date").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (!date || !description || !category || isNaN(amount) || amount <= 0) {
            alert("Please enter valid transaction details!");
            return;
        }

        const transaction = {
            id: Date.now().toString(),
            date: date,
            description: description,
            category: category,
            amount: amount
        };

        transactions.push(transaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        console.log("Transaction added:", transaction); // Debugging
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

    // Reset Data Functionality
    resetDataBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
            transactions = [];
            localStorage.removeItem("transactions");
            updateUI();
            alert("All data has been reset!");
        }
    });

    updateUI();
});