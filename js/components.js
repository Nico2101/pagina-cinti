const headerHTML = `
<nav class="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center relative z-50">
    <a href="index.html" class="text-2xl font-bold tracking-tighter text-purple-950 flex items-center gap-2 group">
        <div class="w-8 h-8 bg-[#b5e4ca] rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
            <span class="text-xs text-purple-950">CA</span>
        </div>
        Cintia Agostino
    </a>
    
    <!-- MENU DESKTOP -->
    <div class="hidden md:flex space-x-10 text-xs font-bold uppercase tracking-widest items-center">
        <a href="index.html" class="hover:text-[#92cda9] transition-colors">Inicio</a>
        <a href="sobre-mi.html" class="hover:text-[#92cda9] transition-colors">Sobre Mí</a>
        <a href="membresia.html" class="hover:text-[#92cda9] transition-colors">Membresía</a>
        <a href="index.html#sesiones" class="bg-purple-950 text-white px-6 py-3 rounded-sm hover:bg-[#b5e4ca] hover:text-purple-950 transition-all shadow-sm">Sesiones 1:1</a>
    </div>

    <!-- BOTON MOBILE (HAMBURGER) -->
    <button id="mobile-menu-btn" class="md:hidden text-purple-950 focus:outline-none p-2 rounded-lg hover:bg-purple-100 transition-colors">
        <svg id="menu-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    </button>

    <!-- MENU MOBILE OVERLAY -->
    <div id="mobile-menu" class="hidden fixed inset-0 bg-white/95 backdrop-blur-md z-[60] flex flex-col items-center justify-center space-y-8 text-2xl font-bold text-purple-950 transition-all duration-300">
        <a href="index.html" class="hover:text-[#92cda9]">Inicio</a>
        <a href="sobre-mi.html" class="hover:text-[#92cda9]">Sobre Mí</a>
        <a href="membresia.html" class="hover:text-[#92cda9]">Membresía</a>
        <a href="index.html#sesiones" class="bg-purple-900 text-white px-10 py-4 rounded-full">Sesiones 1:1</a>
    </div>
</nav>
`;

const footerHTML = `
<footer class="bg-purple-950 text-white py-20 px-8">
    <div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div class="col-span-1 md:col-span-2 space-y-6">
            <h3 class="text-3xl font-bold tracking-tighter">Cintia Agostino</h3>
            <p class="text-purple-200/60 max-w-sm leading-relaxed">Acompañando procesos de autoconocimiento y transformación a través del Coaching Ontológico Profesional.</p>
        </div>
        <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-widest text-[#b5e4ca]">Navegación</h4>
            <div class="flex flex-col space-y-2 text-sm text-purple-100/70">
                <a href="index.html" class="hover:text-white transition">Inicio</a>
                <a href="sobre-mi.html" class="hover:text-white transition">Sobre Mí</a>
                <a href="membresia.html" class="hover:text-white transition">Membresía</a>
                <a href="admin.html" class="mt-4 text-[10px] opacity-50 hover:opacity-100 transition">Panel Administrativo</a>
            </div>
        </div>
        <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-widest text-[#b5e4ca]">Contacto</h4>
            <div class="flex flex-col space-y-2 text-sm text-purple-100/70">
                <a href="https://wa.me/541165248554" target="_blank" class="hover:text-white transition">WhatsApp</a>
                <a href="mailto:consultas@cintiaagostino.com" class="hover:text-white transition">Email</a>
                <a href="#" class="hover:text-white transition">Instagram</a>
            </div>
        </div>
    </div>
    <div class="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 text-center text-[10px] text-white/30 tracking-widest uppercase">
        © 2024 Cintia Agostino • Todos los derechos reservados
    </div>
</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');
    
    if (header) {
        header.innerHTML = headerHTML;
        
        // Logica de Menu Mobile
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        const iconMenu = document.getElementById('menu-icon');
        const iconClose = document.getElementById('close-icon');
        
        if(btn && menu) {
            btn.addEventListener('click', () => {
                const isHidden = menu.classList.contains('hidden');
                if(isHidden) {
                    menu.classList.remove('hidden');
                    menu.classList.add('flex');
                    iconMenu.classList.add('hidden');
                    iconClose.classList.remove('hidden');
                    document.body.style.overflow = 'hidden'; // Evitar scroll
                } else {
                    menu.classList.add('hidden');
                    menu.classList.remove('flex');
                    iconMenu.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
            
            // Cerrar menú al hacer clic en un link
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.add('hidden');
                    menu.classList.remove('flex');
                    iconMenu.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                    document.body.style.overflow = '';
                });
            });
        }
    }
    
    if (footer) footer.innerHTML = footerHTML;
});
