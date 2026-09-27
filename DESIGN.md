# DESIGN.md — Sistema de diseño de frandieguez.com

Documento normativo para agentes y humanos que toquen UI en este repo. Describe el
sistema **tal y como existe hoy** en `src/styles/global.css`, `tailwind.config.ts` y los
componentes de `src/components/`. No es una propuesta de rediseño.

**Regla de oro:** antes de escribir CSS nuevo, buscar el token o la utilidad que ya existe.
Este proyecto tiene un sistema de color completo basado en variables CSS; escribir un
hex suelto es casi siempre un error.

---

## 1. Identidad visual

Blog personal / portfolio de un desarrollador. El tono es **cálido, editorial y
ligeramente lúdico**, no corporativo ni brutalista:

- Fondo crema en todo el sitio (`hsl(24 100% 95.5%)` ≈ `#fff1e8`) y, en oscuro, un
  carbón neutro casi sin tono (`hsl(30 4% 9%)` ≈ `#181716`). Ambos son fondos
  cálidos y sin tinte propio, así que la terracota es el único color de la página
  en los dos temas.
- Un único acento fuerte de color terracota, con un valor por tema para que pase
  AA: `hsl(15 68% 44%)` sobre crema y `hsl(16 82% 62%)` sobre carbón.
- **Tinta y papel** como lenguaje decorativo: grano de papel, reglas dibujadas a mano,
  trazos de rotulador tras una frase, contornos desplazados tipo registro de imprenta,
  y marcas de índice editorial (`01 —`, `02 —`). Ver §6.
- Escala tipográfica agresiva en los titulares de la home (hasta 208px) contra un
  cuerpo de 16–20px.

Lo que **no** es: no hay sombras marcadas, no hay cards apiladas dentro de cards, no
hay bordes gruesos, no hay neones ni glassmorphism, y no hay decoración que se mueva
sola en bucle.

---

## 2. Color

### 2.1 Arquitectura

El color **no** se define por paleta estática sino por una función. En `global.css` se
declaran cuatro variables base por tema y de ahí se derivan 20 pasos de opacidad:

```css
--hue            /* light: 0deg   | dark: 30deg  */
--saturation     /* light: 100%   | dark: 4%     */
--bg-hue         /* light: 24deg  | dark: = --hue */
--bg-saturation  /* light: 100%   | dark: = --saturation */
--bg-brightness  /* light: 95.5%  | dark: 9%     */
--fg-saturation  /* light: = --saturation | dark: 6% */
--fg-brightness  /* light: 9%     | dark: 96%    */
```

El fondo claro es `hsl(24 100% 95.5%)` ≈ `#fff1e8`. Antes era blanco puro y el crema
lo pintaba un `<div>` absoluto detrás del hero de la home, así que solo la portada
era crema y el resto del sitio blanco.

De ahí salen `--theme-color-50` … `--theme-color-900`, que son el **mismo color**
(`--theme-fg`) a distintas alfas (0.0225 → 1.0). Es una escala de opacidad, no de
luminosidad: por eso funciona igual en claro y en oscuro sin duplicar valores.

Se consumen desde Tailwind como `bg-color-150`, `text-color-600`, etc. Los 40
nombres están en `safelist` de `tailwind.config.ts`, así que se pueden construir
dinámicamente.

### 2.2 Tokens semánticos — usar estos, no la escala cruda

| Token Tailwind | Variable | Uso |
| --- | --- | --- |
| `bg-bgColor` | `--theme-bg` | Fondo de página y de superficies opacas |
| `text-textColor` | `--theme-text` | Texto de cuerpo (heredado en `<html>`) |
| `text-accent-base` | `--theme-accent-base` | Títulos y enlaces de título (`.title`) |
| `text-accent-one` | `--theme-accent-one` | Acento secundario, gradientes |
| `bg-accent-two` / `text-accent-two` | claro `hsl(15 68% 44%)` · oscuro `hsl(16 82% 62%)` | **Acento primario**: CTA sólido, títulos de sección, footnotes, `<sup>` |
| `text-link` | `--theme-link` | Enlaces externos dentro de prosa |
| `text-accent` | `--theme-color-600` | Acento neutro, texto de footer |
| `text-quote` | `= --theme-text` | Blockquotes |
| `text-lightest` / `lighter` / `light` | `color-350/400/450` | Texto terciario: fechas, números de línea, metadatos |
| `bg-special-lightest` / `lighter` / `light` | por tema | Superficies elevadas (botón secundario, `<kbd>`) |

