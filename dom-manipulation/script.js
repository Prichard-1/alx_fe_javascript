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
  const display = document.getElementById("quoteDisplay");
  while (display.firstChild) display.removeChild(display.firstChild);

  const selected = document.getElementById("categoryFilter").value;
  const visible = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (visible.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes found.";
    display.appendChild(p);
    return;
  }

  if (currentIndex >= visible.length) currentIndex = 0;

  const quote = visible[currentIndex];
  const p = document.createElement("p");
  p.textContent = `"${quote.text}" — ${quote.category}`;
  display.appendChild(p);

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


// Create form to add quotes
function createAddQuoteForm() {
  const container = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";


