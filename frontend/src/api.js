const BASE = import.meta.env.VITE_API_URL || "https://medipain.onrender.com/api";

function authHeaders() {
  const token = localStorage.getItem("mediplain_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  signup: (body) =>
    fetch(`${BASE}/auth/signup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(handle),

  login: (body) =>
    fetch(`${BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(handle),

  forgotPassword: (email) =>
    fetch(`${BASE}/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).then(handle),

  me: () => fetch(`${BASE}/auth/me`, { headers: authHeaders() }).then(handle),

  updateProfile: (body) =>
    fetch(`${BASE}/auth/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    }).then(handle),

  searchTest: (q, lang) =>
    fetch(`${BASE}/tests/search?q=${encodeURIComponent(q)}&lang=${lang}`).then(handle),

  allTests: (lang) =>
    fetch(`${BASE}/tests?lang=${lang}`).then(handle),

  getTest: (id, lang) =>
    fetch(`${BASE}/tests/${id}?lang=${lang}`).then(handle),

  logTestSearch: (query) =>
    fetch(`${BASE}/tests/log-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ query }),
    }).then(handle),

  searchMedicine: (q, lang) =>
    fetch(`${BASE}/medicines/search?q=${encodeURIComponent(q)}&lang=${lang}`).then(handle),

  allMedicines: (lang) =>
    fetch(`${BASE}/medicines?lang=${lang}`).then(handle),

  getMedicine: (id, lang) =>
    fetch(`${BASE}/medicines/${id}?lang=${lang}`).then(handle),

  logMedicineSearch: (query) =>
    fetch(`${BASE}/medicines/log-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ query }),
    }).then(handle),

  uploadPrescription: (file) => {
    const form = new FormData();
    form.append("prescription", file);
    return fetch(`${BASE}/ocr/upload`, {
      method: "POST",
      headers: authHeaders(),
      body: form,
    }).then(handle);
  },

  askAI: (question, lang) =>
    fetch(`${BASE}/ai/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, lang }),
    }).then(handle),

  dashboard: () =>
    fetch(`${BASE}/dashboard`, { headers: authHeaders() }).then(handle),
};
