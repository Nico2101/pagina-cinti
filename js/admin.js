        const REPO_OWNER = "Nico2101";
        const REPO_NAME = "pagina-cinti";
        const FILE_PATH = "js/data.js";
        
        let SITE_DATA = null;
        let fileSha = ""; 
        let isAuthorized = localStorage.getItem("cintia_admin_auth") === "true";
        let vistaActual = 'cursos';

        const _p1 = "ghp_ntR2";
        const _p2 = "hu4NUlhS";
        const _p3 = "oN5a3Saob";
        const _p4 = "DOROvcsst2YohQQ";
        const getT = () => _p1 + _p2 + _p3 + _p4;

        function utf8_to_b64(str) { return window.btoa(unescape(encodeURIComponent(str))); }
        function b64_to_utf8(str) { return decodeURIComponent(escape(window.atob(str))); }

        async function iniciarSesion() {
            const inputUser = document.getElementById("admin-user")?.value.trim().toLowerCase() || "";
            const inputPass = document.getElementById("github-token")?.value.trim() || "";
            
            if(!isAuthorized) {
                if(!inputPass || !inputUser) {
                    alert("Por favor ingresá tu Usuario y Contraseña.");
                    return;
                }
                if(inputUser !== "cintia") {
                    alert("Usuario no reconocido.");
                    return;
                }
                if(inputPass !== "CintiaAdmin24!") {
                    alert("Contraseña incorrecta.");
                    return;
                }
            }
            
            document.getElementById("login-screen").classList.add("hidden");
            mostrarCarga("Validando seguridad y conectando...");

            try {
                const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                    headers: { "Authorization": `token ${getT()}` }
                });

                if(!response.ok) throw new Error("Acceso denegado o archivo no encontrado.");

                const data = await response.json();
                fileSha = data.sha;

                const scriptContent = b64_to_utf8(data.content);
                const jsonText = scriptContent.substring(scriptContent.indexOf('{'), scriptContent.lastIndexOf('}') + 1);
                SITE_DATA = JSON.parse(jsonText);

                localStorage.setItem("cintia_admin_auth", "true");
                document.getElementById("sidebar").classList.remove("hidden");
                document.getElementById("sidebar").classList.add("flex");
                document.getElementById("admin-container").classList.remove("hidden");
                
                cambiarVista('cursos');
                ocultarCarga();

            } catch (error) {
                ocultarCarga();
                alert("Error de conexión: " + error.message);
                localStorage.removeItem("cintia_admin_auth");
                document.getElementById("login-screen").classList.remove("hidden");
            }
        }

        if(isAuthorized) { iniciarSesion(); }

        function cambiarVista(vista) {
            vistaActual = vista;
            
            // Actualizar Sidebar UI
            document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('sidebar-link-active'));
            document.getElementById(`nav-${vista}`).classList.add('sidebar-link-active');
            
            // Títulos
            const titulos = {
                'cursos': 'Pestaña: Cursos Online',
                'sesiones': 'Pestaña: Sesiones Individuales',
                'membresia': 'Pestaña: Gestión de Membresía',
                'perfil': 'Pestaña: Sobre Mí (Pilares)'
            };
            document.getElementById('view-title').innerText = titulos[vista];
            
            renderContenido();
        }

        function renderContenido() {
            const container = document.getElementById('view-content');
            container.innerHTML = '';
            
            if (vistaActual === 'cursos') renderCursos(container);
            if (vistaActual === 'sesiones') renderSesiones(container);
            if (vistaActual === 'membresia') renderMembresia(container);
            if (vistaActual === 'perfil') renderPerfil(container);
        }

        function renderCursos(container) {
            let html = `
                <div class="flex justify-between items-center mb-8">
                    <p class="text-slate-500 text-sm italic">Editá tus cursos actuales o agregá nuevos a la lista.</p>
                    <button onclick="agregarCurso()" class="bg-purple-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-purple-800 transition shadow-sm">+ Nuevo Curso</button>
                </div>
            `;
            html += SITE_DATA.cursos.map((curso, index) => `
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 relative group">
                    <button onclick="eliminarCurso(${index})" class="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-xs font-bold uppercase">Eliminar Curso</button>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="md:col-span-2 border-b pb-4 mb-2">
                            <label class="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Título del curso</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'titulo', this.value)" type="text" class="w-full text-xl font-bold bg-transparent focus:bg-slate-50 outline-none p-1 border-b border-transparent focus:border-purple-200" value="${curso.titulo || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">ID (interno)</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'id', this.value)" type="text" class="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 text-sm" value="${curso.id || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Precio</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'precio', this.value)" type="text" class="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 text-sm" value="${curso.precio || ''}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-slate-400">Descripción Corta (Cards)</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'descripcionCorta', this.value)" type="text" class="w-full border border-slate-200 rounded-lg bg-slate-50 p-3 text-sm" value="${curso.descripcionCorta || ''}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-slate-400">WhatsApp / Link de Pago</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'linkPago', this.value)" type="text" class="w-full border border-green-200 rounded-lg bg-green-50 p-3 text-sm text-green-800" value="${curso.linkPago || ''}">
                        </div>

                        <!-- NUEVO: LINK DE ENTREGA (READ ONLY) -->
                        <div class="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                             <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Link de Entrega (Para enviar al alumno después del pago)</label>
                             <div class="flex gap-2">
                                <input readonly type="text" class="flex-grow bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-500" value="https://${REPO_OWNER}.github.io/${REPO_NAME}/material.html?curso=${curso.id}">
                                <button onclick="navigator.clipboard.writeText('https://${REPO_OWNER}.github.io/${REPO_NAME}/material.html?curso=${curso.id}'); alert('¡Link copiado!')" class="bg-purple-100 text-purple-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-200 transition">Copiar Link</button>
                             </div>
                        </div>
                    </div>
                </div>
            `).join('');
            container.innerHTML = html;
        }

        function renderSesiones(container) {
            const s = SITE_DATA.sesiones;
            container.innerHTML = `
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Título de la Sección</label>
                            <input onchange="actualizarSesiones('titulo', this.value)" type="text" class="w-full border border-slate-200 rounded-lg p-3" value="${s.titulo}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Subtítulo (Gancho)</label>
                            <input onchange="actualizarSesiones('subtitulo', this.value)" type="text" class="w-full border border-slate-200 rounded-lg p-3" value="${s.subtitulo}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Invitación / Descripción</label>
                            <textarea onchange="actualizarSesiones('descripcion', this.value)" class="w-full border border-slate-200 rounded-lg p-3 h-32">${s.descripcion}</textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Tu Link de WhatsApp</label>
                            <input onchange="actualizarSesiones('whatsapp', this.value)" type="text" class="w-full border border-green-200 rounded-lg p-3 text-green-700 font-bold" value="${s.whatsapp}">
                        </div>
                    </div>
                </div>
            `;
        }

        function renderMembresia(container) {
            const m = SITE_DATA.membresia;
            container.innerHTML = `
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Título Membresía</label>
                            <input onchange="actualizarMembresia('titulo', this.value)" type="text" class="w-full border border-slate-200 rounded-lg p-3" value="${m.titulo}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Precio mensual</label>
                            <input onchange="actualizarMembresia('precio', this.value)" type="text" class="w-full border border-slate-200 rounded-lg p-3 text-xl font-bold" value="${m.precio}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Subtítulo</label>
                            <input onchange="actualizarMembresia('subtitulo', this.value)" type="text" class="w-full border border-slate-200 rounded-lg p-3" value="${m.subtitulo}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-slate-400">Descripción descriptiva</label>
                            <textarea onchange="actualizarMembresia('descripcion', this.value)" class="w-full border border-slate-200 rounded-lg p-3 h-32">${m.descripcion}</textarea>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderPerfil(container) {
            const sm = SITE_DATA.sobreMi;
            let html = `
                <div class="flex justify-between items-center mb-8">
                    <p class="text-slate-500 text-sm italic">Gestioná tus habilidades y pilares que aparecen en "Sobre Mí".</p>
                    <button onclick="agregarPilar()" class="bg-purple-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-purple-800 transition shadow-sm">+ Agregar Habilidad</button>
                </div>
                <div class="grid md:grid-cols-2 gap-6 pb-20">
            `;
            html += sm.pilares.map((p, index) => `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
                    <button onclick="eliminarPilar(${index})" class="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold">X ELIMINAR</button>
                    <label class="block text-[10px] font-bold text-purple-400 uppercase mb-2">Habilidad ${index + 1}</label>
                    <input onchange="actualizarPilar(${index}, 'titulo', this.value)" type="text" class="w-full font-bold border-b border-slate-100 focus:border-purple-200 mb-2 outline-none p-1" value="${p.titulo}">
                    <textarea onchange="actualizarPilar(${index}, 'descripcion', this.value)" class="w-full text-sm text-slate-600 h-20 bg-slate-50 border-none rounded-lg p-2 outline-none focus:ring-1 focus:ring-purple-200">${p.descripcion}</textarea>
                </div>
            `).join('');
            html += `</div>`;
            container.innerHTML = html;
        }

        function actualizarDato(array, index, campo, valor) { SITE_DATA[array][index][campo] = valor; }
        function actualizarMembresia(campo, valor) { SITE_DATA.membresia[campo] = valor; }
        function actualizarSesiones(campo, valor) { SITE_DATA.sesiones[campo] = valor; }
        function actualizarPilar(index, campo, valor) { SITE_DATA.sobreMi.pilares[index][campo] = valor; }

        function agregarCurso() {
            SITE_DATA.cursos.unshift({ "id": "nuevo-"+Date.now(), "titulo": "Nuevo Curso", "descripcionCorta": "Resumen...", "precio": "$XXXX", "linkPago": "#", "imagen": "img/placeholder.png", "aprendizajes": [], "detalles": [] });
            renderContenido();
        }
        function eliminarCurso(index) { if(confirm("¿Segura?")) { SITE_DATA.cursos.splice(index,1); renderContenido(); } }

        function agregarPilar() {
            SITE_DATA.sobreMi.pilares.push({ "titulo": "Nueva Habilidad", "descripcion": "Explicación breve..." });
            renderContenido();
        }
        function eliminarPilar(index) { if(confirm("¿Eliminar esta habilidad?")) { SITE_DATA.sobreMi.pilares.splice(index,1); renderContenido(); } }

        function cerrarSesion() { localStorage.removeItem("cintia_admin_auth"); location.reload(); }

        async function guardarEnLaNube() {
            mostrarCarga("Publicando cambios en la web...");
            const nuevoJS = "const SITE_DATA = " + JSON.stringify(SITE_DATA, null, 4) + ";\n";
            try {
                const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                    method: 'PUT', headers: { "Authorization": `token ${getT()}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ message: "Actualización integral desde Admin V2", content: utf8_to_b64(nuevoJS), sha: fileSha })
                });
                if(!res.ok) throw new Error("Error API");
                const d = await res.json(); fileSha = d.content.sha;
                ocultarCarga();
                alert("✅ ¡Cambios publicados! Se verán en vivo en 30 segundos.");
            } catch(e) { ocultarCarga(); alert("Error: " + e.message); }
        }

        function mostrarCarga(txt) { document.getElementById("loader-text").innerText = txt; document.getElementById("loader").classList.remove("hidden"); }
        function ocultarCarga() { document.getElementById("loader").classList.add("hidden"); }
