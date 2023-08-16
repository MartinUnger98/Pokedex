function searchPokemon() {
  searchKeydown = false;
  clearAll();
  let pokemonStartswith = [];
  let search = document.getElementById("searchInput").value;
  if (search.length > 0) {
    search = search.toLowerCase();
    pokemonStartswith = pokemonNames_Ids.filter((pokemons) => pokemons.includes(search));
    resultOrNoResult(pokemonStartswith);
  }
  else {
    reset(currentGen);
  };
}

function resultOrNoResult(pokemonStartswith) {
  if (pokemonStartswith.length > 0) {
    getIds(pokemonStartswith);
  } 
  else {
    showNoresults();
  }
}

function getIds(pokemonStartswith) {
  let ids = [];
  for (let i = 0; i < pokemonStartswith.length; i++) {
    let element = pokemonStartswith[i];
    ids.push(getIdinInt(element));
  }
  createSearchPokemons(ids);
}

async function createSearchPokemons(ids) {
  for (let j = 0; j < ids.length; j++) {
    let currentId = ids[j];
    await fetchPokemonData(currentId);
    document.getElementById("pokeID" + currentId).classList.remove('d-none');  
  }
  fadeInsFadeOutscreateSearchPokemon();
}

function showNoresults() {
  document.getElementById("noResultsFound").classList.remove('d-none');
  document.getElementById("loadmore").classList.add("d-none");
  document.getElementById("searchInput").value = "";
  document.getElementById("update").classList.remove("d-none");
  searchKeydown = true;
}

function clearAll() {
  let clearAll = document.getElementById("pokemonList");
  clearAll.innerHTML = "";
}

function getIdinInt(pokemon) {
  let id = pokemon.split(':')[1];
  id = parseInt(id);
  return id;
}

function reset(newgen) {
  clearAll();
  searchKeydown = false;
  pokemonNames_Ids = [];
  document.getElementById("searchInput").value = "";
  disableGens(true);
  setSelectedGenBackground(newgen);
  currentPokemonId = 1;
  fadeInsFadeOutsReset();
  selectGen(newgen); 
}

