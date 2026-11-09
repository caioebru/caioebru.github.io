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

// Foto de bicho em cativeiro (zoológico)? Vale o "cativeiro" da foto; sem ele,
// o "zoologico" da viagem.
const emZoo = (f, v = f.viagem) => f.cativeiro ?? !!(v && v.zoologico);

// Caderneta: para cada espécie, a viagem em que apareceu pela primeira vez e
// todas as viagens em que já apareceu. O número segue a ordem em que foram vistas
// (viagens da mais antiga para a mais nova, fotos na ordem em que foram tiradas).
// Como na observação de aves, só conta bicho visto na natureza: zoológico não entra.
function caderneta() {
  const c = {};
  [...viagensOrdenadas()].reverse().forEach((v) => v.fotos.forEach((f) => {
    if (!ESPECIES[f.especie] || emZoo(f, v)) return;
    const r = (c[f.especie] ||= { primeira: v, viagens: [], fotos: 0 });
    if (!r.viagens.includes(v)) r.viagens.push(v);
    r.fotos++;
  }));
  Object.values(c).forEach((r, i) => { r.numero = i + 1; });
  return c;
}
const nomeLugar = (v) => v.local || v.titulo;

// ---------- rotas ----------
const rotas = {
  "": home,
  mapa,
  viagens,
  viagem,
  especies,
  roteiro,
};

let mapaLeaflet = null;
let mapasRoteiro = []; // mapas da aba Roteiro, fechados ao trocar de tela
let albumFiltroInicial = ""; // espécie para o álbum já abrir filtrado (vindo do mapa de uma espécie)
function mostrarTela(token) {
  let rota = token, param = "";
  if (VIAGENS.some((v) => v.id === token)) { rota = "viagem"; param = token; }
  // #mapa-sabia-laranjeira: o mapa só com os lugares onde vimos essa espécie
  if (token.startsWith("mapa-") && ESPECIES[token.slice(5)]) { rota = "mapa"; param = token.slice(5); }
  if (!(rota in rotas)) rota = "";
  if (mapaLeaflet) { mapaLeaflet.remove(); mapaLeaflet = null; }
  mapasRoteiro.forEach((m) => m.remove()); mapasRoteiro = [];
  painelRoteiro.aberto = false; painelRoteiro.noHistorico = false; document.body.classList.remove("rt-painel-aberto");
  fecharLightbox(true);
  pararSom();
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
  if (painelRoteiro.aberto) return painelRoteiro.fechar(true); // voltar com o painel do roteiro aberto: fecha só o painel
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
          <a href="#roteiro"><div class="ico">🧭</div><h2>Roteiro</h2><p>Ideias para as próximas saídas: perto de Bauru, o PETAR e o TOP 10 do Brasil.</p></a>
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
function mapa(esp) {
  const e = ESPECIES[esp];
  const lugares = viagensOrdenadas().filter((v) => !e || v.fotos.some((f) => f.especie === esp));
  document.title = e ? `Onde vimos: ${e.nome} · Vida na Natureza` : "Mapa · Vida na Natureza";
  document.documentElement.style.setProperty("--topo-h", topo.offsetHeight + "px");
  app.innerHTML = `
    <section class="mapa-wrap">
      <div id="mapa"></div>
      <div class="mapa-legenda">${e
        ? `Onde vimos: <b>${esc(e.nome)}</b> · ${lugares.length} ${lugares.length === 1 ? "lugar" : "lugares"} · <a href="#mapa">Mostrar todos os álbuns</a>`
        : `${VIAGENS.length} ${VIAGENS.length === 1 ? "álbum" : "álbuns"}. Clique numa foto no mapa para abrir.`}</div>
    </section>`;
  mapaLeaflet = novoMapa("mapa");

  mapaLeaflet.on("popupopen", (ev) => {
    ev.popup.getElement().querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (ev2) => {
      ev2.preventDefault();
      ev2.stopPropagation(); // o clique não chega no tratamento geral de links, que abriria a tela de novo
      // No mapa de uma espécie, o álbum já abre mostrando só as fotos dela.
      if (e) albumFiltroInicial = esp;
      try { history.pushState(null, "", a.getAttribute("href")); } catch (_) {}
      mostrarTela(a.getAttribute("href").slice(1));
    }));
  });

  // Um pino por lugar. Quando o zoom deixa pinos encostados, eles se juntam
  // num pino com contador; clicar nele aproxima o mapa até separá-los.
  const camadaPinos = L.layerGroup().addTo(mapaLeaflet);
  // No mapa de uma espécie, o pino mostra uma foto dela naquele lugar.
  const fotoPino = (v) => {
    if (!e) return v.capa;
    const fs = v.fotos.filter((f) => f.especie === esp);
    return (fs.find((f) => f.arquivo === capaDaEspecie(esp, todasAsFotos().filter((x) => x.especie === esp)).arquivo) || fs[0]).arquivo;
  };
  const fotosDaEspecie = (v) => v.fotos.filter((f) => f.especie === esp).length;
  const pino = (v, n) => L.divIcon({
    className: "",
    html: `<div class="pino" style="background-image:url('${thumb(v, fotoPino(v))}')">${n > 1 ? `<span class="pino-n">${n}</span>` : ""}</div>
      ${n === 1 ? `<span class="pino-rotulo">${esc(nomeLugar(v))}</span>` : ""}`,
    iconSize: [52, 52], iconAnchor: [26, 26], popupAnchor: [0, -28],
  });
  const popupViagem = (v) => `
    <div class="popup">
      <img src="${thumb(v, fotoPino(v))}" alt="">
      <div>
        <h3>${esc(v.titulo)}</h3>
        <p>${esc(v.local ? v.local + " · " : "")}${esc(v.lugar)}<br>${dataBR(v.data)} · ${e
          ? `${fotosDaEspecie(v)} ${fotosDaEspecie(v) === 1 ? "foto" : "fotos"} de ${esc(e.nome.toLowerCase())}`
          : `${v.fotos.length} fotos`}</p>
        <a class="botao" href="#${v.id}">${e ? "Ver as fotos →" : "Abrir álbum →"}</a>
      </div>
    </div>`;
  const popupLista = (vs) => `
    <div class="popup popup-lista">
      <div class="popup-cab"><h3>${esc(vs[0].lugar)}</h3><p>${vs.length} álbuns</p></div>
      ${vs.map((v) => `
        <a class="popup-item" href="#${v.id}">
          <img src="${thumb(v, fotoPino(v))}" alt="">
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

