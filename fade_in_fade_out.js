function showLoadedPokemon(end, start) {
    for (let i = start; i <= end; i++) {
      document.getElementById("pokeID" + i).classList.remove('d-none');    
    }
  }
  
  function updateLoadingBar(start, end) {
    let loadingBar = document.getElementById('loadingBar');  
    let progress = (start / (end + 1)) * 100; // Berechne Fortschritt in Prozent
    loadingBar.style.width = `${progress}%`;
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
  