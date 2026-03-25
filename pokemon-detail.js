const nameEl = document.getElementById("pokemon-name");
const detailEl = document.getElementById("pokemon-detail");

async function loadPokemonDetail() {
  if (!nameEl || !detailEl) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  if (!name) {
    nameEl.textContent = "ポケモンが指定されていません";
    detailEl.innerHTML = '<div class="alert alert-warning" role="alert">一覧ページから選択してください。</div>';
    return;
  }

  nameEl.textContent = `${name} を読み込み中...`;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const image = data.sprites?.front_default || "";
    const types = (data.types || []).map((t) => t.type.name).join(", ");

    nameEl.textContent = `#${data.id} ${data.name}`;
    detailEl.innerHTML = `
      <div class="card" style="max-width: 520px;">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3 mb-3">
            <img src="${image}" alt="${data.name}" width="96" height="96" class="rounded bg-light border" />
            <div>
              <div><strong>高さ:</strong> ${data.height}</div>
              <div><strong>重さ:</strong> ${data.weight}</div>
              <div><strong>タイプ:</strong> ${types || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    nameEl.textContent = "詳細の取得に失敗しました";
    detailEl.innerHTML = `<div class="alert alert-danger" role="alert">エラー: ${error.message}</div>`;
  }
}

loadPokemonDetail();