### 2.3 Reglas

- **Nunca** un hex literal para texto o superficie de contenido. Los que quedan
  (`#fff8f3aa` y `#38bdf8` en `about.astro`) son deuda conocida, no un patrón.
- El acento terracota es **uno**, pero tiene un valor distinto por tema para pasar
  AA: 4.59:1 sobre crema y 6.38:1 sobre carbón. Un único valor para ambos daba
  3.93:1 en los dos, por debajo del mínimo para texto pequeño.
- Para metadatos pequeños usar `text-color-550` o más oscuro. `text-lighter`
  (`color-400`, alfa 0.395) no pasa AA sobre crema a tamaños pequeños.
- Los colores planos de Tailwind (`blue-400`, `lime-500`, `red-500`…) se reservan
  para los admonitions de prosa y el marcador `(Draft)`.

### 2.4 Modo oscuro

`darkMode: ["class", '[data-theme="dark"]']`. Lo gestiona `ThemeProvider.astro` +
`ThemeToggle.astro`. Al usar tokens semánticos el modo oscuro sale gratis: **si un
componente nuevo necesita más de una variante `dark:`, probablemente está usando el
token equivocado.**

---

## 3. Tipografía

### 3.1 Familias

```ts
sans:    ["IBM Plex Sans", ...defaults]                    // cuerpo, UI
serif:   [...defaults]                                      // comillas decorativas
mono:    [...defaults]                                      // metadatos, código, índices
heading: ["Urbanist", "Space Grotesk", "Lexend", ...sans]
```

`heading` se aplica automáticamente a `h1`–`h6` dentro de `.prose` vía el plugin de
typography. Fuera de prosa hay que pedirla con `font-heading`.

Solo se cargan dos familias, **IBM Plex Sans** y **Urbanist**, en una única petición a
Google Fonts desde `BaseHead.astro`. Nada de `@import` dentro de `global.css`: eso
serializa la descarga.

Los stacks **solo** pueden contener familias realmente cargadas. Antes listaban
`Copernicus` (OTF desde un CDN de terceros), `SFProRounded` y `CascadiaCode` sin
ningún `@font-face` que los respaldase, así que caían al fallback en silencio.
`font-mono` es el stack del sistema: cero bytes y siempre disponible.

### 3.2 Escala

El cuerpo es **más grande en móvil que en desktop**, decisión deliberada en
`Base.astro`: `text-xl md:text-base`.

⚠️ **Esa clase va en `<html>`, así que cambia el tamaño de fuente raíz**: en móvil
pasa a 20px y en desktop a 16px. Como `rem` se resuelve contra la raíz, **todas las
utilidades de Tailwind basadas en rem miden un 25% más en móvil** — espaciados,
anchos, alturas, no solo el texto. `w-36` son 180px en móvil y 144px en desktop. Al
dimensionar algo para móvil hay que contar con eso; es la causa de más de un elemento
que "se sale" solo en pantallas pequeñas.

Los headings globales están redefinidos en `global.css` con `!important` y son
conservadores: `h1: text-2xl`, `h2: text-xl`, `h3: text-lg`, `h4`–`h6`: `text-base`,
todos con `min-h-8`. La escala grande (`text-3xl`/`text-4xl`) se usa solo en los
títulos de hero, declarada de forma explícita en la página.

`letter-spacing: 0.005em` global en `<html>`.

### 3.3 Pesos

`font-medium` para texto destacado, `font-semibold` para el componente `.title` y
botones, `font-bold` para hero y `<strong>`. No usar `font-black` ni `font-thin`.

