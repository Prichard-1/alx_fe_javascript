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

// Create and insert category dropdown
function createCategoryFilter() {
  const dropdown = document.createElement("select");
  dropdown.id = "categoryFilter";
  dropdown.addEventListener("change", filterQuotes);
  document.body.insertBefore(dropdown, document.getElementById("quoteDisplay"));
}

// Populate dropdown with categories
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  dropdown.appendChild(allOption);

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    dropdown.appendChild(opt);
  });

  const saved = localStorage.getItem("lastCategory");
  if (saved) dropdown.value = saved;
}

// Filter quotes by selected category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);
  currentIndex = 0;
  showNextQuote();
}

// Show next quote in filtered list
function showNextQuote() {
  const display = document.getElementById("quoteDisplay");
  while (display.firstChild) display.removeChild(display.firstChild);