// Mapa com as ruas do OpenStreetMap. Onde as imagens de fora são bloqueadas
// (como na página publicada no Claude), usa os contornos do mapa-base.js.
function novoMapa(id, opcoes = {}) {
  const m = L.map(id, { zoomControl: true, scrollWheelZoom: true, minZoom: 3, maxZoom: 19, ...opcoes });
  m.attributionControl.setPrefix(false);
  const ruas = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(m);
  let carregou = false, erros = 0;
  ruas.on("tileload", () => { carregou = true; });
  ruas.on("tileerror", () => {
    if (carregou || ++erros < 3 || !m._loaded) return;
    try { m.removeLayer(ruas); desenharContornos(m); } catch (_) { /* o mapa já foi fechado */ }
  });
  return m;
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

// ---------- roteiro ----------
// Um catálogo só (lugares, lugares diferentes, PETAR, TOP 10 e campings), com
// busca, coleções e filtros; lista enxuta ao lado do mapa e um painel com os
// detalhes de cada lugar.
const TEMAS = { bichos: "Bichos", aves: "Aves", trilha: "Trilha", agua: "Água", caverna: "Caverna", aventura: "Aventura", cultura: "Cultura", diferente: "Diferente", camping: "Camping" };
const ICONES_TEMA = { bichos: "🐾", aves: "🦜", trilha: "🥾", agua: "💧", caverna: "🔦", aventura: "🧗", cultura: "🏛️", diferente: "🏚️", camping: "⛺" };
const SITUACAO = { gratis: "Grátis", pago: "Pago", agendar: "Agendar antes", fechado: "Sem visitação", confirmar: "A confirmar" };
const comoChegar = (l) => `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`;
// Álbuns de um lugar do roteiro: "album" pode ser um id ou uma lista de ids.
const albunsDe = (l) => [].concat(l.album || []).filter((id) => VIAGENS.some((v) => v.id === id));
const semAcento = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const slug = (s) => semAcento(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
function kmEmLinhaReta(a, b) {
  const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}
const lerLocal = (k, padrao) => { try { const v = localStorage.getItem(k); return v === null ? padrao : JSON.parse(v); } catch (_) { return padrao; } };
const salvarLocal = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* navegador sem armazenamento */ } };

// Temas dos destinos do TOP 10 (no roteiro.js eles têm só texto).
const TEMAS_TOP = {
  "Pantanal Norte": ["bichos", "aves", "agua"],
  "Bonito e Serra da Bodoquena": ["agua", "aventura", "aves"],
  "Serra da Canastra": ["bichos", "trilha", "agua"],
  "Parque Estadual Intervales": ["aves", "trilha"],
  "Parque Estadual Carlos Botelho": ["bichos", "trilha"],
  "Ubatuba e Serra do Mar": ["aves", "trilha", "agua"],
  "Parque Nacional do Itatiaia": ["trilha", "aventura", "aves"],
  "Chapada dos Veadeiros": ["trilha", "agua"],
  "Chapada Diamantina": ["trilha", "aventura", "agua"],
  "Cristalino, sul da Amazônia": ["aves", "bichos"],
};

// Distância em faixas de tempo de carro (km de estrada a partir de Bauru)
const FAIXAS = {
  perto: ["Até 1h de carro", 0, 70],
  bate: ["Bate-volta (até 2h30)", 0, 170],
  fds: ["Fim de semana", 170, 650],
  longe: ["Viagem grande", 650, Infinity],
};

let catalogoRoteiro = null;
function catalogo() {
  if (catalogoRoteiro) return catalogoRoteiro;
  const R = ROTEIRO, itens = [];
  const add = (l, extra) => {
    const it = { ...l, ...extra };
    it.id = slug(it.nome);
    it.km = it.km ?? Math.round((kmEmLinhaReta(R.centro, it) * 1.25) / 10) * 10;
    it.temas = it.temas || [];
    it.albuns = albunsDe(it);
    it.gratis = it.situacao === "gratis" || /^gr[aá]tis/i.test(it.preco || "");
    it.busca = semAcento([it.nome, it.cidade, it.resumo, it.bichos, it.dica, it.preco, it.temas.map((t) => TEMAS[t]).join(" ")].join(" "));
    itens.push(it);
  };
  R.perto.forEach((l) => add(l, { categoria: "lugar" }));
  R.alem.forEach((l) => add(l, { categoria: "lugar" }));
  R.diferentes.forEach((l) => add(l, { categoria: "diferente", temas: ["diferente"], situacao: "gratis", preco: l.preco || "Grátis (ver de fora)" }));
  add(R.petar, { categoria: "petar", temas: ["caverna", "aventura", "trilha", "aves"], preco: "R$ 19 por núcleo + monitor", situacao: "pago" });
  R.top.forEach((t, i) => add(t, { categoria: "top", posicao: i + 1, cidade: t.onde, temas: TEMAS_TOP[t.nome] || ["trilha"], resumo: t.bichos, preco: t.custo, situacao: "pago", aviao: /^voo/i.test(t.como) }));
  R.campings.forEach((c) => add(c, { categoria: "camping", temas: ["camping"], situacao: /^gr[aá]tis/i.test(c.preco) ? "gratis" : "confirmar" }));
  catalogoRoteiro = itens;
  return itens;
}

function tempoDeCarro(it) {
  if (it.aviao) return "de avião";
  if (it.km <= 5) return "na cidade";
  const min = Math.max(10, Math.round(((it.km / 75) * 60) / 10) * 10);
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60), resto = min % 60;
  return `~${h}h${resto >= 30 ? "30" : ""}`;
}
const iconeDe = (it) => ICONES_TEMA[it.temas[0]] || "📍";

