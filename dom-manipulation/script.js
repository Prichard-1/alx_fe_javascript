// Quotes array
let quotes = [
  { text: "Discipline is doing what needs to be done, even when you don't feel like doing it.", category: "Motivation" },
  { text: "Float like a butterfly, sting like a bee.", category: "Boxing" },
  { text: "Failure is part of the journey to success.", category: "Inspiration" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Show a random quote using advanced DOM manipulation
function showRandomQuote() {
  // Clear previous quote
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }

  if (quotes.length === 0) {
    const noQuote = document.createElement("p");
    noQuote.textContent = "No quotes available. Please add one.";
    quoteDisplay.appendChild(noQuote);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}" — ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
}

// Create the form to add a new quote
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to add a quote
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = quoteTextInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });

  quoteTextInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
  showRandomQuote();
}

// Event setup
newQuoteButton.addEventListener("click", showRandomQuote);

// Initialize the app
createAddQuoteForm();
showRandomQuote();

