let quotes = [];
let currentIndex = 0;

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Remember selected category
function saveCategory(category) {
  localStorage.setItem("lastCategory", category);
}

// Restore selected category
function restoreCategory() {
  return localStorage.getItem("lastCategory") || "all";
}

// Create filter dropdown
function createCategoryFilter() {
  const dropdown = document.createElement("select");
  dropdown.id = "categoryFilter";
  dropdown.addEventListener("change", filterQuotes);
  document.body.insertBefore(dropdown, document.getElementById("quoteDisplay"));
}

// Populate categories into filter dropdown
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  dropdown.innerHTML = "";

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "All Categories";
  dropdown.appendChild(all);

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
  });

  dropdown.value = restoreCategory();
}

// Display filtered quote
function showNextQuote() {
  const category = document.getElementById("categoryFilter").value;
  const visibleQuotes = category === "all"
    ? quotes
    : quotes.filter(q => q.category === category);

  if (currentIndex >= visibleQuotes.length) currentIndex = 0;

  const quote = visibleQuotes[currentIndex];
  // Display using createElement() and textContent
  currentIndex++;
}


// Filter quotes on category change
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  saveCategory(selected);
  currentIndex = 0;
  showNextQuote();
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showNextQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showNextQuote();
        notifyUser("Quotes imported from file.");
      } else {
        alert("Invalid JSON structure.");
      }
    } catch {
      alert("Error reading file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Create form to add quotes
function createAddQuoteForm() {
  const container = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);
  document.body.appendChild(container);
}
// fetch quote
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(res => res.json())
    .then(data => {
      return data.map(post => ({
        text: post.title,
        category: "ServerSync"
      }));
    });
}

// Create import/export controls
function createImportExportControls() {
  const controls = document.createElement("div");

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes";
  exportBtn.onclick = exportToJsonFile;

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);

  controls.appendChild(exportBtn);
  controls.appendChild(importInput);
  document.body.appendChild(controls);
}

// Notify user of sync/conflict updates
function notifyUser(message) {
  const div = document.createElement("div");
  div.textContent = message;
  div.style.background = "#fffae6";
  div.style.padding = "10px";
  div.style.margin = "10px 0";
  div.style.border = "1px solid #ccc";
  div.style.fontWeight = "bold";
  document.body.insertBefore(div, document.body.firstChild);
  setTimeout(() => div.remove(), 4000);
}

// Simulate server fetch and sync quotes
function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(res => res.json())
    .then(data => data.map(post => ({
      text: post.title,
      category: "ServerSync"
    })))
    .catch(() => []);
}

asyn function syncWithServer() {
  fetchQuotesFromServer().then(serverQuotes => {
    const newQuotes = serverQuotes.filter(
      sq => !quotes.some(lq => lq.text === sq.text)
    );

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      notifyUser(`${newQuotes.length} new quote(s) synced from server.`);
      showNextQuote();
    }
  });
}
const p = document.createElement("p");
p.textContent = `"${quote.text}" — ${quote.category}`;
quoteDisplay.appendChild(p);

// Setup everything
document.getElementById("newQuote").addEventListener("click", showNextQuote);
loadQuotes();
createCategoryFilter();
populateCategories();
createAddQuoteForm();
createImportExportControls();
showNextQuote();
setInterval(syncWithServer, 30000); // every 30s
