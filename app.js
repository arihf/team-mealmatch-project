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
    ],
    tags: ["vegetarian", "quick"]
  },
  {
    id: 2,
    name: "Veggie Stir-Fry",
    description: "Colorful vegetables sautéed with soy sauce.",
    ingredients: ["carrot", "broccoli", "soy sauce", "oil"],
    steps: [
      "Chop all vegetables into bite-sized pieces.",
      "Heat oil in a pan over medium heat.",
      "Add vegetables and stir-fry for 5–7 minutes.",
      "Add soy sauce and cook for another 2 minutes."
    ],
    tags: ["vegetarian", "low-fat", "quick"]
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
    ],
    tags: ["high-protein"]
  }
];

// -------------------- State --------------------
let favoriteIds = [];
let userHistory = { viewed: [], favorites: [] };
let currentTab = "tab-all"; // track active tab
let lastListTab = "tab-all"; // to return after detail

// -------------------- Element References --------------------
const tabs = document.querySelectorAll(".tab-button");
const tabSections = document.querySelectorAll(".tab-section");
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const recipeDetailSection = document.getElementById("recipe-detail-section");

const detailTitleEl = document.getElementById("detail-title");
const detailIngredientsEl = document.getElementById("detail-ingredients");
const detailStepsEl = document.getElementById("detail-steps");
const detailMetaEl = document.getElementById("detail-meta");

const dietaryCheckboxes = document.querySelectorAll("#dietary-filters input[type=checkbox]");
const clearFiltersBtn = document.getElementById("clear-filters");
const noResultsEl = document.getElementById("no-results");

// -------------------- Tab Switching --------------------
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    switchTab(tab.dataset.tab);
  });
});

function switchTab(tabId) {
  currentTab = tabId;
  tabSections.forEach(sec => sec.style.display = "none");
  document.getElementById(tabId).style.display = "block";
  tabs.forEach(t => t.classList.remove("active"));
  document.querySelector(`.tab-button[data-tab=${tabId}]`).classList.add("active");
}

// -------------------- Favorite Logic --------------------
function toggleFavorite(recipeId) {
  if (favoriteIds.includes(recipeId)) {
    favoriteIds = favoriteIds.filter(id => id !== recipeId);
  } else {
    favoriteIds.push(recipeId);
  }
  userHistory.favorites = [...favoriteIds];
  renderFavorites();
  renderRecipes();
  renderRecommendations();
}

// -------------------- Render Recipes --------------------
function renderRecipes() {
  recipesListEl.innerHTML = "";
  let filtered = [...recipes];

  // Apply dietary filters
  const selectedTags = Array.from(dietaryCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (selectedTags.length > 0) {
    filtered = filtered.filter(r => selectedTags.every(tag => r.tags.includes(tag)));
  }

  if (filtered.length === 0) {
    noResultsEl.style.display = "block";
  } else {
    noResultsEl.style.display = "none";
  }

  filtered.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    const favBtn = document.createElement("button");
    favBtn.className = "favorite-button";
    favBtn.textContent = favoriteIds.includes(recipe.id) ? "★ Favorited" : "☆ Favorite";
    if (favoriteIds.includes(recipe.id)) favBtn.classList.add("favorited");
    favBtn.addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(recipe.id);
    });

    header.appendChild(title);
    header.appendChild(favBtn);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    recipesListEl.appendChild(card);
  });
}

// -------------------- Render Favorites --------------------
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

    const removeBtn = document.createElement("button");
    removeBtn.className = "favorite-button favorited";
    removeBtn.textContent = "Remove ★";
    removeBtn.addEventListener("click", () => toggleFavorite(recipe.id));

    header.appendChild(title);
    header.appendChild(removeBtn);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    favoritesListEl.appendChild(card);
  });
}

// -------------------- Recommendations --------------------
function getRecommendations() {
  const interacted = [...new Set([...userHistory.viewed, ...userHistory.favorites])];
  return recipes.filter(r => !interacted.includes(r.id)).slice(0,5);
}

function renderRecommendations() {
  recommendationsListEl.innerHTML = "";
  const recs = getRecommendations();
  if (recs.length === 0) {
    recommendationsListEl.innerHTML = "<p class='muted'>No recommendations yet. Interact with some recipes!</p>";
    return;
  }
  recs.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    const title = document.createElement("h3");
    title.textContent = recipe.name;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));
    card.appendChild(title);
    recommendationsListEl.appendChild(card);
  });
}

// -------------------- Detail View --------------------
function showRecipeDetail(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  if (!userHistory.viewed.includes(recipeId)) userHistory.viewed.push(recipeId);

  lastListTab = currentTab;

  tabSections.forEach(sec => sec.style.display = "none");
  recipeDetailSection.style.display = "block";

  detailTitleEl.textContent = recipe.name;

  // Ingredients
  detailIngredientsEl.innerHTML = "";
  recipe.ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    detailIngredientsEl.appendChild(li);
  });

  // Steps
  detailStepsEl.innerHTML = "";
  recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    detailStepsEl.appendChild(li);
  });

  // Meta
  detailMetaEl.textContent = `Tags: ${recipe.tags.join(", ")}`;
}

// -------------------- Back Button --------------------
document.getElementById("back-to-list").addEventListener("click", () => {
  recipeDetailSection.style.display = "none";
  switchTab(lastListTab);
});

// -------------------- Dietary Filters --------------------
dietaryCheckboxes.forEach(cb => cb.addEventListener("change", renderRecipes));
clearFiltersBtn.addEventListener("click", () => {
  dietaryCheckboxes.forEach(cb => cb.checked = false);
  renderRecipes();
});

// -------------------- Refresh Recommendations --------------------
document.getElementById("refresh-recommendations").addEventListener("click", renderRecommendations);

// -------------------- Initial Render --------------------
renderRecipes();
renderFavorites();
renderRecommendations();
