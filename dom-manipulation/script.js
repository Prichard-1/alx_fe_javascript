let quotes = [];
let currentIndex = 0;

// Load from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Create dropdown filter
function createCategoryFilter() {
  const dropdown = document.createElement("select");
  dropdown.id = "categoryFilter";
  dropdown.addEventListener("change", filterQuotes);
  document.body.insertBefore(dropdown, document.getElementById("quoteDisplay"));
}

// Populate dropdown with unique categories
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "All Categories";
  dropdown.appendChild(defaultOption);

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
  });

  const saved = localStorage.getItem("lastCategory");
  if (saved) dropdown.value = saved;
}

// Display quote based on category filter
function showNextQuote() {
  const selected = document.getElementById("categoryFilter").value;
  const filteredQuotes = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filteredQuotes.length > 0) {
    const quote = filteredQuotes[currentIndex % filteredQuotes.length];
    // Display quote using createElement() and textContent
    currentIndex++;
  }
}


  const selected = document.getElementById("categoryFilter").value;
  const visibleQuotes = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (visibleQuotes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes found for this category.";
    display.appendChild(p);
    return;
  }

  if (currentIndex >= visibleQuotes.length) currentIndex = 0;

  const quote = visibleQuotes[currentIndex];
  const p = document.createElement("p");
  p.textContent = `"${quote.text}" — ${quote.category}`;
  display.appendChild(p);

  currentIndex++;
}

// Update filter and reset view
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);
  currentIndex = 0;
  showNextQuote();
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showNextQuote();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
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
        alert("Quotes imported successfully.");
      } else {
        alert("Invalid JSON structure.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Create input form
function createAddQuoteForm() {
  const form = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);
  document.body.appendChild(form);
}

// Add import/export controls
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

// Setup
document.getElementById("newQuote").addEventListener("click", showNextQuote);
loadQuotes();
createCategoryFilter();
populateCategories();
createAddQuoteForm();
createImportExportControls();
showNextQuote();
function rememberCurrentIndex() {
  sessionStorage.setItem("lastIndex", currentIndex);
}

function restoreCurrentIndex() {
  const stored = sessionStorage.getItem("lastIndex");
  if (stored !== null) {
    currentIndex = Number(stored);
  }
}

function fetchQuotesFromServer() {
  return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
    .then(response => response.j
