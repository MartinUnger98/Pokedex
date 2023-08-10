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
let overlayKeydown = false;
let searchKeydown = false;
let loadingCount = 15;

document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowRight" && overlayKeydown === true) {
    nextPokemon(pokemonIndexGlobal);
  }
  if (event.code === "ArrowLeft" && overlayKeydown === true) {
    previousPokemon(pokemonIndexGlobal);
  }

  if (event.code === "Escape" && overlayKeydown === true) {
    closeOverlay();
  }

  if (event.code === "Enter" && searchKeydown === true) {
    searchPokemon();
  }
});

function loadmore() {

  loadAllPokemon(currentPokemonId);
}

function selectGen(gen) {
  currentGen = gen;
  currentPokemonId = gens[gen].start;
  let start = gens[gen].start;
  loadAllPokemon(start);
}


async function loadAllPokemon(start) {
  while (currentPokemonId <= start+15) {
    await fetchPokemonData(currentPokemonId);
    updateLoadingBar(start+15);
    currentPokemonId++;
  }
  // Alle Pokemon sind geladen, Ladebalken ausblenden alles disablen auf false
  document.getElementById('loadingBarContainer').style.display = 'none';
  document.getElementById('pokemonList').classList.remove('d-none');
  document.getElementById("resetBtn").disabled = false;
  document.getElementById("searchBtn").disabled = false;
  disableGens(false);
  searchKeydown = true;

}

function updateLoadingBar(end) {
  let loadingBar = document.getElementById('loadingBar');  
  let progress = (currentPokemonId / end) * 100; // Berechne Fortschritt in Prozent
  loadingBar.style.width = `${progress}%`;
}

async function fetchPokemonData(pokemonId) {
  let responsAsJSON = await getResponseAsJSON(pokemonId);
  displayPokemonCard(responsAsJSON);
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

function pokemonCardHTML(pokemonData, pokemonInfo, pokemonIndex) {
  return `
  <div class="pokemon-card ${pokemonData.types[0].type.name} text-center" onclick="displayOverlay(${pokemonIndex})">
    <div class="d-flex justify-content-between">
      <h2>#${pokemonData.id}</h2>
      <h2>${pokemonData.name.toUpperCase()}</h2>
    </div>    
    <div class="d-flex justify-content-center align-items-center">
      <div class="m-3" >${pokemonInfo}</div>
      <img class="pokemonImg" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
    </div>
  </div>
`;
}

function displayErrorMessage() {
  let errorCard = document.createElement('div');
  errorCard.classList.add('error-card');
  errorCard.classList.add('text-center');
  errorCard.textContent = 'Pokemon not found.';
  pokemonListDiv.appendChild(errorCard);
}

async function displayOverlay(pokemonIndex) {
  pokemonIndexGlobal = pokemonIndex;
  overlayKeydown = true;
  let pokemonData = await getResponseAsJSON(pokemonIndex);
  let overlay = document.getElementById("overlay");
  overlay.classList.remove('d-none');
  overlay.classList.add('overlay');
  let typesImages = pokemonData.types.map(type => `<img class="typeImg" src="img/${type.type.name}.svg">`).join('');
  let pokemonInfo = `<h2>#${pokemonData.id} ${pokemonData.name.toUpperCase()}</h2>${typesImages}`;


  let statsInfo = `<h3>Stats:</h3>`;
  for (let stat of pokemonData.stats) {
    let statValue = stat.base_stat
    statsInfo += statHTML(stat, statValue);
  }
  overlay.innerHTML = overlayHTML(pokemonData, pokemonInfo, statsInfo, pokemonIndex);
}

function overlayHTML(pokemonData, pokemonInfo, statsInfo, pokemonIndex) {
  return `
  <div class="overlay-content ${pokemonData.types[0].type.name}" onclick="doNotCloseOverlay(event)">
    <div class="d-flex justify-content-between">
      <div class="m-3">${pokemonInfo}</div>
      <div>
        <img class="img30x30 scale" src="img/schliessen.png" onclick="closeOverlay()">
      </div>
    </div>
    <div class="pokemonStats">${statsInfo}</div>
    <div class="d-flex justify-content-between align-items-center">
      <img class="img30x30 scale" src="img/linker-pfeil.png" onclick="previousPokemon(${pokemonIndex})"">
      <img class="pokemonImg noTransform" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
      <img class="img30x30 scale" src="img/rechter-pfeil.png" onclick="nextPokemon(${pokemonIndex})"">
    </div>
  </div>
  `;
}

function statHTML(stat, statValue) {
  return `
  <div class="d-flex align-items-center mb-1 gap-3">
    <div class="stat-name firstLetterUpper">${stat.stat.name}:</div>
    <div class="progress" role="progressbar" aria-label="Example with label">
      <div class="progress-bar" style="width: ${statValue}%">${statValue}</div>
    </div>
  </div>
`;
}

function closeOverlay() {
  overlayKeydown = false;
  let overlay = document.getElementById("overlay")
  overlay.classList.add("d-none");
}

function doNotCloseOverlay(event) {
  event.stopPropagation();
}

function nextPokemon(pokemonIndex) { 
  let end = gens[currentGen].end;
  if(pokemonIndex < currentPokemonId -1) {
    pokemonIndex++;
    displayOverlay(pokemonIndex);
  }
}

function previousPokemon(pokemonIndex) {
  let start = gens[currentGen].start;
  if(pokemonIndex > start) {
    pokemonIndex--;
    displayOverlay(pokemonIndex);
  }
}

function searchPokemon() {
  searchKeydown = false;
  clearAll();
  let pokemonStartswith = [];
  let search = document.getElementById("searchInput").value;
  if (search.length > 0) {
    search = search.toLowerCase();
    pokemonStartswith = pokemonNames_Ids.filter((pokemons) => pokemons.startsWith(search));
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
  }
  document.getElementById("searchInput").value = "";
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

function disableGens(boolean) {
  let length = document.getElementById("genContainer").childElementCount;
  for (let i = 1; i <= length; i++) {
    document.getElementById("gen" + i).disabled = boolean;    
  }
}

function setSelectedGenBackground(newgen) {
  let length = document.getElementById("genContainer").childElementCount;
  for (let i = 1; i <= length; i++) {
    document.getElementById("gen" + i).classList.remove("selected");
    document.getElementById("gen" + i).classList.add("gens");
  }
  document.getElementById(newgen).classList.add("selected");
  document.getElementById(newgen).classList.remove("gens");
}


