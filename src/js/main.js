/*=============== MOSTRAR MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close'),
    navLink = document.querySelectorAll('.nav__link');

/* Detectar navegación con teclado para estilos de foco */
function handleFirstTab(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');

        window.removeEventListener('keydown', handleFirstTab);
        window.addEventListener('mousedown', handleMouseDownOnce);
    }
}

function handleMouseDownOnce() {
    document.body.classList.remove('user-is-tabbing');

    window.removeEventListener('mousedown', handleMouseDownOnce);
    window.addEventListener('keydown', handleFirstTab);
}

// Inicializar listeners para detectar modo navegación
window.addEventListener('keydown', handleFirstTab);

/* Función auxiliar para activar click con teclado en divs */
function activateOnKeyboard(els, callback) {
    const elements = Array.isArray(els) ? els : [els];
    elements.forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                callback();
            }
        });
    });
}

/* Mostrar Menu */
if (navToggle) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic se propague al documento
        navMenu.classList.add('show-menu');
        navMenu.setAttribute('aria-hidden', 'false');
        navToggle.setAttribute('aria-expanded', 'true');
        if (navLink.length > 0) navLink[0].focus();
    });
    activateOnKeyboard(navToggle, () => navToggle.click());
}

/* Ocultar Menu */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        navMenu.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    });
    activateOnKeyboard(navClose, () => navClose.click());
}

/*=============== ELIMINAR MENU EN MÓVIL ===============*/
const linkAction = () => {
    navMenu.classList.remove('show-menu');
    navMenu.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/* Cerrar el menú al hacer clic fuera de él */
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && e.target !== navToggle && e.target !== navClose) {
        navMenu.classList.remove('show-menu');
        navMenu.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

/* Prevenir que se cierre el menú al hacer clic dentro del menú */
navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

/* Cerrar menú con la tecla Escape y quitar clase de foco de accesibilidad */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navMenu.classList.contains('show-menu')) {
            navMenu.classList.remove('show-menu');
            navMenu.setAttribute('aria-hidden', 'true');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
        // Quitar la clase que indica navegación con teclado
        document.body.classList.remove('user-is-tabbing');
    }
});

/*=============== CAMBIAR FONDO DEL HEADER ===============*/
const blurHeader = () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.classList.add('blur-header');
    } else {
        header.classList.remove('blur-header');
    }
};

window.addEventListener('scroll', blurHeader);