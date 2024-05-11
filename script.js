"enable strict";

// selectors
const searchBtn = document.querySelector("#searchFormBtn");
const searchFormTxt = document.querySelector("#recipe");
const recipes = document.querySelector(".recipes");
const nextPageBtn = document.querySelector("#nextPageBtn");
const PrevPageBtn = document.querySelector("#PrevPageBtn");
const moveBtnsDiv = document.querySelector(".moveBtns");
const allRecipes = document.querySelectorAll(".recipe");
const recipeWindow = document.querySelector(".recipeWindow");
const ingredientsDiv = document.querySelector(".ingredients");
const BookmarkRecipeBtn = document.querySelector("#BookmarkRecipeBtn");
const modal = document.querySelector(".modal");
const bookmarksLI = document.querySelector(".bookmarksLI");
const logo = document.querySelector(".logo");
const bookmarkEntry = document.querySelector(".bookmarkEntry");
const AddRecipeBtn = document.querySelector("#AddRecipeBtn");
//function that takes search txt input (q) and returns forkify request link
function retRequest(q) {
  // return `https://forkify-api.herokuapp.com/api/search?q=${q}`;
  return `https://forkify-api.herokuapp.com/api/v2/recipes?search=${q}`;
}

let bookmarks = [];
let data;
let Dataa;

function handleSearch() {
  if (recipes.innerHTML != "") recipes.innerHTML = "";
  data = [];
  const req = retRequest(searchFormTxt.value); // makes the API request to return the search value
  const promise = fetch(req)
    .then((res) => res.json())
    .then((Data) => {
      Dataa = Data.data;

      let count;
      if (data.length == 0) {
        data = Dataa.recipes;
      } else {
        for (i = 0; i < 5; i++) { // checks if the first 5 elements are already in data[], which would mean that the two arrays are probably the same
          if (data[i].id == Data.data.id) {
            count++;
          }
          if (count == 5) return;
          else { // if they're not the same, make Dataa.recipe = data
            data = Dataa.recipe;
          }
        }
      }
      data.forEach((elem) => {
        elem.clicked = 0;
      });
    });

  searchFormTxt.value = "";
  return promise;
}

newRenderedArr = {
  arr: [],
  index: 0,
};

function renderArr(data) {
  console.log(`data is `);
  console.log(data);
  recipes.innerHTML = "";
  for (i = 0; i < data.length; i++) {
    let src = data[i].image_url;
    let publisher = data[i].publisher;
    let title = data[i].title;

    html = `<div class="recipe" id="0${i}">
    <img
      src="${src}"
    />
    <div class=recipeBottom>
      <p class="RecipeWindowHeading">${title}</p>
      <p class="recipePublisher">${publisher}</p>
    </div>
  </div>`;
    recipes.insertAdjacentHTML("beforeend", html);
  }
}

function divideData() {
  newRenderedArr.arr = [];
  newArr = [];
  let count = 0;
  for (i = 0; i < data.length; i++) {
    if (count % 8 == 0 && count != 0) {
      newRenderedArr.arr.push(newArr);
      newArr = [];
    }
    newArr.push(data[i]);
    count++;

    if (i == data.length - 1) newRenderedArr.arr.push(newArr);
  }

  console.log(newRenderedArr);
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let promise = handleSearch().then(() => {
    divideData();
    renderArr(newRenderedArr.arr[0]);
  }); // renders recipes in side bar
});

moveBtnsDiv.addEventListener("click", function (e) {
  console.log(e);
  if (e.target == nextPageBtn) {
    if (newRenderedArr.index < newRenderedArr.arr.length - 1) {
      renderArr(newRenderedArr.arr[newRenderedArr.index + 1]);
      newRenderedArr.index++;
      console.log(
        `index is ${newRenderedArr.index} and length is ${newRenderedArr.arr.length} `
      );
    }
  } else if (e.target == PrevPageBtn) {
    if (newRenderedArr.index > 0) {
      renderArr(newRenderedArr.arr[newRenderedArr.index - 1]);
      newRenderedArr.index--;
      console.log(
        `index is ${newRenderedArr.index} and length is ${newRenderedArr.arr.length} `
      );
    }
  }
}); // event propagation

// render recipe on click
let clickedRecipe;
let recipeTitle;
let recipePublisher;
let foundRecipe;

let ingredientsHTML;
let fullRecipe;

