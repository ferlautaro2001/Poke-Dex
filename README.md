# Poke-Dex — Aplicación de consulta de Pokémon

Aplicación web que consume la [PokeAPI](https://pokeapi.co/) y muestra tarjetas con imagen, tipo, medidas y estadísticas base de los Pokémon de la primera generación.

## Índice

1. [Descripción](#descripción)
2. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Funcionalidades actuales](#funcionalidades-actuales)
5. [Flujo de datos](#flujo-de-datos)
6. [Detalle por archivo](#detalle-por-archivo)
7. [Modelo de datos (`PokemonStats`)](#modelo-de-datos-pokemonstats)
8. [Limitaciones conocidas](#limitaciones-conocidas)
9. [Próximas funcionalidades](#próximas-funcionalidades)
10. [Tecnologías](#tecnologías)
11. [Recursos](#recursos)

---

## Descripción

Poke-Dex carga Pokémon por ID (del **1 al 150**), obtiene sus datos desde la API y los renderiza en un grid de tarjetas. Cada tarjeta incluye:

- Nombre e imagen (sprite `dream_world` de la PokeAPI)
- Tipo principal
- Altura y peso (unidades crudas de la API: decímetros y hectogramos)
- Stats base: HP, Attack, Defense, Speed, Special Attack y Special Defense

La lógica está organizada en módulos ES6 (`api`, `ui`, `main`) con documentación JSDoc, incluido el tipo `PokemonStats` compartido entre capas.

---

## Cómo ejecutar el proyecto

1. Clona o descarga el repositorio.
2. Sirve la carpeta con un servidor local (los módulos ES6 requieren HTTP, no basta con abrir `index.html` como `file://` en muchos navegadores):
   - Extensión **Live Server** en VS Code / Cursor, o
   - `npx serve .` desde la raíz del proyecto.
3. Abre la URL que indique el servidor (por ejemplo `http://localhost:3000`).

La primera carga puede tardar algunos milisegundos: se hace **una petición HTTP por Pokémon**, de forma **secuencial**.

---

## Estructura del proyecto

```
Poke-Dex/
├── index.html          # Punto de entrada HTML
├── README.md
├── css/
│   └── styles.css      # Tema oscuro, grid de tarjetas, hover
└── js/
    ├── main.js         # Orquestación e inicio en DOMContentLoaded
    ├── api/
    │   └── pokeApi.js  # peticionApi(), obtenerStats(), typedef PokemonStats
    └── ui/
        └── renderer.js # crearItem(pokemon)
```

---

## Funcionalidades actuales

| Área | Implementación |
|------|----------------|
| **API** | `peticionApi(url)` — GET con `fetch`, validación `response.ok`, errores relanzados |
| **Datos** | `obtenerStats(idPokemon)` — normaliza nombre, imagen, tipo, altura, peso y stats |
| **UI** | `crearItem(pokemon)` — inserta tarjetas en `#sec1` con stats visibles |
| **Arranque** | `DOMContentLoaded` → `cargarPokemones()` |
| **Almacenamiento en memoria** | Array `listaPokemones` en `main.js` (útil para futuros filtros) |
| **Documentación en código** | JSDoc en todos los módulos JS |

---

## Flujo de datos

```
index.html
    └── <script type="module" src="./js/main.js">
            │
            ▼
        main.js
            │  for (id 1..150)
            ├─► pokeApi.js → obtenerStats(id)
            │       └─► peticionApi("https://pokeapi.co/api/v2/pokemon/{id}/")
            │
            └─► renderer.js → crearItem(pokemon)
                    └─► insertAdjacentHTML en #sec1
```

---

## Detalle por archivo

### `index.html`

- Contenedor vacío `<section id="sec1">` rellenado por JavaScript.
- Estilos en `./css/styles.css`.
- Script principal: `./js/main.js` con `type="module"` y `defer`.

### `css/styles.css`

- Reset básico y tema oscuro (`#0a0a0a` / `#1a1a1a`).
- Grid de **4 columnas** fijas en `#sec1`.
- Tarjetas (`#sec1 > div`) con borde verde, hover con escala y sombra.
- Imágenes `.pokeimg` a 200×200px.
- Clase `.type` con `text-transform: capitalize`.

> **Nota:** No hay media queries; el layout no es responsive en pantallas pequeñas.

### `js/main.js`

```javascript
import { obtenerStats } from './api/pokeApi.js';
import { crearItem } from './ui/renderer.js';

async function cargarPokemones() {
  let listaPokemones = [];
  for (let i = 1; i < 151; i++) {
    listaPokemones.push(await obtenerStats(i));
    crearItem(listaPokemones[i - 1]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    cargarPokemones();
  } catch (error) {
    console.log('Error: ' + error);
  }
});
```

- Carga IDs **1 a 150** (`i < 151`).
- Peticiones en serie (`await` dentro del `for`).

### `js/api/pokeApi.js`

| Export | Descripción |
|--------|-------------|
| `peticionApi(url)` | Wrapper de `fetch` + JSON |
| `obtenerStats(idPokemon)` | Devuelve un objeto `PokemonStats` |

La imagen se toma de `sprites.other.dream_world.front_default`. Las stats se mapean dinámicamente desde `data.stats` usando el nombre de stat de la API (`hp`, `attack`, `special-attack`, etc.).

### `js/ui/renderer.js`

```javascript
function crearItem(pokemon) {
  const contenedor = document.getElementById('sec1');
  const html = `
    <div class="item">
      <h3>${pokemon.name}</h3>
      <img src="${pokemon.img}" alt="${pokemon.name}" class="pokeimg">
      <div class="stats">
        <p class="type">Type: ${pokemon.type}</p>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <!-- HP, Attack, Defense, Speed, Special Attack/Defense -->
      </div>
    </div>
  `;
  contenedor.insertAdjacentHTML('beforeend', html);
}
```

- Recibe un objeto `pokemon` (`PokemonStats`), no parámetros sueltos.
- Las estadísticas se muestran **directamente en la tarjeta** (no hay modal ni botón).

---

## Modelo de datos (`PokemonStats`)

Definido con `@typedef` en `pokeApi.js` y referenciado en `renderer.js`:

| Propiedad | Tipo | Origen / notas |
|-----------|------|----------------|
| `name` | `string` | Nombre del Pokémon |
| `img` | `string \| null` | `dream_world.front_default` |
| `type` | `string` | Primer tipo en `types[0]` |
| `height` | `number` | Decímetros (API) |
| `weight` | `number` | Hectogramos (API) |
| `hp`, `attack`, `defense`, `speed` | `number` | Stats base |
| `special-attack`, `special-defense` | `number` | Claves con guión, como en la API |

---

## Limitaciones conocidas

- **Rango:** se cargan 150 Pokémon (IDs 1–150), no el #151.
- **Rendimiento:** ~150 requests secuenciales para la UI.
- **Imágenes:** `dream_world` suele podría ser `null` en algun caso raro Pokémon; no hay fallback a `front_default` u otro sprite.
- **Posible error de Sync:** el `try/catch` en `DOMContentLoaded` no captura rechazos de la promesa de `cargarPokemones()`.

> Extras
- **Tipos:** solo se muestra el primer tipo; los dual-type no listan el segundo.
- **Unidades:** altura y peso sin convertir a metros/kg en la UI.

- **UX:** sin indicador de carga, mensajes de error en pantalla ni diseño responsive.
(`obtenerListaPokemones`, `limpiarContenedor`, etc.); por el momento.



## TODO's

### Fase 1 — Experiencia de 

- Convertir altura/peso a unidades legibles

### Fase 2 — Presentación de stats

- Definir forma mejor de mostrar stats

### Fase 3 — Filtros y orden

- Filtro por tipo
- Filtro por rangos de stats
- Ordenar por nombre, número, peso, velocidad, etc.

### Fase 4 — Búsqueda

- Búsqueda por nombre u otros criterios
- Criterios combinados

---

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura mínima y contenedor dinámico |
| CSS3 | Grid, tema oscuro, transiciones |
| JavaScript (ES modules) | Lógica modular `import` / `export` |
| Fetch API | Peticiones a PokeAPI |
| JSDoc | Tipado documental (`PokemonStats`, parámetros, retornos) |
| [PokeAPI v2](https://pokeapi.co/docs/v2) | Datos de Pokémon |

---

## Recursos

- [PokeAPI](https://pokeapi.co/)
- [Documentación PokeAPI v2](https://pokeapi.co/docs/v2)
- [MDN — Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [MDN — async/await](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN — Módulos JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules)
