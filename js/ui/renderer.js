/** URL local cuando la API no devuelve sprite. */
const PLACEHOLDER_IMG = "./assets/placeholder.svg";

/**
 * Devuelve la URL de imagen del Pokémon o el placeholder si es null.
 * @param {string|null} img - URL del sprite desde la API.
 * @returns {string}
 */
function urlImagen(img) {
  return img ?? PLACEHOLDER_IMG;
}

/**
 * Crea una tarjeta HTML con los datos del Pokémon y la añade a `#sec1`.
 * @param {import('../api/pokeApi.js').PokemonStats} pokemon - Datos devueltos por `obtenerStats`.
 * @returns {void}
 */
function crearItem(pokemon) {
  const contenedor = document.getElementById("sec1");
  const html = `
    <div class="item">
      <h3>${pokemon.name}</h3>
      <img src="${urlImagen(pokemon.img)}" alt="${pokemon.name}" class="pokeimg" loading="lazy" width="200" height="200">
      
      <div class="stats">
        
        <p class="type">Type: ${pokemon.type}</p>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>HP: ${pokemon.hp}</p>
        <p>Attack: ${pokemon.attack}</p>
        <p>Defense: ${pokemon.defense}</p>
        <p>Speed: ${pokemon.speed}</p>
        <p>Special Attack: ${pokemon["special-attack"]}</p>
        <p>Special Defense: ${pokemon["special-defense"]}</p>
      </div>

    </div>
  `;
  contenedor.insertAdjacentHTML('beforeend', html);
}

export {crearItem};