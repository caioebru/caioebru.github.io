// Vida na Natureza — Caio & Bru
// Site de página única. Cada tela tem um nome simples depois do #:
// #mapa, #viagens, #especies ou o id de uma viagem (ex.: #horto-bauru-2026-11-07).

const app = document.getElementById("app");
const topo = document.getElementById("topo");

const TIPOS = { ave: "Aves", inseto: "Insetos", bicho: "Outros bichos", paisagem: "Paisagens", nos: "Nós", pessoas: "Pessoas", festa: "Festa" };
const GRUPOS = { ave: ["Ave", "Aves"], inseto: ["Inseto", "Insetos"], aracnideo: ["Aracnídeo", "Aranhas"], mamifero: ["Mamífero", "Mamíferos"] };
const CONFIANCA = { alta: "Identificação segura", provavel: "Provável", "a-confirmar": "A confirmar" };
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const thumb = (v, f) => `fotos/${v.id}/thumb/${f}`;
const web = (v, f) => `fotos/${v.id}/web/${f}`;
const dataBR = (iso) => { const [a, m, d] = iso.split("-"); return `${+d} de ${MESES[m - 1]} de ${a}`; };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Link da foto em alta: o arquivo no Drive, se conhecido; senão a pasta da viagem.
const linkDrive = (v, f) => {
  const id = v.driveArquivos?.[f.arquivo];
  return id ? `https://drive.google.com/file/d/${id}/view` : v.drive || DRIVE_GERAL;
};
const ICONE_DRIVE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>`;
const viagensOrdenadas = () => [...VIAGENS].sort((a, b) => b.data.localeCompare(a.data));

// Todas as fotos de todas as viagens, com a viagem junto.
function todasAsFotos() {
  return VIAGENS.flatMap((v) => v.fotos.map((f) => ({ ...f, viagem: v })));
}

// ---------- rotas ----------
const rotas = {
  "": home,
  mapa,
  viagens,
  viagem,
  especies,
};

let mapaLeaflet = null;
function mostrarTela(token) {
  let rota = token, param = "";
  if (VIAGENS.some((v) => v.id === token)) { rota = "viagem"; param = token; }
  if (!(rota in rotas)) rota = "";
  if (mapaLeaflet) { mapaLeaflet.remove(); mapaLeaflet = null; }
  fecharLightbox(true);
  topo.classList.toggle("escondido", rota === "");
  topo.querySelectorAll("nav a").forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === "#" + rota || (rota === "viagem" && a.getAttribute("href") === "#viagens")));
  rotas[rota](param);
  window.scrollTo(0, 0);
}
// Os links internos (href="#...") trocam de tela sem recarregar a página.
document.addEventListener("click", (ev) => {
  const a = ev.target.closest('a[href^="#"]');
  if (!a || ev.ctrlKey || ev.metaKey) return;
  ev.preventDefault();
  const token = a.getAttribute("href").slice(1);
  try { history.pushState(null, "", "#" + token); } catch (_) { /* a página publicada pode não permitir */ }
  mostrarTela(token);
});
window.addEventListener("popstate", () => {
  if (!lb.hidden) return fecharLightbox(true);         // voltar com a foto aberta: fecha só a foto
  if (ignorarVoltar) { ignorarVoltar = false; return; } // foto fechada pelo X: a página fica como está
  mostrarTela(location.hash.slice(1));
});

// ---------- home ----------
function home() {
  const recente = viagensOrdenadas()[0];
  const fotos = todasAsFotos();
  const nEspecies = new Set(fotos.filter((f) => f.especie).map((f) => f.especie)).size;
  document.title = "Vida na Natureza";
  app.innerHTML = `
    <section class="home">
      <div class="home-fundo" style="background-image:url('${web(recente, recente.capa)}')"></div>
      <div class="home-conteudo">
        <div class="home-sobre">Caderno de campo de Caio &amp; Bru</div>
        <h1>Vida na <em>Natureza</em></h1>
        <p class="home-sub">Os lugares por onde andamos e os bichinhos que encontramos no caminho.</p>
        <nav class="menu">
          <a href="#mapa"><div class="ico">🗺️</div><h2>Mapa</h2><p>Onde a gente já foi. Clique num ponto para abrir o álbum.</p></a>
          <a href="#viagens"><div class="ico">📷</div><h2>Viagens</h2><p>Todos os álbuns, do mais novo ao mais antigo.</p></a>
          <a href="#especies"><div class="ico">🪲</div><h2>Espécies</h2><p>As aves, os insetos e os outros bichos que fotografamos, com o que descobrimos sobre cada um.</p></a>
        </nav>
        <div class="numeros">
          <div><b>${VIAGENS.length}</b>${VIAGENS.length === 1 ? "viagem" : "viagens"}</div>
          <div><b>${fotos.length}</b>fotos</div>
          <div><b>${nEspecies}</b>espécies</div>
        </div>
        <a class="home-drive" href="${DRIVE_GERAL}" target="_blank" rel="noopener">${ICONE_DRIVE} Todas as fotos em alta no Drive</a>
      </div>
    </section>`;
}

// ---------- mapa ----------
function mapa() {
  document.title = "Mapa · Vida na Natureza";
  document.documentElement.style.setProperty("--topo-h", topo.offsetHeight + "px");
  app.innerHTML = `
    <section class="mapa-wrap">
      <div id="mapa"></div>
      <div class="mapa-legenda">${VIAGENS.length} ${VIAGENS.length === 1 ? "álbum" : "álbuns"}. Clique numa foto no mapa para abrir.</div>
    </section>`;
  mapaLeaflet = L.map("mapa", { zoomControl: true, scrollWheelZoom: true, minZoom: 3, maxZoom: 19 });
  mapaLeaflet.attributionControl.setPrefix(false);

  // Mapa de ruas do OpenStreetMap. Onde as imagens de fora são bloqueadas
  // (como na página publicada no Claude), usa os contornos do mapa-base.js.
  const ruas = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(mapaLeaflet);
  let carregou = false, erros = 0;
  ruas.on("tileload", () => { carregou = true; });
  ruas.on("tileerror", () => {
    if (carregou || ++erros < 3 || !mapaLeaflet) return;
    mapaLeaflet.removeLayer(ruas);
    desenharContornos(mapaLeaflet);
  });

  mapaLeaflet.on("popupopen", (ev) => {
    ev.popup.getElement().querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      try { history.pushState(null, "", a.getAttribute("href")); } catch (_) {}
      mostrarTela(a.getAttribute("href").slice(1));
    }));
  });

  // Um pino por lugar. Quando o zoom deixa pinos encostados, eles se juntam
  // num pino com contador; clicar nele aproxima o mapa até separá-los.
  const camadaPinos = L.layerGroup().addTo(mapaLeaflet);
  const lugares = viagensOrdenadas();
  const pino = (v, n) => L.divIcon({
    className: "",
    html: `<div class="pino" style="background-image:url('${thumb(v, v.capa)}')">${n > 1 ? `<span class="pino-n">${n}</span>` : ""}</div>
      ${n === 1 ? `<span class="pino-rotulo">${esc(v.local || v.titulo)}</span>` : ""}`,
    iconSize: [52, 52], iconAnchor: [26, 26], popupAnchor: [0, -28],
  });
  const popupViagem = (v) => `
    <div class="popup">
      <img src="${thumb(v, v.capa)}" alt="">
      <div>
        <h3>${esc(v.titulo)}</h3>
        <p>${esc(v.local ? v.local + " · " : "")}${esc(v.lugar)}<br>${dataBR(v.data)} · ${v.fotos.length} fotos</p>
        <a class="botao" href="#${v.id}">Abrir álbum →</a>
      </div>
    </div>`;
  const popupLista = (vs) => `
    <div class="popup popup-lista">
      <div class="popup-cab"><h3>${esc(vs[0].lugar)}</h3><p>${vs.length} álbuns</p></div>
      ${vs.map((v) => `
        <a class="popup-item" href="#${v.id}">
          <img src="${thumb(v, v.capa)}" alt="">
          <span><b>${esc(v.titulo)}</b><small>${esc(v.local || "")} · ${dataBR(v.data)}</small></span>
        </a>`).join("")}
    </div>`;

  function desenharPinos() {
    camadaPinos.clearLayers();
    const grupos = [];
    lugares.forEach((v) => {
      const p = mapaLeaflet.latLngToLayerPoint([v.lat, v.lng]);
      const g = grupos.find((g) => g.p.distanceTo(p) < 60);
      if (g) g.vs.push(v); else grupos.push({ p, vs: [v] });
    });
    grupos.forEach(({ vs }) => {
      const lat = vs.reduce((s, v) => s + v.lat, 0) / vs.length;
      const lng = vs.reduce((s, v) => s + v.lng, 0) / vs.length;
      const m = L.marker([lat, lng], { icon: pino(vs[0], vs.length), title: vs.length === 1 ? vs[0].titulo : `${vs.length} álbuns` }).addTo(camadaPinos);
      if (vs.length === 1) { m.bindPopup(popupViagem(vs[0])); return; }
      m.on("click", () => {
        const limites = L.latLngBounds(vs.map((v) => [v.lat, v.lng]));
        // Lugares quase no mesmo ponto: em vez de aproximar, lista os álbuns.
        if (mapaLeaflet.getBoundsZoom(limites, false, L.point(120, 120)) <= mapaLeaflet.getZoom() || mapaLeaflet.getZoom() >= 17) {
          m.bindPopup(popupLista(vs)).openPopup();
        } else {
          mapaLeaflet.flyToBounds(limites, { padding: [120, 120], maxZoom: 17, duration: 0.8 });
        }
      });
    });
  }
  mapaLeaflet.on("zoomend", desenharPinos);

  const pontos = lugares.map((v) => [v.lat, v.lng]);
  if (pontos.length === 1) mapaLeaflet.setView(pontos[0], 14, { animate: false });
  else mapaLeaflet.fitBounds(pontos, { padding: [90, 90], maxZoom: 15, animate: false });
  desenharPinos();
}

// Contornos dos estados, usados quando o mapa de ruas não carrega.
function desenharContornos(m) {
  const cor = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const ufsVisitadas = new Set(VIAGENS.map((v) => v.lugar.split(",").pop().trim()));
  const vizinhos = L.geoJSON(MAPA_VIZINHOS, { interactive: false, style: { color: cor("--mapa-borda"), weight: 1, fillColor: cor("--mapa-vizinho"), fillOpacity: 1 } }).addTo(m);
  const ufs = L.geoJSON(MAPA_ESTADOS, {
    interactive: false,
    style: (f) => ({
      color: cor("--mapa-borda"), weight: 1,
      fillColor: ufsVisitadas.has(f.properties.sigla) ? cor("--mapa-visitado") : cor("--mapa-terra"),
      fillOpacity: 1,
    }),
  }).addTo(m);
  vizinhos.bringToBack(); ufs.bringToFront();
  m.getContainer().classList.add("sem-ruas");
  if (m.getZoom() > 7) m.setView(m.getCenter(), 6, { animate: false });
}

// ---------- lista de viagens ----------
function viagens() {
  document.title = "Viagens · Vida na Natureza";
  app.innerHTML = `
    <section class="pagina">
      <h1>Viagens</h1>
      <p class="intro">Cada lugar vira um álbum. As espécies aparecem identificadas dentro das fotos.</p>
      <div class="cards">
        ${viagensOrdenadas().map((v) => {
          const n = new Set(v.fotos.filter((f) => f.especie).map((f) => f.especie)).size;
          return `
          <a class="card" href="#${v.id}">
            <img src="${thumb(v, v.capa)}" alt="" loading="lazy">
            <div class="card-corpo">
              <h3>${esc(v.titulo)}</h3>
              <div class="meta">${esc(v.lugar)} · ${dataBR(v.data)}</div>
              <div class="meta">${v.fotos.length} fotos · ${n} espécies</div>
            </div>
          </a>`;
        }).join("")}
      </div>
    </section>`;
}

// ---------- álbum ----------
function viagem(id) {
  const v = VIAGENS.find((x) => x.id === id);
  if (!v) return viagens();
  document.title = `${v.titulo} · Vida na Natureza`;

  const especiesAqui = [...new Set(v.fotos.filter((f) => f.especie).map((f) => f.especie))];
  const tiposAqui = Object.keys(TIPOS).filter((t) => v.fotos.some((f) => f.tipo === t));

  app.innerHTML = `
    <section class="album-capa">
      <img src="${web(v, v.capa)}" alt="">
      <div class="txt">
        <a class="voltar" href="#mapa">← Voltar ao mapa</a>
        <h1>${esc(v.titulo)}</h1>
        <div class="meta">${esc(v.lugar)} · ${dataBR(v.data)} · ${v.fotos.length} fotos</div>
        <a class="botao botao-drive" href="${v.drive || DRIVE_GERAL}" target="_blank" rel="noopener">${ICONE_DRIVE} Fotos em alta no Drive</a>
      </div>
    </section>
    <section class="pagina">
      <p class="resumo">${esc(v.resumo)}</p>
      ${especiesAqui.length ? `
        <h2 class="sec-titulo">Espécies encontradas</h2>
        <div class="chips" id="chips-esp">
          ${especiesAqui.map((k) => `<button class="chip" data-esp="${k}">${esc(ESPECIES[k].nome)} <i>${esc(ESPECIES[k].cientifico)}</i></button>`).join("")}
        </div>` : ""}
      <div class="filtros" id="filtros">
        <button class="chip ativo" data-tipo="">Todas</button>
        ${tiposAqui.map((t) => `<button class="chip" data-tipo="${t}">${TIPOS[t]}</button>`).join("")}
      </div>
      <div class="grade" id="grade"></div>
    </section>`;

  let filtro = { tipo: "", esp: "" };
  const grade = document.getElementById("grade");

  function desenhar() {
    const lista = v.fotos
      .map((f) => ({ ...f, viagem: v }))
      .filter((f) => (!filtro.tipo || f.tipo === filtro.tipo) && (!filtro.esp || f.especie === filtro.esp));
    grade.innerHTML = lista.map((f, i) => {
      const e = ESPECIES[f.especie];
      const cap = e ? `${esc(e.nome)} · <i>${esc(e.cientifico)}</i>` : esc(f.legenda || "");
      return `<figure tabindex="0" data-i="${i}"><img src="${thumb(v, f.arquivo)}" alt="${esc(e ? e.nome : f.legenda || "")}" loading="lazy">${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`;
    }).join("");
    grade.querySelectorAll("figure").forEach((fig) => {
      const abrir = () => abrirLightbox(lista, +fig.dataset.i);
      fig.addEventListener("click", abrir);
      fig.addEventListener("keydown", (ev) => { if (ev.key === "Enter") abrir(); });
    });
    document.querySelectorAll("#filtros .chip").forEach((c) => c.classList.toggle("ativo", c.dataset.tipo === filtro.tipo && !filtro.esp));
    document.querySelectorAll("#chips-esp .chip").forEach((c) => c.classList.toggle("ativo", c.dataset.esp === filtro.esp));
  }

  document.getElementById("filtros").addEventListener("click", (ev) => {
    const b = ev.target.closest(".chip"); if (!b) return;
    filtro = { tipo: b.dataset.tipo, esp: "" }; desenhar();
  });
  document.getElementById("chips-esp")?.addEventListener("click", (ev) => {
    const b = ev.target.closest(".chip"); if (!b) return;
    filtro = { tipo: "", esp: filtro.esp === b.dataset.esp ? "" : b.dataset.esp }; desenhar();
  });
  desenhar();
}

// ---------- espécies ----------
function especies() {
  document.title = "Espécies · Vida na Natureza";
  const fotos = todasAsFotos().filter((f) => f.especie);
  const porEspecie = {};
  fotos.forEach((f) => (porEspecie[f.especie] ||= []).push(f));
  const chaves = Object.keys(porEspecie).sort((a, b) =>
    ESPECIES[a].grupo.localeCompare(ESPECIES[b].grupo) || ESPECIES[a].nome.localeCompare(ESPECIES[b].nome));

  const bloco = (grupo, titulo) => {
    const ks = chaves.filter((k) => ESPECIES[k].grupo === grupo);
    if (!ks.length) return "";
    return `
      <h2 class="sec-titulo" style="margin-top:32px">${titulo} · ${ks.length}</h2>
      <div class="cards">
        ${ks.map((k) => {
          const e = ESPECIES[k], fs = porEspecie[k], capa = capaDaEspecie(k, fs);
          const lugares = [...new Set(fs.map((f) => f.viagem.titulo))].join(", ");
          return `
          <div class="card card-especie" tabindex="0" data-esp="${k}">
            <div class="card-foto">
              <img src="${thumb(capa.viagem, capa.arquivo)}" alt="" loading="lazy">
              ${fs.length > 1 ? `<button class="trocar-capa" data-esp="${k}" aria-label="Escolher a foto de capa de ${esc(e.nome)}">${ICONE_CAPA} Trocar capa</button>` : ""}
            </div>
            <div class="card-corpo">
              <h3>${esc(e.nome)}</h3>
              <div class="cient">${esc(e.cientifico)}</div>
              <div class="meta" style="margin-top:8px"><span class="selo ${e.confianca}">${CONFIANCA[e.confianca]}</span> · ${fs.length} ${fs.length === 1 ? "foto" : "fotos"}</div>
              <div class="meta">${esc(lugares)}</div>
            </div>
          </div>`;
        }).join("")}
      </div>`;
  };

  app.innerHTML = `
    <section class="pagina">
      <h1>Espécies</h1>
      <p class="intro">Tudo o que já fotografamos. O selo mostra o quanto temos certeza da identificação: algumas só dá para confirmar com uma foto mais de perto ou com a ajuda de especialistas no iNaturalist.</p>
      ${Object.entries(GRUPOS).map(([g, [, plural]]) => bloco(g, plural)).join("")}
    </section>`;

  app.querySelectorAll(".card[data-esp]").forEach((c) => {
    const k = c.dataset.esp, fs = porEspecie[k];
    const abrir = () => abrirLightbox(fs, Math.max(0, fs.indexOf(capaDaEspecie(k, fs))));
    c.addEventListener("click", (ev) => { if (!ev.target.closest(".trocar-capa")) abrir(); });
    c.addEventListener("keydown", (ev) => { if (ev.key === "Enter" && ev.target === c) abrir(); });
  });
  app.querySelectorAll(".trocar-capa").forEach((b) => b.addEventListener("click", (ev) => {
    ev.stopPropagation();
    escolherCapa(b.dataset.esp, porEspecie[b.dataset.esp]);
  }));
}

// ---------- capa das espécies ----------
// A capa escolhida fica salva neste navegador; sem escolha, vale a "capa" do dados.js.
const CHAVE_CAPAS = "vida-na-natureza:capas";
const ICONE_CAPA = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>`;
function lerCapas() {
  try { return JSON.parse(localStorage.getItem(CHAVE_CAPAS)) || {}; } catch (_) { return {}; }
}
function salvarCapa(k, f) {
  const capas = lerCapas();
  capas[k] = `${f.viagem.id}/${f.arquivo}`;
  try { localStorage.setItem(CHAVE_CAPAS, JSON.stringify(capas)); } catch (_) { /* navegador sem armazenamento */ }
  capasDaSessao[k] = capas[k];
}
const capasDaSessao = {};
function capaDaEspecie(k, fs) {
  const escolhida = capasDaSessao[k] || lerCapas()[k];
  return fs.find((f) => `${f.viagem.id}/${f.arquivo}` === escolhida)
    || fs.find((f) => f.arquivo === ESPECIES[k].capa)
    || fs[0];
}
function escolherCapa(k, fs) {
  const e = ESPECIES[k], atual = capaDaEspecie(k, fs);
  const caixa = document.createElement("div");
  caixa.className = "escolher";
  caixa.innerHTML = `
    <div class="escolher-painel" role="dialog" aria-modal="true" aria-labelledby="escolher-titulo">
      <div class="escolher-cab">
        <div>
          <h2 id="escolher-titulo">Capa de ${esc(e.nome)}</h2>
          <p>Clique na foto que vai aparecer no card.</p>
        </div>
        <button class="escolher-fechar" aria-label="Fechar">&times;</button>
      </div>
      <div class="escolher-grade">
        ${fs.map((f, i) => `
          <button class="escolher-foto${f === atual ? " atual" : ""}" data-i="${i}" aria-label="Usar ${esc(f.arquivo)} como capa">
            <img src="${thumb(f.viagem, f.arquivo)}" alt="" loading="lazy">
            ${f === atual ? `<span>Capa atual</span>` : ""}
          </button>`).join("")}
      </div>
      <p class="escolher-nota">A escolha fica salva neste navegador.</p>
    </div>`;
  document.body.appendChild(caixa);
  document.body.style.overflow = "hidden";
  const fechar = () => { caixa.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", tecla); };
  const tecla = (ev) => { if (ev.key === "Escape") fechar(); };
  document.addEventListener("keydown", tecla);
  caixa.addEventListener("click", (ev) => {
    if (ev.target === caixa || ev.target.closest(".escolher-fechar")) return fechar();
    const b = ev.target.closest(".escolher-foto");
    if (!b) return;
    salvarCapa(k, fs[+b.dataset.i]);
    fechar();
    const y = window.scrollY;
    especies();
    window.scrollTo(0, y);
  });
  caixa.querySelector(".escolher-foto.atual, .escolher-foto")?.focus();
}

// ---------- lightbox ----------
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector(".lb-foto img");
const lbInfo = lb.querySelector(".lb-info");
let lbLista = [], lbIdx = 0;

// Abrir a foto cria uma entrada no histórico, para o "voltar" do celular
// fechar só a foto e manter a página do álbum.
let lbNoHistorico = false, ignorarVoltar = false;
function abrirLightbox(lista, i) {
  lbLista = lista; lbIdx = i;
  if (lb.hidden) {
    try { history.pushState({ foto: true }, ""); lbNoHistorico = true; } catch (_) { /* página publicada pode não permitir */ }
  }
  lb.hidden = false; document.body.style.overflow = "hidden";
  mostrar();
}
let capaMudou = false;
// veioDoVoltar: o histórico já voltou sozinho (botão voltar) ou a tela está mudando.
function fecharLightbox(veioDoVoltar = false) {
  if (lb.hidden) return;
  if (lbNoHistorico && !veioDoVoltar) { ignorarVoltar = true; history.back(); }
  lbNoHistorico = false;
  lb.hidden = true; document.body.style.overflow = "";
  // Se trocou a capa vendo a foto na página Espécies, atualiza os cards.
  if (capaMudou && app.querySelector(".card-especie")) {
    const y = window.scrollY; especies(); window.scrollTo(0, y);
  }
  capaMudou = false;
}
function passo(d) {
  lbIdx = (lbIdx + d + lbLista.length) % lbLista.length;
  mostrar();
}
function mostrar() {
  const f = lbLista[lbIdx], v = f.viagem, e = ESPECIES[f.especie];
  lbImg.src = thumb(v, f.arquivo); // aparece na hora, depois troca pela grande
  const grande = new Image();
  grande.onload = () => { if (lbLista[lbIdx] === f) lbImg.src = grande.src; };
  grande.src = web(v, f.arquivo);
  lbImg.alt = e ? e.nome : f.legenda || "";
  lb.querySelectorAll(".lb-seta").forEach((b) => (b.style.display = lbLista.length > 1 ? "" : "none"));

  const temArquivo = !!v.driveArquivos?.[f.arquivo];
  lbInfo.innerHTML = `
    <a class="lb-drive" href="${linkDrive(v, f)}" target="_blank" rel="noopener">${ICONE_DRIVE} Abrir em alta no Drive</a>
    ${temArquivo ? "" : `<div class="lb-drive-dica">Abre a pasta da viagem. Procure por ${esc(f.arquivo)}.</div>`}
    ${e ? `
      <div class="sec-titulo" style="color:#8f977f">${(GRUPOS[e.grupo] || [""])[0]}</div>
      <h2>${esc(e.nome)}</h2>
      <div class="cient">${esc(e.cientifico)}</div>
      <div class="fam">Família ${esc(e.familia)} · <span class="selo ${e.confianca}">${CONFIANCA[e.confianca]}</span></div>
      ${f.legenda ? `<p class="legenda">${esc(f.legenda)}</p>` : ""}
      <p>${esc(e.descricao)}</p>
      ${e.nota ? `<p class="nota">${esc(e.nota)}</p>` : ""}
      <div class="links">${Object.entries(e.links || {}).map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n} ↗</a>`).join("")}</div>
      <button class="lb-capa" type="button">${ICONE_CAPA} Usar como capa da espécie</button>
    ` : `
      <div class="sec-titulo" style="color:#8f977f">${TIPOS[f.tipo] || ""}</div>
      <p class="legenda">${esc(f.legenda || "")}</p>
    `}
    <div class="rodape">
      <a href="#${v.id}" style="color:inherit">${esc(v.titulo)}</a> · ${dataBR(v.data)}<br>
      ${lbIdx + 1} de ${lbLista.length} · ${esc(f.arquivo)}
    </div>`;
  const botaoCapa = lbInfo.querySelector(".lb-capa");
  if (botaoCapa) {
    const ehCapa = capaDaEspecie(f.especie, todasAsFotos().filter((x) => x.especie === f.especie)).arquivo === f.arquivo;
    if (ehCapa) { botaoCapa.disabled = true; botaoCapa.lastChild.textContent = " Esta é a capa da espécie"; }
    botaoCapa.addEventListener("click", () => {
      salvarCapa(f.especie, f);
      capaMudou = true;
      botaoCapa.disabled = true;
      botaoCapa.lastChild.textContent = " Capa da espécie trocada";
    });
  }
}

lb.querySelector(".lb-fechar").addEventListener("click", fecharLightbox);
lb.querySelector(".lb-ant").addEventListener("click", () => passo(-1));
lb.querySelector(".lb-prox").addEventListener("click", () => passo(1));
lb.querySelector(".lb-foto").addEventListener("click", (ev) => { if (ev.target !== lbImg) fecharLightbox(); });
document.addEventListener("keydown", (ev) => {
  if (lb.hidden) return;
  if (ev.key === "Escape") fecharLightbox();
  if (ev.key === "ArrowLeft") passo(-1);
  if (ev.key === "ArrowRight") passo(1);
});
// Deslizar para os lados no celular.
let toqueX = null;
lb.addEventListener("touchstart", (ev) => { toqueX = ev.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (ev) => {
  if (toqueX === null) return;
  const dx = ev.changedTouches[0].clientX - toqueX;
  if (Math.abs(dx) > 50) passo(dx < 0 ? 1 : -1);
  toqueX = null;
});

mostrarTela(location.hash.slice(1));
