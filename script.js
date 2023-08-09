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

function selectGen(gen) {
  let pokemonlist = document.getElementById("pokemonList");
  if(pokemonlist.childElementCount !== 0) {
    clearAll();
  }
  currentGen = gen;
  currentPokemonId = gens[gen].start;
  let end = gens[gen].end;
  loadAllPokemon(end);
}


async function loadAllPokemon(end) {
  while (currentPokemonId <= end) {
    await fetchPokemonData(currentPokemonId);
    updateLoadingBar();
    currentPokemonId++;
  }
  // Alle Pokemon sind geladen, Ladebalken ausblenden
  document.getElementById('loadingBarContainer').style.display = 'none';
  document.getElementById('pokemonList').classList.remove('d-none');
  document.getElementById("resetBtn").disabled = false;
  document.getElementById("searchBtn").disabled = false;
  searchKeydown = true;

}

function updateLoadingBar() {
  const loadingBar = document.getElementById('loadingBar');
  const progress = (currentPokemonId / 151) * 100; // Berechne Fortschritt in Prozent
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
  <div class="pokemon-card ${pokemonData.types[0].type.name}" onclick="displayOverlay(${pokemonIndex})">
    <h2>${pokemonData.name.toUpperCase()}</h2>
    <div class="flexCenter">
      <div class="pokemonInfo" >${pokemonInfo}</div>
      <img class="pokemonImg scale" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
    </div>
  </div>
`;
}

function displayErrorMessage() {
  let errorCard = document.createElement('div');
  errorCard.classList.add('error-card');
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
  let pokemonInfo = `<h2>${pokemonData.name.toUpperCase()}</h2>${typesImages}`;


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
    <div class="overlayHeader">
      <div class="pokemonInfo">${pokemonInfo}</div>
      <div>
        <img class="closeBtn" src="img/schliessen.png" onclick="closeOverlay()">
      </div>
    </div>
    <div class="pokemonStats">${statsInfo}</div>
    <div class="spacebetweenCenter">
      <img class="next_previous" src="img/linker-pfeil.png" onclick="previousPokemon(${pokemonIndex})"">
      <img class="pokemonImg" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
      <img class="next_previous" src="img/rechter-pfeil.png" onclick="nextPokemon(${pokemonIndex})"">
    </div>
  </div>
  `;
}

function statHTML(stat, statValue) {
  return `
  <div class="stat-container">
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
  if(pokemonIndex < 151) {
    pokemonIndex++;
    displayOverlay(pokemonIndex);
  }
}

function previousPokemon(pokemonIndex) {
  if(pokemonIndex > 1) {
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
    reset();
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

async function reset() {
  searchKeydown = false;
  document.getElementById("searchInput").value = "";
  document.getElementById("resetBtn").disabled = true;
  document.getElementById("searchBtn").disabled = true;
  currentPokemonId = 1;
  document.getElementById('loadingBar').style.width = "0%";
  document.getElementById('loadingBarContainer').style.display = "";
  document.getElementById('pokemonList').classList.add('d-none');
  await clearAll();
  await selectGen(currentGen);
  
}

selectGen(currentGen);
