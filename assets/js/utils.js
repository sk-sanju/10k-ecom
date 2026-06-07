// assets/js/utils.js
// Helper utilities used across the site
export async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return await response.json();
}

export function formatPrice(value) {
  // Indian Rupee formatting with commas
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

export function buildQuery(params) {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
}
