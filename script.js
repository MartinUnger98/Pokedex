let currentPokemonId = 1;
let pokemonListDiv = document.getElementById('pokemonList');


function loadNextPokemon() {
  if (currentPokemonId <= 151) { // Assuming only gen1
    fetchPokemonData(currentPokemonId);
    currentPokemonId++;
  }
}

/* function loadPreviousPokemon() {
  if (currentPokemonId > 1) {
    currentPokemonId--;
    fetchPokemonData(currentPokemonId);
  }
} */

async function fetchPokemonData(pokemonId) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  let response = fetch(url);
  let responsAsJSON = response.json();
  displayPokemonCard(responsAsJSON);
    .then(response => response.json())
    .then(data => displayPokemonCard(data))
    .catch(error => {
      console.error('Error:', error);
      displayErrorMessage();
    });
}

function displayPokemonCard(pokemonData) {
  let pokemonCard = document.createElement('div');
  pokemonCard.classList.add('pokemon-card');
  pokemonCard.classList.add(pokemonData.types[0].type.name);
  pokemonCard.onclick = "displayOverlay(pokemonData)";

  let typesImages = pokemonData.types.map(type => `<img class="typeImg" src="img/${type.type.name}.svg">`).join('');
  let pokemonInfo = `<h2>${pokemonData.name.toUpperCase()}</h2>${typesImages}`;

  pokemonCard.innerHTML = `
    <div class="pokemonInfo" >${pokemonInfo}</div>
    <img class="pokemonImg" src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
  `;

  // Add onclick event to display the overlay when a pokemon card is clicked
  pokemonCard.onclick = () => displayOverlay(pokemonData);

  pokemonListDiv.appendChild(pokemonCard);
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
setInterval(loadNextPokemon, 2);

// Function to display the overlay with more information about the selected pokemon
function displayOverlay(pokemonData) {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
 
  const overlayContent = document.createElement('div');
  overlayContent.classList.add('overlay-content');
  overlayContent.classList.add(pokemonData.types[0].type.name);
  let typesImages = pokemonData.types.map(type => `<img class="typeImg" src="img/${type.type.name}.svg">`).join('');
  let pokemonInfo = `<h2>${pokemonData.name.toUpperCase()}</h2>${typesImages}`;

  let statsInfo = `<h3>Stats:</h3>`;
  for (const stat of pokemonData.stats) {
    const percentage = stat.base_stat
    statsInfo += `
      <div class="stat-container">
        <div class="stat-name">${stat.stat.name}</div>
        <div class="progress" role="progressbar" aria-label="Example with label">
          <div class="progress-bar" style="width: ${percentage}%">${percentage}</div>
        </div>
      </div>
    `;
  }

  overlayContent.innerHTML = `
    <div class="pokemonInfo">${pokemonInfo}</div>
    <div class="pokemonStats">${statsInfo}</div>
    <img class="pokemonImg" src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
    
    <button onclick="loadNextPokemon()">Previous</button>
    <button onclick="next">Next</button>
  `;

  overlay.appendChild(overlayContent);
  document.body.appendChild(overlay);

  // Add click event to close the overlay when clicking outside the content
  overlay.onclick = () => document.body.removeChild(overlay);
  
}


