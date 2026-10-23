/* ====== CONFIGURACIÓN: productos, precios y colores (cambia aquí) ====== */
const WHATSAPP = "584242674222";
const CAJA_API = "https://script.google.com/macros/s/AKfycbzkTdLOdeIBCpol8gBECUeZuJoHF0S_FhYn-aP_NrzS8QorEYJKSdxZlbY6yEtJ5VWY4A/exec";
// Colores de filamento (los mismos del configurador). Los agotados salen tachados.
const COLORES = [
  ["Blanco","#F2F1EC"],["Negro","#242424"],["Gris","#8C8F94"],["Beige","#C6A77E"],
  ["Plateado","linear-gradient(135deg,#F4F5F7 0%,#C9CCD1 38%,#8E939A 62%,#F4F5F7 100%)"],
  ["Rojo","#D52A2F"],["Fucsia","#E0457F"],["Naranja","#F27B30"],["Amarillo","#F8D62A"],["Marrón","#7B4A2D"],
  ["Verde claro","#A3E3A0"],["Verde","#3DA857"],["Celeste","#8FCBF0"],["Azul","#2A5BC9"],
  ["Morado metalizado","linear-gradient(135deg,#C7A6F2 0%,#7E4FC0 38%,#4B2A80 62%,#C7A6F2 100%)"],
  ["Dorado","linear-gradient(135deg,#FFF6A6 0%,#E2C233 38%,#9E8212 62%,#FFF6A6 100%)"],
  ["Mármol","#E7E6E2"]
];
const FIL_AGOTADO = new Set(["Fucsia"]);
const CATEGORIAS = ["Casa", "Oficina", "Llaveros y charms", "Fidgets", "Para negocios"];
// hoja: nombre exacto del producto en la hoja de ventas (para que se anote solo). precio: null = se cotiza.
// destacado: true = sale en la página de inicio ("Los más vendidos"). El resto, en crea3dve.com/productos/
const PRODUCTOS = [
  {id:"florero",   cat:"Casa", nombre:"Florero Japandi", hoja:"Florero Japandi (M)", precio:6.50, img:"/img/florero.webp",
   desc:"Acanalado, para flores secas o de decoración.", color:"Beige"},
  {id:"joyas",     cat:"Casa", destacado:true, nombre:"Organizador de joyas", hoja:"Organizador de joyas con soporte para reloj", precio:15.00, img:null,
   desc:"Con soporte para reloj. Aprox. 23 × 11 × 24 cm.", color:"Blanco"},
  {id:"soporte",   cat:"Oficina", nombre:"Soporte de teléfono", hoja:"Soporte de teléfono ondulado", precio:7.50, img:"/img/soportes.webp",
   desc:"Para el escritorio o la mesa de noche. Varios colores.", color:"Blanco"},
  {id:"nfc-ig",    cat:"Llaveros y charms", destacado:true, nombre:"Llavero NFC de Instagram", hoja:"Llavero NFC Instagram", precio:5.00, img:null,
   desc:"Acercas el teléfono y se abre tu Instagram.", color:"Negro"},
  {id:"fidget",    cat:"Fidgets", nombre:"Fidget espiral", hoja:"Fidget espiral", precio:null, img:"/img/deco.webp",
   desc:"Para tener en las manos y no parar de jugar. Varios colores.", color:"Blanco"},
  {id:"exhibidor", cat:"Para negocios", nombre:"Exhibidor de pago móvil con NFC", hoja:"Exhibidor pago móvil + NFC (a pedido)", precio:24.50, img:null,
   desc:"Tu QR del banco y botones que abren tu WhatsApp, Instagram y web con solo acercar el teléfono.", color:"Negro"},
  {id:"llav-logo", cat:"Para negocios", nombre:"Llaveros con tu logo", hoja:"Llaveros con logo (por cotizar)", precio:null, img:null,
   desc:"Para regalar a tus clientes o a tu equipo. Precio especial por cantidad.", color:"Blanco", cotizar:true},
  {id:"letrero",   cat:"Para negocios", nombre:"Letrero con tu logo", hoja:"Letrero con logo (por cotizar)", precio:null, img:null,
   desc:"Para el mostrador, la vitrina o tu puesto en el bazar.", color:"Negro", cotizar:true},
];
/* ====================================================================== */

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => "$" + n.toFixed(2).replace(".", ",");
const colorDe = n => (COLORES.find(c => c[0] === n) || COLORES[0])[1];
const ICONO = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 7.5v9L12 21l9-4.5v-9z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>`;
const WA_ICON = `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/></svg>`;

/* ---------- datos del cliente (se recuerdan en este teléfono, igual que en el configurador) ---------- */
const CLI_KEY = "crea3d-cliente";
function cliente(){ try{ return JSON.parse(localStorage.getItem(CLI_KEY)) || {}; }catch(e){ return {}; } }
function guardarCliente(c){ try{ localStorage.setItem(CLI_KEY, JSON.stringify(c)); }catch(e){} }
const telOK = t => { const d = String(t||"").replace(/\D/g,""); return d.length >= 10 && d.length <= 15; };
function llenarCliente(form){ const c = cliente(); if(c.nombre && !form.nombre.value) form.nombre.value = c.nombre; if(c.telefono && !form.telefono.value) form.telefono.value = c.telefono; }
// revisa nombre y teléfono; devuelve {nombre, telefono} o null (y muestra el error)
function leerCliente(form){
  const err = form.querySelector(".err"), nombre = form.nombre.value.trim().replace(/\s+/g," "), telefono = form.telefono.value.trim();
  err.textContent = "";
  if(nombre.length < 2){ err.textContent = "Escribe tu nombre."; form.nombre.focus(); return null; }
  if(!telOK(telefono)){ err.textContent = "Revisa el teléfono: escríbelo completo, ej. 0414-1234567."; form.telefono.focus(); return null; }
  const c = {nombre, telefono}; guardarCliente(c); return c;
}
const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);
// anota el pedido en la hoja (aunque la persona no termine de enviar el WhatsApp)
function avisarCaja(datos, esperar){
  const body = JSON.stringify(Object.assign({accion:"pedidoWeb", id:nuevoId()}, datos));
  const p = fetch(CAJA_API, {method:"POST", mode:"no-cors", keepalive: body.length < 60000, body}).catch(()=>{});
  return esperar ? p : null;
}
function abrirWhatsApp(texto){
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  const w = window.open(url, "_blank");
  if(w) { try{ w.opener = null; }catch(e){} } else location.href = url;
}

/* ---------- selector de colores ---------- */
function swatches(nombreSel, grupo){
  return `<div class="col-lbl">Color: <span data-colname>${esc(nombreSel)}</span></div>
  <div class="sws" role="radiogroup" aria-label="Color" data-grupo="${grupo}">` + COLORES.map(([n,c])=>{
    const ag = FIL_AGOTADO.has(n);
    return `<button type="button" class="sw" role="radio" aria-checked="${n===nombreSel}" aria-label="${esc(n)}${ag?" (agotado)":""}" data-color="${esc(n)}" style="background:${c}" ${ag?"disabled":""}></button>`;
  }).join("") + `</div>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest(".sw"); if(!b || b.disabled) return;
  const g = b.parentElement, box = g.parentElement;
  g.querySelectorAll(".sw").forEach(x => x.setAttribute("aria-checked", x === b));
  const lbl = box.querySelector("[data-colname]"); if(lbl) lbl.textContent = b.dataset.color;
  const card = b.closest("[data-p]"); if(card) elegido[card.dataset.p] = b.dataset.color;
});

