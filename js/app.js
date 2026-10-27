/* =========================================================
   Maqueta genérica tienda TCG · Noirstweb
   Lógica compartida: encabezado, horario, tema, carro, tarjetas
   Los datos se editan en js/config.js
   ========================================================= */

/* ---------- Personalización desde el link (?tienda=&color=&wa=&ig=&ciudad=) ---------- */
(function personalizar() {
  const guardar = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };
  const leer = (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const q = new URLSearchParams(location.search);
  const mapa = { tienda: "nombre", color: "color", wa: "whatsapp", ig: "instagram", ciudad: "ciudad" };
  Object.entries(mapa).forEach(([param, campo]) => {
    let v = q.get(param);
    if (v) guardar("tcg_" + param, v); else v = leer("tcg_" + param);
    if (!v) return;
    if (param === "color") { v = v.replace(/[^0-9a-f]/gi, "").slice(0, 6); if (v.length === 6 || v.length === 3) TIENDA.color = "#" + v; return; }
    if (param === "wa") { v = v.replace(/\D/g, ""); if (v.length >= 8) TIENDA.whatsapp = v; return; }
    if (param === "ig") { TIENDA.instagram = v.replace(/[^\w.]/g, ""); return; }
    TIENDA[campo] = v.slice(0, 40);
  });
})();

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const CLP = (n) => "$" + Math.round(n).toLocaleString("es-CL");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const waLink = (txt) => `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(txt)}`;
const cat = (id) => CATEGORIAS.find((c) => c.id === id) || { nombre: id, color: "#64748B" };
const precioFinal = (p) => p.oferta || p.precio;
const descuento = (p) => (p.oferta ? Math.round((1 - p.oferta / p.precio) * 100) : 0);
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const aMin = (h) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
const iniciales = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const store = {
  get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

/* ---------- Color de marca ---------- */
document.documentElement.style.setProperty("--brand", TIENDA.color);
document.title = document.title.replace("Tu Tienda TCG", TIENDA.nombre);

/* ---------- Horario (hora de Chile) ---------- */
function horaChile() {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/Santiago", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
  const g = (t) => p.find((x) => x.type === t).value;
  return { dia: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")), min: +g("hour") * 60 + +g("minute") };
}
function estadoTienda() {
  const { dia, min } = horaChile();
  const h = TIENDA.horario[dia];
  if (h && min >= aMin(h[0]) && min < aMin(h[1])) return { abierto: true, corto: "Abierto", largo: `Abierto · cierra ${h[1]}` };
  for (let i = 0; i < 7; i++) {
    const d = (dia + i) % 7, x = TIENDA.horario[d];
    if (!x || (i === 0 && min >= aMin(x[0]))) continue;
    const cuando = i === 0 ? "hoy" : i === 1 ? "mañana" : DIAS[d].toLowerCase();
    return { abierto: false, corto: "Cerrado", largo: `Cerrado · abre ${cuando} ${x[0]}` };
  }
  return { abierto: false, corto: "Cerrado", largo: "Cerrado" };
}

/* ---------- Encabezado, menú y pie (se generan para no repetir HTML) ---------- */
const pagina = document.body.dataset.page;
const ICON = {
  carro: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6"/></svg>',
  sol: '<svg class="ic-sol" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  luna: '<svg class="ic-luna" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z"/></svg>',
};
const NAV = [["index.html", "Inicio", "inicio"], ["productos.html", "Productos", "productos"], ["ofertas.html", "Ofertas", "ofertas"]];

function pintarEncabezado() {
  const avisos = TIENDA.avisos.map((a) => `<span>${esc(a)}</span>`).join("");
  const links = NAV.map(([href, txt, id]) => `<a href="${href}" ${pagina === id ? 'aria-current="page"' : ""}>${txt}${id === "ofertas" ? ' <b class="nav__tag">%</b>' : ""}</a>`).join("");
  $("#encabezado").innerHTML = `
    <div class="demo-bar">Maqueta de demostración · Noirstweb · Productos y precios de ejemplo</div>
    <div class="announce"><div class="announce__track">${avisos}${avisos.replace(/<span>/g, '<span aria-hidden="true">')}</div></div>
    <header class="header">
      <div class="container header__inner">
        <button class="icon-btn menu-btn" id="menuBtn" aria-label="Abrir menú" aria-expanded="false" aria-controls="drawerMenu"><span></span><span></span><span></span></button>
        <a href="index.html" class="logo"><span class="logo__mark">${esc(iniciales(TIENDA.nombre))}</span><span class="logo__text">${esc(TIENDA.nombre)}</span></a>
        <nav class="nav" aria-label="Principal">${links}</nav>
        <div class="header__tools">
          <a href="index.html#visitanos" class="hours" id="hours" title="Ver horario"><i class="hours__dot"></i><span class="hours__long"></span><span class="hours__short"></span></a>
          <button class="icon-btn" id="themeBtn" aria-label="Cambiar a modo oscuro">${ICON.sol}${ICON.luna}</button>
          <button class="icon-btn cart-btn" id="cartBtn" aria-label="Abrir carro">${ICON.carro}<b class="cart-btn__count" id="cartCount">0</b></button>
        </div>
      </div>
    </header>
    <div class="drawer drawer--left" id="drawerMenu" aria-hidden="true">
      <div class="drawer__panel" role="dialog" aria-label="Menú">
        <div class="drawer__head"><strong>${esc(TIENDA.nombre)}</strong><button class="icon-btn" data-close aria-label="Cerrar menú"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
        <nav class="drawer__nav">${links}<a href="index.html#visitanos">Horario y ubicación</a></nav>
        <div class="drawer__cats"><p class="eyebrow">Juegos</p>${CATEGORIAS.map((c) => `<a href="productos.html?juego=${c.id}"><i style="background:${c.color}"></i>${esc(c.nombre)}</a>`).join("")}</div>
      </div>
    </div>`;
}

function pintarPie() {
  const horas = [1, 2, 3, 4, 5, 6, 0].map((d) => { const h = TIENDA.horario[d]; return `<li><span>${DIAS[d]}</span><span>${h ? h.join(" – ") : "Cerrado"}</span></li>`; }).join("");
  $("#pie").innerHTML = `
    <footer class="footer">
      <div class="container footer__grid">
        <div>
          <a href="index.html" class="logo"><span class="logo__mark">${esc(iniciales(TIENDA.nombre))}</span><span class="logo__text">${esc(TIENDA.nombre)}</span></a>
          <p>${esc(TIENDA.eslogan)}.</p>
          <p class="footer__muted">${esc(TIENDA.direccion)}, ${esc(TIENDA.ciudad)}</p>
        </div>
        <div><h3>Juegos</h3><ul>${CATEGORIAS.map((c) => `<li><a href="productos.html?juego=${c.id}">${esc(c.nombre)}</a></li>`).join("")}</ul></div>
        <div><h3>Tienda</h3><ul><li><a href="productos.html">Todos los productos</a></li><li><a href="ofertas.html">Ofertas</a></li><li><a href="productos.html?tipo=Preventa">Preventas</a></li><li><a href="index.html#como-comprar">Cómo comprar</a></li></ul></div>
        <div><h3>Horario</h3><ul class="footer__hours">${horas}</ul>
          <p class="footer__social"><a href="https://instagram.com/${esc(TIENDA.instagram)}" target="_blank" rel="noopener">Instagram</a> · <a href="${waLink("Hola, tengo una consulta.")}" target="_blank" rel="noopener">WhatsApp</a></p></div>
      </div>
      <div class="container footer__bottom"><span>© ${new Date().getFullYear()} ${esc(TIENDA.nombre)}</span><span>Sitio de demostración creado por Noirstweb</span></div>
    </footer>
    <a class="wa-float" href="${waLink("Hola, tengo una consulta.")}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">${ICON.wa}</a>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

pintarEncabezado();
pintarPie();

function pintarHorario() {
  const e = estadoTienda();
  const el = $("#hours");
  el.classList.toggle("is-open", e.abierto);
  $(".hours__long", el).textContent = e.largo;
  $(".hours__short", el).textContent = e.corto;
}
pintarHorario();
setInterval(pintarHorario, 60000);

/* ---------- Tema claro / oscuro ---------- */
function aplicarTema(t) {
  document.documentElement.dataset.theme = t;
  $("#themeBtn").setAttribute("aria-label", t === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
}
aplicarTema(document.documentElement.dataset.theme || "light");
$("#themeBtn").addEventListener("click", () => {
  const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  aplicarTema(t);
  try { localStorage.setItem("tcg_tema", t); } catch (e) {}
});

/* ---------- Toast ---------- */
let toastT;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("is-show"), 2400);
}

/* ---------- Paneles laterales (menú y carro) ---------- */
function abrir(drawer, btn) {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  btn && btn.setAttribute("aria-expanded", "true");
  setTimeout(() => $("button, a", $(".drawer__panel", drawer))?.focus(), 50);
}
function cerrar(drawer) {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  $("#menuBtn").setAttribute("aria-expanded", "false");
}
$("#menuBtn").addEventListener("click", (e) => abrir($("#drawerMenu"), e.currentTarget));
document.addEventListener("click", (e) => {
  const d = e.target.closest(".drawer");
  if (d && (e.target === d || e.target.closest("[data-close]"))) cerrar(d);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  $$(".drawer.is-open").forEach(cerrar);
  cerrarModal();
});

/* ---------- Carro de compras ---------- */
let carro = store.get("tcg_carro", {});
const prod = (id) => PRODUCTOS.find((p) => p.id === id);

document.body.insertAdjacentHTML("beforeend", `
  <div class="drawer drawer--right" id="drawerCart" aria-hidden="true">
    <div class="drawer__panel" role="dialog" aria-label="Carro de compras">
      <div class="drawer__head"><strong>Tu carro</strong><button class="icon-btn" data-close aria-label="Cerrar carro"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
      <div class="cart__ship" id="cartShip"></div>
      <div class="cart__items" id="cartItems"></div>
      <div class="cart__foot" id="cartFoot"></div>
    </div>
  </div>`);
$("#cartBtn").addEventListener("click", () => abrir($("#drawerCart")));

function agregar(id, cant = 1) {
  const p = prod(id);
  if (!p || p.stock <= 0) return;
  carro[id] = Math.min((carro[id] || 0) + cant, p.stock);
  guardarCarro();
  toast(`Agregado: ${p.nombre}`);
  const c = $("#cartCount");
  c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
}
function guardarCarro() { store.set("tcg_carro", carro); pintarCarro(); }

function pintarCarro() {
  const ids = Object.keys(carro).filter((id) => prod(id) && carro[id] > 0);
  const n = ids.reduce((s, id) => s + carro[id], 0);
  const total = ids.reduce((s, id) => s + precioFinal(prod(id)) * carro[id], 0);
  $("#cartCount").textContent = n;
  $("#cartCount").hidden = n === 0;

  const meta = TIENDA.envioGratisDesde;
  $("#cartShip").innerHTML = meta && n ? (total >= meta
    ? `<p>¡Tienes <b>envío gratis</b>!</p><div class="bar"><i style="width:100%"></i></div>`
    : `<p>Te faltan <b>${CLP(meta - total)}</b> para envío gratis</p><div class="bar"><i style="width:${(total / meta) * 100}%"></i></div>`) : "";

  $("#cartItems").innerHTML = n ? ids.map((id) => {
    const p = prod(id);
    return `<div class="cart__item">
      <div class="cart__thumb">${arte(p, true)}</div>
      <div class="cart__info"><strong>${esc(p.nombre)}</strong><small>${esc(cat(p.juego).nombre)}</small>
        <div class="qty"><button data-menos="${id}" aria-label="Quitar uno">−</button><span>${carro[id]}</span><button data-mas="${id}" aria-label="Agregar uno" ${carro[id] >= p.stock ? "disabled" : ""}>+</button></div>
      </div>
      <div class="cart__price">${CLP(precioFinal(p) * carro[id])}<button data-quitar="${id}" aria-label="Eliminar">Eliminar</button></div>
    </div>`;
  }).join("") : `<div class="cart__empty"><p>Tu carro está vacío.</p><a class="btn btn--brand" href="productos.html">Ver productos</a></div>`;

  $("#cartFoot").innerHTML = n ? `
    <fieldset class="entrega"><legend>Entrega</legend>
      <label><input type="radio" name="entrega" value="Retiro en tienda" checked> Retiro en tienda</label>
      <label><input type="radio" name="entrega" value="Envío a domicilio"> Envío a domicilio</label>
    </fieldset>
    <div class="cart__total"><span>Total</span><strong>${CLP(total)}</strong></div>
    <button class="btn btn--wa btn--block" id="checkout">${ICON.wa} Enviar pedido por WhatsApp</button>
    <p class="cart__note">Te confirmamos stock y forma de pago por WhatsApp.</p>` : "";
}
$("#drawerCart").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.mas) { carro[b.dataset.mas]++; guardarCarro(); }
  if (b.dataset.menos) { carro[b.dataset.menos]--; if (carro[b.dataset.menos] <= 0) delete carro[b.dataset.menos]; guardarCarro(); }
  if (b.dataset.quitar) { delete carro[b.dataset.quitar]; guardarCarro(); }
  if (b.id === "checkout") {
    const ids = Object.keys(carro).filter((id) => prod(id));
    const lineas = ids.map((id) => `• ${carro[id]} x ${prod(id).nombre} (${cat(prod(id).juego).nombre}) — ${CLP(precioFinal(prod(id)) * carro[id])}`);
    const total = ids.reduce((s, id) => s + precioFinal(prod(id)) * carro[id], 0);
    const entrega = $('input[name="entrega"]:checked').value;
    window.open(waLink(`Hola ${TIENDA.nombre}, quiero hacer este pedido:\n${lineas.join("\n")}\nTotal: ${CLP(total)}\nEntrega: ${entrega}\n¿Me confirman stock?`), "_blank", "noopener");
  }
});
pintarCarro();

/* ---------- Arte de producto (ilustración genérica, reemplazable por fotos) ---------- */
function arte(p, mini = false) {
  const c = cat(p.juego).color;
  const forma = {
    Sobre: '<path d="M30 10h40l4 6-4 6v60l4 6-4 6H30l-4-6 4-6V22l-4-6z"/>',
    Caja: '<rect x="14" y="26" width="72" height="58" rx="4"/><path d="M14 40h72" opacity=".35" stroke="#fff" stroke-width="3"/>',
    Display: '<rect x="12" y="30" width="76" height="52" rx="3"/><path d="M20 30v-8h12v8M36 30v-8h12v8M52 30v-8h12v8M68 30v-8h12v8"/>',
    Mazo: '<rect x="32" y="16" width="46" height="66" rx="5" opacity=".55"/><rect x="24" y="22" width="46" height="66" rx="5"/>',
    Accesorio: '<rect x="22" y="20" width="56" height="64" rx="10"/><rect x="34" y="12" width="32" height="12" rx="4"/>',
    Preventa: '<rect x="24" y="18" width="52" height="70" rx="5" stroke-dasharray="6 5" fill="none" stroke="#fff" stroke-width="3"/><path d="M50 38v16l10 6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>',
  }[p.tipo] || "";
  return `<div class="art ${mini ? "art--mini" : ""}" style="--c:${c}">
    <svg viewBox="0 0 100 100" aria-hidden="true" fill="rgba(255,255,255,.92)">${forma}</svg>
    ${mini ? "" : `<span class="art__label">${esc(cat(p.juego).nombre)}</span>`}
  </div>`;
}

/* ---------- Tarjeta de producto ---------- */
function tarjeta(p) {
  const d = descuento(p);
  const badges = [
    p.tipo === "Preventa" && '<span class="badge badge--pre">Preventa</span>',
    p.nuevo && p.tipo !== "Preventa" && '<span class="badge badge--new">Nuevo</span>',
    d && `<span class="badge badge--off">-${d}%</span>`,
    p.stock > 0 && p.stock <= 3 && `<span class="badge badge--low">¡Últimas ${p.stock}!</span>`,
    p.stock <= 0 && '<span class="badge badge--out">Agotado</span>',
  ].filter(Boolean).join("");
  return `<article class="card ${p.stock <= 0 ? "is-out" : ""}">
    <button class="card__media" data-ver="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${arte(p)}<div class="card__badges">${badges}</div></button>
    <div class="card__body">
      <small class="card__game">${esc(cat(p.juego).nombre)} · ${esc(p.tipo)}</small>
      <h3 class="card__name">${esc(p.nombre)}</h3>
      <div class="card__price">${p.oferta ? `<s>${CLP(p.precio)}</s>` : ""}<strong>${CLP(precioFinal(p))}</strong></div>
      ${p.stock > 0
        ? `<button class="btn btn--brand btn--block" data-add="${p.id}">${p.tipo === "Preventa" ? "Reservar" : "Agregar al carro"}</button>`
        : `<a class="btn btn--ghost btn--block" href="${waLink(`Hola, ¿me avisan cuando llegue "${p.nombre}" (${cat(p.juego).nombre})?`)}" target="_blank" rel="noopener">Avísame cuando llegue</a>`}
    </div>
  </article>`;
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-add]");
  if (a) agregar(a.dataset.add);
  const v = e.target.closest("[data-ver]");
  if (v) abrirModal(v.dataset.ver);
});

/* ---------- Vista rápida ---------- */
document.body.insertAdjacentHTML("beforeend", `<div class="modal" id="modal" aria-hidden="true"><div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="modalTitle" id="modalBox"></div></div>`);
function abrirModal(id) {
  const p = prod(id); if (!p) return;
  const d = descuento(p);
  $("#modalBox").innerHTML = `
    <button class="icon-btn modal__close" data-cerrar aria-label="Cerrar"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <div class="modal__art">${arte(p)}</div>
    <div class="modal__info">
      <small class="card__game">${esc(cat(p.juego).nombre)} · ${esc(p.tipo)}</small>
      <h2 id="modalTitle">${esc(p.nombre)}</h2>
      <p>${esc(DESCRIPCIONES[p.tipo] || "")}</p>
      <div class="card__price card__price--big">${p.oferta ? `<s>${CLP(p.precio)}</s>` : ""}<strong>${CLP(precioFinal(p))}</strong>${d ? `<span class="badge badge--off">-${d}%</span>` : ""}</div>
      <p class="stock ${p.stock <= 0 ? "stock--out" : p.stock <= 3 ? "stock--low" : ""}">${p.stock <= 0 ? "Sin stock" : p.stock <= 3 ? `Quedan ${p.stock} unidades` : "Disponible"}</p>
      ${p.stock > 0 ? `<button class="btn btn--brand btn--block" data-add="${p.id}" data-cerrar>${p.tipo === "Preventa" ? "Reservar" : "Agregar al carro"}</button>`
        : `<a class="btn btn--ghost btn--block" href="${waLink(`Hola, ¿me avisan cuando llegue "${p.nombre}"?`)}" target="_blank" rel="noopener">Avísame cuando llegue</a>`}
    </div>`;
  $("#modal").classList.add("is-open");
  $("#modal").setAttribute("aria-hidden", "false");
  $(".modal__close").focus();
}
function cerrarModal() { $("#modal").classList.remove("is-open"); $("#modal").setAttribute("aria-hidden", "true"); }
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal" || e.target.closest("[data-cerrar]")) cerrarModal(); });

/* =========================================================
   PÁGINAS
   ========================================================= */

/* ---------- Inicio ---------- */
if (pagina === "inicio") {
  // Banner
  const track = $("#promoTrack"), dots = $("#promoDots");
  const arteBanner = {
    sobre: '<div class="b-art b-art--sobre"><i></i><i></i><i></i></div>',
    caja: '<div class="b-art b-art--caja"><i></i><b>-30%</b></div>',
    cartas: '<div class="b-art b-art--cartas"><i></i><i></i><i></i></div>',
  };
  track.innerHTML = BANNERS.map((b, i) => `
    <article class="slide slide--${b.fondo}" aria-roledescription="diapositiva" aria-label="${i + 1} de ${BANNERS.length}">
      <div class="container slide__inner">
        <div class="slide__copy"><span class="slide__tag">${esc(b.etiqueta)}</span><h2>${esc(b.titulo)}</h2><p>${esc(b.texto)}</p><a class="btn btn--light" href="${b.link}">${esc(b.boton)}</a></div>
        ${arteBanner[b.arte] || ""}
      </div>
    </article>`).join("");
  dots.innerHTML = BANNERS.map((_, i) => `<button aria-label="Ir a la promoción ${i + 1}"></button>`).join("");
  let act = 0, timer;
  const ir = (n) => {
    act = (n + BANNERS.length) % BANNERS.length;
    track.style.transform = `translateX(-${act * 100}%)`;
    $$("button", dots).forEach((b, i) => b.setAttribute("aria-current", i === act));
    $$(".slide", track).forEach((s, i) => s.toggleAttribute("inert", i !== act));
  };
  const auto = () => { clearInterval(timer); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => ir(act + 1), 5500); };
  $("#promoPrev").onclick = () => { ir(act - 1); auto(); };
  $("#promoNext").onclick = () => { ir(act + 1); auto(); };
  dots.onclick = (e) => { const b = e.target.closest("button"); if (b) { ir($$("button", dots).indexOf(b)); auto(); } };
  const promo = $(".promo");
  promo.addEventListener("mouseenter", () => clearInterval(timer));
  promo.addEventListener("mouseleave", auto);
  let x0 = null;
  track.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { ir(act + (dx < 0 ? 1 : -1)); auto(); } x0 = null; });
  ir(0); auto();

  // Categorías
  $("#cats").innerHTML = CATEGORIAS.map((c) => {
    const n = PRODUCTOS.filter((p) => p.juego === c.id).length;
    return `<a class="cat" href="productos.html?juego=${c.id}" style="--c:${c.color}"><span class="cat__chip"></span><strong>${esc(c.nombre)}</strong><small>${n} productos</small></a>`;
  }).join("");

  // Pestañas de destacados
  const filas = {
    nuevo: () => PRODUCTOS.filter((p) => p.nuevo),
    destacado: () => PRODUCTOS.filter((p) => p.destacado),
    oferta: () => PRODUCTOS.filter((p) => p.oferta).sort((a, b) => descuento(b) - descuento(a)),
  };
  const pintarFila = (k) => {
    $("#featGrid").innerHTML = filas[k]().slice(0, 4).map(tarjeta).join("");
    $$("#featTabs button").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === k));
  };
  $("#featTabs").onclick = (e) => { const b = e.target.closest("[data-tab]"); if (b) pintarFila(b.dataset.tab); };
  pintarFila("nuevo");

  // Preventas
  $("#preGrid").innerHTML = PRODUCTOS.filter((p) => p.tipo === "Preventa").map(tarjeta).join("");

  // Visítanos
  const hoy = horaChile().dia;
  $("#horario").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => { const h = TIENDA.horario[d]; return `<li class="${d === hoy ? "is-today" : ""}"><span>${DIAS[d]}${d === hoy ? " · hoy" : ""}</span><span>${h ? h.join(" – ") : "Cerrado"}</span></li>`; }).join("");
  $("#estadoGrande").textContent = estadoTienda().largo;
  $("#estadoGrande").classList.toggle("is-open", estadoTienda().abierto);
  $("#direccion").textContent = `${TIENDA.direccion}, ${TIENDA.ciudad}`;
  $("#mapaLink").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(TIENDA.direccion + ", " + TIENDA.ciudad)}`;
  $("#heroCiudad").textContent = TIENDA.ciudad;
}

/* ---------- Productos ---------- */
if (pagina === "productos") {
  const q = new URLSearchParams(location.search);
  const st = { juego: q.get("juego") || "todos", tipo: q.get("tipo") || "todos", orden: q.get("orden") || "relevancia", texto: q.get("q") || "", stock: false };
  const tipos = [...new Set(PRODUCTOS.map((p) => p.tipo))];

  $("#fJuegos").innerHTML = [`<button class="chip" data-juego="todos">Todos</button>`, ...CATEGORIAS.map((c) => `<button class="chip" data-juego="${c.id}" style="--c:${c.color}"><i></i>${esc(c.nombre)}</button>`)].join("");
  $("#fTipo").innerHTML = `<option value="todos">Todos los tipos</option>` + tipos.map((t) => `<option>${t}</option>`).join("");
  $("#fTipo").value = tipos.includes(st.tipo) ? st.tipo : "todos";
  $("#fOrden").value = st.orden;
  $("#fTexto").value = st.texto;

  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function pintar() {
    $$("#fJuegos .chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.juego === st.juego));
    let lista = PRODUCTOS.filter((p) =>
      (st.juego === "todos" || p.juego === st.juego) &&
      (st.tipo === "todos" || p.tipo === st.tipo) &&
      (!st.stock || p.stock > 0) &&
      (!st.texto || norm(`${p.nombre} ${cat(p.juego).nombre} ${p.tipo}`).includes(norm(st.texto))));
    const ord = {
      menor: (a, b) => precioFinal(a) - precioFinal(b),
      mayor: (a, b) => precioFinal(b) - precioFinal(a),
      nuevo: (a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0),
      descuento: (a, b) => descuento(b) - descuento(a),
    }[st.orden];
    if (ord) lista = [...lista].sort(ord);
    $("#grid").innerHTML = lista.map(tarjeta).join("");
    $("#count").textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;
    $("#vacio").hidden = lista.length > 0;
    $("#tituloLista").textContent = st.juego === "todos" ? "Todos los productos" : cat(st.juego).nombre;
  }
  $("#fJuegos").onclick = (e) => { const b = e.target.closest("[data-juego]"); if (b) { st.juego = b.dataset.juego; pintar(); } };
  $("#fTipo").onchange = (e) => { st.tipo = e.target.value; pintar(); };
  $("#fOrden").onchange = (e) => { st.orden = e.target.value; pintar(); };
  $("#fTexto").oninput = (e) => { st.texto = e.target.value; pintar(); };
  $("#fStock").onchange = (e) => { st.stock = e.target.checked; pintar(); };
  $("#limpiar").onclick = () => { Object.assign(st, { juego: "todos", tipo: "todos", orden: "relevancia", texto: "", stock: false }); $("#fTipo").value = "todos"; $("#fOrden").value = "relevancia"; $("#fTexto").value = ""; $("#fStock").checked = false; pintar(); };
  pintar();
}

/* ---------- Ofertas ---------- */
if (pagina === "ofertas") {
  const ofertas = PRODUCTOS.filter((p) => p.oferta).sort((a, b) => descuento(b) - descuento(a));
  $("#ofGrid").innerHTML = ofertas.map(tarjeta).join("");
  const ahorro = ofertas.reduce((m, p) => Math.max(m, descuento(p)), 0);
  $("#ofMax").textContent = `${ahorro}%`;
  $("#ofCount").textContent = ofertas.length;

  // Ofertas por juego (pestañas)
  const juegos = [...new Set(ofertas.map((p) => p.juego))];
  $("#ofTabs").innerHTML = [`<button class="chip" data-j="todos" aria-pressed="true">Todas</button>`, ...juegos.map((j) => `<button class="chip" data-j="${j}" style="--c:${cat(j).color}"><i></i>${esc(cat(j).nombre)}</button>`)].join("");
  $("#ofTabs").onclick = (e) => {
    const b = e.target.closest("[data-j]"); if (!b) return;
    $$("#ofTabs .chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
    $("#ofGrid").innerHTML = ofertas.filter((p) => b.dataset.j === "todos" || p.juego === b.dataset.j).map(tarjeta).join("");
  };

  // Cuenta regresiva
  const fin = new Date(OFERTAS_HASTA).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function tic() {
    let s = Math.max(0, Math.floor((fin - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    $("#cd").innerHTML = [[d, "días"], [h, "horas"], [m, "min"], [s, "seg"]].map(([v, l]) => `<div><b>${pad(v)}</b><small>${l}</small></div>`).join("");
  }
  tic(); setInterval(tic, 1000);
  $("#packBtn").href = waLink(`Hola ${TIENDA.nombre}, quiero el Pack para empezar a jugar (mazo + fundas + deck box).`);
}