### 3.4 Tipografía de display — `.display-heading`

Las reglas `h1`–`h6` de §3.2 llevan `!important`, así que **una clase de utilidad no
puede ganarles el tamaño**. El patrón obligatorio es poner el tamaño en un `<span>`
hijo, que hereda y gana sin necesidad de `!important`:

```html
<h1 class="display-heading">
  <span class="block font-heading text-[clamp(3.25rem,12.5vw,13rem)]
               leading-[0.84] tracking-[-0.02em]">Dieguez</span>
</h1>
```

- Usar `<span class="block">`, nunca `<div>`: un `<div>` dentro de un `<h1>` es HTML
  inválido.
- `.display-heading` es la única excepción documentada al «no más `!important`», y
  solo anula los efectos de layout (`min-height`, `padding-top`), jamás el tamaño.
- A tamaños de display hay que contrarrestar el `letter-spacing: 0.005em` global con
  `tracking-[-0.02em]`: a 160px son 0.8px de hueco parásito por letra.
- **No muevas nunca el tamaño al propio `h*`**: colapsaría a 24px en silencio.

Escala de display en uso: titular de la home `clamp(3.25rem, 12.5vw, 13rem)`,
titulares de sección `text-[2.125rem] md:text-[3.5rem]`, post destacado
`text-[1.75rem] md:text-[2.5rem]`.

---

## 4. Layout y espaciado

### 4.1 Contenedores

```text
body        → max-w-6xl (76rem, sobreescrito) m-auto
#container  → max-w-6xl grow
grid        → px-4 md:px-8 md:pt-4, grid-rows-[auto_auto_1fr]
main        → mt-24 md:mt-[3.5rem]   (deja hueco al header fijo en móvil)
```

`maxWidth` está recalibrado en `tailwind.config.ts`: `4xl` = 54rem (no 56) y
`6xl` = 76rem (no 72). Respetar esos valores; son los que definen la medida de lectura.

### 4.2 Rejilla

Mezcla de flexbox y `grid` de 12 columnas donde hace falta control fino:

- Hero: el titular ocupa el ancho completo y el retrato se posiciona con
  `md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2`. El orden del DOM ya es el
  visual, así que móvil no necesita reordenar.
- Destacados de la home: `md:grid-cols-12` con `md:col-span-7` / `md:col-span-5`.
- `/posts`: `lg:grid-cols-[1fr_14rem]` (lista + aside de tags).
- `/contact`: `md:grid-cols-12` con `md:col-span-7` / `md:col-span-5`.
- Filas compactas: `md:grid-cols-[3.5rem_1fr_auto]` (año · título · mes).
- Timeline: `md:grid-cols-[8.5rem_1fr]` (rango · contenido).
- Listas: `divide-y divide-color-250`, nunca bordes por ítem.

### 4.3 Ritmo vertical

Múltiplos de 4 de la escala Tailwind. Secciones `py-20 md:py-28`; cabecera de sección
a contenido `mt-10 md:mt-14`; entre bloques dentro de sección `mt-8`; filas de lista
`py-4`/`py-5`.

### 4.4 Breakpoints

`xs: 320px` añadido; el resto son los de Tailwind. El breakpoint que importa es
`md` (768px): ahí el header pasa de fijo a estático, el retrato del hero pasa a
absoluto y la tipografía de cuerpo de grande a normal.

---

## 5. Componentes

### 5.1 Radios y bordes

`rounded-lg` es el radio por defecto para **todo**: botones, code blocks, tablas,
inputs, iconos de admonition. `rounded-full` solo para el avatar y los blobs.
`rounded-sm` para los micro-badges de footnote.

Bordes: finos y muy tenues — `border border-gray-400/20`, `border-color-200`,
`border-bgColor`. Nunca `border-2` o más.

### 5.2 Sombras

