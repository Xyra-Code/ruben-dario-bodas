"""Extrae el logo de docs/marca/Perfil Redes Logo.pdf a SVG livianos para la web.

El PDF (Illustrator) trae cada pieza como un trazo vectorial con relleno en degradado.
PyMuPDF exporta esos degradados como imágenes PNG recortadas por el trazo; este script
toma el trazo, muestrea los colores de la imagen y lo reconstruye con un <linearGradient>
SVG real. Resultado: vectores puros, sin flores ni aro (versión para redes).

Uso (requiere PyMuPDF: pip install pymupdf):
    python scripts/marca/extraer-logo.py
"""

import base64
import re
from pathlib import Path

import fitz  # PyMuPDF

RAIZ = Path(__file__).resolve().parents[2]
PDF = RAIZ / "docs" / "marca" / "Perfil Redes Logo.pdf"
SALIDA = RAIZ / "public" / "marca"

# clipPath del SVG exportado → pieza del logo.
PIEZAS = {
    "monograma": "clip_4",
    "nombre": "clip_8",
    "linea": "clip_7",
    "descriptor": "clip_11",
}
PARADAS = 5  # paradas del degradado, muestreadas de izquierda a derecha


def svg_del_pdf() -> str:
    pagina = fitz.open(PDF)[0]
    return pagina.get_svg_image(text_as_path=True)


def extraer_pieza(svg: str, clip_id: str) -> dict:
    """Devuelve el trazo (d, transform, regla) y las paradas de color de una pieza."""
    clip = re.search(rf'<clipPath id="{clip_id}"[^>]*>(.*?)</clipPath>', svg, re.S).group(1)
    path = re.search(r"<path[^>]*>", clip).group(0)
    d = re.search(r'\bd="([^"]+)"', path).group(1)
    transform = re.search(r'transform="([^"]+)"', path).group(1)
    regla = re.search(r'clip-rule="([^"]+)"', path)

    # La imagen recortada por este clip: <g clip-path="url(#clip_x)"> ... <image ...>
    bloque = re.search(
        rf'clip-path="url\(#{clip_id}\)">\s*(?:<g[^>]*>\s*)?<image ([^>]*)', svg, re.S
    ).group(1)
    x, y, w, h = (
        float(re.search(rf'\b{k}="([^"]+)"', bloque).group(1))
        for k in ("x", "y", "width", "height")
    )
    datos = re.search(r'xlink:href="data:image/png;base64,([^"]+)"', bloque).group(1)
    pix = fitz.Pixmap(base64.b64decode(re.sub(r"\s", "", datos)))

    fila = pix.height // 2
    paradas = []
    for i in range(PARADAS):
        px = round(i * (pix.width - 1) / (PARADAS - 1))
        r, g, b = pix.pixel(px, fila)[:3]
        paradas.append((i / (PARADAS - 1), f"#{r:02X}{g:02X}{b:02X}"))

    return {
        "d": d,
        "transform": transform,
        "regla": regla.group(1) if regla else "nonzero",
        "caja": (x, y, w, h),
        "paradas": paradas,
    }


def gradiente(gid: str, pieza: dict) -> str:
    x, _, w, _ = pieza["caja"]
    stops = "".join(f'<stop offset="{o:.2f}" stop-color="{c}"/>' for o, c in pieza["paradas"])
    return (
        f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" '
        f'x1="{x:.1f}" y1="0" x2="{x + w:.1f}" y2="0">{stops}</linearGradient>'
    )


def trazo(pieza: dict, relleno: str) -> str:
    return (
        f'<path transform="{pieza["transform"]}" fill-rule="{pieza["regla"]}" '
        f'fill="{relleno}" d="{pieza["d"]}"/>'
    )


