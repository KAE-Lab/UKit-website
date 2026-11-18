"""Compose les écrans du site comme un iPhone 13 Pro les affiche.

Les captures viennent du banc Android de l'application réglé à la géométrie de l'iPhone 13 Pro
(`adb shell wm size 1170x2532`, `wm density 480`, soit 390 x 844 points, et l'encoche émulée
`com.android.internal.display.cutout.emulation.tall`) : l'application y fait sa mise en page
d'iPhone. Chaque écran tient en trois fichiers : `<nom>.png` (la capture), `<nom>.json` (l'arbre
`android layout --flat` pris avec elle) et `<nom>.heure` (l'heure de la capture, HHMM). Seules
les deux barres du système sont redessinées, comme sur le portfolio (kln-portfolio, screens.py) :
la barre d'état d'iOS dans les 47 points du haut, l'heure et les icônes de part et d'autre de
l'encoche, à l'heure réelle de la capture ; la barre d'accueil en bas. L'application est intacte,
sauf les noms d'enseignants d'ADE, masqués.

Usage : python3 tools/ecrans.py <dossier des captures> public/captures 780 planning planning-semaine
        resto bibliotheques salles
Dépendance : Pillow. La police est Inter (paquet `fonts-inter`).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

LARGEUR, HAUTEUR = 1170, 2532
POINT = LARGEUR / 390           # 3 pixels par point
STATUT = round(47 * POINT)      # la barre d'état de l'iPhone
OREILLE = 57                    # centre de chaque côté de l'encoche, en points depuis le bord
MILIEU = 25                     # hauteur de l'heure et des icônes, en points depuis le haut
POLICE = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
ECHELLE = 4                     # dessinée plus grande puis réduite : des bords nets
MASQUES = {"planning"}          # les seuls écrans qui montrent des enseignants

# NOM Prénom, tel qu'ADE l'écrit : des mots en capitales séparés d'une espace (le dernier d'au moins
# trois lettres, pour écarter « TD Machine »), puis un prénom. Ni virgule ni tiret isolé : « LCO
# Culture, expression… » et « BUSVS - Carreire » sont des titres.
NOM = re.compile(r"^(?:[A-ZÀ-ÖØ-Þ]{2,} )*[A-ZÀ-ÖØ-Þ][A-ZÀ-ÖØ-Þ'-]{2,} [A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]+(?:-[A-ZÀ-ÖØ-Þ]?[a-zà-öø-ÿ]+)*$")


def bornes(b: str) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = map(int, re.findall(r"\d+", b))
    return x1, y1, x2, y2


def masquer(image: Image.Image, arbre: Path) -> list[str]:
    """Une barre neutre à la place de chaque nom d'enseignant, d'après l'arbre d'écran
    (`android layout --flat`) pris avec la capture."""
    d = ImageDraw.Draw(image)
    masques = []
    for fenetre in json.loads(arbre.read_text()):
        if fenetre.get("type") != "APPLICATION":
            continue
        for noeud in fenetre["content"]:
            texte = (noeud.get("text") or "").strip()
            if not NOM.match(texte):
                continue
            x1, y1, x2, y2 = bornes(noeud["bounds"])
            fond = image.getpixel((max(0, x1 - 4), (y1 + y2) // 2))
            d.rectangle((x1, y1, x2, y2), fill=fond)
            h = (y2 - y1) * 0.42
            cy = (y1 + y2) / 2
            largeur = min(x2 - x1, int(len(texte) * (y2 - y1) * 0.48))
            d.rounded_rectangle((x1, cy - h / 2, x1 + largeur, cy + h / 2), radius=h / 2, fill=(52, 52, 64))
            masques.append(texte)
    return masques


def elements_de_statut(heure: str) -> Image.Image:
    """L'heure et les trois icônes, en blanc sur rien, à la taille de la barre d'état."""
    largeur, hauteur = LARGEUR * ECHELLE, STATUT * ECHELLE
    calque = Image.new("RGBA", (largeur, hauteur), (0, 0, 0, 0))
    d = ImageDraw.Draw(calque)
    u = POINT * ECHELLE
    blanc = (255, 255, 255, 255)
    milieu = MILIEU * u
    d.text((OREILLE * u, milieu), heure, font=ImageFont.truetype(POLICE, round(17 * u)), fill=blanc, anchor="mm")
    # Réseau, Wi-Fi et batterie, 68 points en tout, centrés dans l'oreille droite.
    x = (390 - OREILLE - 34) * u
    pied = milieu + 5.4 * u
    for i, haut in enumerate((4, 6.2, 8.4, 10.7)):
        g = x + i * 4.7 * u
        d.rounded_rectangle((g, pied - haut * u, g + 3 * u, pied), radius=u, fill=blanc)
    x += 23.5 * u
    pointe = (x + 7.6 * u, pied - 0.3 * u)
    for rayon, trait in ((11.2, 2.3), (7.4, 2.3), (3.4, 3.4)):
        boite = (pointe[0] - rayon * u, pointe[1] - rayon * u, pointe[0] + rayon * u, pointe[1] + rayon * u)
        if rayon < 4:
            d.pieslice(boite, 225, 315, fill=blanc)
        else:
            d.arc(boite, 225, 315, fill=blanc, width=round(trait * u))
    x += 21 * u
    haut, bas = milieu - 5.7 * u, milieu + 5.7 * u
    d.rounded_rectangle((x, haut, x + 22.3 * u, bas), radius=3.2 * u, outline=(255, 255, 255, 110), width=round(u))
    d.rounded_rectangle((x + 2 * u, haut + 2 * u, x + 20.3 * u, bas - 2 * u), radius=1.6 * u, fill=blanc)
    d.rounded_rectangle((x + 23.3 * u, milieu - 2 * u, x + 24.7 * u, milieu + 2 * u), radius=0.7 * u, fill=(255, 255, 255, 110))
    return calque.resize((LARGEUR, STATUT), Image.LANCZOS)


def pastille_android(image: Image.Image) -> tuple[int, int, int, int] | None:
    """Les bornes de la pastille de geste d'Android, claire, centrée près du bas."""
    lignes = [y for y in range(HAUTEUR - 100, HAUTEUR)
              if sum(1 for x in range(400, 770, 10) if sum(image.getpixel((x, y))) > 600) > 25]
    if not lignes:
        return None
    y0, y1 = min(lignes), max(lignes)
    milieu = (y0 + y1) // 2
    xs = [x for x in range(0, LARGEUR) if sum(image.getpixel((x, milieu))) > 600]
    return (min(xs), y0, max(xs), y1)


