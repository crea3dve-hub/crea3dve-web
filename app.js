/* ====== CONFIGURACIÓN: productos, precios y colores (cambia aquí) ====== */
const WHATSAPP = "584242674222";
const CAJA_API = "https://script.google.com/macros/s/AKfycbzkTdLOdeIBCpol8gBECUeZuJoHF0S_FhYn-aP_NrzS8QorEYJKSdxZlbY6yEtJ5VWY4A/exec";
// Colores de filamento (los mismos del configurador). Los agotados salen tachados.
const COLORES = [   // [nombre, color, (fondo del botón)] — los mismos de crea3dve.com/clicker/
  ["Blanco","#F2F1EC"],["Negro","#242424"],["Gris","#8C8F94"],["Beige","#C6A77E"],
  ["Plateado","#C9CCD1","linear-gradient(135deg, #F4F5F7 0%, #C9CCD1 38%, #8E939A 62%, #F4F5F7 100%)"],
  ["Rojo","#D52A2F"],["Fucsia","#E0457F"],["Naranja","#F27B30"],["Amarillo","#F8D62A"],
  ["Marrón","#7B4A2D"],["Verde claro","#A3E3A0"],["Verde","#3DA857"],
  ["Celeste","#8FCBF0"],["Azul","#2A5BC9"],["Morado metalizado","#7E4FC0","linear-gradient(135deg, #C7A6F2 0%, #7E4FC0 38%, #4B2A80 62%, #C7A6F2 100%)"],
  ["Dorado","#E2C233","linear-gradient(135deg, #FFF6A6 0%, #E2C233 38%, #9E8212 62%, #FFF6A6 100%)"],
  ["Mármol","#E7E6E2","radial-gradient(circle at 30% 35%, #9a9a9a 0 1.5px, transparent 2px), radial-gradient(circle at 65% 60%, #8c8c8c 0 1.5px, transparent 2px), radial-gradient(circle at 45% 75%, #a5a5a5 0 1px, transparent 1.5px), #E7E6E2"]
];
const FIL_AGOTADO = new Set(["Fucsia"]);
const CATEGORIAS = ["Casa", "Oficina", "Llaveros", "Fidgets", "Para negocios"];
// hoja: nombre exacto del producto en la hoja de ventas (para que se anote solo). precio: null = se cotiza.
// sinColor: true = no se escoge color (se hace como en la foto o a pedido).
// color: el color del producto en la foto (al escoger otro, la foto se pinta de ese color).
// partes: cuando tiene dos colores (ej. lámpara: pantalla y base). corte = dónde termina la parte de arriba en la foto (0 a 1).
// destacado: true = sale en la página de inicio ("Los más vendidos"). El resto, en crea3dve.com/productos/
const PRODUCTOS = [
  {id:"florero",   cat:"Casa", nombre:"Florero Japandi", hoja:"Florero Japandi (M)", precio:6.50, img:"/img/florero.webp", recorte:true,
   desc:"Acanalado, para flores secas o de decoración.", color:"Beige"},
  {id:"joyas",     cat:"Casa", destacado:true, nombre:"Organizador de joyas", hoja:"Organizador de joyas con soporte para reloj", precio:15.00, img:"/img/organizador-joyas.webp",
   desc:"Con soporte para reloj. Aprox. 23 × 11 × 24 cm.", color:"Beige"},
  {id:"lampara",   cat:"Casa", nombre:"Lámpara de mesa", hoja:"Lámpara de mesa", precio:40.00, img:"/img/lampara.webp",
   desc:"Pantalla ondulada con luz LED cálida, para la mesa de noche o la sala.",
   partes:[{k:"pantalla", nombre:"Pantalla", color:"Blanco", enFoto:""}, {k:"base", nombre:"Base", color:"Blanco", enFoto:""}], corte:.718},   // enFoto "": la foto está encendida, siempre se pinta con el color real
  {id:"soporte",   cat:"Oficina", destacado:true, nombre:"Soporte de teléfono", hoja:"Soporte de teléfono ondulado", precio:7.50, img:"/img/soporte-telefono.webp",
   desc:"Para el escritorio o la mesa de noche. Varios colores.", color:"Blanco"},
  {id:"nfc-ig",    cat:"Llaveros", destacado:true, nombre:"Llavero NFC personalizado", hoja:"Llavero NFC Instagram", precio:5.00, img:"/img/llavero-nfc.webp",
   desc:"Acercas el teléfono y se abre el link que quieras: tu Instagram, WhatsApp, página web, menú o catálogo.", color:"Blanco", sinColor:true},
  {id:"fidget",    cat:"Fidgets", nombre:"Fidget espiral", hoja:"Fidget espiral", precio:null, img:"/img/deco.webp", recorte:true,
   desc:"Para tener en las manos y no parar de jugar. Varios colores.", color:"Blanco"},
  {id:"exhibidor", cat:"Para negocios", nombre:"Exhibidor de pago móvil con NFC", hoja:"Exhibidor pago móvil + NFC (a pedido)", precio:24.50, img:"/img/exhibidor-nfc.webp",
   desc:"Tu QR del banco y botones que abren tu WhatsApp, Instagram y web con solo acercar el teléfono.", color:"Negro", sinColor:true},
  {id:"llav-logo", cat:"Para negocios", nombre:"Llaveros con tu logo", hoja:"Llaveros con logo (por cotizar)", precio:null, img:"/img/llaveros-logo.webp",
   desc:"Para regalar a tus clientes o a tu equipo. Precio especial por cantidad.", color:"Gris", cotizar:true, sinColor:true},
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
// partes de color de un producto (la mayoría tiene una sola)
const partesDe = p => p.sinColor ? [] : (p.partes || [{k:"", nombre:"Color", color:p.color}]);
const fondoDe = n => { const c = COLORES.find(x => x[0] === n) || COLORES[0]; return c[2] || c[1]; };
const FLECHA = `<svg class="chev" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
function swatches(p, parte, donde){
  const sel = elegido[p.id][parte.k], lista = sws(p, parte, donde, sel);
  // en las tarjetas: una sola rayita "Elegir color" que abre las opciones (así todas miden lo mismo)
  if(donde === "card") return `<div class="col-blq picker">
    <button type="button" class="col-btn" aria-expanded="false"><span class="dot" data-dot style="background:${fondoDe(sel)}"></span><span class="col-txt">${parte.k ? esc(parte.nombre) : "Elegir color"}: <b data-colname>${esc(sel)}</b></span>${FLECHA}</button>
    <div class="col-pop" hidden>${lista}</div></div>`;
  return `<div class="col-blq"><div class="col-lbl">${esc(parte.nombre)}: <span data-colname>${esc(sel)}</span></div>${lista}</div>`;
}
// tarjeta: una sola rayita aunque el producto tenga dos colores (ej. lámpara); al abrirla salen los dos
function selectorCard(p){
  const pts = partesDe(p); if(!pts.length) return "";
  if(pts.length === 1) return swatches(p, pts[0], "card");
  return `<div class="col-blq picker">
    <button type="button" class="col-btn" aria-expanded="false">${pts.map(pt => `<span class="dot" data-dot="${pt.k}" style="background:${fondoDe(elegido[p.id][pt.k])}"></span>`).join("")}<span class="col-txt">Elegir colores</span>${FLECHA}</button>
    <div class="col-pop">${pts.map(pt => `<div class="col-lbl">${esc(pt.nombre)}: <span data-colname="${pt.k}">${esc(elegido[p.id][pt.k])}</span></div>${sws(p, pt, "card", elegido[p.id][pt.k])}`).join("")}</div></div>`.replace('<div class="col-pop">', '<div class="col-pop" hidden>');
}
function sws(p, parte, donde, sel){
  return `<div class="sws" role="radiogroup" aria-label="${esc(parte.nombre)}" data-prod="${p.id}" data-parte="${parte.k}" data-donde="${donde}">` + COLORES.map(([n,c,bg])=>{
    const ag = FIL_AGOTADO.has(n);
    return `<button type="button" class="sw" role="radio" aria-checked="${n===sel}" aria-label="${esc(n)}${ag?" (agotado)":""}" data-color="${esc(n)}" style="background:${bg||c}" ${ag?"disabled":""}></button>`;
  }).join("") + `</div>`;
}
const cerrarPops = (menos) => document.querySelectorAll(".picker").forEach(pk => { if(pk === menos) return; pk.querySelector(".col-pop").hidden = true; pk.querySelector(".col-btn").setAttribute("aria-expanded", "false"); });
document.addEventListener("click", e => {
  const btn = e.target.closest(".col-btn");
  if(btn){ const pk = btn.parentElement, pop = pk.querySelector(".col-pop"), abrir = pop.hidden; cerrarPops(pk); pop.hidden = !abrir; btn.setAttribute("aria-expanded", String(abrir)); return; }
  if(!e.target.closest(".col-pop")) cerrarPops();
});
document.addEventListener("keydown", e => { if(e.key === "Escape") cerrarPops(); });
document.addEventListener("click", e => {
  const b = e.target.closest(".sw"); if(!b || b.disabled) return;
  const g = b.parentElement, id = g.dataset.prod, k = g.dataset.parte, p = PRODUCTOS.find(x => x.id === id); if(!p) return;
  elegido[id][k] = b.dataset.color;
  // marca el color en la tarjeta y en la ventanita a la vez
  document.querySelectorAll(`.sws[data-prod="${id}"][data-parte="${k}"]`).forEach(gr => {
    gr.querySelectorAll(".sw").forEach(x => x.setAttribute("aria-checked", x.dataset.color === b.dataset.color));
    const blq = gr.closest(".col-blq"), multi = !!blq.querySelector(`[data-colname="${k}"]`) && k !== "";
    const l = multi ? blq.querySelector(`[data-colname="${k}"]`) : blq.querySelector("[data-colname]"), dot = multi ? blq.querySelector(`[data-dot="${k}"]`) : blq.querySelector("[data-dot]");
    if(l) l.textContent = b.dataset.color; if(dot) dot.style.background = fondoDe(b.dataset.color);
  });
  const pk = b.closest(".picker"); if(pk && pk.querySelectorAll(".sws").length === 1) setTimeout(() => cerrarPops(), 120);   // con dos colores se queda abierto
  pintarFoto(p);
});

/* ---------- la foto del producto toma el color escogido (como en el configurador) ---------- */
const BASE = {"Plateado":"#C9CCD1", "Morado metalizado":"#7E4FC0", "Dorado":"#E2C233"};
const hexDe = n => BASE[n] || (COLORES.find(c => c[0] === n) || ["","#F2F1EC"])[1];
const fotoCache = {}, fotoOrig = {};
const rgb = h => [1,3,5].map(k => parseInt(h.substr(k, 2), 16));
// metalizados: oscuro, medio y claro (para que el dorado no parezca amarillo ni el plateado blanco)
const METAL = {"Plateado":["#3E434A","#9AA0A8","#F5F6F8"], "Dorado":["#5E4300","#B8901C","#FFE98A"], "Morado metalizado":["#2B1250","#7444BC","#D8BEFA"]};
function cargarImg(src){ return new Promise((ok, mal) => { const im = new Image(); im.onload = () => ok(im); im.onerror = mal; im.src = src; }); }
const firma = p => partesDe(p).map(x => elegido[p.id][x.k]).join("|");
const enFoto = pt => pt.enFoto !== undefined ? pt.enFoto : pt.color;
const esOriginal = p => partesDe(p).every(x => elegido[p.id][x.k] === enFoto(x));
async function fotoEnColor(p){
  const clave = p.id + "|" + firma(p); if(fotoCache[clave]) return fotoCache[clave];
  if(!fotoOrig[p.id]) fotoOrig[p.id] = cargarImg(p.img);
  const im = await fotoOrig[p.id], W = Math.min(700, im.naturalWidth), H = Math.round(im.naturalHeight * W / im.naturalWidth);
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const x = cv.getContext("2d");
  x.drawImage(im, 0, 0, W, H); const d = x.getImageData(0, 0, W, H), a = d.data;
  const partes = partesDe(p), corte = Math.round((p.corte || 1) * H);
  const parteDe = i => partes.length > 1 && Math.floor(i / 4 / W) >= corte ? 1 : 0;
  // brillo promedio de cada parte (para conservar luces y sombras)
  const suma = [0,0], n = [0,0];
  for(let i = 0; i < a.length; i += 4) if(a[i+3] > 200){ const q = parteDe(i); suma[q] += .299*a[i] + .587*a[i+1] + .114*a[i+2]; n[q]++; }
  const ref = [0,1].map(q => Math.max(1, suma[q] / Math.max(1, n[q])));
  const tono = partes.map(pt => { const n = elegido[p.id][pt.k]; if(n === enFoto(pt)) return null;
    return METAL[n] ? {metal: METAL[n].map(rgb)} : {t: rgb(hexDe(n)), marmol: n === "Mármol"}; });
  for(let i = 0; i < a.length; i += 4){
    if(a[i+3] < 90) continue;   // la sombrita del piso se queda igual
    const q = parteDe(i), tn = tono[q]; if(!tn) continue;   // esa parte sigue en su color original
    const k = (.299*a[i] + .587*a[i+1] + .114*a[i+2]) / ref[q], px = (i / 4) % W, py = Math.floor(i / 4 / W);
    let out;
    if(tn.metal){
      // metalizado: más contraste y un brillo en diagonal, con la rampa oscuro → medio → claro del metal
      const v = Math.max(0, Math.min(1, .5 + (k - 1) * 1.9 + .2 * Math.sin((px * .8 + py) / W * Math.PI * 2.4)));
      const [c0, c1] = v < .5 ? [tn.metal[0], tn.metal[1]] : [tn.metal[1], tn.metal[2]], f = v < .5 ? v * 2 : (v - .5) * 2;
      out = [0,1,2].map(c => c0[c] + (c1[c] - c0[c]) * f);
    } else {
      const t = tn.t; out = [0,1,2].map(c => k <= 1 ? t[c]*k : t[c] + (255 - t[c]) * (k - 1) * .6);
      if(tn.marmol){   // puntitos del mármol (siempre en el mismo sitio)
        const cx = px >> 2, cy = py >> 2, h = Math.sin(cx * 127.1 + cy * 311.7) * 43758.5453, r = h - Math.floor(h);
        if(r < .014) out = out.map(c => c * (r < .004 ? .6 : .8));
      }
    }
    for(let c = 0; c < 3; c++) a[i+c] = Math.max(0, Math.min(255, out[c]));
  }
  x.putImageData(d, 0, 0);
  return fotoCache[clave] = cv.toDataURL("image/webp", .9);
}
async function pintarFoto(p){
  if(!p.img || p.sinColor) return;
  const f = firma(p);
  const src = esOriginal(p) ? p.img : await fotoEnColor(p).catch(() => p.img);
  if(firma(p) !== f) return;   // cambió mientras se pintaba
  document.querySelectorAll(`[data-img="${p.id}"]`).forEach(im => { im.src = src; });
}

/* ---------- catálogo ---------- */
const elegido = {};   // colores escogidos en cada producto: {parte: color}
PRODUCTOS.forEach(p => { elegido[p.id] = {}; partesDe(p).forEach(pt => { elegido[p.id][pt.k] = FIL_AGOTADO.has(pt.color) ? "Blanco" : pt.color; }); });
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
      ${p.img ? `<div class="ph${p.recorte ? " recorte" : " foto"}"><img src="${p.img}" alt="${esc(p.nombre)}" loading="lazy" data-img="${p.id}"></div>` : `<div class="ph vacio">${ICONO}<span>Foto pronto</span></div>`}
      <div class="bd">
        <span class="cat">${esc(p.cat)}</span>
        <h3>${esc(p.nombre)}</h3>
        <p class="desc">${esc(p.desc)}</p>
        ${selectorCard(p)}
        <div class="pie">
          ${p.precio != null ? `<span class="precio">${money(p.precio)}<small>tasa BCV</small></span>` : `<span class="precio cotiza">Precio por cotizar</span>`}
          <button class="btn sm" type="button" data-quiero="${p.id}">${p.cotizar ? "Cotizar" : "Lo quiero"}</button>
        </div>
      </div>
    </article>`).join("");
  PRODUCTOS.forEach(p => { if(!p.sinColor && !esOriginal(p)) pintarFoto(p); });
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
  $("#dlg-cuerpo").innerHTML = (p.img ? `<div class="dlg-foto"><img src="${p.img}" alt="" data-img="${p.id}"></div>` : "")
    + partesDe(p).map(pt => swatches(p, pt, "dlg")).join("") + `
    <div class="fld" style="margin-top:14px">Cantidad
      <div class="cant"><button type="button" data-c="-1" aria-label="Uno menos">−</button><output id="cant-n" aria-live="polite">${cantidad}</output><button type="button" data-c="1" aria-label="Uno más">+</button></div>
    </div>
    ${p.cotizar ? `<label class="fld" style="margin-top:14px">¿Qué te gustaría? <small>(opcional)</small><textarea name="detalle" maxlength="500" placeholder="Ej.: con el logo de mi tienda, para el 15 de diciembre"></textarea></label>` : ""}
    ${p.precio != null ? `<div class="total" style="margin-top:14px"><span>Total</span><span id="dlg-total">${money(p.precio)}</span></div>` : ""}`;
  pintarFoto(p);
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
    const p = modo.p, pts = partesDe(p);
    const colTxt = pts.map(pt => (pts.length > 1 ? pt.nombre.toLowerCase() + " " : "") + "*" + elegido[p.id][pt.k].toLowerCase() + "*").join(" · ");
    const col = pts.map(pt => (pts.length > 1 ? pt.nombre + " " : "") + elegido[p.id][pt.k]).join(", ");
    const det = fd.detalle ? fd.detalle.value.trim() : "";
    texto = `✨ ¡Hola Crea3d! ${p.precio != null && !p.cotizar ? "Quiero" : "Quiero cotizar"} este producto ✨\n\n👤 Soy *${c.nombre}*\n\n🛍️ *${p.nombre}*` + (colTxt ? `\n🎨 Color: ${colTxt}` : "") + `\n🔢 Cantidad: *${cantidad}*`
      + (det ? `\n📝 ${det}` : "")
      + (p.precio != null ? `\n\n💰 *Total: ${money(p.precio * cantidad)}* (tasa BCV)` : "");
    datos = {tipo:"Producto", palabras: p.nombre + (col ? " · " + col : ""), texto, nombre:c.nombre, telefono:c.telefono,
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
