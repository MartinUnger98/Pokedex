let currentPokemonId = 1;
let pokemonListDiv = document.getElementById('pokemonList');
let pokemonIndexGlobal = "";

// Laden aller Pokémon
const allPokemon = [];

async function loadAllPokemon() {
  for (let i = 1; i <= 151; i++) {
    const pokemonData = await fetchPokemonData(i);
    allPokemon.push(pokemonData);
  }
}


function loadNextPokemon() {
  if (currentPokemonId <= 151) { // Assuming only gen1
    fetchPokemonData(currentPokemonId);
    currentPokemonId++;
  }
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
      <img class="pokemonImg" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
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

// Load the first Pokemon card and automatically load the rest
loadNextPokemon();

// Automatically load the next Pokemon every 2 seconds (adjust the interval as needed)
setInterval(loadNextPokemon, 0.00000005);

// Function to display the overlay with more information about the selected pokemon
async function displayOverlay(pokemonIndex) {
  pokemonIndexGlobal = pokemonIndex;
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
    <div class="pokemonInfo">${pokemonInfo}</div>
    <div class="pokemonStats">${statsInfo}</div>
    <img class="pokemonImg" src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
    
    <button onclick="previousPokemon(${pokemonIndex})">Previous</button>
    <button onclick="nextPokemon(${pokemonIndex})">Next</button>
  </div>
  `;
}

function statHTML(stat, statValue) {
  return `
  <div class="stat-container">
    <div class="stat-name">${stat.stat.name}</div>
    <div class="progress" role="progressbar" aria-label="Example with label">
      <div class="progress-bar" style="width: ${statValue}%">${statValue}</div>
    </div>
  </div>
`;
}

function closeOverlay() {
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


document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowRight") {
    nextPokemon(pokemonIndexGlobal);
  }
  if (event.code === "ArrowLeft") {
    previousPokemon(pokemonIndexGlobal);
  }

  if (event.code === "Escape") {
    closeOverlay();
  }
});


const searchInput = document.getElementById('searchInput');
const filteredPokemonList = document.getElementById('filteredPokemonList');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredPokemon = allPokemon.filter(pokemon => pokemon.name.startsWith(searchTerm));
  displayFilteredPokemon(filteredPokemon);
});

function displayFilteredPokemon(pokemonList) {
  filteredPokemonList.innerHTML = '';
  for (const pokemon of pokemonList) {
    const typesImages = pokemon.types.map(type => `<img class="typeImg" src="img/${type.type.name}.svg">`).join('');
    const pokemonInfo = `${typesImages}`;
    filteredPokemonList.innerHTML += pokemonCardHTML(pokemon, pokemonInfo, pokemon.id);
  }
}


// Ladevorgang am Anfang
loadAllPokemon().then(() => {
  displayFilteredPokemon(allPokemon);
});


