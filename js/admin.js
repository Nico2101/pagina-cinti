/* ===================================================
   ADMIN.JS — Panel de Control Total V3
   Cintia Agostino — admin.html
   =================================================== */

let currentData = null;

/* ---------- INIT ---------- */
function initAdmin() {
    currentData = JSON.parse(JSON.stringify(SITE_DATA));
    updateStats();
    showTab('dashboard');
}

function updateStats() {
    document.getElementById('stats-cursos').innerText = currentData.cursos.length;
}

/* ---------- LIST EDITOR (TOTAL CONTROL) ---------- */
function renderListEditor(listId, array, placeholder) {
    if (!array) array = [];
    placeholder = placeholder || 'Agregar ítem...';
    let html = '<div class="space-y-3">';

    array.forEach(function(item, index) {
        html += '<div class="flex gap-3 items-center group bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">';
        html += '  <input type="text" value="' + escapeHtml(item) + '" data-list="' + listId + '" data-index="' + index + '" data-action="edit"';
        html += '         class="flex-grow p-2 bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-slate-700">';
        html += '  <button data-list="' + listId + '" data-index="' + index + '" data-action="delete" class="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">';
        html += '    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
        html += '  </button>';
        html += '</div>';
    });

    html += '<button data-list="' + listId + '" data-action="add" class="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-[#2ebfac] hover:text-[#2ebfac] transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">';
    html += '  <span>+ ' + placeholder + '</span>';
    html += '</button>';
    html += '</div>';
    return html;
}

function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---------- GLOBAL EVENT DELEGATION ---------- */
document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action="delete"]');
    if (btn) {
        handleListAction(btn.dataset.list, 'delete', parseInt(btn.dataset.index));
        return;
    }
    btn = e.target.closest('[data-action="add"]');
    if (btn) {
        handleListAction(btn.dataset.list, 'add', -1);
        return;
    }
});

document.addEventListener('change', function(e) {
    if (e.target.dataset && e.target.dataset.action === 'edit') {
        handleListAction(e.target.dataset.list, 'edit', parseInt(e.target.dataset.index), e.target.value);
    }
});

function handleListAction(listId, action, index, value) {
    // Parse listId: "cursos-0-aprendizajes" or "membresia-beneficios" etc.
    var parts = listId.split('-');
    var arr = null;
    var refreshFn = null;

    if (parts[0] === 'cursos') {
        var ci = parseInt(parts[1]);
        var field = parts[2];
        arr = currentData.cursos[ci][field];
        refreshFn = renderCursos;
    } else if (parts[0] === 'membresia') {
        var field = parts[1];
        arr = currentData.membresia[field];
        refreshFn = renderMembresia;
    } else if (parts[0] === 'sesiones') {
        var field = parts[1];
        arr = currentData.sesiones[field];
        refreshFn = renderSesiones;
    }

    if (!arr) return;

    if (action === 'delete') {
        arr.splice(index, 1);
    } else if (action === 'add') {
        arr.push('');
    } else if (action === 'edit') {
        arr[index] = value;
    }

    if (refreshFn) refreshFn();
}

