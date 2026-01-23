import { DataPoint } from '../types';

/**
 * A robust CSV parser that handles quoted fields containing newlines or commas.
 */
export function parseCSV(csvText: string): DataPoint[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  // Normalize line endings
  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }
  
  // Push the last row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  // Clean and parse header (Handle BOM and whitespace)
  const header = rows[0].map(h => h.trim().replace(/^\ufeff/, '').toLowerCase());
  
  // Required columns
  const xIdx = header.indexOf('x');
  const yIdx = header.indexOf('y');
  
  // Text content detection
  const textIdx = header.findIndex(h => h.includes('text') || h === 'content' || h === 'body');
  
  // Metadata detection
  const titleIdx = header.indexOf('title');
  const idIdx = header.indexOf('id');
  const categoryIdx = header.findIndex(h => h === 'category' || h === 'type');
  
  // Story detection
  const storyIdx = header.findIndex(h => h === 'storyid' || h === 'story' || h === 'story_id');
  
  // Color detection (hex codes)
  const colorIdx = header.findIndex(h => h === 'color' || h === 'hex' || h === 'c');

  // Attention Entropy / Temperature detection
  const entropyIdx = header.findIndex(h => h === 'att_entropy' || h === 'entropy' || h === 'temperature');

  if (xIdx === -1 || yIdx === -1) {
    throw new Error("CSV must contain 'x' and 'y' columns.");
  }

  const dataPoints: DataPoint[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    // Skip empty rows
    if (row.length <= Math.max(xIdx, yIdx)) continue;

    // Remove quotes if they somehow remained (though parser should handle it) and trim
    const cleanX = row[xIdx].replace(/^"|"$/g, '').trim();
    const cleanY = row[yIdx].replace(/^"|"$/g, '').trim();

    const xVal = parseFloat(cleanX);
    const yVal = parseFloat(cleanY);

    if (isNaN(xVal) || isNaN(yVal)) continue;

    let entropyVal = undefined;
    if (entropyIdx !== -1 && row[entropyIdx]) {
        const parsed = parseFloat(row[entropyIdx].replace(/^"|"$/g, '').trim());
        if (!isNaN(parsed)) {
            entropyVal = parsed;
        }
    }

    dataPoints.push({
      id: idIdx !== -1 ? row[idIdx] : `pt-${i}`,
      x: xVal,
      y: yVal,
      text: textIdx !== -1 ? row[textIdx] : `Point (${xVal}, ${yVal})`,
      title: titleIdx !== -1 ? row[titleIdx] : undefined,
      category: categoryIdx !== -1 ? row[categoryIdx] : undefined,
      storyId: storyIdx !== -1 ? row[storyIdx] : 'Default Story',
      color: colorIdx !== -1 ? row[colorIdx] : undefined,
      att_entropy: entropyVal,
    });
  }

  return dataPoints;
}