def documento(viewbox: tuple, titulo: str, cuerpo: str, defs: str = "") -> str:
    vx, vy, vw, vh = viewbox
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.1f} {vy:.1f} {vw:.1f} {vh:.1f}" '
        f'role="img" aria-label="{titulo}">'
        f"<title>{titulo}</title>"
        + (f"<defs>{defs}</defs>" if defs else "")
        + cuerpo
        + "</svg>\n"
    )


def union(*cajas, margen=0.0):
    x0 = min(c[0] for c in cajas) - margen
    y0 = min(c[1] for c in cajas) - margen
    x1 = max(c[0] + c[2] for c in cajas) + margen
    y1 = max(c[1] + c[3] for c in cajas) + margen
    return (x0, y0, x1 - x0, y1 - y0)


def main() -> None:
    svg = svg_del_pdf()
    p = {nombre: extraer_pieza(svg, clip) for nombre, clip in PIEZAS.items()}
    SALIDA.mkdir(parents=True, exist_ok=True)
    nombre_marca = "Rubén Darío, diseñador de bodas"

    def a_color(*piezas):
        defs = "".join(gradiente(f"g-{n}", p[n]) for n in piezas)
        cuerpo = "".join(trazo(p[n], f"url(#g-{n})") for n in piezas)
        return defs, cuerpo

    def a_una_tinta(*piezas):
        return "".join(trazo(p[n], "currentColor") for n in piezas)

    texto = ("nombre", "linea", "descriptor")
    todo = ("monograma", *texto)

    # 1. Monograma (favicon, encabezado compacto, avatar).
    caja = union(p["monograma"]["caja"])
    defs, cuerpo = a_color("monograma")
    salidas = {"monograma.svg": documento(caja, nombre_marca, cuerpo, defs)}

    # 2. Vertical sin flores ni aro (footer, Open Graph, página 404).
    caja = union(*(p[n]["caja"] for n in todo), margen=8)
    defs, cuerpo = a_color(*todo)
    salidas["logo-vertical.svg"] = documento(caja, nombre_marca, cuerpo, defs)
    salidas["logo-vertical-tinta.svg"] = documento(caja, nombre_marca, a_una_tinta(*todo))

    # 3. Horizontal: monograma a la izquierda del bloque de texto (encabezado).
    bloque = union(*(p[n]["caja"] for n in texto))
    mono = p["monograma"]["caja"]
    escala = bloque[3] / mono[3]  # el monograma mide lo mismo que el bloque de texto
    separacion = 36
    ancho_mono = mono[2] * escala
    desplazar_mono = (
        f'transform="translate({bloque[0] - separacion - ancho_mono:.2f} {bloque[1]:.2f}) '
        f'scale({escala:.5f}) translate({-mono[0]:.2f} {-mono[1]:.2f})"'
    )
    caja = (bloque[0] - separacion - ancho_mono - 8, bloque[1] - 8,
            bloque[2] + separacion + ancho_mono + 16, bloque[3] + 16)
    defs, cuerpo_texto = a_color(*texto)
    defs += gradiente("g-monograma", p["monograma"])
    cuerpo = f'<g {desplazar_mono}>{trazo(p["monograma"], "url(#g-monograma)")}</g>' + cuerpo_texto
    salidas["logo-horizontal.svg"] = documento(caja, nombre_marca, cuerpo, defs)
    cuerpo_tinta = (
        f'<g {desplazar_mono}>{trazo(p["monograma"], "currentColor")}</g>' + a_una_tinta(*texto)
    )
    salidas["logo-horizontal-tinta.svg"] = documento(caja, nombre_marca, cuerpo_tinta)

    for archivo, contenido in salidas.items():
        (SALIDA / archivo).write_text(contenido, encoding="utf-8", newline="\n")
        print(f"{archivo}: {len(contenido.encode()) / 1024:.1f} KB")

    print("\nColores muestreados:")
    for nombre, pieza in p.items():
        print(f"  {nombre}: {' > '.join(c for _, c in pieza['paradas'])}")


if __name__ == "__main__":
    main()
