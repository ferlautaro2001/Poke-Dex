import { obtenerStats } from './api/pokeApi.js';
import { crearItem } from './ui/renderer.js';

/**
 * Carga los Pokémon del 1 al 150, los guarda en memoria y renderiza cada tarjeta.
 * Hace una petición por Pokémon de forma secuencial.
 * @returns {Promise<void>}
 */
async function cargarPokemones() {

  let listaPokemones = [];

  for (let i = 1; i < 151; i++) {
    
    listaPokemones.push(await obtenerStats(i));
    
    crearItem(listaPokemones[i-1]);
  }
  
}

/**
 * Inicia la aplicación cuando el DOM está listo.
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  try {
    cargarPokemones();
  } catch (error) {
    console.log("Error: "+error)
  }
})