const COLECOES = [
  { id: "domingo", nome: "Bate-volta de domingo", icone: "☀️", filtro: (it) => it.km <= 170 && it.categoria !== "camping" },
  { id: "bichos", nome: "Para ver bichos", icone: "🦜", filtro: (it) => it.temas.includes("aves") || it.temas.includes("bichos") },
  { id: "estranhos", nome: "Lugares estranhos", icone: "🏚️", filtro: (it) => it.categoria === "diferente" },
  { id: "acampar", nome: "Onde acampar", icone: "⛺", filtro: (it) => it.categoria === "camping" },
  { id: "sonhos", nome: "Viagem dos sonhos", icone: "✈️", filtro: (it) => it.categoria === "top" || it.categoria === "petar", ordem: (a, b) => (a.posicao || 0) - (b.posicao || 0) },
  { id: "comecar", nome: "Por onde começar", icone: "🧭", filtro: (it) => ["petar", "parque-estadual-intervales", "serra-da-canastra", "pantanal-norte"].includes(it.id), ordem: (a, b) => a.km - b.km },
];

const filtroRoteiro = { q: "", colecao: "", faixa: "", tema: "", gratis: false, soQueroIr: false, ordem: "perto", modo: "lista" };
let esconderFomos = lerLocal("vida-na-natureza:esconder-fomos", false);
let queroIr = new Set(lerLocal("vida-na-natureza:quero-ir", []));
// Painel de detalhes: abrir cria um passo no histórico, e o "voltar" fecha só o painel.
const painelRoteiro = { aberto: false, noHistorico: false, fechar: null };

