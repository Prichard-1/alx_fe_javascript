
let currentIndex = 0;

// Show quote by index instead of random
function showNextQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear previous content safely
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }

  if (quotes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes available. Add one!";
    quoteDisplay.appendChild(p);
    return;
  }

  // Reset index if it exceeds length
  if (currentIndex >= quotes.length) {
    currentIndex = 0;
  }

  const quote = quotes[currentIndex];
  const quoteParagraph = document.createElement("p");
  quoteParagraph.textContent = `"${quote.text}" — ${quote.category}`;
  quoteDisplay.appendChild(quoteParagraph);

  currentIndex++;
}

