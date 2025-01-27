// Select Elements
const text = document.querySelector(".text");
const number = document.querySelector(".number");
const op2 = document.querySelector(".two");
const date = document.querySelector(".date");
const btn = document.querySelector(".add");
const tbody = document.getElementById("ledger-body");
const categoryTextarea = document.getElementById("description"); // Updated to use textarea

// Initialize Variables
let num = 1;
let bill = 0;

// Load Data from localStorage on Page Load
document.addEventListener("DOMContentLoaded", loadData);

function loadData() {
    const data = JSON.parse(localStorage.getItem("ledgerData")) || [];
    console.log("Loaded data from localStorage:", data); // Debugging

    // Reset the table and variables
    tbody.innerHTML = "";
    num = 1;
    bill = 0;

    data.forEach(entry => {
        addRow(entry);
    });
}

// Save Data to localStorage
function saveData(entry) {
    const data = JSON.parse(localStorage.getItem("ledgerData")) || [];
    data.push(entry);
    localStorage.setItem("ledgerData", JSON.stringify(data));
    console.log("Saved data to localStorage:", data); // Debugging
}

// Remove Data from localStorage
function removeData(index) {
    const data = JSON.parse(localStorage.getItem("ledgerData")) || [];
    if (index > -1 && index < data.length) {
        data.splice(index, 1);
        localStorage.setItem("ledgerData", JSON.stringify(data));
        console.log("Removed data from localStorage:", data); // Debugging
    }
}

// Add Event Listener to Add Button
btn.addEventListener("click", () => {
    if (
        text.value.trim() === "" ||
        number.value.trim() === "" ||
        categoryTextarea.value.trim() === "" || // Validate textarea input
        op2.value === ""
    ) {
        alert("Please provide valid inputs.");
        return;
    }

    // Process category input from textarea
    const categories = categoryTextarea.value
        .split(",")
        .map(cat => cat.trim())
        .filter(cat => cat !== ""); // Remove empty strings

    const entry = {
        name: text.value.trim(),
        amount: parseFloat(number.value),
        category: categories, // Use processed categories array
        type: op2.value,
        date: date.value
    };

    addRow(entry);
    saveData(entry);

    // Reset Form Fields
    text.value = "";
    number.value = "";
    categoryTextarea.value = ""; // Clear textarea
    op2.value = "";
    date.value = "";
});

// Function to Add a Row to the Table
function addRow(entry) {
    const tr = document.createElement("tr");

    // Set background color based on type
    if (entry.type === "Income") {
        tr.style.backgroundColor = "#d1e7dd"; // Light Green for Income
    } else if (entry.type === "Outcome") {
        tr.style.backgroundColor = "#f8d7da"; // Light Red for Outcome
    }

    // No.
    const tdNo = document.createElement("td");
    tdNo.textContent = num++;
    tr.appendChild(tdNo);

    // Date
    const tdDate = document.createElement("td");
    tdDate.textContent = entry.date || "N/A";
    tr.appendChild(tdDate);

    // Name
    const tdName = document.createElement("td");
    tdName.textContent = entry.name;
    tr.appendChild(tdName);

    // Category (join multiple categories with commas)
    const tdCategory = document.createElement("td");
    tdCategory.textContent = entry.category.join(", ");
    tr.appendChild(tdCategory);

    // Type
    const tdType = document.createElement("td");
    tdType.textContent = entry.type;
    tr.appendChild(tdType);

    // Amount
    const tdAmount = document.createElement("td");
    tdAmount.textContent = entry.amount.toFixed(2);
    tr.appendChild(tdAmount);

    // Net
    const tdNet = document.createElement("td");
    bill += entry.type === "Income" ? entry.amount : -entry.amount;
    tdNet.textContent = bill.toFixed(2);
    tr.appendChild(tdNet);

    // Action
    const tdAction = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete-btn");
    tdAction.appendChild(delBtn);
    tr.appendChild(tdAction);

    // Append Row to Table Body
    tbody.appendChild(tr);

    // Add Event Listener to Delete Button
    delBtn.addEventListener("click", () => {
        const index = Array.from(tbody.children).indexOf(tr);
        removeData(index);
        tr.remove();
        updateNet();
    });
}

// Function to Update Net Total After Deletion
function updateNet() {
    const data = JSON.parse(localStorage.getItem("ledgerData")) || [];
    bill = 0;
    num = 1;
    tbody.innerHTML = "";

    data.forEach(entry => {
        addRow(entry);
    });
}