// "O que o pessoal fala": resumo das opiniões encontradas, com as fontes.
function blocoOpiniao(a, aberto = false) {
  if (!a) return "";
  return `
    <details class="opiniao"${aberto ? " open" : ""}>
      <summary>O que o pessoal fala${a.nota ? ` · <b>${esc(a.nota)}</b>` : ""}</summary>
      ${a.resumo ? `<p>${esc(a.resumo)}</p>` : ""}
      ${a.bom?.length ? `<ul class="op-bom">${a.bom.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${a.atencao?.length ? `<ul class="op-atencao">${a.atencao.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${a.fontes?.length ? `<p class="op-fontes">Fontes: ${a.fontes.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(n)}</a>`).join(" · ")}</p>` : ""}
    </details>`;
}

function roteiro() {
  document.title = "Roteiro · Vida na Natureza";
  document.documentElement.style.setProperty("--topo-h", topo.offsetHeight + "px");
  const R = ROTEIRO, itens = catalogo(), F = filtroRoteiro;
  const temasUsados = Object.keys(TEMAS).filter((t) => itens.some((it) => it.temas.includes(t)));

  app.innerHTML = `
    <section class="pagina roteiro2">
      <h1>Roteiro</h1>
      <p class="intro">Lugares para as próximas saídas: perto de Bauru, estranhos, campings e o TOP 10 do Brasil. Pesquisa de novembro de 2026: preços mudam, então confirmem antes de ir.</p>

      <div class="rt-busca">
        <label class="rt-campo">
          <span aria-hidden="true">🔍</span>
          <input id="rt-q" type="search" placeholder="Busque: cachoeira, onça, grátis, Botucatu…" autocomplete="off" value="${esc(F.q)}">
        </label>
        <button type="button" id="rt-quero" class="rt-quero" aria-pressed="${F.soQueroIr}">❤ Quero ir · <b id="rt-quero-n">${queroIr.size}</b></button>
      </div>

      <div class="rt-colecoes" id="rt-colecoes">
        ${COLECOES.map((c) => `<button type="button" data-col="${c.id}" aria-pressed="${F.colecao === c.id}">${c.icone} ${c.nome}</button>`).join("")}
      </div>

      <div class="rt-filtros">
        <select id="rt-faixa" aria-label="Distância">
          <option value="">Qualquer distância</option>
          ${Object.entries(FAIXAS).map(([k, [n]]) => `<option value="${k}"${F.faixa === k ? " selected" : ""}>${n}</option>`).join("")}
        </select>
        <select id="rt-tema" aria-label="Tipo de lugar">
          <option value="">Todos os tipos</option>
          ${temasUsados.map((t) => `<option value="${t}"${F.tema === t ? " selected" : ""}>${ICONES_TEMA[t]} ${TEMAS[t]}</option>`).join("")}
        </select>
        <label class="rt-check"><input type="checkbox" id="rt-gratis"${F.gratis ? " checked" : ""}> Grátis</label>
        <label class="rt-check"><input type="checkbox" id="rt-fomos"${esconderFomos ? " checked" : ""}> Esconder onde já fomos</label>
        <select id="rt-ordem" aria-label="Ordenar">
          <option value="perto"${F.ordem === "perto" ? " selected" : ""}>Mais perto</option>
          <option value="nome"${F.ordem === "nome" ? " selected" : ""}>A a Z</option>
        </select>
      </div>

      <div class="rt-status">
        <span id="rt-contagem"></span>
        <button type="button" id="rt-limpar" class="rt-limpar" hidden>Limpar filtros</button>
        <div class="rt-modos" role="group" aria-label="Ver como">
          <button type="button" data-modo="lista" aria-pressed="${F.modo === "lista"}">Lista</button>
          <button type="button" data-modo="mapa" aria-pressed="${F.modo === "mapa"}">Mapa</button>
        </div>
      </div>

      <div class="rt-corpo modo-${F.modo}" id="rt-corpo">
        <ol class="rt-lista" id="rt-lista"></ol>
        <div class="rt-mapa"><div id="rt-mapa"></div></div>
      </div>

      <details class="roteiro-fontes">
        <summary>Fontes da pesquisa</summary>
        <ul>${R.fontes.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}</ul>
      </details>

      <div class="rt-fundo" id="rt-fundo" hidden></div>
      <aside class="rt-painel" id="rt-painel" hidden aria-label="Detalhes do lugar"></aside>
    </section>`;

  const lista = document.getElementById("rt-lista");
  const corpo = document.getElementById("rt-corpo");

  // ---- mapa ----
  const mapa = novoMapa("rt-mapa", { scrollWheelZoom: true });
  mapasRoteiro.push(mapa);
  L.marker([R.centro.lat, R.centro.lng], { icon: L.divIcon({ className: "", html: `<span class="pino-centro">Bauru</span>`, iconSize: [60, 22], iconAnchor: [30, 11] }), interactive: false, zIndexOffset: -1000 }).addTo(mapa);
  const camada = L.layerGroup().addTo(mapa);
  let visiveis = [], pinoDe = {};

  function desenharPinos() {
    camada.clearLayers(); pinoDe = {};
    const grupos = [];
    visiveis.forEach((it) => {
      const p = mapa.latLngToLayerPoint([it.lat, it.lng]);
      const g = grupos.find((g) => g.p.distanceTo(p) < 34);
      if (g) g.itens.push(it); else grupos.push({ p, itens: [it] });
    });
    grupos.forEach(({ itens: gi }) => {
      const lat = gi.reduce((s, it) => s + it.lat, 0) / gi.length, lng = gi.reduce((s, it) => s + it.lng, 0) / gi.length;
      if (gi.length === 1) {
        const it = gi[0];
        const m = L.marker([it.lat, it.lng], {
          icon: L.divIcon({ className: "", html: `<span class="rt-pino cat-${it.categoria}">${iconeDe(it)}</span>`, iconSize: [32, 32], iconAnchor: [16, 16] }),
          title: it.nome, riseOnHover: true,
        }).addTo(camada);
        m.on("click", () => abrirPainel(it.id));
        pinoDe[it.id] = m;
        return;
      }
      const m = L.marker([lat, lng], { icon: L.divIcon({ className: "", html: `<span class="rt-pino rt-grupo">${gi.length}</span>`, iconSize: [34, 34], iconAnchor: [17, 17] }), title: `${gi.length} lugares` }).addTo(camada);
      m.on("click", () => {
        const limites = L.latLngBounds(gi.map((it) => [it.lat, it.lng]));
        // Lugares no mesmo ponto: em vez de aproximar, lista os nomes.
        if (mapa.getZoom() >= 13 || mapa.getBoundsZoom(limites, false, L.point(80, 80)) <= mapa.getZoom()) {
          m.bindPopup(`<div class="popup-roteiro">${gi.map((it) => `<button type="button" class="rt-pop-item" data-id="${it.id}">${iconeDe(it)} ${esc(it.nome)}</button>`).join("")}</div>`).openPopup();
        } else {
          mapa.flyToBounds(limites, { padding: [60, 60], maxZoom: 14, duration: 0.6 });
        }
      });
    });
  }
  mapa.on("zoomend", desenharPinos);
  mapa.on("popupopen", (ev) => ev.popup.getElement().querySelectorAll(".rt-pop-item").forEach((b) =>
    b.addEventListener("click", () => { mapa.closePopup(); abrirPainel(b.dataset.id); })));

  function enquadrar() {
    if (!visiveis.length) return;
    // Sem filtro nenhum, começa pela região de Bauru; os destinos longe ficam a um zoom de distância.
    const semFiltro = !(F.q || F.colecao || F.faixa || F.tema || F.gratis || F.soQueroIr || esconderFomos);
    const base = semFiltro ? visiveis.filter((it) => it.km <= 170) : visiveis;
    const pts = (base.length ? base : visiveis).map((it) => [it.lat, it.lng]);
    if (pts.length === 1) mapa.setView(pts[0], 11, { animate: false });
    else mapa.fitBounds(pts, { padding: [40, 40], maxZoom: 12, animate: false });
    desenharPinos();
  }
  // Logo no carregamento a página às vezes ainda tem largura 0: reenquadra quando o mapa ganhar tamanho.
  const esperarTamanho = () => {
    let tentativas = 0;
    const checar = () => {
      if (!mapasRoteiro.includes(mapa)) return;
      const el = mapa.getContainer();
      if (el.clientWidth && el.clientHeight) { mapa.invalidateSize(false); enquadrar(); }
      else if (++tentativas < 300) setTimeout(checar, 200);
    };
    setTimeout(checar, 200);
  };

  // ---- filtros e lista ----
  function filtrar() {
    const col = COLECOES.find((c) => c.id === F.colecao);
    const termos = semAcento(F.q).split(/\s+/).filter(Boolean);
    let r = itens.filter((it) =>
      (!col || col.filtro(it)) &&
      (!F.faixa || (it.km >= FAIXAS[F.faixa][1] && it.km <= FAIXAS[F.faixa][2])) &&
      (!F.tema || it.temas.includes(F.tema)) &&
      (!F.gratis || it.gratis) &&
      (!esconderFomos || !it.albuns.length) &&
      (!F.soQueroIr || queroIr.has(it.id)) &&
      termos.every((t) => it.busca.includes(t)));
    const ordem = F.ordem === "nome" ? (a, b) => a.nome.localeCompare(b.nome) : col?.ordem || ((a, b) => a.km - b.km);
    return r.sort(ordem);
  }

  function atualizar(reenquadrar = true) {
    visiveis = filtrar();
    lista.innerHTML = visiveis.length
      ? visiveis.map((it) => `
        <li>
          <button type="button" class="rt-item" data-id="${it.id}">
            <span class="rt-ic" aria-hidden="true">${iconeDe(it)}</span>
            <span class="rt-txt">
              <b>${esc(it.nome)}</b>
              <small>${esc(it.cidade)} · ${tempoDeCarro(it)}${it.categoria === "top" ? ` · TOP ${it.posicao}` : ""}</small>
            </span>
            <span class="rt-dir">
              <span class="rt-sit s-${it.situacao}">${it.gratis ? "Grátis" : SITUACAO[it.situacao]}</span>
              ${it.albuns.length ? `<span class="rt-fomos">✓ Já fomos</span>` : ""}
              ${queroIr.has(it.id) ? `<span class="rt-coracao" title="Quero ir">❤</span>` : ""}
            </span>
          </button>
        </li>`).join("")
      : `<li class="rt-vazio">Nada encontrado com esses filtros.<br><button type="button" class="botao" id="rt-limpar-vazio">Limpar filtros</button></li>`;

    const algumFiltro = F.q || F.colecao || F.faixa || F.tema || F.gratis || F.soQueroIr || esconderFomos;
    document.getElementById("rt-contagem").textContent =
      `${visiveis.length} ${visiveis.length === 1 ? "lugar" : "lugares"}${algumFiltro ? ` de ${itens.length}` : ""}`;
    document.getElementById("rt-limpar").hidden = !algumFiltro;
    document.getElementById("rt-limpar-vazio")?.addEventListener("click", limparFiltros);
    document.querySelectorAll("#rt-colecoes button").forEach((b) => b.setAttribute("aria-pressed", F.colecao === b.dataset.col));
    document.getElementById("rt-quero").setAttribute("aria-pressed", F.soQueroIr);
    document.getElementById("rt-quero-n").textContent = queroIr.size;
    if (reenquadrar) enquadrar(); else desenharPinos();
  }

  function limparFiltros() {
    Object.assign(F, { q: "", colecao: "", faixa: "", tema: "", gratis: false, soQueroIr: false });
    esconderFomos = false; salvarLocal("vida-na-natureza:esconder-fomos", false);
    document.getElementById("rt-q").value = "";
    document.getElementById("rt-faixa").value = "";
    document.getElementById("rt-tema").value = "";
    document.getElementById("rt-gratis").checked = false;
    document.getElementById("rt-fomos").checked = false;
    atualizar();
  }

  // Passar o mouse num item destaca o pino dele no mapa.
  lista.addEventListener("mouseover", (ev) => {
    const b = ev.target.closest(".rt-item");
    document.querySelectorAll(".rt-pino.ativo").forEach((p) => p.classList.remove("ativo"));
    if (b) pinoDe[b.dataset.id]?.getElement()?.querySelector(".rt-pino")?.classList.add("ativo");
  });
  lista.addEventListener("mouseleave", () => document.querySelectorAll(".rt-pino.ativo").forEach((p) => p.classList.remove("ativo")));
  lista.addEventListener("click", (ev) => { const b = ev.target.closest(".rt-item"); if (b) abrirPainel(b.dataset.id); });

  let espera;
  document.getElementById("rt-q").addEventListener("input", (ev) => {
    clearTimeout(espera);
    espera = setTimeout(() => { F.q = ev.target.value; atualizar(); }, 180);
  });
  document.getElementById("rt-colecoes").addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b) return;
    F.colecao = F.colecao === b.dataset.col ? "" : b.dataset.col;
    atualizar();
  });
  document.getElementById("rt-faixa").addEventListener("change", (ev) => { F.faixa = ev.target.value; atualizar(); });
  document.getElementById("rt-tema").addEventListener("change", (ev) => { F.tema = ev.target.value; atualizar(); });
  document.getElementById("rt-ordem").addEventListener("change", (ev) => { F.ordem = ev.target.value; atualizar(false); });
  document.getElementById("rt-gratis").addEventListener("change", (ev) => { F.gratis = ev.target.checked; atualizar(); });
  document.getElementById("rt-fomos").addEventListener("change", (ev) => {
    esconderFomos = ev.target.checked; salvarLocal("vida-na-natureza:esconder-fomos", esconderFomos); atualizar();
  });
  document.getElementById("rt-quero").addEventListener("click", () => { F.soQueroIr = !F.soQueroIr; atualizar(); });
  document.getElementById("rt-limpar").addEventListener("click", limparFiltros);
  document.querySelectorAll(".rt-modos button").forEach((b) => b.addEventListener("click", () => mudarModo(b.dataset.modo)));

  function mudarModo(modo) {
    F.modo = modo;
    corpo.className = `rt-corpo modo-${modo}`;
    document.querySelectorAll(".rt-modos button").forEach((x) => x.setAttribute("aria-pressed", x.dataset.modo === modo));
    if (modo === "mapa") setTimeout(() => { mapa.invalidateSize(false); enquadrar(); }, 30);
  }

  // ---- painel de detalhes ----
  const painel = document.getElementById("rt-painel");
  const fundo = document.getElementById("rt-fundo");

  function htmlPainel(it) {
    const perto = it.categoria === "camping" ? [] : itens
      .filter((c) => c.categoria === "camping" && kmEmLinhaReta(it, c) <= 40)
      .sort((a, b) => kmEmLinhaReta(it, a) - kmEmLinhaReta(it, b));
    const P = ROTEIRO.petar;
    return `
      <div class="rtp-cab">
        <span class="rt-ic rtp-ic" aria-hidden="true">${iconeDe(it)}</span>
        <div class="rtp-titulo">
          <h2>${esc(it.nome)}</h2>
          <div class="meta">${esc(it.cidade)} · ~${it.km} km de Bauru · ${tempoDeCarro(it)}</div>
        </div>
        <button type="button" class="rtp-fechar" aria-label="Fechar">&times;</button>
      </div>
      <div class="rtp-selos">
        <span class="situacao s-${it.situacao}">${it.gratis ? "Grátis" : SITUACAO[it.situacao]}</span>
        ${it.categoria === "top" ? `<span class="rtp-tag">TOP ${it.posicao}</span>` : ""}
        ${it.temas.map((t) => `<span class="rtp-tag">${ICONES_TEMA[t]} ${TEMAS[t]}</span>`).join("")}
      </div>
      <div class="rtp-acoes">
        <button type="button" class="rtp-quero" aria-pressed="${queroIr.has(it.id)}">${queroIr.has(it.id) ? "❤ Na lista Quero ir" : "♡ Quero ir"}</button>
        <a href="${comoChegar(it)}" target="_blank" rel="noopener">Como chegar${it.aprox ? " (aproximado)" : ""} ↗</a>
        ${(it.link || (it.categoria === "petar" && P.link)) ? `<a href="${it.link || P.link}" target="_blank" rel="noopener">Mais informações ↗</a>` : ""}
        <button type="button" class="rtp-ver-mapa">${ICONE_PINO} Ver no mapa</button>
      </div>
      ${it.albuns.map((id) => `<a class="rtp-fomos" href="#${id}">✓ Já fomos: ${esc(VIAGENS.find((v) => v.id === id).titulo)} →</a>`).join("")}
      <p class="rtp-resumo">${esc(it.categoria === "top" ? `Bichos-estrela: ${it.bichos}` : it.resumo)}</p>
      ${it.dica ? `<p class="lugar-dica">${esc(it.dica)}</p>` : ""}
      ${it.categoria === "petar" ? `
        <h3 class="sec-titulo">Núcleos</h3>
        <dl class="petar-lista">${P.nucleos.map(([n, d]) => `<dt>${esc(n)}</dt><dd>${esc(d)}</dd>`).join("")}</dl>
        <h3 class="sec-titulo">Quanto custa (2026)</h3>
        <dl class="petar-lista">${P.precos.map(([n, d]) => `<dt>${esc(n)}</dt><dd>${esc(d)}</dd>`).join("")}</dl>
        <h3 class="sec-titulo">Dicas</h3>
        <ul class="petar-dicas">${P.dicas.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
      <dl class="lugar-info">
        ${it.categoria === "top" ? `<dt>Como ir</dt><dd>${esc(it.como)}</dd><dt>Custo</dt><dd>${esc(it.custo)}</dd>` : it.categoria === "petar" ? "" : `<dt>Preço</dt><dd>${esc(it.preco)}</dd>`}
        ${it.contato ? `<dt>Contato</dt><dd>${esc(it.contato)}</dd>` : ""}
      </dl>
      ${it.categoria === "diferente" ? `<p class="aviso-urbex">Muitos lugares assim são particulares ou estão em ruína: vejam de fora, vão de dia e não entrem em construção caindo.</p>` : ""}
      ${blocoOpiniao(it.avaliacao, true)}
      ${perto.length ? `
        <h3 class="sec-titulo">⛺ Onde acampar perto</h3>
        <ul class="rtp-perto">${perto.map((c) => `<li><button type="button" data-id="${c.id}">${esc(c.nome)} <small>· ${kmEmLinhaReta(it, c) < 1 ? "menos de 1 km" : Math.round(kmEmLinhaReta(it, c)) + " km"} · ${esc(c.preco)}</small></button></li>`).join("")}</ul>` : ""}`;
  }

  function abrirPainel(id) {
    const it = itens.find((x) => x.id === id);
    if (!it) return;
    painel.innerHTML = htmlPainel(it);
    painel.scrollTop = 0;
    if (!painelRoteiro.aberto) {
      try { history.pushState({ painel: true }, ""); painelRoteiro.noHistorico = true; } catch (_) { /* página publicada pode não permitir */ }
    }
    painelRoteiro.aberto = true;
    painel.hidden = false; fundo.hidden = false;
    document.body.classList.add("rt-painel-aberto");
    painel.querySelector(".rtp-fechar").focus({ preventScroll: true });
    painel.querySelector(".rtp-fechar").addEventListener("click", () => fecharPainel());
    painel.querySelector(".rtp-quero").addEventListener("click", () => {
      queroIr.has(it.id) ? queroIr.delete(it.id) : queroIr.add(it.id);
      salvarLocal("vida-na-natureza:quero-ir", [...queroIr]);
      abrirPainel(it.id); atualizar(false);
    });
    painel.querySelector(".rtp-ver-mapa").addEventListener("click", () => {
      fecharPainel();
      if (F.modo !== "mapa" && getComputedStyle(document.querySelector(".rt-modos")).display !== "none") mudarModo("mapa");
      setTimeout(() => {
        mapa.setView([it.lat, it.lng], Math.max(mapa.getZoom(), 12));
        document.getElementById("rt-mapa").scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => pinoDe[it.id]?.getElement()?.querySelector(".rt-pino")?.classList.add("ativo"), 400);
      }, 60);
    });
    painel.querySelectorAll(".rtp-perto button").forEach((b) => b.addEventListener("click", () => abrirPainel(b.dataset.id)));
  }

  function fecharPainel(veioDoVoltar = false) {
    if (!painelRoteiro.aberto) return;
    if (painelRoteiro.noHistorico && !veioDoVoltar) { ignorarVoltar = true; history.back(); }
    painelRoteiro.aberto = false; painelRoteiro.noHistorico = false;
    painel.hidden = true; fundo.hidden = true;
    document.body.classList.remove("rt-painel-aberto");
  }
  painelRoteiro.fechar = fecharPainel;
  fundo.addEventListener("click", () => fecharPainel());
  painel.addEventListener("keydown", (ev) => { if (ev.key === "Escape") fecharPainel(); });

  atualizar();
  esperarTamanho();
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
  const cad = caderneta();
  const novas = especiesAqui.filter((k) => cad[k]?.primeira === v);

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
        <h2 class="sec-titulo">Espécies encontradas${novas.length ? ` · <span class="sec-novas">${novas.length === especiesAqui.length ? (novas.length === 1 ? "nova na caderneta" : "todas novas na caderneta") : `${novas.length} ${novas.length === 1 ? "nova" : "novas"} na caderneta`}</span>` : ""}</h2>
        <div class="chips" id="chips-esp">
          ${especiesAqui.map((k) => `<button class="chip" data-esp="${k}">${novas.includes(k) ? `<span class="novo">Novo!</span> ` : ""}${esc(ESPECIES[k].nome)} <i>${esc(ESPECIES[k].cientifico)}</i></button>`).join("")}
        </div>` : ""}
      <div class="filtros" id="filtros">
        <button class="chip ativo" data-tipo="">Todas</button>
        ${tiposAqui.map((t) => `<button class="chip" data-tipo="${t}">${TIPOS[t]}</button>`).join("")}
      </div>
      <div class="grade" id="grade"></div>
    </section>`;

  let filtro = { tipo: "", esp: especiesAqui.includes(albumFiltroInicial) ? albumFiltroInicial : "" };
  albumFiltroInicial = "";
  const grade = document.getElementById("grade");

  function desenhar() {
    const lista = v.fotos
      .map((f) => ({ ...f, viagem: v }))
      .filter((f) => (!filtro.tipo || f.tipo === filtro.tipo) && (!filtro.esp || f.especie === filtro.esp));
    grade.innerHTML = lista.map((f, i) => {
      const e = ESPECIES[f.especie];
      const cap = e ? `${esc(e.nome)} · <i>${esc(e.cientifico)}</i>` : esc(f.legenda || "");
      return `<figure tabindex="0" data-i="${i}"><img src="${thumb(v, f.arquivo)}" alt="${esc(e ? e.nome : f.legenda || "")}" loading="lazy">${e && emZoo(f) ? `<span class="selo-zoo">Zoológico</span>` : ""}${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`;
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
let ordemEspecies = (() => { try { return localStorage.getItem("vida-na-natureza:ordem") || "grupo"; } catch (_) { return "grupo"; } })();
const ICONE_PINO = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
function especies() {
  document.title = "Espécies · Vida na Natureza";
  const fotos = todasAsFotos().filter((f) => f.especie);
  const porEspecie = {};
  fotos.forEach((f) => (porEspecie[f.especie] ||= []).push(f));
  const cad = caderneta();
  const chaves = Object.keys(cad); // já na ordem em que foram vistas

  const card = (k) => {
    const e = ESPECIES[k], fs = porEspecie[k], capa = capaDaEspecie(k, fs), r = cad[k];
    const nLugares = new Set(fs.map((f) => f.viagem)).size;
    const zoo = fs.filter((f) => emZoo(f));
    const primeiraZoo = zoo.reduce((a, f) => (!a || f.viagem.data < a.data ? f.viagem : a), null);
    return `
      <div class="card card-especie" tabindex="0" data-esp="${k}">
        <div class="card-foto">
          <img src="${thumb(capa.viagem, capa.arquivo)}" alt="" loading="lazy">
          ${r ? `<span class="numero" title="Número na caderneta">nº ${r.numero}</span>` : `<span class="numero numero-zoo">Zoológico</span>`}
          ${fs.length > 1 ? `<button class="trocar-capa" data-esp="${k}" aria-label="Escolher a foto de capa de ${esc(e.nome)}">${ICONE_CAPA} Trocar capa</button>` : ""}
        </div>
        <div class="card-corpo">
          <h3>${esc(e.nome)}</h3>
          <div class="cient">${esc(e.cientifico)}</div>
          <div class="meta" style="margin-top:8px"><span class="selo ${e.confianca}">${CONFIANCA[e.confianca]}</span> · ${fs.length} ${fs.length === 1 ? "foto" : "fotos"}</div>
          ${r
            ? `<div class="meta primeira-vez">1ª vez em ${dataBR(r.primeira.data)} · ${esc(nomeLugar(r.primeira))}</div>
               ${zoo.length ? `<div class="meta">Também ${zoo.length === 1 ? "1 foto" : `${zoo.length} fotos`} no zoológico</div>` : ""}`
            : `<div class="meta primeira-vez">Só no zoológico · ${dataBR(primeiraZoo.data)} · ${esc(nomeLugar(primeiraZoo))}</div>`}
          <div class="card-acoes">
            ${e.som ? `<button class="ouvir" type="button" data-esp="${k}" aria-label="Ouvir ${esc(e.nome)}">${ICONE_PLAY} <span>Ouvir</span></button>` : ""}
            <a class="ver-mapa" href="#mapa-${k}">${ICONE_PINO} Onde vimos${nLugares > 1 ? ` · ${nLugares} lugares` : ""}</a>
          </div>
        </div>
      </div>`;
  };

  // Por grupo: aves, insetos, aranhas, mamíferos.
  const porGrupo = () => Object.entries(GRUPOS).map(([g, [, plural]]) => {
    const ks = chaves.filter((k) => ESPECIES[k].grupo === g)
      .sort((a, b) => ESPECIES[a].nome.localeCompare(ESPECIES[b].nome));
    return ks.length ? `<h2 class="sec-titulo" style="margin-top:32px">${plural} · ${ks.length}</h2><div class="cards">${ks.map(card).join("")}</div>` : "";
  }).join("");
  // Na ordem em que vimos: as novidades de cada viagem, da mais antiga para a mais nova.
  const porOrdem = () => [...viagensOrdenadas()].reverse().map((v) => {
    const ks = chaves.filter((k) => cad[k].primeira === v);
    if (!ks.length) return "";
    return `
      <div class="viagem-novas">
        <h2 class="sec-titulo">${esc(v.titulo)} · ${dataBR(v.data)}</h2>
        <p>${ks.length} ${ks.length === 1 ? "espécie nova" : "espécies novas"} na caderneta (nº ${cad[ks[0]].numero}${ks.length > 1 ? `${ks.length === 2 ? " e " : " a "}${cad[ks[ks.length - 1]].numero}` : ""})</p>
      </div>
      <div class="cards">${ks.map(card).join("")}</div>`;
  }).join("");

  const contagem = Object.entries(GRUPOS)
    .map(([g, [sing, plural]]) => [chaves.filter((k) => ESPECIES[k].grupo === g).length, sing, plural])
    .filter(([n]) => n)
    .map(([n, sing, plural]) => `${n} ${(n === 1 ? sing : plural).toLowerCase()}`);
  const ultima = viagensOrdenadas()[0];
  const novasUltima = chaves.filter((k) => cad[k].primeira === ultima).length;
  // Espécies que só foram fotografadas no zoológico ficam fora da caderneta.
  const soZoo = Object.keys(porEspecie).filter((k) => !cad[k])
    .sort((a, b) => ESPECIES[a].nome.localeCompare(ESPECIES[b].nome));

  app.innerHTML = `
    <section class="pagina">
      <h1>Espécies</h1>
      <div class="caderneta-resumo">
        <div class="caderneta-total"><b>${chaves.length}</b><span>espécies na caderneta</span></div>
        <div class="caderneta-detalhe">
          <p>${contagem.join(" · ")}${soZoo.length ? ` · e mais ${soZoo.length} só no zoológico` : ""}</p>
          ${novasUltima ? `<p>A última viagem, ${esc(nomeLugar(ultima))}, trouxe ${novasUltima} ${novasUltima === 1 ? "espécie nova" : "espécies novas"}.</p>` : ""}
        </div>
      </div>
      <div class="ordem" role="group" aria-label="Como mostrar as espécies">
        <button type="button" data-ordem="grupo" aria-pressed="${ordemEspecies === "grupo"}">Por grupo</button>
        <button type="button" data-ordem="vimos" aria-pressed="${ordemEspecies === "vimos"}">Na ordem em que vimos</button>
      </div>
      <p class="intro">O número de cada bicho é a ordem em que ele entrou na caderneta. O selo mostra o quanto temos certeza da identificação: algumas só dá para confirmar com uma foto mais de perto ou com a ajuda de especialistas no iNaturalist.</p>
      ${ordemEspecies === "vimos" ? porOrdem() : porGrupo()}
      ${soZoo.length ? `
        <div class="viagem-novas">
          <h2 class="sec-titulo">Vistos só no zoológico · ${soZoo.length}</h2>
          <p>Não entram na caderneta: ela só conta bicho visto na natureza. Quando um deles aparecer solto por aí, ganha o número dele.</p>
        </div>
        <div class="cards">${soZoo.map(card).join("")}</div>` : ""}
    </section>`;

  app.querySelectorAll(".ordem button").forEach((b) => b.addEventListener("click", () => {
    ordemEspecies = b.dataset.ordem;
    try { localStorage.setItem("vida-na-natureza:ordem", ordemEspecies); } catch (_) {}
    const y = window.scrollY; especies(); window.scrollTo(0, y);
  }));

  app.querySelectorAll(".card[data-esp]").forEach((c) => {
    const k = c.dataset.esp, fs = porEspecie[k];
    const abrir = () => abrirLightbox(fs, Math.max(0, fs.indexOf(capaDaEspecie(k, fs))));
    c.addEventListener("click", (ev) => { if (!ev.target.closest(".trocar-capa, .ouvir, .ver-mapa")) abrir(); });
    c.addEventListener("keydown", (ev) => { if (ev.key === "Enter" && ev.target === c) abrir(); });
  });
  app.querySelectorAll(".ouvir").forEach((b) => b.addEventListener("click", (ev) => {
    ev.stopPropagation();
    alternarSom(b.dataset.esp, b);
  }));
  app.querySelectorAll(".trocar-capa").forEach((b) => b.addEventListener("click", (ev) => {
    ev.stopPropagation();
    escolherCapa(b.dataset.esp, porEspecie[b.dataset.esp]);
  }));
}

// ---------- sons ----------
// Um tocador só para o site inteiro: tocar um som para o que estava tocando.
const tocador = new Audio();
tocador.preload = "none";
let botaoTocando = null;
const ICONE_PLAY = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
const ICONE_PAUSA = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`;
function marcarBotao(b, tocando) {
  if (!b) return;
  b.classList.toggle("tocando", tocando);
  b.querySelector("svg").outerHTML = tocando ? ICONE_PAUSA : ICONE_PLAY;
  b.querySelector("span").textContent = tocando ? "Pausar" : (b.dataset.rotulo || "Ouvir");
}
function pararSom() {
  tocador.pause();
  marcarBotao(botaoTocando, false);
  botaoTocando = null;
}
function alternarSom(k, b) {
  const src = `sons/${ESPECIES[k].som.arquivo}`;
  if (botaoTocando === b && !tocador.paused) return pararSom();
  marcarBotao(botaoTocando, false);
  if (!tocador.src.endsWith(src)) tocador.src = src;
  botaoTocando = b;
  marcarBotao(b, true);
  tocador.play().catch(() => pararSom());
}
tocador.addEventListener("ended", () => { marcarBotao(botaoTocando, false); botaoTocando = null; });
const creditoSom = (s) =>
  `${esc(s.tipo)} gravado por ${esc(s.autor)} em ${esc(s.local)} · <a href="${s.link}" target="_blank" rel="noopener">iNaturalist ↗</a> · ${esc(s.licenca)}`;

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
  pararSom();
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
      <span class="origem ${emZoo(f) ? "origem-zoo" : "origem-natureza"}">${emZoo(f) ? "Fotografado no zoológico" : "Fotografado na natureza"}</span>
      ${(() => {
        const r = caderneta()[f.especie];
        if (!r) return `<p class="lb-caderneta">Ainda fora da caderneta: só foi visto no zoológico.<br><a href="#mapa-${f.especie}">${ICONE_PINO} Onde vimos</a></p>`;
        return `<p class="lb-caderneta">nº ${r.numero} na caderneta · 1ª vez em ${dataBR(r.primeira.data)}, ${esc(nomeLugar(r.primeira))}${r.primeira === v && !emZoo(f) ? ` <span class="novo">Novo!</span>` : ""}<br><a href="#mapa-${f.especie}">${ICONE_PINO} Onde vimos${r.viagens.length > 1 ? ` (${r.viagens.length} lugares)` : ""}</a></p>`;
      })()}
      ${f.legenda ? `<p class="legenda">${esc(f.legenda)}</p>` : ""}
      <p>${esc(e.descricao)}</p>
      ${e.nota ? `<p class="nota">${esc(e.nota)}</p>` : ""}
      ${e.som ? `
        <div class="lb-som">
          <button class="ouvir ouvir-grande" type="button" data-rotulo="${e.grupo === "ave" ? "Ouvir o canto" : "Ouvir"}">${ICONE_PLAY} <span>${e.grupo === "ave" ? "Ouvir o canto" : "Ouvir"}</span></button>
          <p>${creditoSom(e.som)}</p>
        </div>` : ""}
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
  // Som: passar para outra foto da mesma espécie não interrompe o canto.
  const botaoSom = lbInfo.querySelector(".lb-som .ouvir");
  const somDaFoto = e?.som ? `sons/${e.som.arquivo}` : null;
  if (!tocador.paused && !(somDaFoto && tocador.src.endsWith(somDaFoto))) pararSom();
  if (botaoSom) {
    if (!tocador.paused) { botaoTocando = botaoSom; marcarBotao(botaoSom, true); }
    botaoSom.addEventListener("click", () => alternarSom(f.especie, botaoSom));
  }
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