Prácticamente ausentes. La única sombra del sistema es la de `<kbd>`:
`shadow-[0px_2.5px_0px_rgba(0,0,0,0.25)]` (sombra dura tipo tecla, sin blur). El
`shadow` del nav móvil es residual. **No añadir `shadow-md`/`shadow-xl`**: la
elevación en este sistema se expresa con `bg-special-*`, no con sombra.

### 5.3 Botones

Usa **`src/components/ui/ButtonLink.astro`**, no escribas las clases a mano:

```astro
<ButtonLink href="/posts/">Read the blog</ButtonLink>
<ButtonLink href="/contact/" variant="secondary">➤ Get in touch</ButtonLink>
```

- `variant="primary"` → `bg-accent-two text-bgColor`.
- `variant="secondary"` → `border border-gray-400/20 bg-special-lighter` con
  `hover:bg-special-lightest`.
- `size="md"` (por defecto) → `h-9 md:h-8 px-4`. `size="lg"` → `h-12 md:h-11 px-6`,
  **reservado al hero de la home**: 32px bajo un titular de 160px se lee como un error.

El hover del sistema es **`hover:brightness-110`**, no un cambio de color. Aplicarlo a
cualquier elemento interactivo de color sólido.

### 5.4 Etiquetas y badges

`Badge.astro`. La variante de etiqueta es **`muted`**: contorno de 1px en
`border-color-250`, texto en `color-600`, y terracota **solo en hover**. Nada de
relleno.

```astro
<a href={`/tags/${tag}/`}><Badge variant="muted" title={tag} /></a>
```

- **Nunca `drop-shadow`.** Todas las variantes lo llevaban (`drop-shadow-lg`), que
  es lo que hacía que una fila de etiquetas se leyera como una fila de botones
  toscos, contra §5.2.
- Las variantes rellenas (`accent-two`, `accent-base`…) se reservan para badges
  **sueltos**, como el marcador de serie en la cabecera del post. Diez píldoras del
  acento seguidas convierten el único color del sitio en papel pintado y le roban
  el énfasis a los CTA y a las marcas de sección.
- `h-8` para que un badge envuelto en enlace sea un área táctil de 32px.
- El `#` va a `opacity-60`, para que se lea como prefijo y no como parte del nombre.

### 5.5 Enlaces

Clase de componente `.citrus-link`: sin subrayado en reposo, `underline
underline-offset-2` en hover. Es el comportamiento por defecto de `<a>` dentro de
`.prose`. Para nav y footer, `underline-offset-2 hover:underline` directo.

### 5.6 Clase `.title`

`@apply font-semibold text-accent-base`. Usarla para cualquier encabezado de
sección o título de post en listados, en lugar de repetir las dos utilidades.

### 5.7 Prosa

El contenido de blog usa `class="prose prose-citrus max-w-none"`. La variante
`citrus` remapea las variables de `@tailwindcss/typography` a los tokens del tema.
Está personalizado en `tailwind.config.ts`:

- Blockquotes sin borde izquierdo, con comillas tipográficas `“ ”` en `font-serif`
  vía `::before`/`::after`.
- Tablas con filas alternas `bg-color-100`/`bg-color-50`, `thead` en `bg-color-50`,
  celdas `px-4 py-1`, esquinas redondeadas.
- Código inline: `bg-[var(--code-inline-bg)] px-2 py-1 text-sm rounded-lg`, sin las
  backticks que añade typography por defecto.
- Footnotes (`<sup>`, `.data-footnote-backref`): micro-badge `bg-accent-two`
  `text-bgColor` `rounded-sm`.
- Admonitions (`.aside-note/tip/important/warning/caution`): borde izquierdo de
  `0.625rem`, fondo al 10% del color, icono GitHub en `mask-image`. Se generan desde
  markdown con `src/plugins/remark-admonitions.ts`.

### 5.8 Índice de contenidos (TOC)

No es una caja: es un **instrumento de medida**. `TOCList.astro` dibuja un rail de
1px con una marca por encabezado cuya **longitud codifica el nivel** (`h2` larga y
pegada al rail, `h3` más corta y desplazada), como una regla. Encima, un relleno en
`accent-two` con `origin-top` y `scaleY()` que indica **progreso real de lectura**
dentro del `<article>`, no qué encabezado está resaltado.

