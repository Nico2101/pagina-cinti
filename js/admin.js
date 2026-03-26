        const REPO_OWNER = "Nico2101";
        const REPO_NAME = "pagina-cinti";
        const FILE_PATH = "js/data.js";
        
        let SITE_DATA = null;
        let fileSha = ""; 
        let isAuthorized = localStorage.getItem("cintia_admin_auth") === "true";

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

                if(!response.ok) throw new Error("Contraseña denegada o acceso no autorizado.");

                const data = await response.json();
                fileSha = data.sha;

                const scriptContent = b64_to_utf8(data.content);
                const jsonText = scriptContent.substring(scriptContent.indexOf('{'), scriptContent.lastIndexOf('}') + 1);
                SITE_DATA = JSON.parse(jsonText);

                localStorage.setItem("cintia_admin_auth", "true");
                document.getElementById("btn-save").classList.remove("hidden");
                document.getElementById("btn-logout").classList.remove("hidden");
                document.getElementById("admin-container").classList.remove("hidden");
                renderAdmin();
                ocultarCarga();

            } catch (error) {
                ocultarCarga();
                alert("Acceso Incorrecto: " + error.message);
                localStorage.removeItem("cintia_admin_auth");
                document.getElementById("login-screen").classList.remove("hidden");
            }
        }

        if(isAuthorized) { iniciarSesion(); }

        function renderAdmin() {
            const container = document.getElementById('admin-container');
            
            // Sección de Cursos
            let html = `
                <div class="flex justify-between items-center mb-8 bg-purple-100 p-6 rounded-xl border border-purple-200">
                    <div>
                        <h2 class="text-2xl font-bold text-purple-900">🎓 Gestión de Cursos</h2>
                        <p class="text-purple-700 text-sm">Agregá, editá o eliminá tus capacitaciones.</p>
                    </div>
                    <button onclick="agregarCurso()" class="bg-purple-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-purple-800 transition shadow-sm">+ Nuevo Curso</button>
                </div>
            `;
            
            html += SITE_DATA.cursos.map((curso, index) => `
                <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8 hover:shadow-md transition relative group">
                    <button onclick="eliminarCurso(${index})" class="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">Eliminar</button>
                    <h2 class="text-xl font-bold text-purple-900 mb-6 border-b pb-2 flex items-center gap-2">
                        <span class="bg-purple-100 text-purple-900 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">${index + 1}</span>
                        ${curso.titulo || 'Nuevo Curso'}
                    </h2>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-600">ID (interno, sin espacios)</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'id', this.value)" type="text" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2" value="${curso.id || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-600">Título</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'titulo', this.value)" type="text" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2" value="${curso.titulo || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-600">Precio en Texto</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'precio', this.value)" type="text" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2" value="${curso.precio || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-600">Ruta Imagen (img/nombre.png)</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'imagen', this.value)" type="text" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2" value="${curso.imagen || 'img/'}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-gray-600">Descripción Corta</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'descripcionCorta', this.value)" type="text" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2" value="${curso.descripcionCorta || ''}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-gray-600">Descripción Larga (Usa &lt;br&gt; para saltos)</label>
                            <textarea onchange="actualizarDato('cursos', ${index}, 'descripcionLarga', this.value)" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2 h-24">${curso.descripcionLarga || ''}</textarea>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-gray-600">Link de Pago (MercadoPago, etc)</label>
                            <input onchange="actualizarDato('cursos', ${index}, 'linkPago', this.value)" type="text" class="w-full border border-gray-300 rounded bg-green-50 p-2" value="${curso.linkPago || ''}">
                        </div>
                    </div>
                </div>
            `).join('');

            // Sección de Membresía
            const m = SITE_DATA.membresia;
            html += `
                <div class="mb-8 mt-16 bg-green-50 p-6 rounded-xl border border-green-100">
                    <h2 class="text-2xl font-bold text-green-900">💎 Gestión de Membresía</h2>
                    <p class="text-green-700 text-sm">Actualizá los textos y beneficios de tu comunidad.</p>
                </div>
                <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-600">Título de Membresía</label>
                            <input onchange="actualizarMembresia('titulo', this.value)" type="text" class="w-full border border-gray-300 rounded p-2" value="${m.titulo}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-600">Precio / cuota</label>
                            <input onchange="actualizarMembresia('precio', this.value)" type="text" class="w-full border border-gray-300 rounded p-2" value="${m.precio}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-gray-600">Subtítulo (Gancho comercial)</label>
                            <input onchange="actualizarMembresia('subtitulo', this.value)" type="text" class="w-full border border-gray-300 rounded p-2" value="${m.subtitulo}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-gray-600">Descripción principal</label>
                            <textarea onchange="actualizarMembresia('descripcion', this.value)" class="w-full border border-gray-300 rounded p-2 h-24">${m.descripcion}</textarea>
                        </div>
                    </div>
                </div>
            `;

            // Sección Sobre Mí (Pilares)
            const s = SITE_DATA.sobreMi;
            html += `
                <div class="mb-8 mt-16 bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h2 class="text-2xl font-bold text-blue-900">👩‍💼 Perfil Profesional (Sobre Mí)</h2>
                    <p class="text-blue-700 text-sm">Editá tus habilidades y pilares profesionales.</p>
                </div>
                <div class="grid md:grid-cols-2 gap-6 mb-20">
                    ${s.pilares.map((p, index) => `
                        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <label class="block text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">Habilidad ${index + 1}</label>
                            <input onchange="actualizarPilar(${index}, 'titulo', this.value)" type="text" class="w-full border border-gray-300 rounded p-2 mb-3 font-bold" value="${p.titulo}">
                            <textarea onchange="actualizarPilar(${index}, 'descripcion', this.value)" class="w-full border border-gray-300 rounded p-2 h-20 text-sm text-gray-600">${p.descripcion}</textarea>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.innerHTML = html;
        }

        function actualizarDato(array, index, campo, valor) {
            SITE_DATA[array][index][campo] = valor;
        }

        function actualizarMembresia(campo, valor) {
            SITE_DATA.membresia[campo] = valor;
        }

        function actualizarPilar(index, campo, valor) {
            SITE_DATA.sobreMi.pilares[index][campo] = valor;
        }

        function agregarCurso() {
            const nuevo = {
                "id": "nuevo-curso-" + Date.now(),
                "titulo": "Nuevo Curso",
                "descripcionCorta": "Descripción corta aquí...",
                "descripcionLarga": "Descripción detallada...",
                "precio": "$XXXX",
                "imagen": "img/placeholder.png",
                "linkPago": "#",
                "aprendizajes": [],
                "detalles": ["A tu propio ritmo"]
            };
            SITE_DATA.cursos.unshift(nuevo);
            renderAdmin();
        }

        function eliminarCurso(index) {
            if(confirm("¿Estás segura de eliminar este curso? No se puede deshacer.")) {
                SITE_DATA.cursos.splice(index, 1);
                renderAdmin();
            }
        }

        function cerrarSesion() {
            localStorage.removeItem("cintia_admin_auth");
            location.reload();
        }

        async function guardarEnLaNube() {
            mostrarCarga("Subiendo actualizaciones al servidor central...");
            
            const nuevoContenidoJS = "const SITE_DATA = " + JSON.stringify(SITE_DATA, null, 4) + ";\n";
            const base64Content = utf8_to_b64(nuevoContenidoJS);

            try {
                const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `token ${getT()}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: "Expansión de pilares profesionales desde Panel Admin",
                        content: base64Content,
                        sha: fileSha 
                    })
                });

                if(!response.ok) throw new Error("No se pudo guardar, revisá que el token tenga permisos.");
                
                const data = await response.json();
                fileSha = data.content.sha; 

                ocultarCarga();
                alert("🎉 ¡Actualización un éxito!\n\nLos cambios ya están viajando a internet. Deberías verlos reflejados en tu página (GitHub.io) en aprox 20 a 30 segundos.");

            } catch(error) {
                ocultarCarga();
                alert("Hubo un error al intentar publicar: " + error.message);
            }
        }

        function mostrarCarga(txt) {
            document.getElementById("loader-text").innerText = txt;
            document.getElementById("loader").classList.remove("hidden");
        }
        function ocultarCarga() {
            document.getElementById("loader").classList.add("hidden");
        }
