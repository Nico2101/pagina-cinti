let currentData = null;

function initAdmin() {
    currentData = JSON.parse(JSON.stringify(SITE_DATA));
    updateStats();
    showTab('dashboard');
}

function updateStats() {
    document.getElementById('stats-cursos').innerText = currentData.cursos.length;
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(`tab-${id}`).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('tab-active', 'bg-white/10'));
    document.getElementById(`btn-${id}`).classList.add('tab-active');
    
    // Refresh content
    if(id === 'cursos') renderCursos();
    if(id === 'membresia') renderMembresia();
    if(id === 'sesiones') renderSesiones();
    
    const titles = {
        dashboard: 'Vista General',
        cursos: 'Gestión de Cursos',
        membresia: 'Configuración Membresía',
        sesiones: 'Ajustes de Sesiones'
    };
    document.getElementById('tab-title').innerText = titles[id];
}

// HELPER: RENDER LIST EDITOR (TOTAL CONTROL)
function renderListEditor(array, onUpdate, placeholder = "Agregar ítem...") {
    if (!array) array = [];
    const listHtml = array.map((item, index) => `
        <div class="flex gap-3 items-center group bg-slate-50 p-2 rounded-xl border border-slate-100">
            <input type="text" value="${item}" onchange="${onUpdate}(this, ${index})" 
                   class="flex-grow p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-aqua text-sm outline-none transition-all">
            <button onclick="${onUpdate}(null, ${index})" class="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `).join('');

    return `
        <div class="space-y-3">
            ${listHtml}
            <button onclick="${onUpdate}({value:''}, -1)" class="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-brand-aqua hover:text-brand-aqua transition-all text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <span>+ ${placeholder}</span>
            </button>
        </div>
    `;
}

