// -------------------- Recipe Data --------------------
const recipes = [
  {
    id: 1,
    name: "Spaghetti Marinara",
    description: "Simple pasta with tomato sauce.",
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
    description: "Colorful vegetables sautéed with soy sauce.",
    ingredients: ["carrot", "broccoli", "soy sauce", "oil"],
    steps: [
      "Chop all vegetables into bite-sized pieces.",
      "Heat oil in a pan over medium heat.",
      "Add vegetables and stir-fry for 5-7 minutes.",
      "Add soy sauce and cook for another 2 minutes."
    ]
  },
  {
    id: 3,
    name: "Chicken Tacos",
    description: "Tortillas filled with seasoned chicken and toppings.",
    ingredients: ["chicken", "taco shells", "lettuce", "cheese", "salsa"],
    steps: [
      "Cook chicken in a pan with your favorite seasoning.",
      "Warm taco shells in the oven.",
      "Assemble tacos with chicken, lettuce, cheese, and salsa."
    ]
  }
];

// -------------------- State --------------------
let favoriteIds = [];
let userHistory = { viewed: [], favorites: [] };

// -------------------- Element References --------------------
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const recipeDetailSection = document.getElementById("recipe-detail-section");

// -------------------- Render Functions --------------------
function renderRecipes() {
  recipesListEl.innerHTML = "";
  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    const favButton = document.createElement("button");
    favButton.className = "favorite-button";
    favButton.textContent = favoriteIds.includes(recipe.id) ? "★ Favorited" : "☆ Favorite";
    if (favoriteIds.includes(recipe.id)) favButton.classList.add("favorited");

    favButton.addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(recipe.id);
    });

    header.appendChild(title);
    header.appendChild(favButton);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    recipesListEl.appendChild(card);
  });
}

function renderFavorites() {
  favoritesListEl.innerHTML = "";
  const favoriteRecipes = recipes.filter(r => favoriteIds.includes(r.id));
  if (favoriteRecipes.length === 0) {
    favoritesEmptyMessageEl.style.display = "block";
    return;
  }
  favoritesEmptyMessageEl.style.display = "none";

  favoriteRecipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    const removeButton = document.createElement("button");
    removeButton.className = "favorite-button favorited";
    removeButton.textContent = "Remove ★";
    removeButton.addEventListener("click", () => toggleFavorite(recipe.id));

    header.appendChild(title);
    header.appendChild(removeButton);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    favoritesListEl.appendChild(card);
  });
}

function toggleFavorite(recipeId) {
  if (favoriteIds.includes(recipeId)) favoriteIds = favoriteIds.filter(id => id !== recipeId);
  else favoriteIds.push(recipeId);

  userHistory.favorites = [...favoriteIds];
  renderRecipes();
  renderFavorites();
  renderRecommendations();
}

// -------------------- Recipe Detail View --------------------
function showRecipeDetail(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  // Track viewed
  if (!userHistory.viewed.includes(recipeId)) userHistory.viewed.push(recipeId);

  // Show detail section
  recipeDetailSection.style.display = "block";
  recipesListEl.parentElement.style.display = "none";
  favoritesListEl.parentElement.style.display = "none";
  recommendationsListEl.parentElement.style.display = "none";

  document.getElementById("detail-title").textContent = recipe.name;

  const ingList = document.getElementById("detail-ingredients");
  ingList.innerHTML = "";
  recipe.ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ingList.appendChild(li);
  });

  const stepList = document.getElementById("detail-steps");
  stepList.innerHTML = "";
  recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepList.appendChild(li);
  });
}

// Back button for detail view
document.getElementById("back-to-list").addEventListener("click", () => {
  recipeDetailSection.style.display = "none";
  recipesListEl.parentElement.style.display = "block";
  favoritesListEl.parentElement.style.display = "block";
  recommendationsListEl.parentElement.style.display = "block";

  renderRecipes();
  renderFavorites();
  renderRecommendations();
});

// -------------------- Recommendations --------------------
function getRecommendations() {
  const interactedIds = [...new Set([...userHistory.viewed, ...userHistory.favorites])];
  const recommended = recipes.filter(r => !interactedIds.includes(r.id));
  return recommended.slice(0, 5);
}

function renderRecommendations() {
  recommendationsListEl.innerHTML = "";
  const recs = getRecommendations();
  if (recs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No recommendations yet. Interact with some recipes!";
    recommendationsListEl.appendChild(p);
    return;
  }
  recs.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const title = document.createElement("h4");
    title.textContent = recipe.name;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    card.appendChild(title);
    recommendationsListEl.appendChild(card);
  });
}

// -------------------- Initial Render --------------------
renderRecipes();
renderFavorites();
renderRecommendations();
