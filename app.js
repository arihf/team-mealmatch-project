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
  },
  {
    id: 4,
    name: "Lo Mein",
    description: "Chinese-style noodles with veggies.",
    ingredients: ["noodles", "soy sauce", "carrot", "bell pepper", "onion"],
    steps: [
      "Cook noodles according to package.",
      "Stir-fry veggies in a pan.",
      "Add noodles and soy sauce, toss to combine."
    ],
    tags: ["vegetarian"]
  },
  {
    id: 5,
    name: "Chia Pudding",
    description: "A simple healthy dessert.",
    ingredients: ["chia seeds", "almond milk", "honey", "vanilla extract"],
    steps: [
      "Mix chia seeds with almond milk.",
      "Add honey and vanilla, stir well.",
      "Refrigerate 2–4 hours until set."
    ],
    tags: ["vegan", "gluten-free"]
  },
  {
    id: 6,
    name: "Cheese Enchiladas",
    description: "Classic Mexican enchiladas with cheese.",
    ingredients: ["tortillas", "cheese", "enchilada sauce"],
    steps: [
      "Fill tortillas with cheese.",
      "Roll and place in baking dish.",
      "Pour sauce over and bake 20 min at 350°F."
    ],
    tags: ["vegetarian"]
  },
  {
    id: 7,
    name: "Chicken Noodle Soup",
    description: "Warm comforting soup.",
    ingredients: ["chicken", "noodles", "carrot", "celery", "onion", "broth"],
    steps: [
      "Cook chicken in broth.",
      "Add chopped veggies.",
      "Add noodles and cook until tender."
    ],
    tags: ["high-protein"]
  },
  {
    id: 8,
    name: "Mediterranean Salad",
    description: "Fresh, vegan, and gluten-free salad.",
    ingredients: ["lettuce", "cucumber", "tomato", "olive oil", "lemon juice"],
    steps: [
      "Chop vegetables.",
      "Mix with olive oil and lemon juice.",
      "Serve chilled."
    ],
    tags: ["vegan", "gluten-free"]
  }
];

// -------------------- State --------------------
let ingredientsList = [];
let favoriteIds = [];
let dietaryFilters = [];

// -------------------- Elements --------------------
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const noResultsEl = document.getElementById("no-results");
const weeklyPlanEl = document.getElementById("weekly-plan");
const weeklyPlanEmptyEl = document.getElementById("weekly-plan-empty");
const planDaysEl = document.getElementById("plan-days");

// Tabs
const tabs = document.querySelectorAll(".tab-button");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab-button.active").classList.remove("active");
    tab.classList.add("active");
    const tabId = tab.dataset.tab;
    document.querySelectorAll(".tab-section, .detail-section").forEach(s => s.style.display = "none");
    document.getElementById(tabId).style.display = "block";
  });
});

// -------------------- Ingredient Input --------------------
const ingredientInputContainer = document.createElement("div");
ingredientInputContainer.id = "ingredient-input-container";
ingredientInputContainer.innerHTML = `
  <input type="text" id="ingredient-input" placeholder="Type an ingredient"/>
  <button id="add-ingredient" class="btn small">Add</button>
  <ul id="ingredients-list-ui"></ul>
`;
document.getElementById("tab-all").prepend(ingredientInputContainer);

const ingredientInputEl = document.getElementById("ingredient-input");
const addIngredientBtn = document.getElementById("add-ingredient");
const ingredientsListUI = document.getElementById("ingredients-list-ui");

addIngredientBtn.addEventListener("click", addIngredient);
ingredientInputEl.addEventListener("keydown", e => { if (e.key === "Enter") addIngredient(); });

function addIngredient() {
  const val = ingredientInputEl.value.trim().toLowerCase();
  if (!val || ingredientsList.includes(val)) return;
  ingredientsList.push(val);
  ingredientInputEl.value = "";
  renderIngredients();
  renderRecipes();
}

function renderIngredients() {
  ingredientsListUI.innerHTML = "";
  ingredientsList.forEach((ing, idx) => {
    const li = document.createElement("li");
    li.textContent = ing + " ";
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.className = "btn small";
    removeBtn.addEventListener("click", () => {
      ingredientsList.splice(idx, 1);
      renderIngredients();
      renderRecipes();
    });
    li.appendChild(removeBtn);
    ingredientsListUI.appendChild(li);
  });
}

