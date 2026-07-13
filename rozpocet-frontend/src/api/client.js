// Centrální funkce pro veškerou komunikaci s backendem.
// Řeší na jednom místě: base URL, hlavičky requestu, a zpracování chyb.
// Všechny api/*.js soubory tuhle funkci používají místo přímého volání fetch().

const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options, // umožňuje volajícímu přidat method (POST/PUT/DELETE) a body
  });

  // Pokud backend vrátí chybový status (4xx/5xx), vyhodíme chybu,
  // kterou pak zachytí hook (v try/catch) a uloží do stavu "error".
  if (!response.ok) {
    throw new Error(`Chyba ${response.status}: ${response.statusText}`);
  }

  // DELETE endpointy vrací 204 No Content - není co parsovat jako JSON.
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export default request;