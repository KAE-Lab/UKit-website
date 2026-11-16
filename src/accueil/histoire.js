/**
 * La frise de l'histoire, a l'echelle vraie : une graduation par an, de 2012 a 2027. L'annee 2026,
 * ou tout se resserre, a son detail agrandi en dessous, comme un detail sur un plan, avec son facteur
 * d'echelle reel. « Aujourd'hui » est la date du visiteur. L'axe se trace au rythme du defilement.
 * Les dates viennent de docs/histoire.md de l'application ; les deux premieres ne sont sures qu'au plus
 * tard (archives du web) et s'affichent a l'annee.
 */

/** Un nombre a la francaise, l'espace fine (que Geist n'a pas) remplacee par une insecable. */
function nombre(valeur) {
    return new Intl.NumberFormat('fr-FR').format(valeur).replace(/\u202f/g, '\u00a0')
}

const EVENEMENTS = [
    { date: '2012-09-12', affichee: '2012', texte: '«\u00a0Emplois du temps de Bordeaux\u00a0I\u00a0», le site d’un étudiant' },
    { date: '2015-05-22', affichee: '2015', texte: 'l’application Android, sur la fiche du Play Store que UKit occupe encore' },
    { date: '2017-07-03', texte: 'le code d’aujourd’hui ; il prend le nom de UKit le 17 septembre' },
    { date: '2018-09-01', texte: 'UKit Bordeaux sur l’App Store' },
    { date: '2021-08-27', texte: 'la version 4' },
    { date: '2023-09-11', texte: 'le dernier commit de l’équipe d’origine' },
    { date: '2026-02-20', texte: 'KAE Lab reprend le relais' },
    { date: '2026-02-23', texte: 'la version 5 : les restos U et les bibliothèques' },
    { date: '2026-08-31', texte: 'la version 6 : le comportement de l’app devient de la donnée' },
    { date: '2026-09-24', texte: 'Disrupt Campus, et l’Épure' },
]

const DEBUT = Date.UTC(2012, 0, 1)
const FIN = Date.UTC(2027, 0, 1)
const DETAIL_DEBUT = Date.UTC(2026, 0, 1)
const DETAIL_FIN = Date.UTC(2027, 0, 1)
const SVG = 'http://www.w3.org/2000/svg'
const ORDINATEUR = window.matchMedia('(min-width: 1024px)')

const temps = (iso) => Date.parse(`${iso}T12:00:00Z`)
const dateCourte = (t) => {
    const d = new Date(t)
    const deux = (n) => String(n).padStart(2, '0')
    return `${deux(d.getUTCDate())}.${deux(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`
}

function trait(parent, attributs, classe = 'trace') {
    const element = document.createElementNS(SVG, attributs.d ? 'path' : 'line')
    Object.entries(attributs).forEach(([cle, valeur]) => element.setAttribute(cle, valeur))
    element.setAttribute('class', classe)
    parent.append(element)
    return element
}

function etiquette(parent, x, y, classe, html) {
    const element = document.createElement('span')
    element.className = classe
    element.style.left = `${x}px`
    element.style.top = `${y}px`
    element.innerHTML = html
    parent.append(element)
    return element
}

/** Des positions sur un axe vertical, ecartees d'au moins `ecart` sans remonter. */
function etager(ys, ecart) {
    const sorties = []
    ys.forEach((y, i) => { sorties[i] = i === 0 ? y : Math.max(y, sorties[i - 1] + ecart) })
    return sorties
}

