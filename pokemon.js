const listEl = document.getElementById("pokemon-list");
const statusEl = document.getElementById("status");
const reloadBtn = document.getElementById("reload-btn");

function extractIdFromUrl(url) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

function buildIconUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

async function loadPokemon() {
  if (!listEl || !statusEl) {
    return;
  }

  statusEl.textContent = "読み込み中...";
  listEl.innerHTML = "";

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const items = data.results ?? [];

    items.forEach((pokemon) => {
      const id = extractIdFromUrl(pokemon.url);
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4";
      const iconUrl = id ? buildIconUrl(id) : "";
      const link = `pokemon-detail.html?name=${encodeURIComponent(pokemon.name)}`;

      col.innerHTML = `
        <a href="${link}" class="text-decoration-none text-body">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <img
                src="${iconUrl}"
                alt="${pokemon.name} icon"
                width="56"
                height="56"
                class="rounded bg-light border"
                loading="lazy"
              />
              <div>
                <h3 class="h6 card-title mb-1 text-capitalize">#${id ?? "-"} ${pokemon.name}</h3>
                <p class="card-text text-body-secondary mb-0">クリックで詳細へ</p>
              </div>
            </div>
          </div>
        </a>
      `;

      listEl.appendChild(col);
    });

    statusEl.textContent = `${items.length}件のデータを取得しました。`;
  } catch (error) {
    statusEl.textContent = "データ取得に失敗しました。";
    listEl.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger mb-0" role="alert">
          PokeAPIの取得中にエラーが発生しました: ${error.message}
        </div>
      </div>
    `;
  }
}

if (reloadBtn) {
  reloadBtn.addEventListener("click", loadPokemon);
}

loadPokemon();
