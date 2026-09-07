/**
 * Le fond commun a toutes les pages : la feuille de style, et les particules qui flottent derriere
 * le contenu. Une page secondaire (telechargement, engagement) n'importe que ce module ; l'accueil
 * l'importe puis ajoute ses onglets, ses modales et son echelle (main.js).
 */

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
                    value: 80,
                    max: 80
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
