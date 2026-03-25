const listEl = document.getElementById("pokemon-list");
const statusEl = document.getElementById("status");
const reloadBtn = document.getElementById("reload-btn");

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

    items.forEach((pokemon, index) => {
      const id = index + 1;
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4";

      col.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h3 class="h6 card-title mb-1">#${id} ${pokemon.name}</h3>
            <p class="card-text text-body-secondary mb-0">${pokemon.url}</p>
          </div>
        </div>
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
