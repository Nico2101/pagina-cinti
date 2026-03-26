document.addEventListener('DOMContentLoaded', () => {
    // Definimos el HTML centralizado del Menú Superior
    const navHTML = `
    <nav class="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div class="w-32 md:w-48">
            <a href="index.html">
                <img src="img/1-removebg-preview.png" alt="Cintia Agostino Logo" class="w-full h-auto drop-shadow-md">
            </a>
        </div>
        <div class="hidden md:flex space-x-8 text-sm uppercase tracking-wider font-medium items-center">
            <a href="sobre-mi.html" class="hover:text-purple-600 transition-colors">Sobre mí</a>
            <a href="index.html#cursos" class="hover:text-purple-600 transition-colors">Cursos</a>
            <a href="membresia.html" class="hover:text-purple-600 transition-colors">Membresía</a>
            <a href="index.html#sesiones" class="hover:text-purple-600 transition-colors">Sesiones</a>
            <a href="https://wa.me/tu-numero" class="btn-accent text-purple-950 font-semibold px-5 py-2 rounded-full">Contacto</a>
        </div>
    </nav>
    <div class="w-full h-3 bg-[#b5e4ca]"></div>
    `;

    // Definimos el HTML centralizado del Pie de Página
    const footerHTML = `
    <footer class="py-12 border-t border-purple-200 text-center bg-[#f5f0f6] w-full mt-auto">
        <div class="flex flex-col items-center justify-center mb-6">
            <img src="img/1-removebg-preview.png" alt="Cintia Agostino Icon" class="w-24 mb-4 opacity-80">
            <p class="text-xs uppercase tracking-widest text-purple-800/60">© 2026 Cintia Agostino - Coaching Ontológico</p>
        </div>
        <div class="flex justify-center space-x-6 mt-6">
            <a href="https://instagram.com/cintiaagostino" class="text-purple-800/60 hover:text-purple-900 transition-colors">Instagram</a>
            <a href="#" class="text-purple-800/60 hover:text-purple-900 transition-colors">LinkedIn</a>
        </div>
    </footer>
    `;

    // Inyectamos el Menú
    const headerEl = document.getElementById('main-header');
    if (headerEl) {
        headerEl.innerHTML = navHTML;
    }

    // Inyectamos el Pie de Página
    const footerEl = document.getElementById('main-footer');
    if (footerEl) {
        footerEl.innerHTML = footerHTML;
    }
});
