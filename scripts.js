let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  let modalContainer = document.querySelector('#modal-container');

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }
  function getAll() {
    return pokemonList;
  }

function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listpokemon = document.createElement("li");
    listpokemon.classList.add("list-group-item");

    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary", "button-class");
    button.innerText = pokemon.name;
    
    // Set data-target and data-toggle attributes using dot notation
    button.setAttribute("data-target", "#exampleModal");
    button.setAttribute("data-toggle", "modal");

    listpokemon.appendChild(button);
    pokemonList.appendChild(listpokemon);

    button.addEventListener("click", function(event) {
        showDetails(pokemon);
    });
}

  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
        //console.log(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }
  
document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the form from submitting and refreshing the page
  let searchQuery = document.querySelector(".form-control").value.toLowerCase(); // Get the search query from the input field and convert to lowercase for case-insensitive comparison
  let foundPokemon = pokemonRepository.getAll().find(function(pokemon) {
    return pokemon.name.toLowerCase() === searchQuery; // Check if the name of the Pokemon matches the search query
  });
  if (foundPokemon) {
    pokemonRepository.showDetails(foundPokemon); // Show modal for the found Pokemon
  } else {
    alert("Pokemon not found!"); // Display an alert if the Pokemon is not found
  }
});

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.abilities = details.abilities;
    }).catch(function (e) {
      console.error(e);
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
        showModal(item);
    });
  }

function showModal(item) {
  let modalBody = document.querySelector(".modal-body");
  let modalTitle = document.querySelector(".modal-title");
  let modalHeader = document.querySelector(".modal-header");
  //clear exisiting content of the modal
  //modalHeader.empty();
  modalTitle.innerText = "";
  modalBody.innerText = "";

  //creating element for name in modal content
  let nameElement = document.createElement("h1");
  nameElement.innerText = item.name;
  //creating img in modal content
  let imageElementFront = document.createElement("img"); 
  imageElementFront.className = "modal-img";
  imageElementFront.style = "width 50%"
  imageElementFront.src = item.imageUrl
  //create element for height in modal content
  let heightElement = document.createElement("p");
  heightElement.innerText = "height: " + item.height;
  //create element for weight in modal cotent
  let weightElement = document.createElement("p");
  weightElement.innerText = "weight: " + item.weight;
  //create element for type in modal content
  let abilitiesElement = document.createElement("p");
  abilitiesElement.innerText = "abilities: " + item.abilities;
  //create empty array
  let abilityNames = []
  item.abilities.forEach(function (elem){
    if(!elem.is_hidden){
            console.log(elem.ability.name);
      abilityNames.push(elem.ability.name);
    }
  });  
  //for formatting if the number of abilityNames is greater than 1 then join (concatenate)
  //with a comma ", ".  Don't forget the space after the comma.
  //pokemon pidgeotto has two abilities
  let abilities_str = ""
  if(abilityNames.length > 1){
    abilities_str = abilityNames.join(", ")
  }
  else{
    //if there is just one abilityNames then just use that
    if(abilityNames.length == 1) {
      abilities_str = abilityNames[0]
    }
    //if there are no abilityNames then return None.
    else{
      abilities_str = "None"
    }
  }
    
  abilitiesElement.innerText = "types : " + abilities_str;

  modalTitle.append(nameElement);
  modalBody.append(imageElementFront);
  modalBody.append(heightElement);
  modalBody.append(weightElement);
  modalBody.append(abilitiesElement);
}

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal
  };
})();


pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
    
  });
});
