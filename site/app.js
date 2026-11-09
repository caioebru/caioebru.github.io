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
const TEMAS = { aves: "Aves", trilha: "Trilha", agua: "Água", cultura: "Cultura", aventura: "Aventura", caverna: "Caverna" };
const SITUACAO = { gratis: "Grátis", pago: "Pago", agendar: "Agendar antes", fechado: "Sem visitação", confirmar: "A confirmar" };
const comoChegar = (l) => `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`;
// Álbuns de um lugar do roteiro: "album" pode ser um id ou uma lista de ids.
const albunsDe = (l) => [].concat(l.album || []).filter((id) => VIAGENS.some((v) => v.id === id));
let roteiroSoNovos = (() => { try { return !!localStorage.getItem("vida-na-natureza:so-novos"); } catch (_) { return false; } })();

// "O que o pessoal fala": resumo das opiniões encontradas, com as fontes.
function blocoOpiniao(a) {
  if (!a) return "";
  return `
    <details class="opiniao">
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
  const R = ROTEIRO;
  const lugares = [...R.perto.map((l) => ({ ...l, grupo: "perto" })), ...R.alem.map((l) => ({ ...l, grupo: "alem" }))]
    .map((l, i) => ({ ...l, n: i + 1 }));
  const temasUsados = Object.keys(TEMAS).filter((t) => lugares.some((l) => l.temas.includes(t)));

  const cardLugar = (l) => `
    <article class="lugar${albunsDe(l).length ? " visitado" : ""}" id="lugar-${l.n}" data-temas="${l.temas.join(" ")}">
      <div class="lugar-cab">
        <span class="lugar-n ${l.grupo}">${l.n}</span>
        <div class="lugar-titulo">
          <h3>${esc(l.nome)}</h3>
          <div class="meta">${esc(l.cidade)} · ~${l.km} km de Bauru</div>
        </div>
        <span class="situacao s-${l.situacao}">${SITUACAO[l.situacao]}</span>
      </div>
      <p>${esc(l.resumo)}</p>
      ${l.dica ? `<p class="lugar-dica">${esc(l.dica)}</p>` : ""}
      <dl class="lugar-info">
        <dt>Preço</dt><dd>${esc(l.preco)}</dd>
        ${l.contato ? `<dt>Contato</dt><dd>${esc(l.contato)}</dd>` : ""}
      </dl>
      ${blocoOpiniao(l.avaliacao)}
      <div class="lugar-temas">${l.temas.map((t) => `<span>${TEMAS[t]}</span>`).join("")}</div>
      <div class="lugar-acoes">
        <button type="button" class="ver-no-mapa" data-n="${l.n}">${ICONE_PINO} Ver no mapa</button>
        <a href="${comoChegar(l)}" target="_blank" rel="noopener">Como chegar ↗</a>
        ${l.link ? `<a href="${l.link}" target="_blank" rel="noopener">Mais informações ↗</a>` : ""}
        ${albunsDe(l).map((id) => `<a href="#${id}" class="ja-fomos">Já fomos: ${esc((VIAGENS.find((v) => v.id === id) || {}).titulo || "ver o álbum")}</a>`).join("")}
      </div>
    </article>`;

  const P = R.petar;
  app.innerHTML = `
    <section class="pagina roteiro">
      <h1>Roteiro</h1>
      <p class="intro">Ideias para as próximas saídas, pensadas em bichos, trilha e aventura. Pesquisa de novembro de 2026: preços mudam, então confirmem antes de ir.</p>
      <nav class="roteiro-secoes" aria-label="Partes do roteiro">
        <button type="button" data-alvo="sec-perto">Perto de Bauru</button>
        <button type="button" data-alvo="sec-diferentes">Lugares diferentes</button>
        <button type="button" data-alvo="sec-petar">PETAR</button>
        <button type="button" data-alvo="sec-top">TOP 10</button>
        <button type="button" data-alvo="sec-camping">Onde acampar</button>
      </nav>

      <section id="sec-perto" class="roteiro-bloco">
        <h2>Perto de Bauru</h2>
        <p class="roteiro-sub">Num raio de 50 km a região é quase toda cana e pasto, e há poucos parques abertos. O que vale são as matas que guardam bichos, o rio Tietê e a Terra Indígena Araribá. Os pontos em laranja ficam um pouco mais longe, até ~2h30 de carro.</p>
        <div class="roteiro-mapa"><div id="mapa-perto"></div></div>
        <div class="roteiro-filtros">
          <div class="filtros" id="filtro-temas">
            <button class="chip ativo" data-tema="">Todos</button>
            ${temasUsados.map((t) => `<button class="chip" data-tema="${t}">${TEMAS[t]}</button>`).join("")}
          </div>
          <label class="so-novos"><input type="checkbox" id="so-novos" ${roteiroSoNovos ? "checked" : ""}> Esconder onde já fomos</label>
        </div>
        <p class="roteiro-contagem" id="roteiro-contagem"></p>
        <h3 class="sec-titulo">Até 50 km</h3>
        <div class="lugares">${lugares.filter((l) => l.grupo === "perto").map(cardLugar).join("")}</div>
        <h3 class="sec-titulo" style="margin-top:28px">Um pouco além (até ~2h30)</h3>
        <div class="lugares">${lugares.filter((l) => l.grupo === "alem").map(cardLugar).join("")}</div>
      </section>

      <section id="sec-diferentes" class="roteiro-bloco">
        <h2>Lugares diferentes</h2>
        <p class="roteiro-sub">Abandonados, curiosos ou com lenda: igreja perdida no mato, estações de trem fantasmas, dinossauros e uma vila deserta. Aparecem em roxo no mapa de perto de Bauru.</p>
        <p class="aviso-urbex">Muitos são particulares, da União ou estão caindo aos pedaços. Vejam de fora, vão de dia, não entrem em construção em ruína e não levem nada de lá.</p>
        <div class="lugares">${R.diferentes.map((d, i) => `
          <article class="lugar diferente" id="diferente-${i}">
            <div class="lugar-cab">
              <span class="lugar-n dif">?</span>
              <div class="lugar-titulo">
                <h3>${esc(d.nome)}</h3>
                <div class="meta">${esc(d.cidade)} · ~${d.km} km de Bauru</div>
              </div>
              ${d.preco ? `<span class="situacao s-gratis">${esc(d.preco)}</span>` : ""}
            </div>
            <p>${esc(d.resumo)}</p>
            ${d.dica ? `<p class="lugar-dica">${esc(d.dica)}</p>` : ""}
            ${d.contato ? `<dl class="lugar-info"><dt>Contato</dt><dd>${esc(d.contato)}</dd></dl>` : ""}
            <div class="lugar-acoes">
              <a href="${comoChegar(d)}" target="_blank" rel="noopener">Como chegar${d.aprox ? " (local aproximado)" : ""} ↗</a>
              ${d.link ? `<a href="${d.link}" target="_blank" rel="noopener">Mais informações ↗</a>` : ""}
            </div>
          </article>`).join("")}
        </div>
      </section>

      <section id="sec-petar" class="roteiro-bloco petar">
        <div class="petar-cab">
          <div>
            <div class="sec-titulo">Destaque</div>
            <h2>${esc(P.nome)} <small>${esc(P.completo)}</small></h2>
            <div class="meta">${esc(P.cidade)} · ~${P.km} km · ${esc(P.horas)}</div>
          </div>
          <div class="lugar-acoes">
            <a href="${comoChegar(P)}" target="_blank" rel="noopener">Como chegar ↗</a>
            <a href="${P.link}" target="_blank" rel="noopener">Ingressos ↗</a>
            ${albunsDe(P).map((id) => `<a href="#${id}" class="ja-fomos">Já fomos: ${esc(VIAGENS.find((v) => v.id === id).titulo)}</a>`).join("")}
          </div>
        </div>
        <p class="petar-resumo">${esc(P.resumo)}</p>
        ${blocoOpiniao(P.avaliacao)}
        <div class="petar-grade">
          <div>
            <h3 class="sec-titulo">Núcleos</h3>
            <dl class="petar-lista">${P.nucleos.map(([n, d]) => `<dt>${esc(n)}</dt><dd>${esc(d)}</dd>`).join("")}</dl>
          </div>
          <div>
            <h3 class="sec-titulo">Quanto custa (2026)</h3>
            <dl class="petar-lista">${P.precos.map(([n, d]) => `<dt>${esc(n)}</dt><dd>${esc(d)}</dd>`).join("")}</dl>
            <h3 class="sec-titulo" style="margin-top:18px">Dicas</h3>
            <ul class="petar-dicas">${P.dicas.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
          </div>
        </div>
      </section>

      <section id="sec-top" class="roteiro-bloco">
        <h2>TOP 10 para ir um dia</h2>
        <p class="roteiro-sub">Os lugares mais incríveis do Brasil para bichos, trilha e aventura, do mais especial para vocês ao mais distante do bolso.</p>
        <div class="roteiro-mapa"><div id="mapa-top"></div></div>
        <ol class="top10">
          ${R.top.map((t, i) => `
            <li id="top-${i + 1}">
              <span class="top-n">${i + 1}</span>
              <div class="top-corpo">
                <h3>${esc(t.nome)} <small>${esc(t.onde)}</small></h3>
                <p class="top-bichos">${esc(t.bichos)}</p>
                <dl class="lugar-info">
                  <dt>Como ir</dt><dd>${esc(t.como)}</dd>
                  <dt>Custo</dt><dd>${esc(t.custo)}</dd>
                </dl>
                ${blocoOpiniao(t.avaliacao)}
                <div class="lugar-acoes">
                  <button type="button" class="ver-no-mapa" data-top="${i + 1}">${ICONE_PINO} Ver no mapa</button>
                  <a href="${comoChegar(t)}" target="_blank" rel="noopener">Como chegar ↗</a>
                  ${albunsDe(t).map((id) => `<a href="#${id}" class="ja-fomos">Já fomos: ${esc(VIAGENS.find((v) => v.id === id).titulo)}</a>`).join("")}
                </div>
              </div>
            </li>`).join("")}
        </ol>
        <div class="sugestao">
          <h3>Se fosse para escolher três</h3>
          <dl>${R.sugestao.map(([q, o]) => `<dt>${esc(q)}</dt><dd>${esc(o)}</dd>`).join("")}</dl>
        </div>
      </section>

      <section id="sec-camping" class="roteiro-bloco">
        <h2>Onde acampar</h2>
        <p class="roteiro-sub">Campings perto dos lugares do roteiro. Quase todos os preços vêm de relatos antigos de viajantes, então liguem antes. Os campings da região também aparecem como barraquinhas no mapa de perto de Bauru.</p>
        ${[...new Set(R.campings.map((c) => c.area))].map((area) => `
          <h3 class="sec-titulo" style="margin-top:22px">${esc(area)}</h3>
          <div class="lugares">${R.campings.map((c, i) => ({ ...c, i })).filter((c) => c.area === area).map((c) => `
            <article class="lugar camping" id="camping-${c.i}">
              <div class="lugar-cab">
                <span class="lugar-n camping-icone" aria-hidden="true">⛺</span>
                <div class="lugar-titulo">
                  <h3>${esc(c.nome)}</h3>
                  <div class="meta">${esc(c.cidade)}</div>
                </div>
              </div>
              <p>${esc(c.resumo)}</p>
              ${c.dica ? `<p class="lugar-dica">${esc(c.dica)}</p>` : ""}
              <dl class="lugar-info"><dt>Preço</dt><dd>${esc(c.preco)}</dd></dl>
              ${blocoOpiniao(c.avaliacao)}
              <div class="lugar-acoes">
                <a href="${comoChegar(c)}" target="_blank" rel="noopener">Como chegar${c.aprox ? " (local aproximado)" : ""} ↗</a>
                ${c.link ? `<a href="${c.link}" target="_blank" rel="noopener">Mais informações ↗</a>` : ""}
              </div>
            </article>`).join("")}
          </div>`).join("")}
      </section>

      <details class="roteiro-fontes">
        <summary>Fontes da pesquisa</summary>
        <ul>${R.fontes.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}</ul>
      </details>
    </section>`;

  // Atalhos para as partes da página
  app.querySelectorAll(".roteiro-secoes button").forEach((b) => b.addEventListener("click", () =>
    document.getElementById(b.dataset.alvo).scrollIntoView({ behavior: "smooth", block: "start" })));

  // Mapa de perto: círculo de 50 km em volta de Bauru e um pino numerado por lugar
  const pinoNumero = (n, classe) => L.divIcon({ className: "", html: `<span class="pino-num ${classe}">${n}</span>`, iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14] });
  const mPerto = novoMapa("mapa-perto", { scrollWheelZoom: false });
  mapasRoteiro.push(mPerto);
  L.circle([R.centro.lat, R.centro.lng], { radius: 50000, color: "#3d5a3a", weight: 1.5, dashArray: "6 6", fillOpacity: 0.04 }).addTo(mPerto);
  L.marker([R.centro.lat, R.centro.lng], { icon: L.divIcon({ className: "", html: `<span class="pino-centro">Bauru</span>`, iconSize: [60, 22], iconAnchor: [30, 11] }), interactive: false }).addTo(mPerto);
  const marcasPerto = {};
  lugares.forEach((l) => {
    marcasPerto[l.n] = L.marker([l.lat, l.lng], { icon: pinoNumero(l.n, l.grupo), title: l.nome }).addTo(mPerto)
      .bindPopup(`<div class="popup-roteiro"><b>${l.n}. ${esc(l.nome)}</b><br>${esc(l.cidade)} · ~${l.km} km<br><a href="#" data-ir="lugar-${l.n}">Ver detalhes</a></div>`);
  });
  // Lugares diferentes (os mais longe ficam fora do enquadramento)
  R.diferentes.forEach((d, i) => {
    L.marker([d.lat, d.lng], { icon: pinoNumero("?", "dif"), title: d.nome }).addTo(mPerto)
      .bindPopup(`<div class="popup-roteiro"><b>${esc(d.nome)}</b><br>${esc(d.cidade)} · ~${d.km} km<br><a href="#" data-ir="diferente-${i}">Ver detalhes</a></div>`);
  });
  // Campings da região (os do PETAR e do TOP 10 ficam longe deste mapa)
  R.campings.forEach((c, i) => {
    if (c.area === "PETAR" || c.area === "TOP 10") return;
    L.marker([c.lat, c.lng], { icon: L.divIcon({ className: "", html: `<span class="pino-camping">⛺</span>`, iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -13] }), title: c.nome }).addTo(mPerto)
      .bindPopup(`<div class="popup-roteiro"><b>⛺ ${esc(c.nome)}</b><br>${esc(c.cidade)}<br><a href="#" data-ir="camping-${i}">Ver detalhes</a></div>`);
  });
  const enquadrarPerto = () => mPerto.fitBounds(L.latLng(R.centro.lat, R.centro.lng).toBounds(110000), { animate: false });
  enquadrarPerto();

  // Mapa do TOP 10, com o PETAR em destaque
  const mTop = novoMapa("mapa-top", { scrollWheelZoom: false });
  mapasRoteiro.push(mTop);
  const marcasTop = {};
  R.top.forEach((t, i) => {
    marcasTop[i + 1] = L.marker([t.lat, t.lng], { icon: pinoNumero(i + 1, "top"), title: t.nome }).addTo(mTop)
      .bindPopup(`<div class="popup-roteiro"><b>${i + 1}. ${esc(t.nome)}</b><br>${esc(t.onde)}<br><a href="#" data-ir="top-${i + 1}">Ver detalhes</a></div>`);
  });
  L.marker([P.lat, P.lng], { icon: pinoNumero("P", "petar"), title: "PETAR" }).addTo(mTop)
    .bindPopup(`<div class="popup-roteiro"><b>PETAR</b><br>${esc(P.cidade)}<br><a href="#" data-ir="sec-petar">Ver detalhes</a></div>`);
  L.marker([R.centro.lat, R.centro.lng], { icon: L.divIcon({ className: "", html: `<span class="pino-centro">Bauru</span>`, iconSize: [60, 22], iconAnchor: [30, 11] }), interactive: false }).addTo(mTop);
  const enquadrarTop = () => mTop.fitBounds([...R.top.map((t) => [t.lat, t.lng]), [R.centro.lat, R.centro.lng], [P.lat, P.lng]], { padding: [30, 30], animate: false });
  enquadrarTop();
  // Logo no carregamento a página às vezes ainda tem largura 0: espera o mapa
  // ganhar tamanho (checando a cada 0,2 s, por até 1 min) e enquadra de novo.
  [[mPerto, enquadrarPerto], [mTop, enquadrarTop]].forEach(([m, enquadrar]) => {
    const t = m.getSize();
    if (t.x && t.y) return;
    // O Leaflet avisa ("resize") quando percebe o tamanho novo do mapa; a janela também.
    m.once("resize", () => enquadrar());
    const aoRedimensionar = () => {
      window.removeEventListener("resize", aoRedimensionar);
      if (!mapasRoteiro.includes(m)) return;
      m.invalidateSize(false); enquadrar();
    };
    window.addEventListener("resize", aoRedimensionar);
    let tentativas = 0;
    const checar = () => {
      if (!mapasRoteiro.includes(m)) return; // saiu da tela
      const el = m.getContainer();
      if (el.clientWidth && el.clientHeight) { m.invalidateSize(false); enquadrar(); }
      else if (++tentativas < 300) setTimeout(checar, 200);
    };
    setTimeout(checar, 200);
  });

  // "Ver detalhes" no balão rola até o card; "Ver no mapa" no card abre o balão
  [mPerto, mTop].forEach((m) => m.on("popupopen", (ev) => {
    const a = ev.popup.getElement().querySelector("[data-ir]");
    a?.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      m.closePopup();
      const alvo = document.getElementById(a.dataset.ir);
      alvo.scrollIntoView({ behavior: "smooth", block: "center" });
      alvo.classList.add("destaque"); setTimeout(() => alvo.classList.remove("destaque"), 1600);
    });
  }));
  app.querySelectorAll(".ver-no-mapa").forEach((b) => b.addEventListener("click", () => {
    const [m, marca, zoom] = b.dataset.n ? [mPerto, marcasPerto[b.dataset.n], 12] : [mTop, marcasTop[b.dataset.top], 7];
    m.getContainer().scrollIntoView({ behavior: "smooth", block: "center" });
    m.setView(marca.getLatLng(), Math.max(m.getZoom(), zoom));
    marca.openPopup();
  }));

  // Filtros: tema e "esconder onde já fomos" (os dois juntos)
  let tema = "";
  const aplicarFiltros = () => {
    let visiveis = 0;
    lugares.forEach((l) => {
      const mostra = (!tema || l.temas.includes(tema)) && !(roteiroSoNovos && albunsDe(l).length);
      document.getElementById(`lugar-${l.n}`).hidden = !mostra;
      const el = marcasPerto[l.n].getElement(); if (el) el.style.opacity = mostra ? 1 : 0.2;
      if (mostra) visiveis++;
    });
    const fomos = lugares.filter((l) => albunsDe(l).length).length;
    document.getElementById("roteiro-contagem").textContent =
      `Mostrando ${visiveis} de ${lugares.length} lugares${roteiroSoNovos && fomos ? ` · ${fomos} onde já fomos ${fomos === 1 ? "está escondido" : "estão escondidos"}` : ""}.`;
  };
  document.getElementById("filtro-temas").addEventListener("click", (ev) => {
    const b = ev.target.closest(".chip"); if (!b) return;
    tema = b.dataset.tema;
    document.querySelectorAll("#filtro-temas .chip").forEach((c) => c.classList.toggle("ativo", c === b));
    aplicarFiltros();
  });
  document.getElementById("so-novos").addEventListener("change", (ev) => {
    roteiroSoNovos = ev.target.checked;
    try { localStorage.setItem("vida-na-natureza:so-novos", roteiroSoNovos ? "1" : ""); } catch (_) {}
    aplicarFiltros();
  });
  aplicarFiltros();
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
