
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