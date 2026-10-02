// Centrální funkce pro veškerou komunikaci s backendem.
// Řeší na jednom místě: base URL, hlavičky requestu, a zpracování chyb.
// Všechny api/*.js soubory tuhle funkci používají místo přímého volání fetch().

// Vite si podle režimu (dev/build) sám natáhne .env.development nebo
// .env.production - appka tak sama pozná, jestli volá lokální backend,
// nebo ten nasazený na Renderu, bez ručního přepisování téhle adresy.
const BASE_URL = import.meta.env.VITE_API_URL;

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
  // Některé endpointy (např. generate-fixed na backendu, co vrací "void")
  // mají prázdné tělo odpovědi i se statusem 200 - content-length "0"
  // znamená, že tam skutečně nic není, takže appka to ani nezkouší
  // parsovat jako JSON (to by vždycky spadlo na chybu "Unexpected end of JSON input").
  const contentLength = response.headers.get('content-length');
  if (response.status === 204 || contentLength === '0') {
    return null;
  }

  return response.json();
}

export default request;