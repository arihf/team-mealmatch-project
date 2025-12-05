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
    description: "Stir-fried noodles with vegetables and soy sauce.",
    ingredients: ["lo mein noodles", "carrot", "bell pepper", "soy sauce", "oil"],
    steps: [
      "Cook noodles according to package instructions.",
      "Stir-fry vegetables in oil for 3–4 minutes.",
      "Add noodles and soy sauce, toss to combine."
    ],
    tags: ["vegetarian", "quick"]
  },
  {
    id: 5,
    name: "Chia Pudding",
    description: "Healthy chia seed pudding with almond milk.",
    ingredients: ["chia seeds", "almond milk", "honey", "vanilla extract"],
    steps: [
      "Mix chia seeds, almond milk, honey, and vanilla in a bowl.",
      "Refrigerate overnight.",
      "Serve chilled with fruit."
    ],
    tags: ["vegan", "gluten-free", "healthy"]
  },
  {
    id: 6,
    name: "Cheese Enchiladas",
    description: "Baked tortillas stuffed with cheese and sauce.",
    ingredients: ["tortillas", "cheese", "enchilada sauce", "onion"],
    steps: [
      "Preheat oven to 375°F (190°C).",
      "Fill tortillas with cheese and roll them up.",
      "Place in baking dish, cover with enchilada sauce and bake 20 min."
    ],
    tags: ["vegetarian"]
  },
  {
    id: 7,
    name: "Chicken Noodle Soup",
    description: "Classic comforting chicken noodle soup.",
    ingredients: ["chicken", "carrot", "celery", "noodles", "chicken broth"],
    steps: [
      "Boil chicken in broth until cooked.",
      "Add vegetables and noodles, cook until tender.",
      "Season with salt and pepper."
    ],
    tags: ["high-protein"]
  },
  {
    id: 8,
    name: "Mediterranean Salad",
    description: "Fresh salad with cucumbers, tomatoes, and chickpeas.",
    ingredients: ["cucumber", "tomato", "chickpeas", "olive oil", "lemon juice"],
    steps: [
      "Chop all vegetables and combine in a bowl.",
      "Add chickpeas, olive oil, lemon juice, salt, and pepper.",
      "Toss and serve chilled."
    ],
    tags: ["vegan", "gluten-free"]
  },
  {
    id: 9,
    name: "Vegetarian Quesadilla",
    description: "Cheesy quesadilla with vegetables.",
    ingredients: ["tortilla", "cheese", "bell pepper", "onion"],
    steps: [
      "Place cheese and vegetables on tortilla.",
      "Fold in half and cook on a pan until golden.",
      "Cut into wedges and serve."
    ],
    tags: ["vegetarian"]
  },
  {
    id: 10,
    name: "Vegan Curry",
    description: "Rich and creamy vegan curry with coconut milk.",
    ingredients: ["coconut milk", "chickpeas", "spinach", "curry powder", "onion"],
    steps: [
      "Sauté onion and curry powder in oil.",
      "Add coconut milk and chickpeas, simmer 10 minutes.",
      "Add spinach and cook until wilted."
    ],
    tags: ["vegan", "gluten-free"]
  }
];

// -------------------- State --------------------
let favoriteIds = [];
let dietaryFilters = [];
let currentTab = "tab-all";

// -------------------- Element References --------------------
const tabs = document.querySelectorAll(".tab-button");
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const noResultsEl = document.getElementById("no-results");
const noRecommendationsEl = document.getElementById("no-recommendations");
const weeklyPlanEl = document.getElementById("weekly-plan");
const weeklyPlanEmptyEl = document.getElementById("weekly-plan-empty");
const planDaysEl = document.getElementById("plan-days");
const dietaryCheckboxes = document.querySelectorAll("#dietary-filters input[type='checkbox']");
const clearFiltersBtn = document.getElementById("clear-filters");

