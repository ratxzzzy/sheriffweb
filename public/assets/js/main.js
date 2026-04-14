const $ = (id) => document.getElementById(id);

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

function renderPlayers(players) {
  $('players-grid').innerHTML = players.map((p) => `
    <article class="card">
      <h3>#${p.dorsal} ${p.name}</h3>
      <p>${p.nick || ''}</p>
      <div class="badges">${(p.badges || []).map((b) => `<span class="badge">${b}</span>`).join('')}</div>
    </article>
  `).join('');
}

function renderUpcoming(items) {
  $('upcoming-list').innerHTML = items.map((m) => `
    <article class="card">
      <strong>vs ${m.rival}</strong>
      <p>${formatDate(m.date)} · ${m.location}</p>
      <small>${m.tournament || ''}</small>
    </article>
  `).join('');
}

function renderResults(items) {
  $('results-list').innerHTML = items.map((m) => `
    <article class="card">
      <strong>${m.resultType} vs ${m.rival}</strong>
      <p>${m.score} · ${formatDate(m.date)}</p>
    </article>
  `).join('');
}

function renderNews(items) {
  $('news-list').innerHTML = items.map((n) => `
    <article class="card">
      <img src="${n.imageUrl}" alt="${n.title}" loading="lazy" />
      <h3>${n.title}</h3>
      <small>${formatDate(n.date)}</small>
      <p>${n.excerpt}</p>
    </article>
  `).join('');
}

async function loadData() {
  const [players, upcoming, results, news] = await Promise.all([
    fetchJson('/api/players'),
    fetchJson('/api/matches/upcoming'),
    fetchJson('/api/matches/results'),
    fetchJson('/api/news'),
  ]);

  renderPlayers(players);
  renderUpcoming(upcoming);
  renderResults(results);
  renderNews(news);
}

$('socios-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  const msg = $('socios-message');

  try {
    await fetchJson('/api/socios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    event.currentTarget.reset();
    msg.textContent = '¡Gracias por sumarte al Sheriff!';
  } catch {
    msg.textContent = 'No se pudo enviar. Intentá nuevamente.';
  }
});

loadData().catch(() => {
  $('socios-message').textContent = 'Error cargando datos del sitio.';
});
