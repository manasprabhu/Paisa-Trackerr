document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("id");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let transaction = transactions[transactionId];

    if (transaction) {
        document.getElementById("transaction-details").innerHTML = `
            <h2>Transaction Info</h2>
            <p><strong>Date:</strong> ${transaction.date}</p>
            <p><strong>Description:</strong> ${transaction.description}</p>
            <p><strong>Amount:</strong> ₹${transaction.amount}</p>
            <p><strong>Type:</strong> ${transaction.type}</p>
        `;
    } else {
        document.getElementById("transaction-details").innerHTML = "<p>Transaction not found.</p>";
    }
});