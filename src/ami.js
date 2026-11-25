// La page du lien d'un ami (/ami#...) : le fragment porte l'emploi du temps partage, et un navigateur ne
// l'envoie jamais au serveur. Ce script le lit ici, dans le navigateur, pour une seule chose : poser
// l'adresse du bouton qui ouvre l'application (son schema, ukit-bordeaux://). Il ne l'affiche pas, ne
// l'envoie nulle part et ne le garde pas. La lecture du contenu est celle de l'application
// (src/features/Amis/services/lienAmi.ts, depot KAE-Lab/UKit).
//
// L'ouverture attend un toucher : ouvrir un schema sans geste echoue en silence sur Android, et Safari
// affiche une erreur quand l'application n'est pas installee, le cas ou cette page sert le plus.

const SCHEMA = 'ukit-bordeaux://ami'
// Le fragment tel que l'application l'ecrit : des champs cle=valeur encodes pour URL, version d'abord.
const FORME = /^v=\d+&[A-Za-z0-9%._~!*'(),=&-]*$/
const LONGUEUR_MAXIMUM = 2000

const ouvrir = document.getElementById('ouvrir')
const incomplet = document.getElementById('incomplet')

// Relu a chaque changement de fragment : un second lien ouvert dans le meme onglet ne recharge pas la page.
function poserLeBouton() {
    const fragment = window.location.hash.slice(1)
    const lisible = fragment.length <= LONGUEUR_MAXIMUM && FORME.test(fragment)
    ouvrir.querySelector('a').href = lisible ? `${SCHEMA}#${fragment}` : '/download.html'
    ouvrir.hidden = !lisible
    incomplet.hidden = lisible
}

poserLeBouton()
window.addEventListener('hashchange', poserLeBouton)
