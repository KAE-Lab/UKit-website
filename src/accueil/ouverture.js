/**
 * L'ouverture de l'accueil : le logo qui se construit (style.css, .en-construction), et sa nomenclature.
 * Viser une ligne de la nomenclature allume sa trace sur le dessin et estompe les autres : le tableau et
 * le plan se lisent ensemble, comme une legende de plan.
 */

function installerVerre() {
    const svg = document.querySelector('[data-plan-logo] svg')
    if (!svg) return
    // Le contour du verre se trace en unites du dessin : on le regle pour qu'il fasse 1,6 px a l'ecran.
    const regler = () => {
        const largeur = svg.getBoundingClientRect().width
        if (largeur > 0) svg.style.setProperty('--epaisseur-verre', String((1.6 * 870) / largeur))
    }
    new ResizeObserver(regler).observe(svg)
    regler()
}

function installerNomenclature() {
    const ouverture = document.querySelector('.ouverture')
    const lignes = [...document.querySelectorAll('.nomenclature [data-vise]')]
    if (!ouverture || lignes.length === 0) return
    const viser = (cle) => {
        ouverture.classList.toggle('en-visee', Boolean(cle))
        ouverture.querySelectorAll('[data-trace]').forEach((trace) => {
            trace.classList.toggle('vise', trace.dataset.trace === cle)
        })
    }
    lignes.forEach((ligne) => {
        ligne.addEventListener('pointerenter', () => viser(ligne.dataset.vise))
        ligne.addEventListener('focus', () => viser(ligne.dataset.vise))
        ligne.addEventListener('pointerleave', () => viser(null))
        ligne.addEventListener('blur', () => viser(null))
    })
}

export function installerOuverture() {
    installerVerre()
    installerNomenclature()
}
