/**
 * L'accueil. La fiche typographique du slogan dit la taille rendue a l'ecran, pas celle de la
 * slide temoin : sur l'Epure, une trace dit une verite (docs/identite.md de l'application, regle 2).
 * Sans script, elle garde la valeur de la slide, que l'ecran de 1920 rend exactement.
 */

const slogan = document.getElementById('slogan')
const fiche = document.querySelector('[data-fiche]')

function majFiche() {
    if (!slogan || !fiche) return
    const style = getComputedStyle(slogan)
    const corps = Math.round(parseFloat(style.fontSize))
    const interligne = Math.round(parseFloat(style.lineHeight))
    if (Number.isNaN(corps) || Number.isNaN(interligne)) return
    fiche.textContent = `geist ${style.fontWeight} · ${corps} / ${interligne}`
}

majFiche()
window.addEventListener('resize', majFiche)