/* ---------- catálogo ---------- */
const elegido = {};   // color escogido en cada tarjeta
PRODUCTOS.forEach(p => { if(FIL_AGOTADO.has(p.color)) p.color = "Blanco"; elegido[p.id] = p.color; });
let filtro = "Todo";
const GRID = $("#grid"), TABS = $("#tabs"), SOLO_DESTACADOS = GRID && GRID.dataset.modo === "destacados";
function pintarTabs(){
  if(!TABS) return;
  const cats = ["Todo"].concat(CATEGORIAS.filter(c => PRODUCTOS.some(p => p.cat === c)));
  $("#tabs").innerHTML = cats.map(c => `<button class="tab" type="button" aria-pressed="${c===filtro}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
}
function pintarProductos(){
  if(!GRID) return;
  GRID.innerHTML = PRODUCTOS.filter(p => SOLO_DESTACADOS ? p.destacado : (filtro === "Todo" || p.cat === filtro)).map(p => `
    <article class="card" data-p="${p.id}">
      ${p.img ? `<div class="ph"><img src="${p.img}" alt="${esc(p.nombre)}" loading="lazy"></div>` : `<div class="ph vacio">${ICONO}<span>Foto pronto</span></div>`}
      <div class="bd">
        <span class="cat">${esc(p.cat)}</span>
        <h3>${esc(p.nombre)}</h3>
        <p class="desc">${esc(p.desc)}</p>
        <div>${swatches(elegido[p.id], p.id)}</div>
        <div class="pie">
          ${p.precio != null ? `<span class="precio">${money(p.precio)}<small>tasa BCV</small></span>` : `<span class="precio cotiza">Precio por cotizar</span>`}
          <button class="btn sm" type="button" data-quiero="${p.id}">${p.cotizar ? "Cotizar" : "Lo quiero"}</button>
        </div>
      </div>
    </article>`).join("");
}
if(TABS) TABS.addEventListener("click", e => { const b = e.target.closest(".tab"); if(!b) return; filtro = b.dataset.cat; pintarTabs(); pintarProductos(); });
if(GRID) GRID.addEventListener("click", e => { const b = e.target.closest("[data-quiero]"); if(b) abrirProducto(PRODUCTOS.find(p => p.id === b.dataset.quiero)); });
pintarTabs(); pintarProductos();

/* ---------- ventanita ---------- */
const dlg = $("#dlg"), fd = $("#f-dlg");
let modo = null;   // {tipo:"Producto", p} o {tipo:"Evento"}
function abrirDlg(){
  fd.querySelector(".err").textContent = ""; llenarCliente(fd);
  if(typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open","");
}
function cerrarDlg(){ if(dlg.open) dlg.close(); }
$("#dlg-x").onclick = cerrarDlg;
dlg.addEventListener("click", e => { if(e.target === dlg) cerrarDlg(); });

let cantidad = 1;
function pintarTotal(){
  const p = modo && modo.p; $("#cant-n").textContent = cantidad;
  const t = $("#dlg-total"); if(t && p && p.precio != null) t.textContent = money(p.precio * cantidad);
}
function abrirProducto(p){
  modo = {tipo:"Producto", p}; cantidad = p.cotizar ? 10 : 1;
  $("#dlg-t").textContent = p.nombre;
  $("#dlg-s").textContent = p.precio != null ? money(p.precio) + " c/u · tasa BCV" : "Te pasamos el precio por WhatsApp";
  $("#dlg-btn").textContent = p.cotizar || p.precio == null ? "Pedir precio por WhatsApp" : "Pedir por WhatsApp";
  $("#dlg-cuerpo").innerHTML = `<div style="display:flex;flex-direction:column;gap:8px">${swatches(elegido[p.id], "dlg")}</div>
    <div class="fld" style="margin-top:14px">Cantidad
      <div class="cant"><button type="button" data-c="-1" aria-label="Uno menos">−</button><output id="cant-n" aria-live="polite">${cantidad}</output><button type="button" data-c="1" aria-label="Uno más">+</button></div>
    </div>
    ${p.cotizar ? `<label class="fld" style="margin-top:14px">¿Qué te gustaría? <small>(opcional)</small><textarea name="detalle" maxlength="500" placeholder="Ej.: con el logo de mi tienda, para el 15 de diciembre"></textarea></label>` : ""}
    ${p.precio != null ? `<div class="total" style="margin-top:14px"><span>Total</span><span id="dlg-total">${money(p.precio)}</span></div>` : ""}`;
  abrirDlg();
}
$("#dlg-cuerpo").addEventListener("click", e => {
  const b = e.target.closest("[data-c]"); if(!b) return;
  cantidad = Math.max(1, Math.min(999, cantidad + Number(b.dataset.c))); pintarTotal();
});
if($("#btn-evento")) $("#btn-evento").onclick = () => {
  modo = {tipo:"Evento"};
  $("#dlg-t").textContent = "Cotizar mi evento";
  $("#dlg-s").textContent = "Cuéntanos de tu fiesta y te pasamos ideas y precio.";
  $("#dlg-btn").textContent = "Pedir cotización por WhatsApp";
  $("#dlg-cuerpo").innerHTML = `<div style="display:flex;flex-direction:column;gap:14px">
    <div class="dos">
      <label class="fld">Tipo de evento<select name="evento">
        <option>Cumpleaños</option><option>Baby shower</option><option>Boda</option><option>Graduación</option><option>Evento de empresa</option><option>Otro</option>
      </select></label>
      <label class="fld">Fecha<input name="fecha" type="date"></label>
    </div>
    <label class="fld">¿Cuántos invitados o recuerdos?<input name="invitados" inputmode="numeric" maxlength="20" placeholder="Ej.: 30"></label>
    <label class="fld">¿Qué te gustaría?<textarea name="detalle" maxlength="600" placeholder="Ej.: llaveros con el nombre de cada invitado y un topper para la torta"></textarea></label>
    <label class="fld">Colores de la fiesta <small>(opcional)</small><input name="colores" maxlength="120" placeholder="Ej.: rosado y dorado"></label>
  </div>`;
  abrirDlg();
};
fd.addEventListener("submit", e => {
  e.preventDefault();
  const c = leerCliente(fd); if(!c) return;
  let texto, datos;
  if(modo.tipo === "Producto"){
    const p = modo.p, col = elegido[p.id] = (fd.querySelector('[data-grupo="dlg"] [aria-checked="true"]') || {}).dataset?.color || elegido[p.id];
    const det = fd.detalle ? fd.detalle.value.trim() : "";
    texto = `✨ ¡Hola Crea3d! ${p.precio != null && !p.cotizar ? "Quiero" : "Quiero cotizar"} este producto ✨\n\n👤 Soy *${c.nombre}*\n\n🛍️ *${p.nombre}*\n🎨 Color: *${col.toLowerCase()}*\n🔢 Cantidad: *${cantidad}*`
      + (det ? `\n📝 ${det}` : "")
      + (p.precio != null ? `\n\n💰 *Total: ${money(p.precio * cantidad)}* (tasa BCV)` : "");
    datos = {tipo:"Producto", palabras: p.nombre + " · " + col, texto, nombre:c.nombre, telefono:c.telefono,
      items:[{producto:p.hoja, cantidad, precio:p.precio || 0}]};
    pintarProductos();
  } else {
    const v = k => (fd[k] && fd[k].value || "").trim();
    const f = v("fecha") ? v("fecha").split("-").reverse().join("/") : "";
    texto = `✨ ¡Hola Crea3d! Quiero cotizar un evento ✨\n\n👤 Soy *${c.nombre}*\n\n🎉 Evento: *${v("evento")}*` + (f ? `\n📅 Fecha: *${f}*` : "")
      + (v("invitados") ? `\n👥 Invitados / recuerdos: *${v("invitados")}*` : "") + (v("detalle") ? `\n📝 ${v("detalle")}` : "") + (v("colores") ? `\n🎨 Colores: ${v("colores")}` : "");
    datos = {tipo:"Evento", palabras: "Evento · " + v("evento") + (f ? " · " + f : ""), texto, nombre:c.nombre, telefono:c.telefono,
      items:[{producto:"Evento – " + v("evento") + " (por cotizar)", cantidad:1, precio:0}]};
  }
  avisarCaja(datos);
  abrirWhatsApp(texto);
  cerrarDlg();
});

/* ---------- a la medida (con foto) ---------- */
const fm = $("#f-medida");
if(fm){

llenarCliente(fm); fm.addEventListener("focusin", () => llenarCliente(fm));
let fotoData = null;
// achica la foto (máx. 1280 px, JPG) para que suba rápido
function achicar(file){
  return new Promise((ok, mal) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { const k = Math.min(1, 1280 / Math.max(im.width, im.height)), cv = document.createElement("canvas");
      cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
      const x = cv.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0,0,cv.width,cv.height); x.drawImage(im, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url); ok(cv.toDataURL("image/jpeg", 0.82)); };
    im.onerror = () => { URL.revokeObjectURL(url); mal(new Error("foto")); };
    im.src = url;
  });
}
$("#foto-in").addEventListener("change", async e => {
  const f = e.target.files && e.target.files[0]; if(!f) return;
  $("#foto-txt").textContent = "Preparando la foto…";
  try{ fotoData = await achicar(f); $("#foto-prev").src = fotoData; $("#foto-box").classList.add("lista"); $("#foto-txt").textContent = "Foto lista · toca para cambiarla"; }
  catch(err){ fotoData = null; $("#foto-box").classList.remove("lista"); $("#foto-txt").textContent = "No se pudo leer esa foto. Prueba con otra."; }
});
fm.addEventListener("submit", async e => {
  e.preventDefault();
  const err = fm.querySelector(".err"), que = fm.que.value.trim(), medidas = fm.medidas.value.trim();
  if(que.length < 3){ err.textContent = "Cuéntanos qué necesitas."; fm.que.focus(); return; }
  const c = leerCliente(fm); if(!c) return;
  const texto = `✨ ¡Hola Crea3d! Quiero un presupuesto ✨\n\n👤 Soy *${c.nombre}*\n\n🔧 ${que}` + (medidas ? `\n📏 Medidas: ${medidas}` : "")
    + (fotoData ? `\n📸 Les mandé la foto por la página.` : "");
  const btn = fm.querySelector("button[type=submit]"); btn.disabled = true;
  const lbl = btn.lastChild, antes = lbl.textContent; lbl.textContent = fotoData ? " Enviando la foto…" : " Abriendo WhatsApp…";
  const datos = {tipo:"A la medida", palabras: "A la medida · " + que.slice(0, 60), texto, nombre:c.nombre, telefono:c.telefono,
    items:[{producto:"Pieza a la medida (por cotizar)", cantidad:1, precio:0}], foto: fotoData || ""};
  if(fotoData){
    await Promise.race([avisarCaja(datos, true), new Promise(r => setTimeout(r, 20000))]);   // espera a que suba la foto
    location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  } else { avisarCaja(datos); abrirWhatsApp(texto); }
  btn.disabled = false; lbl.textContent = antes;
});
}

/* ---------- menú de accesos directos ---------- */
const menuBtn = $("#menu-btn"), menu = $("#menu");
if(menuBtn && menu){
  const cerrarMenu = () => { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.addEventListener("click", e => { e.stopPropagation(); const abrir = menu.hidden; menu.hidden = !abrir; menuBtn.setAttribute("aria-expanded", String(abrir)); if(abrir) menu.querySelector("a").focus(); });
  menu.addEventListener("click", e => { if(e.target.closest("a")) cerrarMenu(); });
  document.addEventListener("click", e => { if(!menu.hidden && !menu.contains(e.target)) cerrarMenu(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape" && !menu.hidden){ cerrarMenu(); menuBtn.focus(); } });
}
