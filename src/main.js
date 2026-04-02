import './style.css'
import { tsParticles } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"

/* ══════════════════════════════════════════════════════════════════
   PARTICLES – fond animé (tsParticles)
   Petits carrés arrondis bleu/violet qui flottent et se connectent.
   Utilise des SVG purs pour contourner les bugs de rendu Canvas.
══════════════════════════════════════════════════════════════════ */

const svgBlue = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect x="0" y="0" width="100" height="100" rx="25" ry="25" fill="#007AFF" />
    </svg>
`);

const svgPurple = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect x="0" y="0" width="100" height="100" rx="25" ry="25" fill="#5E5CE6" />
    </svg>
`);

async function initGraph() {
    await loadSlim(tsParticles)

    await tsParticles.load({
        id: "tsparticles",
        options: {
            background: {
                color: { value: "transparent" }
            },
            fpsLimit: 60,
            interactivity: {
                detectsOn: "window",
                events: {
                    // Spawn + onde de choc au clic
                    onClick: { enable: true, mode: ["push", "repulse"] },
                    // Lignes de connexion + répulsion douce au survol
                    onHover: { enable: true, mode: ["grab", "repulse"] }
                },
                modes: {
                    push: { quantity: 3 },
                    grab: { distance: 150, links: { opacity: 0.4 } },
                    // distance : bulle de protection autour de la souris
                    // factor/duration : violence de l'onde de choc au clic
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                        factor: 2,
                        speed: 1
                    }
                }
            },
            particles: {
                color: {
                    value: ["#007AFF", "#5E5CE6"]
                },
                links: {
                    color: "#5E5CE6",
                    distance: 120,
                    enable: true,
                    opacity: 0.3,
                    width: 1,
                    triangles: { enable: false }
                },
                move: {
                    enable: true,
                    speed: 1.2,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: { default: "out" }
                },
                number: {
                    density: { enable: true, width: 1000 },
                    value: 80
                },
                opacity: {
                    value: { min: 0.6, max: 0.9 }
                },
                shape: {
                    type: "image",
                    options: {
                        // tsParticles alterne automatiquement entre bleu et violet
                        image: [
                            { src: svgBlue, width: 100, height: 100 },
                            { src: svgPurple, width: 100, height: 100 }
                        ]
                    }
                },
                size: { value: { min: 2, max: 5 } }
            },
            detectRetina: true
        }
    })
}

initGraph()

/* ══════════════════════════════════════════════════════════════════
   MODALES
   – info-modal  : à propos (mobile uniquement)
   – qr-modal    : QR code de téléchargement (desktop)
   Le scroll est verrouillé sur #scroll-wrapper pendant qu'une modale
   est ouverte, et restauré uniquement quand les deux sont fermées.
══════════════════════════════════════════════════════════════════ */

const ANDROID_URL = 'https://github.com/Illumye/UKit/releases/latest/download/ukit-release.apk'
const IOS_URL = 'https://apps.apple.com/app/ukit/id0000000000'

function openInfoModal() {
    document.getElementById('info-modal').classList.remove('hidden')
    const sw = document.getElementById('scroll-wrapper');
    if (sw) sw.style.overflow = 'hidden'
}

function closeInfoModal() {
    document.getElementById('info-modal').classList.add('hidden')
    // Restaure l'overflow uniquement si la modale QR est aussi fermée
    if (document.getElementById('qr-modal').classList.contains('hidden')) {
        const sw = document.getElementById('scroll-wrapper');
        if (sw) sw.style.overflow = ''
    }
}

function handleDownload() {
    const ua = navigator.userAgent.toLowerCase()
    if (/android/.test(ua)) {
        window.location.href = ANDROID_URL
    } else if (/iphone|ipad|ipod/.test(ua)) {
        window.location.href = IOS_URL
    } else {
        document.getElementById('qr-modal').classList.remove('hidden')
        const sw = document.getElementById('scroll-wrapper');
        if (sw) sw.style.overflow = 'hidden'
    }
}

