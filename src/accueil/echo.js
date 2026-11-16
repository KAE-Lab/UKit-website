/**
 * Fig. 01, le U du logo en echo, sur son plateau : le defilement ajoute une copie a chaque pas, jusqu'a
 * quarante, et le pointeur regle le decalage de l'une a l'autre. Les aretes prolongees, l'angle et la
 * fiche de mesures disent la valeur reelle a chaque image. Au repos, l'echo revient a sa mesure de
 * reference, celle des slides : (5 ; 3,2), soit 32,6°.
 */

import { nombre } from '../instruments.js'

const COPIES = 40
const REPOS = { dx: 5, dy: 3.2 }
const BLEU = [0x00, 0x7a, 0xff]
const INDIGO = [0x5e, 0x5c, 0xe6]
// Deux coins de la face avant du U, dans le repere du dessin : le bec de l'empattement, et le haut du
// fut droit. Les aretes de l'echo passent par eux.
const COINS = [{ x: 1.84, y: 29.35 }, { x: 280.15, y: 1.68 }]
const BOITE = { x: -4, y: -4, l: 550, h: 603 }
const SVG = 'http://www.w3.org/2000/svg'

const mouvementReduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function melange(a, b, t) {
    const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
    return `rgb(${c.join(',')})`
}

/** Le segment de la droite (p, direction) contenu dans la boite de la figure. */
function droiteDansBoite(p, ux, uy) {
    const bornes = []
    if (ux !== 0) bornes.push((BOITE.x - p.x) / ux, (BOITE.x + BOITE.l - p.x) / ux)
    if (uy !== 0) bornes.push((BOITE.y - p.y) / uy, (BOITE.y + BOITE.h - p.y) / uy)
    const negatifs = bornes.filter((t) => t <= 0)
    const positifs = bornes.filter((t) => t >= 0)
    const t0 = Math.max(...negatifs)
    const t1 = Math.min(...positifs)
    return [p.x + ux * t0, p.y + uy * t0, p.x + ux * t1, p.y + uy * t1]
}

