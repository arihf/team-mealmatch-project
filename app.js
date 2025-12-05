// -------------------- Mock Recipe Data --------------------
const recipes = [
  {
    id: 1,
    name: "Spaghetti Marinara",
    description: "Simple pasta with tomato sauce.",
    ingredients: ["pasta", "tomato sauce", "salt", "olive oil"],
    tags: ["vegetarian", "quick"]
  },
  {
    id: 2,
    name: "Veggie Stir-Fry",
    description: "Colorful vegetables sautéed with soy sauce.",
    ingredients: ["carrot", "broccoli", "soy sauce", "oil"],
    tags: ["vegetarian", "low-fat", "quick"]
  },
  {
    id: 3,
    name: "Chicken Tacos",
    description: "Tortillas filled with seasoned chicken and toppings.",
    ingredients: ["chicken", "taco shells", "lettuce", "cheese", "salsa"],
    tags: ["high-protein"]
  },
  {
    id: 4,
    name: "Lo Mein",
    description: "Chinese-style noodles with vegetables.",
    ingredients: ["noodles", "soy sauce", "carrot", "cabbage", "oil"],
    tags: ["vegetarian"]
  },
  {
    id: 5,
    name: "Chia Pudding",
    description: "Healthy chia seed dessert with milk.",
    ingredients: ["chia seeds", "almond milk", "honey", "vanilla extract"],
    tags: ["vegan", "gluten-free"]
  },
  {
    id: 6,
    name: "Cheese Enchiladas",
    description: "Corn tortillas filled with cheese and topped with sauce.",
    ingredients: ["corn tortillas", "cheese", "enchilada sauce", "onion"],
    tags: ["vegetarian"]
  },
  {
    id: 7,
    name: "Chicken Noodle Soup",
    description: "Comforting soup with chicken and noodles.",
    ingredients: ["chicken", "noodles", "carrot", "celery", "salt"],
    tags: ["high-protein"]
  },
  {
    id: 8,
    name: "Mediterranean Salad",
    description: "Fresh salad with olives, cucumber, and tomatoes.",
    ingredients: ["cucumber", "tomato", "olives", "olive oil", "lemon juice"],
    tags: ["vegan", "gluten-free"]
  },
  {
    id: 9,
    name: "Vegetarian Quesadilla",
    description: "Tortilla with cheese and vegetables.",
    ingredients: ["tortilla", "cheese", "bell pepper", "onion"],
    tags: ["vegetarian"]
  },
  {
    id: 10,
    name: "Vegan Buddha Bowl",
    description: "Healthy bowl with grains and vegetables.",
    ingredients: ["quinoa", "chickpeas", "spinach", "avocado", "carrot"],
    tags: ["vegan", "gluten-free"]
  }
];

// -------------------- State --------------------
let ingredientsList = [];
let dietaryFilters = [];
let favoriteIds = [];

// -------------------- Element References --------------------
const tabs = document.querySelectorAll(".tab-button");
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const weeklyPlanEl = document.getElementById("weekly-plan");
const weeklyPlanEmptyEl = document.getElementById("weekly-plan-empty");
const planDaysEl = document.getElementById("plan-days");
const noResultsEl = document.getElementById("no-results");

// Ingredient input elements
const ingredientInput = document.createElement("input");
ingredientInput.type = "text";
ingredientInput.placeholder = "Type an ingredient";
ingredientInput.id = "ingredient-input";
const addIngredientBtn = document.createElement("button");
addIngredientBtn.textContent = "Add";
addIngredientBtn.className = "btn";
const ingredientArea = document.createElement("div");
ingredientArea.id = "ingredient-input-area";
ingredientArea.appendChild(ingredientInput);
ingredientArea.appendChild(addIngredientBtn);
recipesListEl.parentNode.insertBefore(ingredientArea, recipesListEl);

const currentIngredientsEl = document.createElement("div");
currentIngredientsEl.id = "current-ingredients";
ingredientArea.parentNode.insertBefore(currentIngredientsEl, recipesListEl);

// Dietary filter elements
const dietaryFilterEls = document.querySelectorAll("#dietary-filters input[type='checkbox']");
const clearFiltersBtn = document.getElementById("clear-filters");

// -------------------- Tab Functionality --------------------
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    document.querySelectorAll(".tab-section, .detail-section").forEach(sec => sec.style.display = "none");
    document.getElementById(tab.dataset.tab).style.display = "block";
  });
});

// -------------------- Ingredients Functionality --------------------
function renderIngredients() {
  currentIngredientsEl.innerHTML = "";
  if (ingredientsList.length === 0) {
    currentIngredientsEl.textContent = "No ingredients added yet.";
    return;
  }
  ingredientsList.forEach((ing, i) => {
    const p = document.createElement("p");
    p.textContent = ing;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.className = "btn small";
    removeBtn.style.marginLeft = "0.5rem";
    removeBtn.addEventListener("click", () => {
      ingredientsList.splice(i, 1);
      renderIngredients();
      renderRecipes();
    });
    p.appendChild(removeBtn);
    currentIngredientsEl.appendChild(p);
  });
}

