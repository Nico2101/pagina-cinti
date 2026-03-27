let currentData = null;

function initAdmin() {
    currentData = JSON.parse(JSON.stringify(SITE_DATA));
    updateStats();
    renderCursos();
    renderMembresia();
    renderSesiones();
}

function updateStats() {
    document.getElementById('stats-cursos').innerText = currentData.cursos.length;
}

function renderCursos() {
    const grid = document.getElementById('admin-cursos-list');
    grid.innerHTML = currentData.cursos.map((c, i) => `
        <div class="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
            <h4 class="font-bold text-purple-900">${c.titulo}</h4>
            <div class="grid gap-2">
                <input type="text" value="${c.titulo}" onchange="updateCurso(${i}, 'titulo', this.value)" class="p-2 border rounded-lg text-sm" placeholder="Título">
                <input type="text" value="${c.precio}" onchange="updateCurso(${i}, 'precio', this.value)" class="p-2 border rounded-lg text-sm" placeholder="Precio">
                <textarea onchange="updateCurso(${i}, 'descripcionCorta', this.value)" class="p-2 border rounded-lg text-sm h-20" placeholder="Descripción corta">${c.descripcionCorta}</textarea>
                <input type="text" value="${c.linkPago}" onchange="updateCurso(${i}, 'linkPago', this.value)" class="p-2 border rounded-lg text-sm" placeholder="Link de Pago">
            </div>
        </div>
    `).join('');
}

function updateCurso(index, field, value) {
    currentData.cursos[index][field] = value;
}

function renderMembresia() {
    const m = currentData.membresia;
    const container = document.getElementById('admin-membresia-form');
    container.innerHTML = `
        <div class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="text-xs font-bold uppercase tracking-widest text-slate-400">Título</label>
                    <input type="text" value="${m.titulo}" onchange="updateMembresia('titulo', this.value)" class="w-full p-4 border rounded-xl">
                </div>
                <div class="space-y-2">
                    <label class="text-xs font-bold uppercase tracking-widest text-slate-400">Precio</label>
                    <input type="text" value="${m.precio}" onchange="updateMembresia('precio', this.value)" class="w-full p-4 border rounded-xl">
                </div>
            </div>
            <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-400">Descripción</label>
                <textarea onchange="updateMembresia('descripcion', this.value)" class="w-full p-4 border rounded-xl h-32">${m.descripcion}</textarea>
            </div>
        </div>
    `;
}

function updateMembresia(field, value) {
    currentData.membresia[field] = value;
}

function renderSesiones() {
    const s = currentData.sesiones;
    const container = document.getElementById('admin-sesiones-form');
    container.innerHTML = `
        <div class="space-y-6">
            <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-400">Título Principal</label>
                <input type="text" value="${s.titulo}" onchange="updateSesion('titulo', this.value)" class="w-full p-4 border rounded-xl">
            </div>
            <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-400">Descripción</label>
                <textarea onchange="updateSesion('descripcion', this.value)" class="w-full p-4 border rounded-xl h-32">${s.descripcion}</textarea>
            </div>
        </div>
    `;
}

function updateSesion(field, value) {
    currentData.sesiones[field] = value;
}

function saveAll() {
    const status = document.getElementById('save-status');
    status.classList.remove('hidden');
    
    // Generar el código para data.js
    const content = 'const SITE_DATA = ' + JSON.stringify(currentData, null, 4) + ';';
    
    // Aquí el usuario debe descargar el archivo o el asistente debe escribirlo
    // Simulamos la acción informando que los datos están listos
    console.log("Nuevos datos generados:", content);
    
    // OPCIONAL: Descargar como archivo para respaldo directo
    const blob = new Blob([content], {type: 'text/javascript'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    a.click();

    setTimeout(() => status.classList.add('hidden'), 3000);
}

function downloadBackup() {
    const content = 'const SITE_DATA = ' + JSON.stringify(currentData, null, 4) + ';';
    const blob = new Blob([content], {type: 'text/javascript'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_backup.js';
    a.click();
}
