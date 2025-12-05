// -------------------- Recipe Data --------------------
const recipes = [
  {
    id: 1,
    name: "Spaghetti Marinara",
    ingredients: ["pasta", "tomato sauce", "salt", "olive oil"],
    steps: [
      "Boil water and cook pasta according to package instructions.",
      "Heat olive oil in a pan and add tomato sauce.",
      "Combine pasta with sauce and serve."
    ]
  },
  {
    id: 2,
    name: "Veggie Stir-Fry",
    ingredients: ["carrot", "broccoli", "soy sauce", "oil"],
    steps: [
      "Chop all vegetables.",
      "Heat oil in a pan over medium heat.",
      "Add vegetables and stir-fry 5–7 minutes.",
      "Add soy sauce and cook 2 more minutes."
    ]
  },
  {
    id: 3,
    name: "Chicken Tacos",
    ingredients: ["chicken", "taco shells", "lettuce", "cheese", "salsa"],
    steps: [
      "Cook chicken with seasoning.",
      "Warm taco shells.",
      "Assemble tacos with toppings."
    ]
  }
];

// -------------------- State --------------------
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentRecipe = null;

// -------------------- Element References --------------------
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favEmptyMsg = document.getElementById("favorites-empty-message");
const detailSection = document.getElementById("recipe-detail-section");
const backBtn = document.getElementById("back-to-list");
const favBtn = document.getElementById("favorite-toggle");
const detailTitle = document.getElementById("detail-title");
const detailIngredients = document.getElementById("detail-ingredients");
const detailSteps = document.getElementById("detail-steps");

// -------------------- Rendering --------------------
function renderRecipes() {
  recipesListEl.innerHTML = "";
  recipes.forEach(r => {
    const el = document.createElement("div");
    el.className = "recipe-card";
    el.textContent = r.name;
    el.onclick = () => showRecipeDetail(r);
    recipesListEl.appendChild(el);
  });
}

function renderFavorites() {
  favoritesListEl.innerHTML = "";

  if (favorites.length === 0) {
    favEmptyMsg.style.display = "block";
    return;
  }

  favEmptyMsg.style.display = "none";

  favorites.forEach(id => {
    const r = recipes.find(x => x.id === id);
    if (!r) return;

    const el = document.createElement("div");
    el.className = "recipe-card";
    el.textContent = r.name;
    el.onclick = () => showRecipeDetail(r);
    favoritesListEl.appendChild(el);
  });
}

// -------------------- Detail View --------------------
function showRecipeDetail(recipe) {
  currentRecipe = recipe;
  detailTitle.textContent = recipe.name;

  detailIngredients.innerHTML = recipe.ingredients
    .map(i => `<li>${i}</li>`)
    .join("");

  detailSteps.innerHTML = recipe.steps
    .map(s => `<li>${s}</li>`)
    .join("");

  updateFavoriteButton();

  document.querySelector("main").style.display = "none";
  detailSection.style.display = "block";
}

function updateFavoriteButton() {
  if (favorites.includes(currentRecipe.id)) {
    favBtn.textContent = "Remove from Favorites";
  } else {
    favBtn.textContent = "Save to Favorites";
  }
}

// -------------------- Actions --------------------
favBtn.addEventListener("click", () => {
  if (!currentRecipe) return;

  if (favorites.includes(currentRecipe.id)) {
    favorites = favorites.filter(id => id !== currentRecipe.id);
  } else {
    favorites.push(currentRecipe.id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteButton();
  renderFavorites();
});

backBtn.addEventListener("click", () => {
  detailSection.style.display = "none";
  document.querySelector("main").style.display = "block";
});

// -------------------- Tabs --------------------
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-section").forEach(s => s.style.display = "none");
    document.getElementById(tab).style.display = "block";
  });
});

// -------------------- Init --------------------
renderRecipes();
renderFavorites();