- `src/scripts/toc.ts` calcula ambas cosas en un único handler de scroll con rAF.
  La sección actual es el último encabezado que ha cruzado una línea al 25% del
  viewport — mejor que un IntersectionObserver aquí, porque las secciones cortas
  pueden dejar cero encabezados intersecando y el resaltado parpadea.
- El estado va en `.toc-link` dentro de `global.css` y se dispara con
  `aria-current="true"`, que pone el script. Es el mismo patrón que los reveals:
  estado acoplado a JS fuera de las utilidades.
- Dos variantes: `rail` (aside pegajoso en desktop) y `disclosure` (un `<details>`
  nativo sobre el artículo en móvil, cero JS). Antes móvil no tenía índice.
- Solo `h2` y `h3`. Más niveles ensucian el rail y el `h1` es el título del post.

### 5.9 Bloques de código

`rehype-pretty-code` + Shiki con temas duales (`--shiki-light` / `--shiki-dark`).
Todo el estilado vive en `global.css` bajo
`figure[data-rehype-pretty-code-figure]`: título en `h-10`, líneas en `h-6`,
`max-h-[612px]`, resaltado por línea y diffs add/remove con variables
`--code-line-diff-*`. No estilar code blocks desde componentes.

---

## 6. Decoración y movimiento

### 6.1 Lenguaje decorativo — «tinta y papel»

| Elemento | Dónde | Cómo |
| --- | --- | --- |
| Grano de papel | `Base.astro`, capa `fixed` global | Tile SVG `feTurbulence` de ~500 B en `--paper-grain`, a `opacity-[0.035] mix-blend-multiply` (claro) / `dark:opacity-[0.07] dark:mix-blend-screen`. El color lo hereda del fondo por el blend |
| Regla dibujada a mano | `HandRule.astro` | Un `<path>` ondulado con `vector-effect="non-scaling-stroke"`. Separa bandas; se «entinta» al entrar en viewport |
| Trazo de rotulador | Una frase por sección | `relative isolate` + `before:` rotado `-1.2deg` con `-z-10` en `bg-accent-two/20..25` |
| Contorno desplazado | `Avatar.astro` | Borde de 1px en `accent-two/45` desplazado 8px, como un registro de imprenta mal alineado. Se acerca en hover |
| Forma orgánica estática | `rounded-pebble`, `rounded-leaf` | Radios asimétricos fijos. Sustituyen al blob que mutaba en bucle |
| Marcas de índice | Cabecera de sección | `01 —`, `02 —` en `font-mono text-xs uppercase tracking-[0.22em]` |

**`isolation: isolate` es obligatorio** en dos sitios, por motivos distintos:

1. En el contenedor de contenido de `Base.astro`. Sin su propio contexto de
   apilamiento, el contenido entra en el grupo de mezcla del grano y **las imágenes
   dejan de pintarse**.
2. En el `<span>` del trazo de rotulador. Su `before:` lleva `-z-10`, y el `<p>` que
   lo contiene lleva `data-reveal`: mientras dura el reveal, el `transform` crea un
   contexto de apilamiento que contiene al pseudo-elemento, pero al terminar
   (`transform: none`) ese contexto desaparece y el realce **se va detrás del fondo
   de la banda**. Se veía y luego desaparecía. Con `isolate` en el propio span el
   `-z-10` queda acotado a él.

**Regla general:** un `-z-*` dentro de algo que lleva `data-reveal` necesita su propio
contexto de apilamiento, o se romperá justo cuando acabe la animación.

### 6.2 Movimiento

Reveals al entrar en viewport, vía un único `IntersectionObserver` en
`src/scripts/reveal.ts` más clases en `global.css`. Sin framer-motion.

- Se marca con `data-reveal` (o `data-reveal="scale"` / `="side"`) y se escalona con
  `style="--reveal-delay:Nms"`. Duración 520ms, stagger de 45–90ms.
