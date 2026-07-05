const BASE = "/api";

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
    fetch(`${BASE}/auth/me`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(body) }).then(handle),

  searchTest: (q, lang) => fetch(`${BASE}/tests/search?q=${encodeURIComponent(q)}&lang=${lang}`).then(handle),
  allTests: (lang) => fetch(`${BASE}/tests?lang=${lang}`).then(handle),
  getTest: (id, lang) => fetch(`${BASE}/tests/${id}?lang=${lang}`).then(handle),
  logTestSearch: (query) =>
    fetch(`${BASE}/tests/log-search`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ query }) }).then(handle),

  searchMedicine: (q, lang) => fetch(`${BASE}/medicines/search?q=${encodeURIComponent(q)}&lang=${lang}`).then(handle),
  allMedicines: (lang) => fetch(`${BASE}/medicines?lang=${lang}`).then(handle),
  getMedicine: (id, lang) => fetch(`${BASE}/medicines/${id}?lang=${lang}`).then(handle),
  logMedicineSearch: (query) =>
    fetch(`${BASE}/medicines/log-search`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ query }) }).then(handle),

  uploadPrescription: (file) => {
    const form = new FormData();
    form.append("prescription", file);
    return fetch(`${BASE}/ocr/upload`, { method: "POST", headers: authHeaders(), body: form }).then(handle);
  },

  // XHR-based upload so we get real onprogress events (fetch can't report
  // upload progress). Used by the Upload page to show a live progress bar.
  uploadPrescriptionWithProgress: (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append("prescription", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE}/ocr/upload`);
      const token = localStorage.getItem("mediplain_token");
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) resolve(data);
          else reject(new Error(data.error || "Upload failed"));
        } catch (e) {
          reject(new Error("Upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(form);
    });
  },

  askAI: (question, lang) =>
    fetch(`${BASE}/ai/ask`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, lang }) }).then(handle),

  dashboard: () => fetch(`${BASE}/dashboard`, { headers: authHeaders() }).then(handle),
  addBookmark: (itemId, itemType) =>
    fetch(`${BASE}/dashboard/bookmarks`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ itemId, itemType }) }).then(handle),
  removeBookmark: (itemType, itemId) =>
    fetch(`${BASE}/dashboard/bookmarks/${itemType}/${itemId}`, { method: "DELETE", headers: authHeaders() }).then(handle),
};
