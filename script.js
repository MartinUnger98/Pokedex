let currentPokemonId = 1;
let pokemonListDiv = document.getElementById('pokemonList');
let pokemonIndexGlobal = "";
let pokemonNames_Ids = [];
let currentGen = "gen1";
let gens = {
  gen1: {
    start: 1,
    end: 151
  },
  gen2: {
    start: 152,
    end: 251
  },
  gen3: {
    start: 252,
    end: 386
  },
  gen4: {
    start: 387,
    end: 493
  },
  gen5: {
    start: 494,
    end: 649
  },
  gen6: {
    start: 650,
    end: 721
  },
  gen7: {
    start: 722,
    end: 809
  },
};
let evolutionImgs = {};
let overlayKeydown = false;
let searchKeydown = false;

function loadmore() {
  document.getElementById('loadAni').classList.remove('d-none');
  let end = gens[currentGen].end;
  loadAllPokemon(currentPokemonId, end);
}

function selectGen(gen) {
  currentGen = gen;
  currentPokemonId = gens[gen].start;
  let start = gens[gen].start;
  let end = gens[gen].end;
  document.getElementById('loadingBarContainer').classList.remove('d-none');
  document.getElementById('loadmore').classList.add('d-none');
  document.getElementById('loadingtxt').classList.remove('d-none');
  document.getElementById('loadingtxt').innerHTML = "Loading " + currentGen.toUpperCase();
  loadAllPokemon(start, end);
}


async function loadAllPokemon(start, end) {
  let amountMore = 20;
  if(start + amountMore > end) {
    amountMore = end - start;
  };
  let number = 1;
  const promises = [];
  while (currentPokemonId <= start + amountMore) {
      promises.push(await fetchPokemonData(currentPokemonId));
      updateLoadingBar(number, amountMore);
      currentPokemonId++;
      number++;
  }
  await Promise.all(promises);
  
/* 
  while (currentPokemonId <= start + amountMore) {
    await fetchPokemonData(currentPokemonId);
    updateLoadingBar(start + amountMore);
    currentPokemonId++;
  } */

  showLoadedPokemon((start + amountMore), start);
  document.getElementById('loadingBarContainer').classList.add('d-none');
  document.getElementById('loadAni').classList.add('d-none');
  document.getElementById('pokemonList').classList.remove('d-none');
  document.getElementById("loadmore").classList.remove('d-none');
  document.getElementById('loadingbackground').classList.add('h-0');
  document.getElementById('loadingtxt').classList.add('d-none');
  disableGens(false);
  searchKeydown = true;

}


async function fetchPokemonData(pokemonId) {
  let responsAsJSON = await getResponseAsJSON(pokemonId);
  displayPokemonCard(responsAsJSON);
  pushEvolutionImg(responsAsJSON, pokemonId);
}


async function pushEvolutionImg(pokemonData, pokemonId) {
  let images = await getEvolutionImg(pokemonData);
  evolutionImgs[pokemonId] = images;
}


async function getResponseAsJSON(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  let response = await fetch(url);
  let responsAsJSON = await response.json();
  return responsAsJSON;
}

function displayPokemonCard(pokemonData) {
  if(pokemonNames_Ids.includes(pokemonData.name + ':' + pokemonData.id) === false) {
    pokemonNames_Ids.push(pokemonData.name + ':' + pokemonData.id);
  };  
  let pokemonCard = document.getElementById("pokemonList");
  let typesImages = pokemonData.types.map(type => `<img class="typeImg" src="img/${type.type.name}.svg">`).join('');
  let pokemonInfo = `${typesImages}`;
  let pokemonIndex = pokemonData.id 
  pokemonCard.innerHTML += pokemonCardHTML(pokemonData, pokemonInfo, pokemonIndex);
}

function displayErrorMessage() {
  let errorCard = document.createElement('div');
  errorCard.classList.add('error-card');
  errorCard.classList.add('text-center');
  errorCard.textContent = 'Pokemon not found.';
  pokemonListDiv.appendChild(errorCard);
}





