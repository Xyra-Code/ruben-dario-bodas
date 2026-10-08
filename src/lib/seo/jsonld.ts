/**
 * Datos estructurados (schema.org) para Google y para los buscadores con IA.
 * Reglas del mapa del sitio: `LocalBusiness` completo solo en la portada; el resto de
 * páginas lo referencia por `@id`. `FAQPage` donde hay preguntas frecuentes.
 */
import type { Evento } from "@/lib/contenido/cargar";
import { obtenerContenido } from "@/lib/contenido/cargar";
import type { Lugar, PreguntaFrecuente, Servicio } from "@/lib/contenido/esquemas";
import { obtenerImagen } from "@/lib/imagenes";
import { urlAbsoluta } from "@/lib/seo/metadatos";

type Nodo = Record<string, unknown>;

export const ids = {
  negocio: () => `${urlAbsoluta("/")}/#negocio`,
  sitio: () => `${urlAbsoluta("/")}/#sitio`,
  fundador: () => `${urlAbsoluta("/")}/#ruben-dario`,
};

const DIAS_SCHEMA = {
  lunes: "Monday",
  martes: "Tuesday",
  miercoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sabado: "Saturday",
  domingo: "Sunday",
} as const;

/**
 * Zona de servicio: cada departamento o distrito y sus municipios (sin los que aún están
 * [PENDIENTE]). Bogotá va como ciudad; Meta y Cundinamarca como áreas administrativas.
 */
function areaServida(): Nodo[] {
  return obtenerContenido().sitio.cobertura.zonas.flatMap((zona) => {
    const municipios = zona.municipios.filter((m) => !m.includes("[PENDIENTE"));
    if (zona.tipo === "distrito") {
      return municipios.map((m) => ({ "@type": "City", name: m }));
    }
    const area = { "@type": "AdministrativeArea", name: `${zona.nombre}, Colombia` };
    return [area, ...municipios.map((m) => ({ "@type": "City", name: m, containedInPlace: area }))];
  });
}

const direccionLugar = (l: Lugar) => ({
  "@type": "PostalAddress",
  addressLocality: l.municipio,
  addressRegion: l.departamento,
  addressCountry: "CO",
});

/** Negocio completo (solo portada). */
export function negocio(): Nodo {
  const { sitio } = obtenerContenido();
  const d = sitio.direccion;
  const redes = Object.values(sitio.redes).filter(Boolean);
  return {
    "@type": "LocalBusiness",
    "@id": ids.negocio(),
    name: sitio.nombre,
    description: `Diseño y decoración de bodas y fiestas de 15 años en ${sitio.cobertura.resumen}.`,
    url: urlAbsoluta("/"),
    logo: urlAbsoluta("/marca/icono-512.png"),
    image: urlAbsoluta("/img/og/sitio.jpg"),
    telephone: sitio.telefono.e164,
    // Negocio de área de servicio: sin calle pública, solo ciudad (como en Google Business).
    address: {
      "@type": "PostalAddress",
      ...(d.publica ? { streetAddress: d.calle } : {}),
      ...(d.publica && d.codigoPostal ? { postalCode: d.codigoPostal } : {}),
      addressLocality: d.ciudad,
      addressRegion: d.departamento,
      addressCountry: d.pais,
    },
    areaServed: areaServida(),
    openingHoursSpecification: sitio.horario.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias.map((dia) => DIAS_SCHEMA[dia]),
      opens: h.abre,
      closes: h.cierra,
    })),
    ...(redes.length ? { sameAs: redes } : {}),
    founder: { "@id": ids.fundador() },
    knowsAbout: ["Decoración de bodas", "Decoración de fiestas de 15 años", "Diseño de eventos"],
  };
}

export function sitioWeb(): Nodo {
  return {
    "@type": "WebSite",
    "@id": ids.sitio(),
    name: obtenerContenido().sitio.nombre,
    url: urlAbsoluta("/"),
    inLanguage: "es-CO",
    publisher: { "@id": ids.negocio() },
  };
}

export function preguntasFrecuentes(preguntas: PreguntaFrecuente[]): Nodo {
  return {
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}

export type Miga = { nombre: string; ruta: string };

export function migas(items: Miga[]): Nodo {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: urlAbsoluta(m.ruta),
    })),
  };
}

/** "$3.500.000" → 3500000; null si aún no es un valor (p. ej. [PENDIENTE]). */
function valorEnPesos(texto: string) {
  const digitos = texto.replace(/[^\d]/g, "");
  return /\d/.test(texto) && !texto.includes("[PENDIENTE") ? Number(digitos) : null;
}

export function servicio(s: Servicio, ruta: string): Nodo {
  const desde = valorEnPesos(s.inversion.desde);
  return {
    "@type": "Service",
    name: s.nombre,
    serviceType: s.nombre,
    description: s.seo.description,
    url: urlAbsoluta(ruta),
    provider: { "@id": ids.negocio() },
    areaServed: areaServida(),
    ...(desde
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "COP",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: desde,
              priceCurrency: "COP",
            },
          },
        }
      : {}),
  };
}

/** Página de un evento: una galería de fotos (no `Event`: no se venden entradas). */
export function galeriaEvento(e: Evento, ruta: string): Nodo {
  return {
    "@type": "ImageGallery",
    name: e.titulo,
    description: e.seo.description,
    url: urlAbsoluta(ruta),
    inLanguage: "es-CO",
    creator: { "@id": ids.negocio() },
    contentLocation: {
      "@type": "Place",
      name: e.lugar.nombre,
      address: direccionLugar(e.lugar),
    },
    image: e.fotos.map((f) => {
      const img = obtenerImagen(e.slug, f.archivo);
      const mayor = img.variantes[img.variantes.length - 1];
      return {
        "@type": "ImageObject",
        contentUrl: urlAbsoluta(mayor.src),
        caption: f.alt,
        width: mayor.ancho,
        height: Math.round((img.alto * mayor.ancho) / img.ancho),
        creator: { "@id": ids.negocio() },
      };
    }),
  };
}

export function paginaSobre(ruta: string): Nodo[] {
  return [
    {
      "@type": "AboutPage",
      url: urlAbsoluta(ruta),
      about: { "@id": ids.negocio() },
      mainEntity: { "@id": ids.fundador() },
    },
    {
      "@type": "Person",
      "@id": ids.fundador(),
      name: "Rubén Darío",
      jobTitle: "Diseñador de bodas",
      worksFor: { "@id": ids.negocio() },
      url: urlAbsoluta(ruta),
    },
  ];
}

export function listaLugares(lugares: Lugar[]): Nodo {
  return {
    "@type": "ItemList",
    itemListElement: lugares.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Place",
        name: l.nombre,
        address: direccionLugar(l),
      },
    })),
  };
}

export function listaEventos(eventos: Evento[]): Nodo {
  return {
    "@type": "CollectionPage",
    url: urlAbsoluta("/eventos"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: eventos.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: urlAbsoluta(`/eventos/${e.slug}`),
        name: e.titulo,
      })),
    },
  };
}
