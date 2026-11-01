import { barLayout, fieldMaps, SUBTITLE_PROPERTIES } from './fieldMaps.js';
import { formatters } from './formatters.js';

export function renderBarForCard(card, fieldNames) {
  if (!card || !Array.isArray(fieldNames) || fieldNames.length === 0) return '';

  const segmentsHTML = fieldNames
    .map(fieldName => {
      const dictionary = fieldMaps?.[fieldName];
      if (!dictionary) return null;

      // 1. Resolve key: prioritize exact fieldName on card, then dictionary.key, then fieldName
      let propKey = fieldName;
      if (!(fieldName in card) && dictionary.key && (dictionary.key in card)) {
        propKey = dictionary.key;
      }

      // 2. Strict existence check: return null if field is missing/empty on card
      if (!(propKey in card) || card[propKey] === undefined || card[propKey] === null || card[propKey] === '') {
        return null;
      }

      const rawValue = card[propKey];

      // 3. Suppress boolean `false` unless explicitly mapped in dictionary
      if (rawValue === false) {
        const hasFalseMapping = false in dictionary || 'false' in dictionary;
        if (!hasFalseMapping) return null;
      }

      // 4. Distinguish Config Objects (length, releaseDate) from Value Maps (statusMap)
      const isConfig = Boolean(dictionary.formatter || dictionary.typeKey || dictionary.iconMap);

      let info = null;
      if (isConfig) {
        info = dictionary;
      } else {
        const valueEntry = dictionary[rawValue] ?? dictionary[String(rawValue)];
        if (valueEntry) {
          info = valueEntry;
        } else if ('default' in dictionary) {
          info = dictionary['default'];
        } else {
          // Unmapped value in a dictionary with no default -> suppress segment
          return null;
        }
      }

      // --- TEXT RESOLUTION ---
      let text = rawValue;
      if (typeof info === 'string') {
        text = info;
      } else if (info.formatter) {
        // Safe formatter execution (prevents ReferenceError if `formatters` is undeclared)
        const formatFn = (typeof formatters !== 'undefined' && formatters?.[info.formatter])
                      || (typeof window !== 'undefined' && window?.[info.formatter])
                      || (typeof globalThis !== 'undefined' && globalThis?.[info.formatter]);
        if (typeof formatFn === 'function') {
          text = formatFn(rawValue);
        }
      } else if (info.text) {
        text = info.text;
      }

      const cssClass = info.cssClass || dictionary.cssClass || '';

      // --- ICON RESOLUTION ---
      let iconId = null;
      const typeKey = info.typeKey || dictionary.typeKey;
      const iconMap = info.iconMap || dictionary.iconMap;
      const defaultIcon = info.defaultIcon || dictionary.defaultIcon;
      const staticIcon = info.iconId || dictionary.iconId;

      if (typeKey && iconMap) {
        const subValue = card[typeKey];
        if (subValue !== undefined && subValue !== null && subValue !== '') {
          const targetStr = String(subValue).trim().toLowerCase();
          const matchedKey = Object.keys(iconMap).find(
            k => k.trim().toLowerCase() === targetStr
          );
          iconId = matchedKey ? iconMap[matchedKey] : (defaultIcon || staticIcon || null);
        } else {
          iconId = defaultIcon || staticIcon || null;
        }
      } else {
        iconId = staticIcon || defaultIcon || null;
      }

      const href = iconId ? (iconId.startsWith('#') ? iconId : `#${iconId}`) : '';
      const iconHTML = href ? `<svg class="icon"><use href="${href}"></use></svg>` : '';

      return `
        <div class="segment ${cssClass}">
          <span class="segment-content">
            ${iconHTML}
            ${text}
          </span>
        </div>
      `;
    })
    .filter(Boolean)
    .join('');

  return segmentsHTML ? `<div class="segmented-bar">${segmentsHTML}</div>` : '';
}

export function renderCards(data) {
  const container = document.getElementById('card-gallery');
  if (!container) return;

  container.innerHTML = data.map(card => {
    const titleLetter = (card.title || 'C').charAt(0).toUpperCase();

    // Use card.cover directly from the JSON
    const coverSrc = card.cover || null;

    const coverHTML = coverSrc
      ? `<img class="cover-img" src="${coverSrc}" alt="${card.title || ''}" 
              onerror="this.classList.add('is-hidden'); this.nextElementSibling.classList.remove('is-hidden');" />
         <div class="cover-fallback is-hidden" data-title="${titleLetter}"></div>`
      : `<div class="cover-fallback" data-title="${titleLetter}"></div>`;

    return `<a href="https://www.mangabaka.org/${card.id}" class="card-link">
      <div class="card">
        <div class="cover-container">
          ${coverHTML}

          <div class="bar-container top-bar">
            ${renderBarForCard(card, barLayout.topBar)}
          </div>
          <div class="bar-container bottom-bar">
            ${renderBarForCard(card, barLayout.bottomBar)}
          </div>
        </div>

        <div class="card-info">
          <div class="card-title">${card.title || ''}</div>
          ${renderSubtitleBubbles(card)}
        </div>
      </div></a>
    `;
  }).join('');
}

export function renderSubtitleBubbles(card) {
  const bubblesHTML = SUBTITLE_PROPERTIES
    .flatMap(prop => {
      const rawValue = card[prop.key];

      // Skip if missing, null, undefined, or empty
      if (rawValue === undefined || rawValue === null || rawValue === '') {
        return [];
      }

      // Standardize into an array (handles both single strings and lists)
      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      const iconRef = prop.icon.startsWith('#') ? prop.icon : `#${prop.icon}`;

      // Map each non-empty string item to its own subtitle bubble
      return values
        .filter(val => val !== undefined && val !== null && String(val).trim() !== '')
        .map(val => `
          <span class="subtitle-bubble">
            <svg class="icon"><use href="${iconRef}"></use></svg>
            <span class="bubble-text">${val}</span>
          </span>
        `);
    })
    .join('');

  return bubblesHTML ? `<div class="card-subtitle-bubbles">${bubblesHTML}</div>` : '';
}