function closeQrModal() {
    document.getElementById('qr-modal').classList.add('hidden')
    const sw = document.getElementById('scroll-wrapper');
    if (sw) sw.style.overflow = ''
}

function scrollToTop() {
    const sw = document.getElementById('scroll-wrapper');
    if (sw) sw.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fermeture des modales à l'appui sur Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeQrModal()
        closeInfoModal()
    }
})

// Exposition globale des fonctions appelées depuis le HTML via onclick=""
window.openInfoModal  = openInfoModal
window.closeInfoModal = closeInfoModal
window.handleDownload = handleDownload
window.closeQrModal   = closeQrModal
window.scrollToTop    = scrollToTop

/* ══════════════════════════════════════════════════════════════════
   ONGLETS DE FEATURES
   switchTab(name) : affiche la vidéo associée à l'onglet en fondu
   et met à jour l'état visuel actif/inactif des boutons.
══════════════════════════════════════════════════════════════════ */

function switchTab(name) {
    document.querySelectorAll('.video-panel').forEach(panel => {
        if (panel.id !== 'video-' + name && panel.classList.contains('opacity-100')) {
            // Fondu vers la transparence
            panel.classList.remove('opacity-100', 'z-10')
            panel.classList.add('opacity-0', 'z-0')

            const video = panel.querySelector('video')
            // On attend la fin de la transition (300 ms) pour couper et réinitialiser
            // la vidéo, afin d'éviter un saut visible au début lors de la disparition
            setTimeout(() => {
                video.pause()
                video.currentTime = 0
            }, 300)
        }
    })

    document.querySelectorAll('.tab-btn').forEach(btn => {
        // Retrait des classes de l'onglet actif
        btn.classList.remove('active-tab', 'bg-white/20', 'backdrop-blur-sm')
        btn.classList.add('bg-white/10', 'backdrop-blur-xs', 'hover:-translate-y-1')
        btn.querySelector('span').classList.add('text-slate-500')
        btn.querySelector('span').classList.remove('text-slate-900')
    })

    // Affichage de la nouvelle vidéo en fondu
    const panel = document.getElementById('video-' + name)
    panel.classList.remove('opacity-0', 'z-0')
    panel.classList.add('opacity-100', 'z-10')

    const activeVideo = panel.querySelector('video')
    activeVideo.currentTime = 0
    activeVideo.play()

    const tab = document.getElementById('tab-' + name)
    // L'onglet actif ne grossit plus au survol, il est déjà en avant
    tab.classList.add('active-tab', 'bg-white/20', 'backdrop-blur-sm')
    tab.classList.remove('bg-white/10', 'backdrop-blur-xs', 'hover:-translate-y-1')
    tab.querySelector('span').classList.replace('text-slate-500', 'text-slate-900')
}

window.switchTab = switchTab

/* ── Initialisation de l'état par défaut des onglets ────────────── */
// Nettoyage des classes par défaut ajoutées en HTML statique
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.add('bg-white/10', 'backdrop-blur-xs', 'hover:-translate-y-1', 'text-slate-500', 'border-transparent')
    btn.classList.remove('bg-white', 'border-slate-200', 'bg-white/20', 'backdrop-blur-sm', 'hover:bg-white/20')
    btn.querySelector('span').classList.add('text-slate-500')
})

const activeTab = document.getElementById('tab-navigation')
activeTab.classList.add('active-tab', 'bg-white/20', 'backdrop-blur-sm')
activeTab.classList.remove('bg-white/10', 'backdrop-blur-xs', 'hover:-translate-y-1', 'border-transparent')
activeTab.querySelector('span').classList.replace('text-slate-500', 'text-slate-900')

/* ══════════════════════════════════════════════════════════════════
   INTERSECTION OBSERVERS
   1. scrollObserver   : déclenche l'animation .reveal quand un
      élément entre dans le viewport (et la retire à la sortie).
   2. transitionObserver : bascule entre l'écran hero et la grille
      de features en observant l'ancre .snap-point.
══════════════════════════════════════════════════════════════════ */