/** Telephone : l'axe devient vertical, une annee pour 40 px, et le detail de 2026 le suit dessous. */
function dessinerVertical(frise) {
    frise.replaceChildren()
    const largeur = frise.getBoundingClientRect().width
    const maintenant = Date.now()
    const an = 40
    const facteur = 15
    const xAxe = 6
    const xTexte = 64
    const y = (t) => ((t - DEBUT) / (365.25 * 864e5)) * an
    const hautDetail = y(FIN) + 150
    const yd = (t) => hautDetail + ((t - DETAIL_DEBUT) / (365.25 * 864e5)) * an * facteur
    const hauteur = yd(DETAIL_FIN) + 40
    frise.style.height = `${hauteur}px`
    const svg = document.createElementNS(SVG, 'svg')
    svg.setAttribute('viewBox', `0 0 ${largeur} ${hauteur}`)
    svg.setAttribute('height', String(hauteur))
    svg.setAttribute('aria-hidden', 'true')
    frise.append(svg)

    const axe = trait(svg, { x1: xAxe, y1: y(DEBUT), x2: xAxe, y2: y(Math.min(maintenant, FIN)) }, 'axe')
    for (let annee = 2012; annee <= 2027; annee += 1) {
        const t = Date.UTC(annee, 0, 1)
        trait(svg, { x1: xAxe, y1: y(t), x2: xAxe + 8, y2: y(t) })
        if (annee % 3 === 0) etiquette(frise, xAxe + 14, y(t) - 7, 'm graduation-texte graduation-v decor', String(annee))
    }
    trait(svg, { d: `M${xAxe - 6} ${y(DETAIL_DEBUT)} H${xAxe + 10} V${y(DETAIL_FIN)} H${xAxe - 6} Z`, 'stroke-dasharray': '3 5' })
    trait(svg, { x1: xAxe, y1: y(DETAIL_FIN), x2: xAxe, y2: hautDetail - 10, 'stroke-dasharray': '3 5' })
    etiquette(frise, xTexte, hautDetail - 64, 'm detail-titre', `<b>détail A</b> · 2026 · échelle ×${facteur}`)
    const axeDetail = trait(svg, { x1: xAxe, y1: yd(DETAIL_DEBUT), x2: xAxe, y2: yd(Math.min(maintenant, DETAIL_FIN)) }, 'axe')
    for (let m = 0; m <= 12; m += 1) {
        trait(svg, { x1: xAxe, y1: yd(Date.UTC(2026, m, 1)), x2: xAxe + 6, y2: yd(Date.UTC(2026, m, 1)) })
    }

    const elements = []
    const poser = (liste, position, debutPart, finPart, debut, fin) => {
        const ancres = liste.map((e) => position(temps(e.date)))
        etager(ancres, 74).forEach((yl, i) => {
            const e = liste[i]
            trait(svg, { d: `M${xAxe} ${ancres[i]} H${xAxe + 26} L${xTexte - 8} ${yl + 8}` })
            const el = etiquette(frise, xTexte, yl, 'evenement evenement-v',
                `<span class="m date">${e.affichee ?? dateCourte(temps(e.date))}</span><span class="quoi">${e.texte}</span>`)
            el.style.maxWidth = `${largeur - xTexte}px`
            elements.push({ el, part: debutPart + ((temps(e.date) - debut) / (fin - debut)) * (finPart - debutPart) })
        })
    }
    poser(EVENEMENTS.filter((e) => temps(e.date) < DETAIL_DEBUT), y, 0, 0.6, DEBUT, FIN)
    poser(EVENEMENTS.filter((e) => temps(e.date) >= DETAIL_DEBUT), yd, 0.6, 1, DETAIL_DEBUT, DETAIL_FIN)
    if (maintenant >= DETAIL_DEBUT && maintenant < DETAIL_FIN) {
        trait(svg, { x1: xAxe - 10, y1: yd(maintenant), x2: xAxe + 10, y2: yd(maintenant) }, 'axe')
        etiquette(frise, xTexte, yd(maintenant) - 8, 'm aujourdhui', `<b>aujourd’hui</b> · ${dateCourte(maintenant)}`)
    }
    return { axe, axeDetail, elements }
}

