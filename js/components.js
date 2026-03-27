const headerHTML = `
<nav class="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center relative z-[100]">
    <a href="index.html" class="flex items-center group">
        <img src="img/1-removebg-preview.png" alt="Cintia Agostino Logo" class="h-16 md:h-20 w-auto group-hover:scale-105 transition-transform">
    </a>
    
    <!-- MENU DESKTOP -->
    <div class="hidden md:flex space-x-10 text-xs font-bold uppercase tracking-widest items-center">
        <a href="index.html" class="hover:text-brand-aqua transition-colors">Inicio</a>
        <a href="sobre-mi.html" class="hover:text-brand-aqua transition-colors">Sobre Mí</a>
        <a href="membresia.html" class="hover:text-brand-aqua transition-colors">Membresía</a>
        <a href="index.html#sesiones" class="bg-purple-950 text-white px-8 py-4 rounded-sm hover:bg-brand-aqua hover:text-white transition-all shadow-md transform hover:-translate-y-0.5">Sesiones 1:1</a>
    </div>

    <!-- BOTON MOBILE (HAMBURGER) -->
    <button id="mobile-menu-btn" class="md:hidden text-purple-950 focus:outline-none p-2 rounded-xl hover:bg-brand-aqua/10 transition-colors flex-shrink-0 z-[120] relative" aria-label="Abrir menú">
        <svg id="menu-icon" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <svg id="close-icon" class="w-8 h-8 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    </button>
</nav>
`;

const footerHTML = `
<footer class="bg-purple-950 text-white py-20 px-8">
    <div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div class="col-span-1 md:col-span-2 space-y-6">
            <img src="img/1-removebg-preview.png" alt="Cintia Agostino Logo" class="h-24 w-auto brightness-0 invert opacity-100">
            <p class="text-purple-200/60 max-w-sm leading-relaxed">Acompañando procesos de autoconocimiento y transformación a través del Coaching Ontológico Profesional.</p>
        </div>
        <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-widest text-brand-aqua">Navegación</h4>
            <div class="flex flex-col space-y-2 text-sm text-purple-100/70">
                <a href="index.html" class="hover:text-brand-aqua transition">Inicio</a>
                <a href="sobre-mi.html" class="hover:text-brand-aqua transition">Sobre Mí</a>
                <a href="membresia.html" class="hover:text-brand-aqua transition">Membresía</a>
                <a href="admin.html" class="mt-4 text-[10px] opacity-50 hover:opacity-100 transition">Panel Administrativo</a>
            </div>
        </div>
        <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-widest text-brand-aqua">Contacto</h4>
            <div class="flex flex-col space-y-2 text-sm text-purple-100/70">
                <a href="https://wa.me/541165248554" target="_blank" class="hover:text-brand-aqua transition">WhatsApp</a>
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
        header.className = "w-full fixed top-0 left-0 z-[100] backdrop-blur-md bg-white/80 transition-all duration-500 border-b border-purple-50";
        
        // Crear el menú mobile FUERA del header, directamente en el body
        // Usando SOLO estilos inline para garantizar fondo sólido
        const mobileMenuDiv = document.createElement('div');
        mobileMenuDiv.id = 'mobile-menu';
        mobileMenuDiv.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            z-index: 9999;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding-top: 8rem;
            gap: 3rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a0a2e;
        `;
        
        const menuLinks = [
            { href: 'index.html', text: 'Inicio' },
            { href: 'sobre-mi.html', text: 'Sobre Mí' },
            { href: 'membresia.html', text: 'Membresía' },
        ];
        
        menuLinks.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            a.style.cssText = 'text-decoration: none; color: #1a0a2e; transition: color 0.3s;';
            a.addEventListener('mouseenter', () => a.style.color = '#2ebfac');
            a.addEventListener('mouseleave', () => a.style.color = '#1a0a2e');
            mobileMenuDiv.appendChild(a);
        });
        
        // Botón CTA
        const ctaLink = document.createElement('a');
        ctaLink.href = 'index.html#sesiones';
        ctaLink.textContent = 'Sesiones 1:1';
        ctaLink.style.cssText = `
            background-color: #2ebfac;
            color: white;
            padding: 1.25rem 2.5rem;
            border-radius: 9999px;
            text-decoration: none;
            box-shadow: 0 10px 25px rgba(46, 191, 172, 0.3);
            font-weight: 700;
        `;
        mobileMenuDiv.appendChild(ctaLink);
        
        document.body.appendChild(mobileMenuDiv);
        
        // Lógica de toggle
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        const iconMenu = document.getElementById('menu-icon');
        const iconClose = document.getElementById('close-icon');
        
        if(btn && menu) {
            btn.addEventListener('click', () => {
                const isHidden = menu.style.display === 'none' || menu.style.display === '';
                if(isHidden) {
                    menu.style.display = 'flex';
                    iconMenu.classList.add('hidden');
                    iconClose.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                } else {
                    menu.style.display = 'none';
                    iconMenu.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
            
            // Cerrar menú al hacer clic en un link
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.style.display = 'none';
                    iconMenu.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                    document.body.style.overflow = '';
                });
            });
        }
    }
    
    if (footer) footer.innerHTML = footerHTML;
});