const scrollWrapper = document.getElementById('scroll-wrapper');

// 1. Révélation au scroll
const observerOptions = {
    root: scrollWrapper,
    rootMargin: '0px',
    threshold: 0.15 // Déclenché quand 15 % de l'élément est visible
}

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
        } else {
            // Retrait de la classe pour que l'animation se rejoue au prochain passage
            entry.target.classList.remove('is-visible')
        }
    })
}, observerOptions)

document.querySelectorAll('.reveal').forEach(el => {
    scrollObserver.observe(el)
})

// 2. Bascule hero ↔ features
const transitionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Vrai quand on a dépassé l'ancre en scrollant vers le bas
        const isPastTrigger = !entry.isIntersecting && entry.boundingClientRect.top < 0;

        const heroText      = document.getElementById('hero-text');
        const featuresGrid  = document.getElementById('features-grid');
        const heroScreen    = document.getElementById('hero-screen');
        const featuresScreen = document.getElementById('features-screen');

        if (isPastTrigger) {
            heroText.style.opacity = '0';
            heroText.style.pointerEvents = 'none';
            heroScreen.style.opacity = '0';

            featuresGrid.style.opacity = '1';
            featuresGrid.style.pointerEvents = 'auto';
            featuresScreen.style.opacity = '1';

            // On ne relance switchTab que lors de l'entrée dans la section
            if (featuresScreen.getAttribute('data-active') !== 'true') {
                featuresScreen.setAttribute('data-active', 'true');
                switchTab('navigation');
            }
        } else {
            heroText.style.opacity = '1';
            heroText.style.pointerEvents = 'auto';
            heroScreen.style.opacity = '1';

            featuresGrid.style.opacity = '0';
            featuresGrid.style.pointerEvents = 'none';
            featuresScreen.style.opacity = '0';
            featuresScreen.setAttribute('data-active', 'false');

            // Réinitialisation des vidéos pour la prochaine visite
            document.querySelectorAll('.video-panel video').forEach(v => {
                v.pause();
                v.currentTime = 0;
            });
        }
    });
}, { root: scrollWrapper, threshold: 0 });

// Observation de l'ancre invisible pour déclencher la bascule
transitionObserver.observe(document.querySelector('.snap-point'));

/* ══════════════════════════════════════════════════════════════════
   MOBILE TOUCH HANDLER
   Sur certains mobiles, le scroll-snap CSS ne fonctionne pas
   correctement (le contenu apparaît puis revient). On détecte le
   swipe et on scrolle programmatiquement vers la bonne position.
══════════════════════════════════════════════════════════════════ */
(function () {
    // Actif uniquement sur mobile (écrans tactiles)
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile) return;

    let touchStartY = 0;
    let touchStartTime = 0;
    const scrollEl = document.getElementById('scroll-wrapper') || document.body;
    const SWIPE_THRESHOLD = 30; // pixels minimum pour considérer un swipe

    scrollEl.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    scrollEl.addEventListener('touchend', function (e) {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY; // positif = swipe vers le haut (scroll down)
        const elapsed = Date.now() - touchStartTime;

        // On ignore les taps et les gestes trop lents (> 800 ms = probablement un drag précis)
        if (Math.abs(deltaY) < SWIPE_THRESHOLD || elapsed > 800) return;

        const scrollTop = scrollEl.scrollTop;
        const viewportHeight = window.innerHeight;

        if (deltaY > 0) {
            // Swipe vers le haut → on veut voir les features
            if (scrollTop < viewportHeight * 0.5) {
                scrollEl.scrollTo({ top: viewportHeight, behavior: 'smooth' });
            }
        } else {
            // Swipe vers le bas → retour au hero
            if (scrollTop > 0) {
                scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, { passive: true });
})();