/* ---------- RENDER: CURSOS ---------- */
function renderCursos() {
    var grid = document.getElementById('admin-cursos-list');
    var html = '';

    currentData.cursos.forEach(function(c, i) {
        html += '<div class="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">';

        // Header
        html += '<div class="flex justify-between items-center border-b border-slate-50 pb-8">';
        html += '  <div>';
        html += '    <h4 class="text-3xl font-serif text-[#1a0b2e]">' + escapeHtml(c.titulo || 'Sin Título') + '</h4>';
        html += '    <p class="text-[10px] text-[#2ebfac] font-bold uppercase tracking-widest mt-2">ID: ' + escapeHtml(c.id) + '</p>';
        html += '  </div>';
        html += '</div>';

        html += '<div class="grid gap-10">';

        // Row 1: Titulo + Precio
        html += '<div class="grid md:grid-cols-2 gap-8">';
        html += fieldBox('Título Visible', 'text', c.titulo, 'cursos', i, 'titulo', 'font-medium');
        html += fieldBox('Precio de Venta', 'text', c.precio, 'cursos', i, 'precio', 'font-bold text-[#2ebfac]');
        html += '</div>';

        // Desc corta
        html += fieldBox('Resumen (Home)', 'text', c.descripcionCorta, 'cursos', i, 'descripcionCorta', 'text-sm');

        // Desc larga
        html += fieldArea('Descripción Detallada', c.descripcionLarga, 'cursos', i, 'descripcionLarga');

        // Links
        html += '<div class="grid md:grid-cols-2 gap-8">';
        html += fieldBox('Link de Pago (URL)', 'text', c.linkPago, 'cursos', i, 'linkPago', 'text-xs text-slate-500');
        html += fieldBox('Imagen del Curso (Ruta)', 'text', c.imagen, 'cursos', i, 'imagen', 'text-xs text-slate-500');
        html += '</div>';

        // Lists: Aprendizajes + Detalles
        html += '<div class="grid md:grid-cols-2 gap-12 pt-6">';
        html += '<div class="space-y-6">';
        html += '  <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac] border-b border-[#2ebfac]/20 pb-2 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#2ebfac]"></span> Aprendizajes Clave</label>';
        html += renderListEditor('cursos-' + i + '-aprendizajes', c.aprendizajes, 'Nuevo Aprendizaje');
        html += '</div>';
        html += '<div class="space-y-6">';
        html += '  <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac] border-b border-[#2ebfac]/20 pb-2 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#2ebfac]"></span> Detalles Logísticos</label>';
        html += renderListEditor('cursos-' + i + '-detalles', c.detalles, 'Nuevo Detalle');
        html += '</div>';
        html += '</div>';

        html += '</div>'; // gap-10
        html += '</div>'; // card
    });

    grid.innerHTML = html;
}

/* ---------- RENDER: MEMBRESÍA ---------- */
function renderMembresia() {
    var m = currentData.membresia;
    var container = document.getElementById('admin-membresia-form');
    var html = '<div class="space-y-12">';

    // Row 1: Titulo + Precio
    html += '<div class="grid md:grid-cols-2 gap-8">';
    html += fieldBox('Título de Membresía', 'text', m.titulo, 'membresia', null, 'titulo', 'text-2xl font-serif text-[#1a0b2e]');
    html += fieldBox('Precio Mensual', 'text', m.precio, 'membresia', null, 'precio', 'text-2xl font-bold text-[#2ebfac]');
    html += '</div>';

    // Descripción
    html += fieldArea('Propuesta de Valor', m.descripcion, 'membresia', null, 'descripcion');

    // Two columns: Beneficios + Checklist
    html += '<div class="grid md:grid-cols-2 gap-12">';

    // Beneficios (titulo + desc objects)
    html += '<div class="space-y-8">';
    html += '<label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac] border-b border-[#2ebfac]/20 pb-3 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#2ebfac]"></span> Beneficios Detallados</label>';
    html += '<div class="space-y-6">';

    m.beneficios.forEach(function(b, bi) {
        html += '<div class="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col gap-4 relative group shadow-sm">';
        html += '  <input type="text" value="' + escapeHtml(b.titulo) + '" data-cat="membresia" data-field="beneficios" data-bi="' + bi + '" data-subfield="titulo" class="admin-obj-field bg-white p-4 rounded-2xl border border-slate-200 font-bold text-sm outline-none" placeholder="Título...">';
        html += '  <textarea data-cat="membresia" data-field="beneficios" data-bi="' + bi + '" data-subfield="descripcion" class="admin-obj-field bg-white p-4 rounded-2xl border border-slate-200 text-xs h-24 outline-none leading-relaxed" placeholder="Descripción...">' + escapeHtml(b.descripcion) + '</textarea>';
        html += '  <button data-delete-benefit="' + bi + '" class="absolute -top-3 -right-3 w-10 h-10 bg-white text-red-500 rounded-full shadow-xl border border-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold">×</button>';
        html += '</div>';
    });

    html += '<button id="add-mem-benefit" class="w-full p-5 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 hover:text-[#2ebfac] hover:border-[#2ebfac] text-[10px] font-bold uppercase tracking-widest transition-all">+ Nuevo Beneficio</button>';
    html += '</div></div>';

    // Checklist
    html += '<div class="space-y-8">';
    html += '<label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac] border-b border-[#2ebfac]/20 pb-3 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#2ebfac]"></span> Checklist de Incluidos</label>';
    html += renderListEditor('membresia-itemsIncluidos', m.itemsIncluidos, 'Nuevo Ítem');
    html += '</div>';

    html += '</div>'; // grid
    html += '</div>'; // root
    container.innerHTML = html;

    // Wire up benefit-specific events
    container.querySelectorAll('[data-delete-benefit]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            currentData.membresia.beneficios.splice(parseInt(this.dataset.deleteBenefit), 1);
            renderMembresia();
        });
    });
    document.getElementById('add-mem-benefit').addEventListener('click', function() {
        currentData.membresia.beneficios.push({titulo: '', descripcion: ''});
        renderMembresia();
    });
    container.querySelectorAll('.admin-obj-field').forEach(function(input) {
        input.addEventListener('change', function() {
            var bi = parseInt(this.dataset.bi);
            var sub = this.dataset.subfield;
            currentData.membresia.beneficios[bi][sub] = this.value;
        });
    });
}