function renderCursos() {
    const grid = document.getElementById('admin-cursos-list');
    grid.innerHTML = currentData.cursos.map((c, i) => `
        <div class="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
            <div class="flex justify-between items-center border-b border-slate-50 pb-6">
                <div>
                    <h4 class="text-2xl font-serif text-purple-950">${c.titulo || 'Sin Título'}</h4>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ID: ${c.id}</p>
                </div>
            </div>
            
            <div class="grid gap-8">
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Título del Curso</label>
                        <input type="text" value="${c.titulo}" onchange="updateValue('cursos', ${i}, 'titulo', this.value)" class="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-aqua outline-none">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Precio</label>
                        <input type="text" value="${c.precio}" onchange="updateValue('cursos', ${i}, 'precio', this.value)" class="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-aqua outline-none">
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Descripción Corta (Cards)</label>
                    <input type="text" value="${c.descripcionCorta}" onchange="updateValue('cursos', ${i}, 'descripcionCorta', this.value)" class="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none">
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Descripción Larga (Detalles)</label>
                    <textarea onchange="updateValue('cursos', ${i}, 'descripcionLarga', this.value)" class="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm h-32 outline-none">${c.descripcionLarga}</textarea>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Link de Pago (Mercado Pago)</label>
                        <input type="text" value="${c.linkPago}" onchange="updateValue('cursos', ${i}, 'linkPago', this.value)" class="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Imagen del Curso (URL/Path)</label>
                        <input type="text" value="${c.imagen}" onchange="updateValue('cursos', ${i}, 'imagen', this.value)" class="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none">
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-10 pt-4">
                    <div class="space-y-4">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Lo que aprenderás (Lista)</label>
                        ${renderListEditor(c.aprendizajes, `(input, index) => updateArray('cursos', ${i}, 'aprendizajes', input, index, 'renderCursos')`, "Aprendizaje")}
                    </div>
                    <div class="space-y-4">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Detalles / Logística (Lista)</label>
                        ${renderListEditor(c.detalles, `(input, index) => updateArray('cursos', ${i}, 'detalles', input, index, 'renderCursos')`, "Detalle")}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMembresia() {
    const m = currentData.membresia;
    const container = document.getElementById('admin-membresia-form');
    container.innerHTML = `
        <div class="space-y-12">
            <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Título Membresía</label>
                    <input type="text" value="${m.titulo}" onchange="currentData.membresia.titulo = this.value" class="w-full p-5 bg-slate-50 border-none rounded-3xl text-lg font-serif outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Precio Mensual</label>
                    <input type="text" value="${m.precio}" onchange="currentData.membresia.precio = this.value" class="w-full p-5 bg-slate-50 border-none rounded-3xl text-lg font-bold outline-none">
                </div>
            </div>
            
            <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Descripción Principal</label>
                <textarea onchange="currentData.membresia.descripcion = this.value" class="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm h-32 outline-none">${m.descripcion}</textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-12">
                <div class="space-y-6">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Beneficios (Título + Desc)</label>
                    <div class="space-y-6">
                        ${m.beneficios.map((b, bi) => `
                            <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-3 relative group">
                                <input type="text" value="${b.titulo}" onchange="currentData.membresia.beneficios[${bi}].titulo = this.value" placeholder="Título..." class="bg-white p-3 rounded-xl border border-slate-100 font-bold text-sm outline-none">
                                <textarea onchange="currentData.membresia.beneficios[${bi}].descripcion = this.value" placeholder="Descripción..." class="bg-white p-3 rounded-xl border border-slate-100 text-xs h-20 outline-none">${b.descripcion}</textarea>
                                <button onclick="currentData.membresia.beneficios.splice(${bi}, 1); renderMembresia()" class="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full shadow-lg border border-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold">×</button>
                            </div>
                        `).join('')}
                        <button onclick="currentData.membresia.beneficios.push({titulo:'',descripcion:''}); renderMembresia()" class="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-brand-aqua text-xs font-bold uppercase tracking-widest">+ Nuevo Beneficio</button>
                    </div>
                </div>
                <div class="space-y-6">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Checklist de Incluidos</label>
                    ${renderListEditor(m.itemsIncluidos, `(input, index) => updateArray('membresia', null, 'itemsIncluidos', input, index, 'renderMembresia')`, "Ítem")}
                </div>
            </div>
        </div>
    `;
}

function renderSesiones() {
    const s = currentData.sesiones;
    const container = document.getElementById('admin-sesiones-form');
    container.innerHTML = `
        <div class="space-y-12">
            <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Título Sección</label>
                    <input type="text" value="${s.titulo}" onchange="currentData.sesiones.titulo = this.value" class="w-full p-5 bg-slate-50 border-none rounded-3xl text-lg font-serif outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Precio por Sesión</label>
                    <input type="text" value="${s.precio}" onchange="currentData.sesiones.precio = this.value" class="w-full p-5 bg-slate-50 border-none rounded-3xl text-lg font-bold outline-none">
                </div>
            </div>
            
            <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Descripción del Servicio</label>
                <textarea onchange="currentData.sesiones.descripcion = this.value" class="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm h-32 outline-none">${s.descripcion}</textarea>
            </div>

            <div class="space-y-6 max-w-2xl">
                <label class="text-[10px] font-bold uppercase tracking-widest text-[#2ebfac]">Puntos Clave / Beneficios</label>
                ${renderListEditor(s.beneficios, `(input, index) => updateArray('sesiones', null, 'beneficios', input, index, 'renderSesiones')`, "Beneficio")}
            </div>
        </div>
    `;
}

// GENERIC UPDATE FUNCTIONS
function updateValue(category, index, field, value) {
    if (index !== null) currentData[category][index][field] = value;
    else currentData[category][field] = value;
}

function updateArray(category, cIndex, field, input, arrIndex, refreshFunc) {
    const arr = (cIndex !== null) ? currentData[category][cIndex][field] : currentData[category][field];
    
    if (input === null) { // DELETE
        arr.splice(arrIndex, 1);
    } else if (arrIndex === -1) { // ADD
        arr.push("");
    } else { // EDIT
        arr[arrIndex] = input.value;
    }
    window[refreshFunc]();
}

function saveAll() {
    const status = document.getElementById('save-status');
    status.classList.remove('hidden');
    
    const content = 'const SITE_DATA = ' + JSON.stringify(currentData, null, 4) + ';';
    const blob = new Blob([content], {type: 'text/javascript'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => status.classList.add('hidden'), 3000);
}

function downloadBackup() {
    const content = 'const SITE_DATA = ' + JSON.stringify(currentData, null, 4) + ';';
    const blob = new Blob([content], {type: 'text/javascript'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_backup_${new Date().getTime()}.js`;
    a.click();
    URL.revokeObjectURL(url);
}