function dessiner(frise) {
    if (!ORDINATEUR.matches) return dessinerVertical(frise)
    frise.replaceChildren()
    const largeur = frise.getBoundingClientRect().width
    const maintenant = Date.now()
    const yAxe = 120
    const yDetail = 390
    const hauteur = 500
    const x = (t) => ((t - DEBUT) / (FIN - DEBUT)) * largeur
    const xd = (t) => ((t - DETAIL_DEBUT) / (DETAIL_FIN - DETAIL_DEBUT)) * largeur
    const facteur = (FIN - DEBUT) / (DETAIL_FIN - DETAIL_DEBUT)

    frise.style.height = `${hauteur}px`
    const svg = document.createElementNS(SVG, 'svg')
    svg.setAttribute('viewBox', `0 0 ${largeur} ${hauteur}`)
    svg.setAttribute('height', String(hauteur))
    svg.setAttribute('aria-hidden', 'true')
    frise.append(svg)

    // L'axe principal et ses graduations, une par an.
    const axe = trait(svg, { x1: 0, y1: yAxe, x2: x(Math.min(maintenant, FIN)), y2: yAxe }, 'axe')
    for (let annee = 2012; annee <= 2027; annee += 1) {
        const t = Date.UTC(annee, 0, 1)
        trait(svg, { x1: x(t), y1: yAxe, x2: x(t), y2: yAxe + 8 })
        etiquette(frise, x(t), yAxe + 14, 'm graduation-texte decor', String(annee))
    }

    // Le detail A : 2026 encadre sur l'axe, agrandi dessous a sa vraie echelle, relie par la construction.
    const g = x(DETAIL_DEBUT)
    // Comme sur un plan : un repere « A » sur la vue d'ensemble, et la vue de detail qui porte son titre.
    trait(svg, { d: `M${g} ${yAxe - 12} H${largeur} V${yAxe + 12} H${g} Z`, 'stroke-dasharray': '3 5' })
    const repere = etiquette(frise, largeur, yAxe - 38, 'm detail-titre', '<b>A</b>')
    repere.style.transform = 'translateX(-100%)'
    etiquette(frise, 0, yDetail - 128, 'm detail-titre', `<b>détail A</b> · 2026 · échelle ×${nombre(facteur)}`)
    const axeDetail = trait(svg, { x1: 0, y1: yDetail, x2: xd(Math.min(maintenant, DETAIL_FIN)), y2: yDetail }, 'axe')
    const mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
    for (let m = 0; m <= 12; m += 1) {
        const t = Date.UTC(2026, m, 1)
        trait(svg, { x1: xd(t), y1: yDetail, x2: xd(t), y2: yDetail + 6 })
        if (m < 12) etiquette(frise, (xd(t) + xd(Date.UTC(2026, m + 1, 1))) / 2, yDetail + 12, 'm graduation-texte decor', mois[m])
    }

    // Les evenements, en alternance au-dessus et au-dessous de leur axe : une ligne de rappel verticale,
    // un noeud sur l'axe, l'etiquette contre la ligne.
    const elements = []
    const poser = (liste, position, yA, debutPart, finPart, debut, fin) => {
        liste.forEach((e, i) => {
            const t = temps(e.date)
            const xa = position(t)
            const dessus = i % 2 === 0
            const yHaut = dessus ? yA - 92 : yA + 44
            trait(svg, { x1: xa, y1: yA, x2: xa, y2: dessus ? yHaut : yHaut + 66 })
            const noeud = document.createElementNS(SVG, 'circle')
            noeud.setAttribute('cx', xa)
            noeud.setAttribute('cy', yA)
            noeud.setAttribute('r', '3.5')
            noeud.setAttribute('class', 'noeud')
            svg.append(noeud)
            const el = etiquette(frise, xa + 10, yHaut, 'evenement',
                `<span class="m date">${e.affichee ?? dateCourte(t)}</span><span class="quoi">${e.texte}</span>`)
            el.style.maxWidth = `${Math.min(250, largeur * 0.17)}px`
            elements.push({ el, part: debutPart + ((t - debut) / (fin - debut)) * (finPart - debutPart) })
        })
    }
    poser(EVENEMENTS.filter((e) => temps(e.date) < DETAIL_DEBUT), x, yAxe, 0, 0.62, DEBUT, FIN)
    poser(EVENEMENTS.filter((e) => temps(e.date) >= DETAIL_DEBUT), xd, yDetail, 0.66, 1, DETAIL_DEBUT, DETAIL_FIN)

    // Aujourd'hui : la date du visiteur, sur les deux axes.
    if (maintenant >= DEBUT && maintenant < FIN) {
        trait(svg, { x1: x(maintenant), y1: yAxe - 8, x2: x(maintenant), y2: yAxe + 8 }, 'axe')
    }
    if (maintenant >= DETAIL_DEBUT && maintenant < DETAIL_FIN) {
        const xa = xd(maintenant)
        trait(svg, { x1: xa, y1: yDetail - 60, x2: xa, y2: yDetail + 10 }, 'axe')
        const el = etiquette(frise, xa + 10, yDetail - 60, 'm aujourdhui', `<b>aujourd’hui</b><br>${dateCourte(maintenant)}`)
        elements.push({ el, part: 0.98 })
    }

    return { axe, axeDetail, elements }
}

export function installerHistoire() {
    const frise = document.querySelector('[data-frise]')
    if (!frise) return
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dessin = dessiner(frise)

    // L'axe se trace avec le defilement. Sur ordinateur, la section est epinglee : la traversee de sa
    // hauteur trace la frise, complete aux quatre cinquiemes. Sur telephone, la montee de la frise.
    const section = frise.closest('.histoire')
    function suivre() {
        const vue = window.innerHeight
        let avance = 1
        if (!reduit && ORDINATEUR.matches && section) {
            const boite = section.getBoundingClientRect()
            avance = Math.min(1, Math.max(0, -boite.top / (Math.max(1, boite.height - vue) * 0.8)))
        } else if (!reduit) {
            const boite = frise.getBoundingClientRect()
            avance = Math.min(1, Math.max(0, (vue * 0.85 - boite.top) / (boite.height * 0.9)))
        }
        const principal = Math.min(1, avance / 0.62)
        const detail = Math.min(1, Math.max(0, (avance - 0.64) / 0.34))
        ;[[dessin.axe, principal], [dessin.axeDetail, detail]].forEach(([ligne, part]) => {
            const longueur = ligne.getTotalLength()
            ligne.style.strokeDasharray = `${longueur}`
            ligne.style.strokeDashoffset = `${longueur * (1 - part)}`
        })
        dessin.elements.forEach(({ el, part }) => el.classList.toggle('a-venir', avance < part))
    }

    let prevu = false
    window.addEventListener('scroll', () => {
        if (prevu) return
        prevu = true
        requestAnimationFrame(() => { prevu = false; suivre() })
    }, { passive: true })
    let attente = 0
    new ResizeObserver(() => {
        clearTimeout(attente)
        attente = setTimeout(() => { dessin = dessiner(frise); suivre() }, 150)
    }).observe(frise)
    suivre()
}