/* ---------- RENDER: SESIONES ---------- */
function renderSesiones() {
    var s = currentData.sesiones;
    var container = document.getElementById('admin-sesiones-form');
    var html = '<div class="space-y-12">';

    html += '<div class="grid md:grid-cols-2 gap-8">';
    html += fieldBox('Título de Sección', 'text', s.titulo, 'sesiones', null, 'titulo', 'text-2xl font-serif text-[#1a0b2e]');
    html += fieldBox('Costo por Sesión', 'text', s.precio, 'sesiones', null, 'precio', 'text-2xl font-bold text-[#2ebfac]');
    html += '</div>';

    html += fieldArea('Descripción del Acompañamiento', s.descripcion, 'sesiones', null, 'descripcion');

    html += '<div class="space-y-8 max-w-3xl">';
    html += '<label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac] border-b border-[#2ebfac]/20 pb-3 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#2ebfac]"></span> Puntos de Valor 1:1</label>';
    html += renderListEditor('sesiones-beneficios', s.beneficios, 'Nuevo Beneficio');
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
}

/* ---------- FIELD HELPERS ---------- */
function fieldBox(label, type, value, cat, index, field, extraClass) {
    extraClass = extraClass || '';
    var html = '<div class="space-y-3">';
    html += '<label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">' + label + '</label>';
    html += '<input type="' + type + '" value="' + escapeHtml(value || '') + '" data-cat="' + cat + '"';
    if (index !== null && index !== undefined) html += ' data-index="' + index + '"';
    html += ' data-field="' + field + '" class="admin-field w-full p-5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm outline-none ' + extraClass + '">';
    html += '</div>';
    return html;
}

function fieldArea(label, value, cat, index, field) {
    var html = '<div class="space-y-3">';
    html += '<label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">' + label + '</label>';
    html += '<textarea data-cat="' + cat + '"';
    if (index !== null && index !== undefined) html += ' data-index="' + index + '"';
    html += ' data-field="' + field + '" class="admin-field w-full p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm text-sm h-40 outline-none leading-relaxed">' + escapeHtml(value || '') + '</textarea>';
    html += '</div>';
    return html;
}

/* ---------- FIELD CHANGE DELEGATION ---------- */
document.addEventListener('change', function(e) {
    if (e.target.classList && e.target.classList.contains('admin-field')) {
        var cat = e.target.dataset.cat;
        var field = e.target.dataset.field;
        var index = e.target.dataset.index;
        var val = e.target.value;

        if (index !== undefined) {
            currentData[cat][parseInt(index)][field] = val;
        } else {
            currentData[cat][field] = val;
        }
    }
});

/* ---------- SAVE / BACKUP ---------- */
function saveAll() {
    var status = document.getElementById('save-status');
    status.classList.remove('hidden');

    var content = 'const SITE_DATA = ' + JSON.stringify(currentData, null, 4) + ';\n';
    var blob = new Blob([content], {type: 'text/javascript'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(function() { status.classList.add('hidden'); }, 3000);
}

function downloadBackup() {
    var content = 'const SITE_DATA = ' + JSON.stringify(currentData, null, 4) + ';\n';
    var blob = new Blob([content], {type: 'text/javascript'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'data_backup_' + Date.now() + '.js';
    a.click();
    URL.revokeObjectURL(url);
}
