# AGENTS.md

Blog y portfolio personal de Fran Dieguez. Astro 5 + islas de React 19 + Tailwind 3,
desplegado en Cloudflare Pages.

## ⚠️ Antes de tocar cualquier UI: lee DESIGN.md

**[DESIGN.md](./DESIGN.md) es de lectura obligatoria** antes de escribir o modificar
markup, CSS o clases de Tailwind en este repo. Documenta el sistema de diseño real
—tokens de color, tipografía, componentes, movimiento— y una lista de deuda técnica
que **no** hay que propagar.

Los cuatro errores más habituales que evita:

1. Escribir un hex literal en vez de usar un token semántico (`bg-accent-two`,
   `text-textColor`, `bg-color-150`…). El color aquí se deriva de cuatro variables CSS
   por tema; un hex rompe el modo oscuro.
2. Añadir `shadow-md`/`shadow-xl`. Este sistema no usa sombras: la elevación se
   expresa con las superficies `bg-special-*`.
3. Poner un tamaño de display directamente en un `<h1>`. `global.css` fuerza
   `h1 { text-2xl !important }`: el tamaño va en un `<span class="block">` hijo, con
   `.display-heading` en el encabezado. Ver DESIGN.md §3.4.
4. Crear una isla de React para renderizar markup estático. La home fue de tres islas
   a cero; no la devuelvas al punto de partida.

Al terminar un cambio visual, pasa el checklist de la sección 10 de DESIGN.md.

## Comandos

```bash
yarn dev      # servidor de desarrollo
yarn build    # build + indexación de Pagefind (postbuild)
yarn preview  # previsualizar el build
yarn lint     # Biome — ⚠️ hoy no arranca: biome.json usa claves de Biome v1
yarn check    # astro check (tipos) — baseline: 3 errores preexistentes, ver DESIGN.md §9
yarn format   # Biome + Prettier
yarn new:post # scaffolding de post o nota con frontmatter válido
```

Gestor de paquetes: **yarn 4** (`packageManager` en `package.json`). No usar npm ni pnpm.

## Estructura

```text
src/
  pages/       Rutas Astro (index, about, contact, posts/, notes/, tags/, series/)
  layouts/     Base.astro (shell común), BlogPost.astro, Series.astro
  components/
    ui/        Primitivas: ButtonLink, Avatar
    home/      Secciones de la home: HomeHero, WritingSection, HandRule…
    career/    CareerTimeline, CareerTimelineItem
    blog/      PostPreview, TOC, Masthead, webmentions
    layout/    Header, Footer
  data/        career.ts y post.ts — fuentes de verdad, sin consultas ad hoc
  scripts/     reveal.ts — el IntersectionObserver de los reveals
  content/     Colecciones de contenido (post, note, series) en Markdown/MDX
  styles/      global.css — variables de tema, reveals, reduced-motion, code blocks
  plugins/     remark-admonitions, remark-reading-time
  assets/      Imágenes y fuentes. Las imágenes van aquí, NO en public/
  site.config.ts  Metadatos del sitio y enlaces del menú
```

Imports con alias `@/` → `src/`.

## Convenciones

- **Astro por defecto.** Solo la interactividad de cliente real justifica una isla.
  No queda ningún `.tsx` en `src/` y ninguna página envía islas hidratadas. Ojo:
  React sigue haciendo falta **en build**, porque los logos se importan con `?react`.
- **Estilos en clases de Tailwind.** A `global.css` solo va lo que no se puede
  expresar con utilidades: keyframes, variables de tema y el estilado del HTML
  generado desde markdown.
- **Indentación con tabulador** en `.astro` y `.css`; Biome manda.
- **Imágenes** siempre con `<Image>` de `astro:assets`, nunca `<img>`, e importadas
  desde `src/assets/`. Importar desde `public/` emite el asset dos veces.
- **Scripts de cliente**: escuchar `astro:page-load`, nunca `DOMContentLoaded`. Con
  `<ClientRouter />` activo, este último no vuelve a dispararse tras una navegación.
- **Iconos**: `astro-icon` (sets `hugeicons`, `mdi`, `solar`).
- El contenido de blog se renderiza con `class="prose prose-citrus max-w-none"`.

## Contenido

Los posts van en `src/content/post/<slug>/index.md`. El esquema de frontmatter está
en `src/content.config.ts`. Marcar `draft: true` mientras no esté listo.

No crear el fichero a mano: **`yarn new:post <slug>`** genera el frontmatter válido
(el esquema Zod rompe el build si falta `description` o `publishDate`, y el de `note`
exige ISO 8601 con offset). Acepta `--note`, `--tags`, `--date`, `--series`, `--order`.

Los tags salen del **vocabulario controlado de `scripts/tag-vocabulary.mjs`**, y el
script rechaza cualquier otro. El archivo llegó a tener 302 tags para 124 posts, 249
de ellos usados una sola vez; como `getRelatedPosts()` (`src/data/post.ts`) pondera
por 1/frecuencia, esa cola generaba casi todos los enlaces internos del sitio.
Añadir un tag nuevo es editar ese fichero a propósito, no colarlo en un frontmatter.

## Accesibilidad

El sitio cumple hoy con skip link, `aria-current` en navegación, `aria-expanded`
sincronizado en el menú móvil, iconos con `aria-hidden` y `alt` en todas las
imágenes. Mantener ese nivel en cualquier UI nueva — detalle en la sección 7 de
DESIGN.md.

## Skills de diseño instaladas

El repo trae skills en `.agents/skills/` (con symlinks desde `.claude/skills/`,
ambos ignorados por git). Varias son **direcciones estéticas mutuamente excluyentes**
(`minimalist-ui`, `industrial-brutalist-ui`, `high-end-visual-design`, `gpt-taste`):
usar como máximo una, y solo si se pide explícitamente un cambio de dirección visual.
Para trabajo normal sobre el sitio existente, DESIGN.md manda sobre cualquier skill
estética.