- El estado oculto vive bajo `html.js-reveal`, y esa clase **la añade el propio
  script**. Si el JS falla, si es un bot o si se pide menos movimiento, el contenido
  simplemente se ve.
- El script se registra en **`astro:page-load`**, nunca en `DOMContentLoaded`: con
  `<ClientRouter />` activo este último no vuelve a dispararse tras navegar.
- Solo se animan `opacity`, `transform` y `stroke-dashoffset`.
- Transiciones de interacción: `duration-200`. El drawer móvil usa `duration-300`.
- Nada de scroll-jacking, pinning ni scroll scrubbing.
- Las capas decorativas van siempre en contenedores `pointer-events-none aria-hidden`.

`prefers-reduced-motion: reduce` está cubierto en dos capas: el script no crea el
observer y no añade `js-reveal`, y un bloque global en `global.css` anula duraciones,
`scroll-smooth` y las View Transitions nativas.

---

## 7. Accesibilidad — no negociable

El proyecto ya cumple estos puntos; mantenerlos al añadir UI:

- `SkipLink.astro` como primer elemento del body, apuntando a `#main`.
- `aria-current={pathname === link.path ? "page" : false}` en todo enlace de nav.
- `aria-label` en header nav, footer nav, nav móvil y en el logo.
- El botón de menú móvil mantiene `aria-expanded` sincronizado en JS y usa
  `aria-haspopup="menu"`; el drawer gestiona `aria-hidden`.
- Iconos decorativos con `aria-hidden="true" focusable="false"`.
- `<section aria-label="Blog post list">` y `role="list"` donde el estilado podría
  eliminar la semántica.
- Toda imagen con `alt` descriptivo.
- Áreas táctiles mínimo `h-8 w-8`.
- `:focus-visible` global con contorno de 2px en `accent-two`. Usar `outline`, no
  `ring`: `ringOffsetColor` y `ringOffsetWidth` están desactivados en `corePlugins`.
- `prefers-reduced-motion` respetado en todo el sitio (§6.2).
- Los timelines son `<ol role="list">` con `role="list"` explícito: Safari + VoiceOver
  pierde la semántica de lista al aplicar `list-style: none`. El rail y los nodos se
  dibujan en CSS, sin elementos extra en el árbol de accesibilidad.
- `<section aria-labelledby>` apuntando al `id` del titular visible, mejor que
  `aria-label`, que duplica un texto que puede divergir.
- Nunca un `<button>` envolviendo `<h3>`/`<p>`: el nombre accesible del botón aplana
  todo el texto descendiente en una sola etiqueta y se pierde el encabezado.

---

## 8. Stack y convenciones de código

- **Astro 5**. Componente estático → `.astro`. Solo interactividad de cliente real
  justifica una isla. **No queda ningún `.tsx` en `src/`** y ninguna página envía una
  isla hidratada (`grep -c astro-island dist/<pagina>.html` → 0).
- ⚠️ **React sigue siendo necesario en build**, aunque no se envíe nada al cliente:
  los logos se importan con `?react` (`vite-plugin-svgr`), lo que genera componentes
  React que Astro renderiza en el servidor. Es decir, `@astrojs/react` y `react` **no
  se pueden quitar** mientras el logo se cargue así. `framer-motion`, `react-icons` y
  `react-dom` sí son retirables.
- Los tipos de `*.svg?react` vienen de `vite-plugin-svgr/client`, referenciado desde
  `src/env.d.ts`. Sin esa línea, cada import de logo es un error de `astro check`.
- **Datos compartidos en `src/data/`**: `career.ts` es la única fuente de verdad de la
  trayectoria (antes había dos copias que se contradecían), y `post.ts` concentra las
  consultas de posts (`getAllPosts`, `getLatestPosts`, `groupPostsByYear`,
  `getUniqueTagsWithCount`). Nada de consultas ad hoc en las páginas.
- **Primitivas en `src/components/ui/`**: `ButtonLink.astro`, `Avatar.astro`.
  Secciones de la home en `src/components/home/`, trayectoria en
  `src/components/career/`.
