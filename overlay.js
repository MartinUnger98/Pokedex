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
    let evolutionImgArray = evolutionImgs[pokemonIndex];
    let evolutionImg = createEvolutionImg(evolutionImgArray);
    overlay.innerHTML = overlayHTML(pokemonData, pokemonInfo, statsInfo, pokemonIndex, evolutionImg);
  }

  function createEvolutionImg(evolutionImgArray) {
    let evolutionImges = "";
    for (let i = 0; i < evolutionImgArray.length; i++) {
        const element = evolutionImgArray[i];
        evolutionImges += `<img class="img100x100" src="${element}">`;
    }
    return evolutionImges;
  }

  async function pushEvolutionImg(pokemonData, pokemonId) {
    let images = await getEvolutionImg(pokemonData);
    evolutionImgs[pokemonId] = images;
  }

  async function getEvolutionImg(pokemonData) {
    let urlSpecies = pokemonData.species.url;
    let responseSpecies = await fetch(urlSpecies);
    let responsAsJSONSpecies = await responseSpecies.json();
    let urlChain = responsAsJSONSpecies.evolution_chain.url;
    let responseChain = await fetch(urlChain);
    let responsAsJSONChain = await responseChain.json(); 
    let evolutionnames = getEvolutionArray(responsAsJSONChain);
    let evolutionImg = getEvolutionImages(evolutionnames);
    return evolutionImg;
  }

  function getEvolutionArray(responsAsJSONChain) {
    let evolutionnames = [];
    if (responsAsJSONChain.chain.evolves_to.length === 0) {
        evolutionnames.push(responsAsJSONChain.chain.species.name);
    }
    else if (responsAsJSONChain.chain.evolves_to[0].evolves_to.length === 0) {
        evolutionnames.push(responsAsJSONChain.chain.species.name);
        evolutionnames.push(responsAsJSONChain.chain.evolves_to[0].species.name);
    }
    else {
        evolutionnames.push(responsAsJSONChain.chain.species.name);
        evolutionnames.push(responsAsJSONChain.chain.evolves_to[0].species.name);
        evolutionnames.push(responsAsJSONChain.chain.evolves_to[0].evolves_to[0].species.name);
    }
    return evolutionnames;
  }

  async function getEvolutionImages(evolutionnames) {
    let evolutionImg = [];
    for (let i = 0; i < evolutionnames.length; i++) {
        const evolutions = evolutionnames[i];
        let responsAsJSON = await getResponseAsJSON(evolutions);
        evolutionImg.push(responsAsJSON.sprites.other["official-artwork"].front_default);        
    }
    return evolutionImg;
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