// -------------------- Functions --------------------
function renderRecipes(arr, container) {
  container.innerHTML = "";
  if (arr.length === 0) return false;

  arr.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <div class="recipe-header">
        <h3>${recipe.name}</h3>
        <button class="favorite-button ${favoriteIds.includes(recipe.id) ? 'favorited' : ''}" data-id="${recipe.id}">
          ${favoriteIds.includes(recipe.id) ? '★' : '☆'}
        </button>
      </div>
      <p>${recipe.description}</p>
    `;

    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("favorite-button")) {
        showDetail(recipe.id);
      }
    });

    container.appendChild(card);
  });

  return true;
}

function showDetail(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  document.getElementById("detail-title").textContent = recipe.name;
  document.getElementById("detail-ingredients").innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join("");
  document.getElementById("detail-steps").innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join("");

  document.getElementById("recipe-detail-section").style.display = "block";
  document.getElementById(currentTab).style.display = "none";
}

function toggleFavorite(id) {
  if (favoriteIds.includes(id)) {
    favoriteIds = favoriteIds.filter(f => f !== id);
  } else {
    favoriteIds.push(id);
  }
  renderAll();
}

function filterByDietary(arr) {
  if (dietaryFilters.length === 0) return arr;
  return arr.filter(recipe => dietaryFilters.every(tag => recipe.tags.includes(tag)));
}

function generateWeeklyPlan() {
  const favorites = recipes.filter(r => favoriteIds.includes(r.id));
  const days = parseInt(planDaysEl.value);

  weeklyPlanEl.innerHTML = "";
  if (favorites.length === 0) {
    weeklyPlanEmptyEl.style.display = "block";
    return;
  }

  weeklyPlanEmptyEl.style.display = "none";

  for (let i = 0; i < days; i++) {
    const recipe = favorites[i % favorites.length];
    const card = document.createElement("div");
    card.className = "plan-card";
    card.innerHTML = `<h4>Day ${i + 1}: ${recipe.name}</h4>`;
    weeklyPlanEl.appendChild(card);
  }
}

function renderRecommendations() {
  const recommended = recipes.filter(r => !favoriteIds.includes(r.id));
  recommendationsListEl.innerHTML = "";

  if (recommended.length === 0) {
    noRecommendationsEl.style.display = "block";
  } else {
    noRecommendationsEl.style.display = "none";
    renderRecipes(recommended, recommendationsListEl);
  }
}

function renderAll() {
  const filtered = filterByDietary(recipes);
  const hasRecipes = renderRecipes(filtered, recipesListEl);
  noResultsEl.style.display = hasRecipes ? "none" : "block";

  const favs = recipes.filter(r => favoriteIds.includes(r.id));
  if (favs.length === 0) {
    favoritesEmptyMessageEl.style.display = "block";
    favoritesListEl.innerHTML = "";
  } else {
    favoritesEmptyMessageEl.style.display = "none";
    renderRecipes(favs, favoritesListEl);
  }

  renderRecommendations();
}

// -------------------- Event Listeners --------------------
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.getElementById(currentTab).style.display = "none";
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    document.getElementById(currentTab).style.display = "block";
  });
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("favorite-button")) {
    const id = parseInt(e.target.dataset.id);
    toggleFavorite(id);
  }
});

dietaryCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    dietaryFilters = Array.from(dietaryCheckboxes).filter(i => i.checked).map(i => i.value);
    renderAll();
  });
});

clearFiltersBtn.addEventListener("click", () => {
  dietaryCheckboxes.forEach(cb => cb.checked = false);
  dietaryFilters = [];
  renderAll();
});

document.getElementById("generate-plan").addEventListener("click", generateWeeklyPlan);

document.getElementById("refresh-recommendations").addEventListener("click", renderAll);

document.getElementById("back-to-list").addEventListener("click", () => {
  document.getElementById("recipe-detail-section").style.display = "none";
  document.getElementById(currentTab).style.display = "block";
});

// -------------------- Initial Render --------------------
renderAll();
