/**
 * L'accueil : le kit (le telephone epingle et ses fiches), la frise de l'histoire, et le sommaire de la
 * tete qui marque la section lue.
 */

import { installerKit } from './accueil/kit.js'
import { installerHistoire } from './accueil/histoire.js'

installerKit()
installerHistoire()

const liens = [...document.querySelectorAll('.sommaire a[href^="#"]')]
const parCible = new Map(liens.map((lien) => [lien.getAttribute('href').slice(1), lien]))
const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
        parCible.get(entree.target.id)?.setAttribute('aria-current', String(entree.isIntersecting))
    })
}, { rootMargin: '-40% 0px -55% 0px' })
parCible.forEach((_, id) => {
    const cible = document.getElementById(id)
    if (cible) observateur.observe(cible)
})