export function installerEcho() {
    const figure = document.querySelector('[data-echo]')
    const groupe = figure?.querySelector('[data-copies]')
    const verre = document.querySelector('[data-verre]')
    if (!figure || !groupe || !verre) return

    // Le U est le premier sous-chemin du logo : la figure vient du logo, elle ne le recopie pas.
    const u = verre.getAttribute('d').split('Z')[0] + 'Z'
    const copies = []
    for (let i = COPIES - 1; i >= 0; i -= 1) {
        const t = i / (COPIES - 1)
        const copie = document.createElementNS(SVG, 'path')
        copie.setAttribute('d', u)
        copie.setAttribute('fill', 'none')
        copie.setAttribute('stroke', melange(BLEU, INDIGO, t))
        copie.setAttribute('stroke-opacity', (1 - 0.9 * t).toFixed(3))
        copie.setAttribute('stroke-width', '1.2')
        copie.setAttribute('vector-effect', 'non-scaling-stroke')
        groupe.append(copie)
        copies[i] = copie
    }

    const aretes = [...figure.querySelectorAll('[data-arete]')]
    const horizontale = figure.querySelector('[data-horizontale]')
    const arc = figure.querySelector('[data-arc]')
    const noeud = figure.querySelector('[data-noeud]')
    const angleTexte = figure.querySelector('[data-angle-texte]')
    const scene = figure.closest('[data-echo-scene]') ?? figure
    const lectureCopies = scene.querySelector('[data-echo-copies]')
    const lectureDecalage = scene.querySelector('[data-echo-decalage]')
    const lectureAngle = scene.querySelector('[data-echo-angle]')

    const etat = { dx: REPOS.dx, dy: REPOS.dy, visibles: COPIES }
    const cible = { ...REPOS }
    const reduit = mouvementReduit()
    const ordinateur = window.matchMedia('(min-width: 1024px)')
    // L'extrusion suit le defilement : sur ordinateur, la traversee du plateau epingle (complete aux
    // trois quarts) ; sur telephone, la montee de la figure dans l'ecran.
    function extrusion() {
        if (reduit) return 1
        const vue = window.innerHeight
        if (ordinateur.matches) {
            const boite = scene.getBoundingClientRect()
            const parcours = Math.max(1, boite.height - vue)
            return Math.min(1, Math.max(0, -boite.top / (parcours * 0.75)))
        }
        const boite = figure.getBoundingClientRect()
        return Math.min(1, Math.max(0, (vue * 0.95 - boite.top) / (vue * 0.6)))
    }

    function dessiner() {
        copies.forEach((copie, i) => {
            copie.setAttribute('transform', `translate(${1.5 + i * etat.dx} ${1.5 + i * etat.dy})`)
            copie.style.display = i < etat.visibles ? '' : 'none'
        })
        const longueur = Math.hypot(etat.dx, etat.dy)
        const ux = etat.dx / longueur
        const uy = etat.dy / longueur
        aretes.forEach((ligne, k) => {
            const [x1, y1, x2, y2] = droiteDansBoite(COINS[k], ux, uy)
            ligne.setAttribute('x1', x1)
            ligne.setAttribute('y1', y1)
            ligne.setAttribute('x2', x2)
            ligne.setAttribute('y2', y2)
        })
        const a = COINS[0]
        const angle = Math.atan2(etat.dy, etat.dx)
        horizontale.setAttribute('x1', a.x - 70)
        horizontale.setAttribute('y1', a.y)
        horizontale.setAttribute('x2', a.x)
        horizontale.setAttribute('y2', a.y)
        // L'angle se mesure du cote du fond : entre l'horizontale et l'arete qui remonte vers la gauche.
        const r = 46
        arc.setAttribute('d', `M${a.x - r} ${a.y} A${r} ${r} 0 0 1 ${a.x - r * Math.cos(angle)} ${a.y - r * Math.sin(angle)}`)
        noeud.setAttribute('cx', a.x)
        noeud.setAttribute('cy', a.y)
        if (angleTexte) {
            const milieu = angle / 2
            angleTexte.setAttribute('x', a.x - (r + 52) * Math.cos(milieu))
            angleTexte.setAttribute('y', a.y - (r + 6) * Math.sin(milieu) - 4)
            angleTexte.textContent = `${nombre((angle * 180) / Math.PI, 1)}°`
        }
        if (lectureCopies) lectureCopies.textContent = String(etat.visibles)
        if (lectureDecalage) lectureDecalage.textContent = `(${nombre(etat.dx, 1)} ; ${nombre(etat.dy, 1)})`
        if (lectureAngle) lectureAngle.textContent = `${nombre((angle * 180) / Math.PI, 1)}°`
    }

    let enCours = false
    function boucle() {
        const avant = etat.visibles
        etat.visibles = Math.max(1, Math.round(extrusion() * COPIES))
        const pas = reduit ? 1 : 0.14
        etat.dx += (cible.dx - etat.dx) * pas
        etat.dy += (cible.dy - etat.dy) * pas
        const proche = Math.abs(cible.dx - etat.dx) < 0.005 && Math.abs(cible.dy - etat.dy) < 0.005
        if (proche) {
            etat.dx = cible.dx
            etat.dy = cible.dy
        }
        dessiner()
        if (!proche || avant !== etat.visibles) {
            requestAnimationFrame(boucle)
        } else {
            enCours = false
        }
    }
    function relancer() {
        if (enCours) return
        enCours = true
        requestAnimationFrame(boucle)
    }

    /** Le pointeur dans l'ouverture regle l'angle (de gauche a droite) et le pas (de bas en haut). */
    function viser(x, y, zone) {
        const px = Math.min(1, Math.max(0, (x - zone.left) / zone.width))
        const py = Math.min(1, Math.max(0, (y - zone.top) / zone.height))
        const angle = ((10 + px * 64) * Math.PI) / 180
        const pas = 7 - py * 3.4
        cible.dx = pas * Math.cos(angle)
        cible.dy = pas * Math.sin(angle)
        relancer()
    }

    const plateau = scene.querySelector('.fig-plateau') ?? figure
    const survol = window.matchMedia('(hover: hover) and (pointer: fine)')
    plateau.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'mouse' && survol.matches) viser(e.clientX, e.clientY, plateau.getBoundingClientRect())
    })
    plateau.addEventListener('pointerleave', () => {
        Object.assign(cible, REPOS)
        relancer()
    })
    // Au doigt : on fait glisser sur la figure, et l'echo revient au repos quand on la lache.
    const svg = figure.querySelector('svg')
    svg.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse' && e.pressure > 0) viser(e.clientX, e.clientY, svg.getBoundingClientRect())
    })
    svg.addEventListener('pointerup', () => {
        Object.assign(cible, REPOS)
        relancer()
    })

    window.addEventListener('scroll', relancer, { passive: true })
    etat.visibles = Math.max(1, Math.round(extrusion() * COPIES))
    dessiner()
    relancer()
}

