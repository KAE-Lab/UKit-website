/**
 * Le kit : cinq fiches, chacune avec sa capture et ses annotations. Les annotations sont des reperes
 * releves sur l'arbre d'ecran de l'application au moment de la capture (coordonnees en pixels de la
 * capture, 1080 x 2290) : elles pointent ce qui est vraiment a l'ecran.
 *
 * Sur ordinateur, une scene epinglee montre l'ecran de la fiche lue ; ses annotations se tracent a
 * gauche, en lignes de rappel coudees. Sur telephone, chaque fiche porte son ecran, des reperes
 * numerotes et leur liste.
 */

const LARGEUR = 1080
const HAUTEUR = 2290
const SVG = 'http://www.w3.org/2000/svg'
const ORDINATEUR = window.matchMedia('(min-width: 1024px)')

function notesDe(etape) {
    return [...etape.querySelectorAll('[data-notes] li')].map((li) => ({
        x: Number(li.dataset.x),
        y: Number(li.dataset.y),
        texte: li.textContent.trim(),
    }))
}

/** Telephone : des reperes numerotes poses sur la capture, en proportion. */
function poserReperes(etape) {
    const calque = etape.querySelector('[data-reperes]')
    if (!calque) return
    calque.replaceChildren(...notesDe(etape).map((note, i) => {
        const repere = document.createElement('span')
        repere.className = 'repere-ecran'
        repere.style.left = `${(note.x / LARGEUR) * 100}%`
        repere.style.top = `${(note.y / HAUTEUR) * 100}%`
        const numero = document.createElement('span')
        numero.textContent = String(i + 1)
        repere.append(numero)
        return repere
    }))
}

/**
 * Les etiquettes se rangent en colonne, a intervalles reguliers sur la hauteur de l'ecran, dans l'ordre
 * de leurs ancres : les lignes de rappel arrivent en biais sur l'element, sans barrer le texte qu'elles
 * longeraient a l'horizontale.
 */
function repartir(positions, haut, bas) {
    const ordre = positions.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y)
    const resultat = []
    const pas = ordre.length > 1 ? (bas - haut) / (ordre.length - 1) : 0
    ordre.forEach((o, k) => { resultat[o.i] = ordre.length > 1 ? haut + k * pas : o.y })
    return resultat
}

function installerScene(etapes) {
    const scene = document.querySelector('[data-scene]')
    const ecranScene = scene?.querySelector('[data-scene-ecran]')
    if (!scene || !ecranScene) return

    // L'ecran de la scene : toutes les captures empilees, une seule visible, et la figure vide.
    const ecran = document.createElement('div')
    ecran.className = 'ecran'
    const images = etapes.map((etape) => {
        if (!etape.dataset.image) return null
        const image = document.createElement('img')
        image.src = etape.dataset.image
        image.alt = ''
        image.width = 720
        image.height = 1527
        ecran.append(image)
        return image
    })
    const vide = document.querySelector('[data-vide]')?.cloneNode(true)
    ecranScene.append(ecran)
    if (vide) {
        vide.style.position = 'absolute'
        vide.style.inset = '0'
        vide.hidden = true
        ecranScene.append(vide)
    }

    const traits = document.createElementNS(SVG, 'svg')
    traits.classList.add('annotations')
    const etiquettes = document.createElement('div')
    etiquettes.className = 'annotations'
    scene.append(traits, etiquettes)

    const legende = scene.querySelector('[data-scene-legende]')
    const cote = scene.querySelector('[data-scene-cote]')
    let active = -1

    function annoter(index, animer) {
        const notes = notesDe(etapes[index])
        traits.replaceChildren()
        etiquettes.replaceChildren()
        if (notes.length === 0) return
        const boite = scene.getBoundingClientRect()
        const cadre = ecran.getBoundingClientRect()
        const echelle = cadre.width / LARGEUR
        const gauche = cadre.left - boite.left
        const hautEcran = cadre.top - boite.top
        const ancres = notes.map((n) => ({ x: gauche + n.x * echelle, y: hautEcran + n.y * echelle }))
        const ys = repartir(ancres.map((a) => a.y), hautEcran + cadre.height * 0.06, hautEcran + cadre.height * 0.94)
        const bord = gauche - 22
        const fin = gauche - 64
        notes.forEach((note, i) => {
            const a = ancres[i]
            const ligne = document.createElementNS(SVG, 'polyline')
            ligne.setAttribute('points', `${fin} ${ys[i]} ${bord} ${ys[i]} ${a.x} ${a.y}`)
            const noeud = document.createElementNS(SVG, 'circle')
            noeud.setAttribute('cx', a.x)
            noeud.setAttribute('cy', a.y)
            noeud.setAttribute('r', '4')
            traits.append(ligne, noeud)
            if (animer) {
                ligne.style.setProperty('--longueur', String(Math.ceil(ligne.getTotalLength())))
                ligne.classList.add('trace-en-cours')
                ligne.style.animationDelay = `${i * 70}ms`
            }
            const etiquette = document.createElement('span')
            etiquette.className = 'm annotation-etiquette'
            etiquette.style.left = `${fin - 10}px`
            etiquette.style.top = `${ys[i]}px`
            etiquette.textContent = note.texte
            if (animer) {
                etiquette.style.opacity = '0'
                setTimeout(() => { etiquette.style.opacity = '' }, 250 + i * 70)
            }
            etiquettes.append(etiquette)
        })
    }

    function activer(index) {
        if (index === active) return
        active = index
        const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        etapes.forEach((etape, i) => etape.classList.toggle('active', i === index))
        images.forEach((image, i) => image?.classList.toggle('active', i === index))
        const sansImage = !images[index]
        ecran.style.visibility = sansImage ? 'hidden' : ''
        if (vide) vide.hidden = !sansImage
        if (legende) {
            const [numero, nom] = etapes[index].dataset.legende.split(' · ')
            legende.innerHTML = `${numero} · <b>${nom}</b>`
        }
        if (cote) cote.textContent = sansImage ? 'figure non reproduite' : `${LARGEUR} × ${HAUTEUR} · android 15`
        annoter(index, !reduit)
    }

    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) activer(etapes.indexOf(entree.target))
        })
    }, { rootMargin: '-48% 0px -48% 0px' })
    etapes.forEach((etape) => observateur.observe(etape))

    let attente = 0
    new ResizeObserver(() => {
        clearTimeout(attente)
        attente = setTimeout(() => { if (active >= 0) annoter(active, false) }, 120)
    }).observe(scene)
    // La premiere capture peut arriver apres l'activation : on reannote quand elle a ses dimensions.
    images[0]?.addEventListener('load', () => { if (active >= 0) annoter(active, false) })
    activer(0)
}

export function installerKit() {
    const etapes = [...document.querySelectorAll('[data-etapes] > .etape')]
    if (etapes.length === 0) return
    etapes.forEach(poserReperes)
    let sceneInstallee = false
    const essayer = () => {
        if (sceneInstallee || !ORDINATEUR.matches) return
        sceneInstallee = true
        installerScene(etapes)
    }
    essayer()
    ORDINATEUR.addEventListener('change', essayer)
}