def ecran(dossier: Path, nom: str) -> Image.Image:
    capture = Image.open(dossier / f"{nom}.png").convert("RGB")
    assert capture.size == (LARGEUR, HAUTEUR), capture.size
    page = capture
    if nom in MASQUES:
        print(nom, "masqués :", masquer(page, dossier / f"{nom}.json"))
    # La barre d'Android fait 44 points, celle de l'iPhone 47 : l'application descend de la
    # différence, et perd autant en bas, sous la barre d'accueil.
    android = 133
    decale = Image.new("RGB", (LARGEUR, HAUTEUR))
    decale.paste(page.crop((0, android, LARGEUR, HAUTEUR - (STATUT - android))), (0, STATUT))
    # Derrière la barre d'état court l'en-tête de l'application : une ligne de son fond prise sous les
    # icônes d'Android, au-dessus du bouton d'information qui commence à la ligne 134, étirée.
    decale.paste(page.crop((0, 130, LARGEUR, 131)).resize((LARGEUR, STATUT)), (0, 0))
    page = decale
    heure = (dossier / f"{nom}.heure").read_text().strip()
    heure = f"{int(heure[:2])}:{heure[2:]}"
    page.paste(elements_de_statut(heure), (0, 0), elements_de_statut(heure))
    # La barre d'accueil : 134 x 5 points, centrée sur la pastille d'Android qu'elle recouvre.
    d = ImageDraw.Draw(page, "RGBA")
    android = pastille_android(page)
    centre = (android[1] + android[3]) / 2 if android else HAUTEUR - 10.5 * POINT
    demi_l, demi_h = 67 * POINT, 2.5 * POINT
    if android:
        assert android[2] - android[0] <= 2 * demi_l and android[3] - android[1] <= 2 * demi_h + 2, android
    d.rounded_rectangle((LARGEUR / 2 - demi_l, centre - demi_h, LARGEUR / 2 + demi_l, centre + demi_h),
                        radius=demi_h, fill=(255, 255, 255, 235))
    return page


def main(argv: list[str]) -> int:
    dossier, sortie, largeur = Path(argv[1]), Path(argv[2]), int(argv[3])
    sortie.mkdir(parents=True, exist_ok=True)
    for nom in argv[4:]:
        page = ecran(dossier, nom)
        hauteur = round(HAUTEUR * largeur / LARGEUR)
        page.resize((largeur, hauteur), Image.LANCZOS).save(sortie / f"{nom}.webp", quality=88, method=6)
        print(nom, (largeur, hauteur))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
