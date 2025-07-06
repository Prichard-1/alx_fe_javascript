let quotes = [];
let currentIndex = 0;

// Restore from local storage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// Save to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display filtered quotes
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", category);

  currentIndex = 0;
  showNextQuote();
}

// Populate filter dropdown with unique categories
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear old options
  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  dropdown.appendChild(allOption);

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  // Restore last selected
  const last = localStorage.getItem("lastCategory");
  if (last) {
    dropdown.value = last;
  }
}

// Show quote based on currentIndex and selected category
function showNextQuote() {
  const display = document.getElementById("quoteDisplay");
  while (display.firstChild) {
    display.removeChild(display.firstChild);
  }

  const selectedCategory = document.getElementById("categoryFilter").value;
  let visibleQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (visibleQuotes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes in this category.";
    display.appendChild(p);
    return;
  }

  if (currentIndex >= visibleQuotes.length) currentIndex = 0;

  const q = visibleQuotes[currentIndex];
  const p = document.createElement("p");
  p.textContent = `"${q.text}" — ${q.category}`;
  display.appendChild(p);

  currentIndex++;
}


