/**
 * L'accueil : les instruments communs a toutes les pages, puis les quatre moments de la page --
 * l'ouverture qui se construit, Fig. 01 que le defilement extrude, le kit et ses annotations, la frise
 * a l'echelle.
 */

import { installerInstruments } from './instruments.js'
import { installerOuverture } from './accueil/ouverture.js'
import { installerEcho } from './accueil/echo.js'
import { installerKit } from './accueil/kit.js'
import { installerHistoire } from './accueil/histoire.js'

installerInstruments()
installerOuverture()
installerEcho()
installerKit()
installerHistoire()

// La fiche typographique du slogan dit la taille rendue a l'ecran, pas celle de la slide temoin.
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
