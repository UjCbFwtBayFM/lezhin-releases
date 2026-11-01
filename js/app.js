import { renderCards } from './renderers.js';

async function fetchCardsData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch cards: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading cards dataset:', error);
    return [];
  }
}

function sortCards(cards, key, direction = 'asc') {
  return [...cards].sort((a, b) => {
    let valA = a[key] ?? '';
    let valB = b[key] ?? '';

    // Handle date string comparisons (e.g. "2026-10-01")
    if (key === 'dueDate') {
      valA = new Date(valA).getTime() || 0;
      valB = new Date(valB).getTime() || 0;
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

async function loadSvgSprite(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load SVG: ${response.statusText}`);

    const svgContent = await response.text();

    // Create a hidden wrapper and inject the SVG at the top of <body>
    const container = document.createElement('div');
    container.style.display = 'none';
    container.innerHTML = svgContent;
    document.body.insertBefore(container, document.body.firstChild);
  } catch (error) {
    console.error('SVG Sprite load error:', error);
  }
}

// Initialize rendering
async function initApp() {
  await loadSvgSprite('./assets/symbols.svg');

  // Fetch external JSON data
  const cardsData = await fetchCardsData('./data/lezhin_2026-11.json');
  const sortedCards = sortCards(cardsData, 'releaseDate', 'asc');
  // Render cards
  renderCards(sortedCards);
}

document.addEventListener('DOMContentLoaded', initApp);