// -------------------- Dietary Filters --------------------
const dietaryCheckboxes = document.querySelectorAll("#dietary-filters input[type=checkbox]");
dietaryCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    dietaryFilters = Array.from(dietaryCheckboxes).filter(c => c.checked).map(c => c.value);
    renderRecipes();
  });
});

document.getElementById("clear-filters").addEventListener("click", () => {
  dietaryFilters = [];
  dietaryCheckboxes.forEach(c => c.checked = false);
  renderRecipes();
});

// -------------------- Render Recipes --------------------
function renderRecipes() {
  recipesListEl.innerHTML = "";
  let filtered = recipes.filter(r => {
    // Match ingredients (at least one)
    const hasIngredient = ingredientsList.length === 0 || r.ingredients.some(ing => ingredientsList.includes(ing.toLowerCase()));
    // Match dietary filters
    const hasDiet = dietaryFilters.length === 0 || dietaryFilters.every(tag => r.tags.includes(tag));
    return hasIngredient && hasDiet;
  });

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
    const h3 = document.createElement("h3");
    h3.textContent = recipe.name;
    const favBtn = document.createElement("button");
    favBtn.className = "favorite-button";
    favBtn.innerHTML = favoriteIds.includes(recipe.id) ? "★" : "☆";
    favBtn.addEventListener("click", () => toggleFavorite(recipe.id, favBtn));
    header.appendChild(h3);
    header.appendChild(favBtn);
    card.appendChild(header);

    const p = document.createElement("p");
    p.textContent = recipe.description;
    card.appendChild(p);

    recipesListEl.appendChild(card);
  });
}

// -------------------- Favorites --------------------
function toggleFavorite(id, btn) {
  if (favoriteIds.includes(id)) {
    favoriteIds = favoriteIds.filter(f => f !== id);
    btn.textContent = "☆";
  } else {
    favoriteIds.push(id);
    btn.textContent = "★";
  }
  renderFavorites();
}

function renderFavorites() {
  favoritesListEl.innerHTML = "";
  const favRecipes = recipes.filter(r => favoriteIds.includes(r.id));
  if (favRecipes.length === 0) {
    favoritesEmptyMessageEl.style.display = "block";
  } else {
    favoritesEmptyMessageEl.style.display = "none";
  }

  favRecipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.textContent = recipe.name;
    favoritesListEl.appendChild(card);
  });
}

// -------------------- Weekly Plan --------------------
document.getElementById("generate-plan").addEventListener("click", () => {
  weeklyPlanEl.innerHTML = "";
  const dayCount = parseInt(planDaysEl.value);
  const favRecipes = recipes.filter(r => favoriteIds.includes(r.id));
  if (favRecipes.length < dayCount) {
    weeklyPlanEmptyEl.style.display = "block";
    return;
  } else {
    weeklyPlanEmptyEl.style.display = "none";
  }

  // Shuffle favorites
  const shuffled = [...favRecipes].sort(() => 0.5 - Math.random());

  for (let i = 0; i < dayCount; i++) {
    const planCard = document.createElement("div");
    planCard.className = "plan-card";
    planCard.innerHTML = `<h4>Day ${i + 1}</h4><p>${shuffled[i].name}</p>`;
    weeklyPlanEl.appendChild(planCard);
  }
});

// -------------------- Recommendations --------------------
document.getElementById("refresh-recommendations").addEventListener("click", () => {
  recommendationsListEl.innerHTML = "";

  const recipesCopy = [...recipes];
  for (let i = recipesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [recipesCopy[i], recipesCopy[j]] = [recipesCopy[j], recipesCopy[i]];
  }

  const recs = recipesCopy.slice(0, 3);
  recs.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    const h3 = document.createElement("h3");
    h3.textContent = recipe.name;
    const p = document.createElement("p");
    p.textContent = recipe.description;
    card.appendChild(h3);
    card.appendChild(p);
    recommendationsListEl.appendChild(card);
  });
});

// -------------------- Initial Render --------------------
renderRecipes();
renderFavorites();
