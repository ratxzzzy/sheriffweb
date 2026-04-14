const sectionsRoot = document.getElementById('sections');
const tokenKey = 'sheriff_admin_token';

const entities = [
  { key: 'players', title: 'Jugadores', fields: ['dorsal', 'name', 'nick', 'badges'] },
  { key: 'matches/upcoming', title: 'Próximos partidos', fields: ['rival', 'date', 'location', 'tournament'] },
  { key: 'matches/results', title: 'Resultados', fields: ['rival', 'date', 'score', 'resultType'] },
  { key: 'news', title: 'Noticias', fields: ['title', 'date', 'excerpt', 'imageUrl'] },
];

const token = () => localStorage.getItem(tokenKey);

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}), 'Content-Type': 'application/json' };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const response = await fetch(`/api/admin/${path}`, { ...options, headers });
  if (!response.ok) throw new Error('request_failed');
  if (response.status === 204) return null;
  return response.json();
}

function authUI() {
  const logged = !!token();
  document.getElementById('login-box').classList.toggle('hidden', logged);
  document.getElementById('dashboard').classList.toggle('hidden', !logged);
}

function valueByField(field) {
  if (field === 'badges') return 'Capitán,Goleador';
  if (field === 'date') return new Date().toISOString();
  if (field === 'resultType') return 'VICTORIA';
  return '';
}

function formHtml(entity) {
  return entity.fields.map((f) => `<input name="${f}" placeholder="${f}" value="${valueByField(f)}" class="w-full border rounded px-2 py-1 mb-2">`).join('');
}

function parseBody(form, fields) {
  const raw = Object.fromEntries(new FormData(form).entries());
  const out = {};
  for (const field of fields) {
    let val = raw[field] ?? '';
    if (field === 'dorsal') val = Number(val);
    if (field === 'badges') val = String(val).split(',').map((x) => x.trim()).filter(Boolean);
    out[field] = val;
  }
  return out;
}

async function renderEntity(entity) {
  const items = await api(entity.key);
  const id = entity.key.replaceAll('/', '-');

  const html = `
    <section class="bg-white rounded-xl shadow p-4" data-entity="${entity.key}">
      <h3 class="font-semibold mb-2">${entity.title}</h3>
      <form class="create-form mb-3">${formHtml(entity)}<button class="bg-green-600 text-white px-3 py-1 rounded">Guardar</button></form>
      <div class="space-y-2 text-sm">${items.map((it) => `
        <article class="border rounded p-2 flex justify-between gap-2 items-center">
          <pre class="whitespace-pre-wrap text-xs overflow-auto">${JSON.stringify(it, null, 2)}</pre>
          <button data-id="${it.id}" class="delete-btn bg-red-600 text-white rounded px-2 py-1">Eliminar</button>
        </article>
      `).join('')}</div>
    </section>`;

  const existing = document.getElementById(id);
  if (existing) existing.outerHTML = `<div id="${id}">${html}</div>`;
  else sectionsRoot.insertAdjacentHTML('beforeend', `<div id="${id}">${html}</div>`);

  const root = document.getElementById(id);
  root.querySelector('.create-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api(entity.key, { method: 'POST', body: JSON.stringify(parseBody(e.currentTarget, entity.fields)) });
    renderEntity(entity);
  });

  root.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await api(`${entity.key}/${btn.dataset.id}`, { method: 'DELETE' });
      renderEntity(entity);
    });
  });
}

async function renderSocios() {
  const socios = await api('socios');
  document.getElementById('socios-list').innerHTML = socios.map((s) => `<p>${s.name} - ${s.email} - ${s.phone}</p>`).join('');
}

async function renderDashboard() {
  sectionsRoot.innerHTML = '';
  for (const entity of entities) await renderEntity(entity);
  await renderSocios();
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(e.currentTarget).entries());
  const msg = document.getElementById('login-message');

  try {
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error();
    const data = await response.json();
    localStorage.setItem(tokenKey, data.token);
    authUI();
    renderDashboard();
  } catch {
    msg.textContent = 'Credenciales inválidas';
    msg.className = 'mt-2 text-sm text-red-600';
  }
});

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem(tokenKey);
  authUI();
});

authUI();
if (token()) renderDashboard();
