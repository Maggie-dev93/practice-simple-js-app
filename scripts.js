function createNavbar() {
  // Create navbar elements
  let navbar = document.createElement("nav");
  navbar.classList.add("navbar", "navbar-expand-lg", "navbar-light", "bg-light");

  let containerDiv = document.createElement("div");
  containerDiv.classList.add("container-fluid");

  let brandLink = document.createElement("a");
  brandLink.classList.add("navbar-brand");
  brandLink.href = "#";
  brandLink.textContent = "Pokedex";

  let togglerButton = document.createElement("button");
  togglerButton.classList.add("navbar-toggler");
  togglerButton.type = "button";
  togglerButton.setAttribute("data-bs-toggle", "collapse");
  togglerButton.setAttribute("data-bs-target", "#navbarNav");
  togglerButton.setAttribute("aria-controls", "navbarNav");
  togglerButton.setAttribute("aria-expanded", "false");
  togglerButton.setAttribute("aria-label", "Toggle navigation");
  togglerButton.innerHTML = `<span class="navbar-toggler-icon"></span>`;

  let collapseDiv = document.createElement("div");
  collapseDiv.classList.add("collapse", "navbar-collapse");
  collapseDiv.id = "navbarNav";

  let navbarList = document.createElement("ul");
  navbarList.classList.add("navbar-nav");

  let listItem1 = document.createElement("li");
  listItem1.classList.add("nav-item");
  let link1 = document.createElement("a");
  link1.classList.add("nav-link");
  link1.href = "#";
  link1.textContent = "Home";
  listItem1.appendChild(link1);

   // Append elements
   collapseDiv.appendChild(navbarList);
   containerDiv.appendChild(brandLink);
   containerDiv.appendChild(togglerButton);
   containerDiv.appendChild(collapseDiv);
   navbar.appendChild(containerDiv);
 
   // Append navbar to the document
   document.body.insertBefore(navbar, document.body.firstChild);
 }
 
 createNavbar();

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
button.dataset.target = "#exampleModal";
button.dataset.toggle = "modal";

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
    
  typesElement.innerText = "types : " + abilities_str;

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
