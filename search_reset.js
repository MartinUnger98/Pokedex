function searchPokemon() {
    searchKeydown = false;
    clearAll();
    let pokemonStartswith = [];
    let search = document.getElementById("searchInput").value;
    if (search.length > 0) {
      search = search.toLowerCase();
      pokemonStartswith = pokemonNames_Ids.filter((pokemons) => pokemons.includes(search));
      getIds(pokemonStartswith);
    }
    else {
      reset(currentGen);
    };
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
    document.getElementById("searchInput").value = "";
    document.getElementById("loadmore").classList.add("d-none");
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
  
  async function reset(newgen) {
    searchKeydown = false;
    pokemonNames_Ids = [];
    document.getElementById("searchInput").value = "";
    document.getElementById("resetBtn").disabled = true;
    document.getElementById("searchBtn").disabled = true;
    disableGens(true);
    setSelectedGenBackground(newgen);
    currentPokemonId = 1;
    document.getElementById('loadingBar').style.width = "0%";
    document.getElementById('loadingBarContainer').style.display = "";
    document.getElementById('pokemonList').classList.add('d-none');
    clearAll();
    selectGen(newgen);
    
  }