addIngredientBtn.addEventListener("click", () => {
  const val = ingredientInput.value.trim().toLowerCase();
  if (val && !ingredientsList.includes(val)) {
    ingredientsList.push(val);
    ingredientInput.value = "";
    renderIngredients();
    renderRecipes();
  }
});

ingredientInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addIngredientBtn.click();
});

// -------------------- Dietary Filters --------------------
dietaryFilterEls.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    dietaryFilters = Array.from(dietaryFilterEls).filter(cb => cb.checked).map(cb => cb.value);
    renderRecipes();
  });
});

clearFiltersBtn.addEventListener("click", () => {
  dietaryFilterEls.forEach(cb => cb.checked = false);
  dietaryFilters = [];
  renderRecipes();
});

// -------------------- Render Recipes --------------------
function renderRecipes() {
  recipesListEl.innerHTML = "";
  let filtered = recipes.filter(recipe => {
    // Ingredient match rule: at least 1 ingredient matches
    const ingredientMatch = ingredientsList.length === 0 || recipe.ingredients.some(ing => ingredientsList.includes(ing.toLowerCase()));
    // Dietary match
    const dietaryMatch = dietaryFilters.length === 0 || dietaryFilters.every(tag => recipe.tags.includes(tag));
    return ingredientMatch && dietaryMatch;
  });

  if (filtered.length === 0) {
    noResultsEl.style.display = "block";
    return;
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
    header.appendChild(title);

    const favBtn = document.createElement("button");
    favBtn.className = "favorite-button";
    favBtn.textContent = favoriteIds.includes(recipe.id) ? "★" : "☆";
    if (favoriteIds.includes(recipe.id)) favBtn.classList.add("favorited");
    favBtn.addEventListener("click", () => {
      if (favoriteIds.includes(recipe.id)) {
        favoriteIds = favoriteIds.filter(id => id !== recipe.id);
      } else {
        favoriteIds.push(recipe.id);
      }
      renderRecipes();
      renderFavorites();
    });
    header.appendChild(favBtn);

    card.appendChild(header);

    const desc = document.createElement("p");
    desc.textContent = recipe.description;
    card.appendChild(desc);

    recipesListEl.appendChild(card);
  });
}

// -------------------- Favorites --------------------
function renderFavorites() {
  favoritesListEl.innerHTML = "";
  const favRecipes = recipes.filter(r => favoriteIds.includes(r.id));
  if (favRecipes.length === 0) {
    favoritesEmptyMessageEl.style.display = "block";
    return;
  } else {
    favoritesEmptyMessageEl.style.display = "none";
  }
  favRecipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const header = document.createElement("div");
    header.className = "recipe-header";
    const title = document.createElement("h3");
    title.textContent = recipe.name;
    header.appendChild(title);

    const removeBtn = document.createElement("button");
    removeBtn.className = "favorite-button favorited";
    removeBtn.textContent = "★ Remove";
    removeBtn.addEventListener("click", () => {
      favoriteIds = favoriteIds.filter(id => id !== recipe.id);
      renderFavorites();
      renderRecipes();
    });
    header.appendChild(removeBtn);

    card.appendChild(header);
    const desc = document.createElement("p");
    desc.textContent = recipe.description;
    card.appendChild(desc);

    favoritesListEl.appendChild(card);
  });
}

// -------------------- Weekly Plan --------------------
document.getElementById("generate-plan").addEventListener("click", () => {
  weeklyPlanEl.innerHTML = "";
  const days = parseInt(planDaysEl.value);
  const planRecipes = [...recipes]; // copy all recipes
  if (planRecipes.length < days) {
    weeklyPlanEmptyEl.style.display = "block";
    return;
  } else {
    weeklyPlanEmptyEl.style.display = "none";
  }

  for (let i = 0; i < days; i++) {
    const recipe = planRecipes[i % planRecipes.length];
    const card = document.createElement("div");
    card.className = "plan-card";
    const h4 = document.createElement("h4");
    h4.textContent = `Day ${i + 1}: ${recipe.name}`;
    card.appendChild(h4);
    const p = document.createElement("p");
    p.textContent = recipe.description;
    card.appendChild(p);
    weeklyPlanEl.appendChild(card);
  }
});

// -------------------- Recommendations --------------------
document.getElementById("refresh-recommendations").addEventListener("click", () => {
  recommendationsListEl.innerHTML = "";
  const shuffled = recipes.sort(() => 0.5 - Math.random());
  const recs = shuffled.slice(0, 3);
  recs.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    const h3 = document.createElement("h3");
    h3.textContent = recipe.name;
    card.appendChild(h3);
    const p = document.createElement("p");
    p.textContent = recipe.description;
    card.appendChild(p);
    recommendationsListEl.appendChild(card);
  });
});

// -------------------- Initial Render --------------------
renderIngredients();
renderRecipes();
renderFavorites();
