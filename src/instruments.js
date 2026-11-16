/**
 * Les instruments du plan, sur toutes les pages : les mesures de la fenetre dans la tete, la regle
 * graduee de la marge droite et ses reperes de section, le sommaire qui suit la lecture, et le calque
 * des traces, qu'on eteint comme dans un logiciel de dessin. Chaque mesure affichee est vraie : elle
 * se relit sur la fenetre a chaque changement (docs/identite.md de l'application, regle 2).
 */

const CLE_CALQUE = 'ukit.calque-traces'

/** Un nombre a la francaise, l'espace fine (que Geist n'a pas) remplacee par une insecable. */
export function nombre(valeur, decimales = 0) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
    }).format(valeur).replace(/\u202f/g, '\u00a0')
}

function calqueAllume() {
    try {
        return localStorage.getItem(CLE_CALQUE) !== 'eteint'
    } catch {
        return true
    }
}

function memoriserCalque(allume) {
    try {
        localStorage.setItem(CLE_CALQUE, allume ? 'allume' : 'eteint')
    } catch {
        // Stockage indisponible (navigation privee) : le reglage vaut pour la visite.
    }
}

function installerCalque() {
    const bouton = document.querySelector('[data-calque]')
    const appliquer = (allume) => {
        document.documentElement.classList.toggle('sans-traces', !allume)
        if (!bouton) return
        bouton.setAttribute('aria-pressed', String(allume))
        const valeur = bouton.querySelector('b')
        if (valeur) valeur.textContent = allume ? '65 %' : '0 %'
    }
    const basculer = () => {
        const allume = document.documentElement.classList.contains('sans-traces')
        appliquer(allume)
        memoriserCalque(allume)
    }
    appliquer(calqueAllume())
    if (bouton) bouton.addEventListener('click', basculer)
    document.addEventListener('keydown', (e) => {
        if (e.key !== 't' && e.key !== 'T') return
        if (e.ctrlKey || e.metaKey || e.altKey) return
        if (e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable]')) return
        basculer()
    })
}

function installerMesures() {
    const cible = document.querySelector('[data-mesure-ecran]')
    if (!cible) return
    let prevu = false
    const maj = () => {
        prevu = false
        cible.textContent = `${nombre(window.innerWidth)} × ${nombre(window.innerHeight)} · y ${nombre(window.scrollY)}`
    }
    const demander = () => {
        if (prevu) return
        prevu = true
        requestAnimationFrame(maj)
    }
    window.addEventListener('scroll', demander, { passive: true })
    window.addEventListener('resize', demander)
    maj()
}

function installerRegle() {
    const regle = document.querySelector('[data-regle]')
    if (!regle) return
    const dessiner = () => {
        if (getComputedStyle(regle).display === 'none') return
        const hauteur = regle.getBoundingClientRect().height
        const origine = regle.getBoundingClientRect().top + window.scrollY
        const morceaux = []
        for (let y = 500; y < hauteur - 24; y += 500) {
            const graduation = document.createElement('span')
            graduation.className = 'm graduation'
            graduation.style.top = `${y}px`
            graduation.textContent = nombre(y)
            morceaux.push(graduation)
        }
        document.querySelectorAll('[data-section]').forEach((section) => {
            const repere = document.createElement('span')
            repere.className = 'm repere'
            repere.style.top = `${section.getBoundingClientRect().top + window.scrollY - origine}px`
            repere.textContent = section.dataset.section.split(' ')[0]
            morceaux.push(repere)
        })
        regle.replaceChildren(...morceaux)
    }
    let attente = 0
    const plusTard = () => {
        clearTimeout(attente)
        attente = setTimeout(dessiner, 150)
    }
    new ResizeObserver(plusTard).observe(document.body)
    window.addEventListener('load', dessiner)
    dessiner()
}

/** Le sommaire de la tete marque la section lue. */
function installerSommaire() {
    const liens = [...document.querySelectorAll('.sommaire a[href^="#"]')]
    if (liens.length === 0) return
    const parCible = new Map(liens.map((lien) => [lien.getAttribute('href').slice(1), lien]))
    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            const lien = parCible.get(entree.target.id)
            if (lien) lien.setAttribute('aria-current', String(entree.isIntersecting))
        })
    }, { rootMargin: '-40% 0px -55% 0px' })
    parCible.forEach((_, id) => {
        const section = document.getElementById(id)
        if (section) observateur.observe(section)
    })
}

export function installerInstruments() {
    installerCalque()
    installerMesures()
    installerRegle()
    installerSommaire()
}