- **Tailwind 3.4** vía `@astrojs/tailwind`. Los estilos viven en las clases; solo
  va a `global.css` lo que no se puede expresar con utilidades (keyframes, variables
  de tema, estilado de HTML generado por markdown).
- **Biome** para lint y formato (`yarn lint`, `yarn format`). Indentación con
  **tabulador** en `.astro` y `.css`.
- Imports con alias `@/` (`@/components/...`, `@/layouts/...`).
- Iconos: `astro-icon` con los sets `hugeicons`, `mdi`, `solar`.
- Imágenes con `<Image>` de `astro:assets`, nunca `<img>` directo.
- Búsqueda con Pagefind (se indexa en `postbuild`).
- `yarn dev` para el servidor local; `yarn build` incluye la indexación.

---

## 9. Deuda conocida — no propagar

Marcado aquí para que ningún agente lo tome como patrón:

1. **Páginas aún sin migrar al sistema**: `/notes/`, `/series/` y `/404`. Siguen con
   los encabezados `.title` del tema base, sin marca de índice, sin `HandRule` y sin
   reveals. Son las tres rutas de menor tráfico y ninguna está enlazada desde el menú.
2. **Higiene de tags**: hay **304 tags únicos** para 124 posts. Duplicados
   español/inglés (`servidor`/`server`, `rendimiento`/`performance`) y varios que son
   frases enteras filtradas desde YAML corrupto. `/tags/` los expone todos; hace falta
   una limpieza del contenido, no del diseño.
3. **`!important` en los headings** de `global.css`, necesario hoy para ganar al
   plugin de typography. La única excepción documentada es `.display-heading` (§3.4).
   No añadir más. Restringir esas reglas a `.prose` es lo correcto a largo plazo, pero
   cinco rutas dependen de ellas fuera de `.prose`.
4. **`contact.astro` tiene dos backends de formulario a la vez**: publica a Formspree
   (`action=`) y además lleva los atributos de Netlify Forms (`data-netlify`,
   `netlify-honeypot`). Hay que elegir uno; el estilado ya está migrado.
5. **`yarn lint` no arranca**: `biome.json` usa claves de Biome v1 (`ignore`,
   `organizeImports`) y está instalado Biome v2.
6. **Restos del tema starter en el contenido**: ~17 posts de demo en `draft: true`, las
   dos series `citrus-docs`/`markdown-elements`, y `note/welcome.md`.
7. **`header.svg?react`** no tiene declaración de tipos, de ahí uno de los 3 errores
   de `astro check`. Los otros dos son de satori en la ruta OG.

---

## 10. Checklist antes de dar por terminado un cambio de UI

- [ ] Sin hex literales nuevos; todo con tokens semánticos.
- [ ] Verificado en claro **y** oscuro con el `ThemeToggle`.
- [ ] Verificado a 320px, 768px y 1280px, y sin scroll horizontal
      (`document.documentElement.scrollWidth`; el `overflow-x-hidden` del `html`
      puede enmascararlo).
- [ ] `rounded-lg`, `hover:brightness-110` y los tokens de acento reutilizados en
      lugar de inventar variantes.
- [ ] Sin `shadow-*` nuevas.
- [ ] Reveals comprobados con *prefers-reduced-motion: reduce*: todo visible al
      cargar y `html` **sin** la clase `js-reveal`.
- [ ] Ninguna isla de cliente nueva sin interactividad real
      (`grep -c astro-island dist/<pagina>.html`).
- [ ] Nav/botones nuevos con `aria-label` y `aria-current` donde aplique, y foco
      visible en cada parada al tabular.
- [ ] Imágenes vía `<Image>` importadas desde `src/assets/`, nunca desde `public/`
      (eso emite el asset dos veces), con `alt`.
- [ ] `yarn check` sin errores nuevos respecto al baseline (hoy 3, todos en §9).
- [ ] No se ha copiado ninguno de los patrones de la sección 9.
