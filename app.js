// Simple mock recipe data with ingredients for shopping list.
const recipes = [
  {
    id: 1,
    name: "Spaghetti Marinara",
    description: "Simple pasta with tomato sauce.",
    ingredients: ["spaghetti", "tomato sauce", "garlic", "olive oil", "salt"]
  },
  {
    id: 2,
    name: "Veggie Stir-Fry",
    description: "Colorful vegetables sautéed with soy sauce.",
    ingredients: ["broccoli", "carrots", "bell pepper", "soy sauce", "garlic"]
  },
  {
    id: 3,
    name: "Chicken Tacos",
    description: "Tortillas filled with seasoned chicken and toppings.",
    ingredients: ["chicken", "tortillas", "lettuce", "cheese", "salsa"]
  }
];

// This will store the IDs of favorite recipes
let favoriteIds = [];

// This will store the user's available ingredients (all lowercase)
let myIngredients = [];

// --- Get references to HTML elements ---

// Recipes / Favorites
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById(
  "favorites-empty-message"
);

// My Ingredients
const ingredientInputEl = document.getElementById("ingredient-input");
const addIngredientButtonEl = document.getElementById("add-ingredient-button");
const myIngredientsListEl = document.getElementById("my-ingredients-list");

// Shopping List
const shoppingListItemsEl = document.getElementById("shopping-list-items");
const shoppingListMessageEl = document.getElementById("shopping-list-message");

// Weekly Meal Plan
const mealPlanListEl = document.getElementById("meal-plan-list");
const mealPlanMessageEl = document.getElementById("meal-plan-message");
const generateMealPlanButtonEl = document.getElementById(
  "generate-meal-plan-button"
);
generateMealPlanButtonEl.addEventListener("click", generateMealPlan);


// --- Event listeners for "My Ingredients" ---

addIngredientButtonEl.addEventListener("click", addIngredient);
ingredientInputEl.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addIngredient();
  }
});

// Add an ingredient the user has on hand
function addIngredient() {
  const rawValue = ingredientInputEl.value.trim();
  if (!rawValue) return;

  const ingredient = rawValue.toLowerCase();

  // Avoid duplicates
  if (!myIngredients.includes(ingredient)) {
    myIngredients.push(ingredient);
  }

  ingredientInputEl.value = "";
  renderMyIngredients();
}

// Render the list of ingredients the user has
function renderMyIngredients() {
  myIngredientsListEl.innerHTML = "";

  if (myIngredients.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No ingredients added yet.";
    myIngredientsListEl.appendChild(li);
    return;
  }

  myIngredients.forEach((ingredient, index) => {
    const li = document.createElement("li");
    li.textContent = ingredient;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-ingredient-button";
    removeButton.textContent = "x";

    removeButton.addEventListener("click", () => {
      myIngredients.splice(index, 1);
      renderMyIngredients();
    });

    li.appendChild(removeButton);
    myIngredientsListEl.appendChild(li);
  });
}

// --- Render all recipes with favorite + shopping buttons ---

function renderRecipes() {
  recipesListEl.innerHTML = "";

  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const favButton = document.createElement("button");
    favButton.className = "favorite-button";

    const isFavorite = favoriteIds.includes(recipe.id);
    favButton.textContent = isFavorite ? "★ Favorited" : "☆ Favorite";
    if (isFavorite) {
      favButton.classList.add("favorited");
    }

    favButton.addEventListener("click", () => {
      toggleFavorite(recipe.id);
    });

    header.appendChild(title);
    header.appendChild(favButton);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    const shoppingButton = document.createElement("button");
    shoppingButton.className = "shopping-button";
    shoppingButton.textContent = "Show Shopping List";

    shoppingButton.addEventListener("click", () => {
      showShoppingList(recipe);
    });

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(shoppingButton);
    recipesListEl.appendChild(card);
  });
}

// --- Favorites section ---

function renderFavorites() {
  favoritesListEl.innerHTML = "";

  const favoriteRecipes = recipes.filter((recipe) =>
    favoriteIds.includes(recipe.id)
  );

  if (favoriteRecipes.length === 0) {
    favoritesEmptyMessageEl.style.display = "block";
    return;
  }

  favoritesEmptyMessageEl.style.display = "none";

  favoriteRecipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const removeButton = document.createElement("button");
    removeButton.className = "favorite-button favorited";
    removeButton.textContent = "Remove ★";

    removeButton.addEventListener("click", () => {
      toggleFavorite(recipe.id);
    });

    header.appendChild(title);
    header.appendChild(removeButton);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    card.appendChild(header);
    card.appendChild(desc);
    favoritesListEl.appendChild(card);
  });
}

// Add or remove a recipe from favorites
function toggleFavorite(recipeId) {
  if (favoriteIds.includes(recipeId)) {
    favoriteIds = favoriteIds.filter((id) => id !== recipeId);
  } else {
    favoriteIds.push(recipeId);
  }

  renderRecipes();
  renderFavorites();
}

// --- Shopping list logic ---

function showShoppingList(recipe) {
  shoppingListItemsEl.innerHTML = "";

  if (myIngredients.length === 0) {
    shoppingListMessageEl.textContent =
      "Add your ingredients first so we can calculate what you're missing.";
    return;
  }

  const missing = recipe.ingredients.filter((ingredient) => {
    const normalized = ingredient.toLowerCase();
    return !myIngredients.includes(normalized);
  });

  if (missing.length === 0) {
    shoppingListMessageEl.textContent = `You already have all ingredients for ${recipe.name}!`;
    return;
  }

  shoppingListMessageEl.textContent = `Missing ingredients for ${recipe.name}:`;

  missing.forEach((ingredient) => {
    const li = document.createElement("li");
    li.textContent = ingredient;
    shoppingListItemsEl.appendChild(li);
  });
}

// --- Weekly Meal Plan logic ---

// Simple approach:
// - We build a 5-day plan (Mon–Fri)
// - Prefer favorite recipes if there are enough
// - Otherwise fill with other recipes
// - Avoid repeating the same recipe if possible

function generateMealPlan() {
  mealPlanListEl.innerHTML = "";

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Start from favorites if there are any
  const favoriteRecipes = recipes.filter((recipe) =>
    favoriteIds.includes(recipe.id)
  );

  // Copy arrays so we don't mutate originals
  const availableFavorites = [...favoriteRecipes];
  const availableOthers = recipes.filter(
    (recipe) => !favoriteIds.includes(recipe.id)
  );

  if (recipes.length === 0) {
    mealPlanMessageEl.textContent =
      "No recipes available to build a meal plan yet.";
    return;
  }

  mealPlanMessageEl.textContent =
    "Here is your suggested plan for the week:";

  days.forEach((day) => {
    let chosenRecipe = null;

    if (availableFavorites.length > 0) {
      // Use a favorite first
      chosenRecipe = availableFavorites.shift();
    } else if (availableOthers.length > 0) {
      // Fall back to non-favorites
      chosenRecipe = availableOthers.shift();
    } else {
      // If we run out, just reuse any recipe
      chosenRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    }

    const li = document.createElement("li");

    const daySpan = document.createElement("span");
    daySpan.className = "meal-plan-day";
    daySpan.textContent = day + ":";

    const recipeSpan = document.createElement("span");
    recipeSpan.textContent = chosenRecipe.name;

    li.appendChild(daySpan);
    li.appendChild(recipeSpan);
    mealPlanListEl.appendChild(li);
  });
}


// --- Initial render when the page loads ---
renderMyIngredients();
renderRecipes();
renderFavorites();