retListHTML = function (ingredients, Class) {
  console.log(`ingredients is:`);
  console.log(ingredients);
  let html = `<div class="${Class}">
  <ul>`;
  ingredients.forEach((elem, index, arr) => {
    if (Class == "ingridients dark" && index == Math.floor(arr.length / 2)) {
      html += "</ul> <ul>";
    }
    console.log(elem)

    Class == "ingridients dark"
      ? (html += `<li>${elem.quantity != null ? elem.quantity : ""} ${
          elem.unit
        } ${elem.description}`)
      : (html += `<a href="#" class="bookmarkElem id=${index}"><li class="bookmarksLI id=${index}"> <div class="bookmarkEntry" id=${index}> <img id=${index} src="${elem.image_url}" /><h5 id=${index}>${elem.title} </h5> </div>
      </li></a>`);
  });
  html += "</ul>";
  return html;
};

async function getAdditionalData(recipe_id) {
  // 1) fetches request  2)updates foundRecipe to be new requested recipe 3)creates ingredientsHTML  4)returns new recipe
  // okay.. what if this recipe was already fetched before ? then:
  // 1) fetch but keep clicked = 1.. foundrecipe = data.find(recipe => recipe.id == recipe_id)
  let getFromBookmarks = bookmarks.find((recipe) => {
    console.log("bookmarks: ", bookmarks, "recipe: ", recipe)
    return recipe?.id == recipe_id;
  });
  if (!getFromBookmarks) {
    console.log(`recipe_id is ${recipe_id}`);
    bookmarks;
    let Res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${recipe_id}?`
    );
    fullRecipe = await Res.json(); // additional Data Recipe
    foundRecipe = fullRecipe.data.recipe;
    console.log(foundRecipe);
  } else foundRecipe = getFromBookmarks;
  isRecipeExists = data.find(
    (recipe) =>
      recipe.servings == foundRecipe.servings && recipe.id == recipe_id
  );

  console.log(`isRecipeExists is ${isRecipeExists}`);
  if (isRecipeExists == undefined) {
    console.log(`in line 189`);
    // if this recipe is not in data[] , put it in data
    let indexFound = data.findIndex((recipe) => {
      recipe.id == recipe_id;
    });
    data[indexFound] = foundRecipe;
    console.log(`foundRecipe is now `);
    console.log(foundRecipe);
  } else {
    console.log(`in line 200`);
    foundRecipe = isRecipeExists;
    if (bookmarks.includes(foundRecipe)) foundRecipe.clicked = 1;
    console.log(foundRecipe);
  }
  console.log(`recipe_id is ${recipe_id}`);
  console.log(foundRecipe);
  ingredientsHTML = retListHTML(foundRecipe.ingredients, "ingridients dark");
  console.log(`in l196`);

  return foundRecipe;
}

let HTML1, HTML2;

formRecipeHTML = () => {
  // <h1 class="recipeWindowHeading">${recipeTitle}</h1>
  HTML1 = `<div class="imgContainer">
      <img
      src="${foundRecipe.image_url}"
      />
      </div>
      <h1 class="recipeWindowHeading">${foundRecipe.title}</h1>
      <div class="recipeSummary light">
      <div class="p1">
      <h3>${foundRecipe.cooking_time} minutes</h3>
      <h3>${foundRecipe.servings} servings</h3>
      </div>
      <button class="recipe__love ${
        foundRecipe.clicked == 1 ? "Liked" : ""
      }">like this Recipe</button>
      </div>
      `;

  HTML2 = `</div>
      <div class="cookingProcedure light">
      <h1 class="recipeWindowHeading">How to Cook It</h1>
      <p>This recipe was carefully designed and tested by ${foundRecipe.publisher}. Please check out directions at their website.</p>
      <a href="${foundRecipe.source_url}"><button class="directionsBtn">Directions &#8594</button></a>
      </div>`;
};

select_RecipeSelectors = (e) => {
  clickedRecipe = e.target.closest(".recipe");
  recipeTitle = clickedRecipe.querySelector(".RecipeWindowHeading").innerHTML;
  recipePublisher = clickedRecipe.querySelector(".recipePublisher").innerHTML;

  foundRecipe = data.find(
    (elem) => elem.title == recipeTitle && elem.publisher == recipePublisher
  );
};

updateFoundRecipe = () => {};

async function renderRecipe(e) {
  recipeWindow.innerHTML = "";
  select_RecipeSelectors(e);
  console.log(foundRecipe.id);
  let promise = await getAdditionalData(foundRecipe.id); // get recipe ingredients -- older code before modification

  let foundRecipeIndex = data.findIndex(
    (elem) => elem.title == recipeTitle && elem.publisher == recipePublisher
  );

  data[foundRecipeIndex] = foundRecipe;

  console.log(`foundRecipeIndex is ${foundRecipeIndex} and data is: `);

  formRecipeHTML();
  // recipeWindow.innerHTML = htmL;
  recipeWindow.insertAdjacentHTML("beforeend", HTML1);
  recipeWindow.insertAdjacentHTML("beforeend", ingredientsHTML);
  recipeWindow.insertAdjacentHTML("beforeend", HTML2);

  recipeLikeBtn = document.querySelector(".recipe__love");
  recipeLikeBtn.addEventListener("click", (e) => {
    console.log(`in line 268`);
    e.preventDefault();
    foundRecipe.clicked = true;
    for (let recipe of data) {
      if (recipe.id == foundRecipe.id) {
        recipe.clicked = 1;
        data[foundRecipeIndex].clicked = 1;
      }
    }
    data.find((elem) => elem.id == foundRecipe.id);
    if (!bookmarks.includes(foundRecipe)) bookmarks.push(foundRecipe);
    console.log(`bookmarks is now:`);
    console.log(bookmarks);
    console.log(`and data is now`);
    console.log(data);
    // recipeLikeBtn.style.backgroundColor = "#f59a83";
    recipeLikeBtn.classList.add("Liked");
    syncLocalBookmarks();
  });
  syncLocalBookmarks();
  printLocalStorage();
  return promise;
}

let recipeLikeBtn;
recipes.addEventListener("click", (e) => {
  // e.preventDefault();
  if (e.target == recipes) return;
  renderRecipe(e);
});

// bookmarks container

let bookmarkElem;

handleBookMarkClick = (e) => {
  e.preventDefault();
  console.log(`line 289`);
  e.preventDefault();
  console.log(e);

  // locate clicked Recipe from bookmarks
  // found recipe = clicked recipe
  console.log(`e.target.id is ${e.target.id}`);
  foundRecipe = bookmarks[e.target.id];
  console.log(`clicked BookMark is`);
  console.log(foundRecipe);
  formRecipeHTML();
  // recipeWindow.innerHTML = htmL;
  console.log(recipeWindow);
  recipeWindow.innerHTML = "";
  recipeWindow.insertAdjacentHTML("beforeend", HTML1);
  ingredientsHTML = retListHTML(foundRecipe.ingredients, "ingridients dark");
  console.log(`foundRecipe.ingredients is : `);
  console.log(foundRecipe.ingredients);
  console.log(`ingredientsHTML is `);
  console.log(ingredientsHTML);
  recipeWindow.insertAdjacentHTML("beforeend", ingredientsHTML);
  recipeWindow.insertAdjacentHTML("beforeend", HTML2);
};

addBookMarkListener = () => {
  bookmarkElem.addEventListener("click", (e) => {
    e.preventDefault();
    handleBookMarkClick(e);
  });
};

modal.addEventListener("click", (e) => {
  e.preventDefault();
  handleBookMarkClick(e);
});

BookmarkRecipeBtn.addEventListener("mouseover", () => {
  modal.innerHTML = "";
  modal.style.display = "block";
  if (bookmarks.length != 0) {
    // display liked recipes
    let html = retListHTML(bookmarks, "");
    modal.insertAdjacentHTML("beforeend", html);
    html = "";
    bookmarkElem = document.querySelector(".bookmarkElem");

    console.log(`line 296`);

    addBookMarkListener();
  }
});

BookmarkRecipeBtn.addEventListener("mouseout", () => {
  setTimeout(() => {
    modal.style.display = "none";
    modal.innerHTML = "";
  }, 3000);
});

modal.addEventListener("mouseover", () => {
  modal.style.display = "block";
});

logo.addEventListener("click", () => {
  document.location.reload();
});

// add bookmarks to local storage
syncLocalBookmarks = () => {
  let count = 0;
  // empty localStorage
  localStorage.clear();
  for (elem of bookmarks) {
    localStorage.setItem(count, JSON.stringify(elem));
    count++;
  }
};

window.addEventListener("load", () => {
  const items = { ...localStorage };
  console.log(items);
  for (i = 0; i < localStorage.length; i++) {
    entry = JSON.parse(localStorage.getItem(i));
    // fill bookmarks
    bookmarks.push(entry);
  }
  localStorage.clear();
});

printLocalStorage = () => {
  const items = { ...localStorage };
  console.log(items);
};

let addRecipeDiv;
let recipeUploadBtn;

let renderAddRecipeWindow = () => {
  let addReciptHTML = `      <div id="AddRecipeDiv">
  <div class="addRecipeSection" id="o1">
    <h3>Recipe Data</h3>
    <div class="required">
      <label>Title</label>
      <input />
      <label>source URL</label>
      <input />
      <label>Image URL</label>
      <input />
      <label>Publisher</label>
      <input />
      <label>Cooking Time</label>
      <input />
      <label>Servings</label>
      <input />
    </div>
  </div>
  <div class="addRecipeSection" id="o2">
    <h3>Ingredients</h3>
    <div id="02">
      <label >Ingredient 1</label>
      <input placeholder="Format: 'Quantity,Unit,Description'"/>
      <label>Ingredient 2</label>
      <input placeholder="Format: 'Quantity,Unit,Description'"/>
      <label>Ingredient 3</label>
      <input placeholder="Format: 'Quantity,Unit,Description'" />
      <label>Ingredient 4</label>
      <input placeholder="Format: 'Quantity,Unit,Description'"/>
      <label>Ingredient 5</label>
      <input placeholder="Format: 'Quantity,Unit,Description'"/>
      <label>Ingredient 6</label>
      <input placeholder="Format: 'Quantity,Unit,Description'"/>
    </div>
  </div>
  <button id="recipeUploadBtn"> Upload Now</button>
</div>`;
  document.querySelector("body").insertAdjacentHTML("beforeend", addReciptHTML);
};

function Recipe(
  cooking_time,
  id,
  image_url,
  ingredients = [],
  publisher,
  servings,
  source_url,
  title
) {
  this.cooking_time = cooking_time;
  this.id = id;
  this.image_url = image_url;
  this.ingredients = ingredients;
  this.publisher = publisher;
  this.servings = servings;
  this.source_url = source_url;
  this.title = title;
}
function Ingredient(quantity, unit, desc) {
  this.quantity = quantity;
  this.unit = unit;
  this.description = this.description;
}
let currRecipe;

let createRecipeObject = (addRecipeSections) => {
  currRecipe = new Recipe();
  for (k = 0; k < addRecipeSections.length; k++) {
    let formDivs = addRecipeSections.item(k).querySelector("div");
    let RequiredDivElements = formDivs.children;
    for (i = 0; i < RequiredDivElements.length; i = i + 2) {
      let fieldName = RequiredDivElements.item(i).innerHTML; // gets the fieldName from the Dom
      // fieldname: 1)capital letter--> small letter && 2)replace " " with "_"
      fieldName = fieldName.replace(" ", "_").toLowerCase();
      let value = RequiredDivElements.item(i + 1).value;
      `fieldName.split("_").includes("ingredient") is ${fieldName
        .split("_")
        .includes("ingredient")}`;
      if (!fieldName.split("_").includes("ingredient")) {
        currRecipe[fieldName] = RequiredDivElements.item(i + 1).value;
      } else if (value != "") {
        let Ing = new Ingredient(); // {}
        let ingArr = RequiredDivElements.item(i + 1).value.split(","); //[0.5, kg, carrot]
        Ing.quantity = ingArr[0];
        Ing.unit = ingArr[1];
        Ing.description = ingArr[2];
        currRecipe.ingredients.push(Ing);
      }
    }
  }
  return currRecipe;
};
// Add Recipe

isEmptyy = (div) => {
  let inputs = div.querySelectorAll("input");
  for (i of inputs) {
    console.log(`i.value is ${i.value}`);
    if (i.value == "") return 1;
  }
  return 0;
};

toggleElement = (element) => {
  if (element.style.display === "none") {
    element.style.display = "";
  } else {
    element.style.display = "none";
  }
};

let addedRecipes = 0;
let addRecipe = () => {
  addedRecipes++;
  if (!addRecipeDiv) {
    renderAddRecipeWindow();
  } else toggleElement(addRecipeDiv);

  // show window
  addRecipeDiv = document.getElementById("AddRecipeDiv");
  let requiredDiv = document.querySelector("#AddRecipeDiv .required");
  addRecipeSections = document.querySelectorAll(".addRecipeSection");
  recipeUploadBtn = document.querySelector("#recipeUploadBtn");
  recipeUploadBtn.addEventListener("click", (e) => {
    // if required fields not empty
    let Bool = !isEmptyy(requiredDiv);
    console.log(`Bool is ${Bool}`);
    if (Bool) {
      let recipeObj = createRecipeObject(addRecipeSections);
      e.preventDefault();
      recipeObj.id = addedRecipes;
      bookmarks.push(recipeObj);
      addRecipeDiv.style = "";
      toggleElement(addRecipeDiv);
    }
  });
  // are required forms filled ?
  // remove Recipehtml
};

AddRecipeBtn.addEventListener("click", addRecipe);

console.log("testing git");
