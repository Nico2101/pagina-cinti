        const REPO_OWNER = "Nico2101";
        const REPO_NAME = "pagina-cinti";
        const FILE_PATH = "js/data.js";
        
        // Almacena la versión local de curso data
        let SITE_DATA = null;
        let fileSha = ""; 
        let githubToken = localStorage.getItem("cintia_github_token");

        function utf8_to_b64(str) { return window.btoa(unescape(encodeURIComponent(str))); }
        function b64_to_utf8(str) { return decodeURIComponent(escape(window.atob(str))); }

        async function iniciarSesion() {
            const inputUser = document.getElementById("admin-user")?.value.trim().toLowerCase() || "";
            const inputToken = document.getElementById("github-token")?.value.trim() || "";
            
            const finalToken = inputToken || githubToken;
            
            if(!finalToken) { 
                alert("Por favor ingresá tu Usuario y Contraseña."); 
                return; 
            }
            
            if(inputToken && inputUser !== "cintia") {
                alert("Usuario no reconocido. Verificá que esté bien escrito.");
                return;
            }
            
            if(inputToken) { githubToken = inputToken; }
            
            document.getElementById("login-screen").classList.add("hidden");
            mostrarCarga("Validando seguridad y conectando...");

            try {
                const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                    headers: { "Authorization": `token ${githubToken}` }
                });

                if(!response.ok) throw new Error("Contraseña denegada o acceso no autorizado.");

                const data = await response.json();
                fileSha = data.sha;

                const scriptContent = b64_to_utf8(data.content);
                const jsonText = scriptContent.replace("const SITE_DATA = ", "").replace(/;\s*$/, "");
                SITE_DATA = JSON.parse(jsonText);

                localStorage.setItem("cintia_github_token", githubToken);
                document.getElementById("btn-save").classList.remove("hidden");
                document.getElementById("admin-container").classList.remove("hidden");
                renderAdmin();
                ocultarCarga();

            } catch (error) {
                ocultarCarga();
                alert("Acceso Incorrecto: " + error.message);
                localStorage.removeItem("cintia_github_token");
                document.getElementById("login-screen").classList.remove("hidden");
            }
        }

        if(githubToken) { iniciarSesion(); }

        function renderAdmin() {
            const container = document.getElementById('admin-container');
            container.innerHTML = SITE_DATA.cursos.map((curso, index) => `
                <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8 hover:shadow-md transition">
                    <h2 class="text-xl font-bold text-purple-900 mb-6 border-b pb-2">✏️ Curso: ${curso.titulo}</h2>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-600">Título</label>
                            <input onchange="actualizarDato(${index}, 'titulo', this.value)" type="text" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2" value="${curso.titulo}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1 text-gray-600">Precio en Texto</label>
                            <input onchange="actualizarDato(${index}, 'precio', this.value)" type="text" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2" value="${curso.precio}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-gray-600">Descripción Corta</label>
                            <input onchange="actualizarDato(${index}, 'descripcionCorta', this.value)" type="text" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2" value="${curso.descripcionCorta}">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-gray-600">Descripción Larga</label>
                            <textarea onchange="actualizarDato(${index}, 'descripcionLarga', this.value)" class="w-full border border-gray-300 rounded bg-gray-50 focus:bg-white p-2 h-24">${curso.descripcionLarga}</textarea>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium mb-1 text-gray-600">Link de Pago (MercadoPago, etc)</label>
                            <input onchange="actualizarDato(${index}, 'linkPago', this.value)" type="text" class="w-full border border-gray-300 rounded bg-green-50 p-2" value="${curso.linkPago}">
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function actualizarDato(index, campo, valor) {
            SITE_DATA.cursos[index][campo] = valor;
        }

        async function guardarEnLaNube() {
            mostrarCarga("Subiendo actualizaciones al servidor central...");
            
            const nuevoContenidoJS = "const SITE_DATA = " + JSON.stringify(SITE_DATA, null, 4) + ";\n";
            const base64Content = utf8_to_b64(nuevoContenidoJS);

            try {
                const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `token ${githubToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: "Actualización de cursos desde el Panel Web",
                        content: base64Content,
                        sha: fileSha 
                    })
                });

                if(!response.ok) throw new Error("No se pudo guardar, revisá que el token tenga permisos.");
                
                const data = await response.json();
                fileSha = data.content.sha; 

                ocultarCarga();
                alert("🎉 ¡Actualización un éxito!\\n\\nNetlify ya recibió la orden y los cambios impactarán en tu página en aprox 15 a 30 segundos.");

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
