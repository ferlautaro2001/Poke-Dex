/**
 * Datos de un Pokémon normalizados para la UI.
 * Las stats base usan los mismos nombres que la PokeAPI (`special-attack`, etc.).
 * @typedef {Object} PokemonStats
 * @property {string} name - Nombre del Pokémon.
 * @property {string|null} img - URL del sprite frontal (`front_default`).
 * @property {string} type - Tipo principal (primer slot de `types`).
 * @property {number} height - Altura en decímetros (unidad de la API).
 * @property {number} weight - Peso en hectogramos (unidad de la API).
 * @property {number} [hp] - Stat base de PS.
 * @property {number} [attack] - Stat base de ataque.
 * @property {number} [defense] - Stat base de defensa.
 * @property {number} [speed] - Stat base de velocidad.
 * @property {number} ["special-attack"] - Stat base de ataque especial.
 * @property {number} ["special-defense"] - Stat base de defensa especial.
 */

/**
 * Realiza una petición HTTP GET a la PokeAPI y devuelve el JSON.
 * @param {string} url - URL completa del recurso a consultar.
 * @returns {Promise<Record<string, unknown>>} Cuerpo de la respuesta parseado como JSON.
 * @throws {Error} Si la respuesta no es OK o falla la red o el parseo.
 */
async function peticionApi(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Error:", error);
    throw error; // opcional pero recomendado
  }
}

/**
 * Obtiene y normaliza la información de un Pokémon por ID o nombre.
 * @param {number|string} idPokemon - ID numérico o nombre en la PokeAPI (ej. `25`, `"pikachu"`).
 * @returns {Promise<PokemonStats>} Objeto listo para renderizar en tarjetas.
 * @throws {Error} Propaga errores de {@link peticionApi}.
 */
async function obtenerStats(idPokemon) {
  const data = await peticionApi(`https://pokeapi.co/api/v2/pokemon/${idPokemon}/`);

  const estadisticas = {};
  estadisticas.height = data.height;
  estadisticas.weight = data.weight;
  estadisticas.type = data.types[0].type.name;
  estadisticas.name = data.name;
  estadisticas.img = data.sprites.other.dream_world.front_default;

  // data.stats.forEach(element => {
  //   console.log(element)
  //   estadisticas.hp = element.base_stat;
  //   estadisticas.attack = element.base_stat
  // });

  // TODO: Averiguar bien estructura de la API en este caso.

  data.stats.forEach(element => {
    estadisticas[element.stat.name] = element.base_stat;
  });

  return estadisticas;
}

export {peticionApi, obtenerStats};

