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
let favoriteIds = loadFromStorage("favoriteIds", []);
let userHistory = loadFromStorage("userHistory", { viewed: [], favorites: [] });
let currentTab = "tab-all"; // keep track of active tab for back navigation
let lastListContext = "tab-all"; // where to go back after detail

// -------------------- Element References --------------------
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const recipeDetailSection = document.getElementById("recipe-detail-section");
const tabsNav = document.querySelectorAll(".tab-button");

// Detail elements
const detailTitleEl = document.getElementById("detail-title");
const detailIngredientsEl = document.getElementById("detail-ingredients");
const detailStepsEl = document.getElementById("detail-steps");
const detailMetaEl = document.getElementById("detail-meta");

// Weekly plan elements
const planDaysEl = document.getElementById("plan-days");
const generatePlanBtn = document.getElementById("generate-plan");
const weeklyPlanEl = document.getElementById("weekly-plan");
const weeklyPlanEmptyEl = document.getElementById("weekly-plan-empty");

// -------------------- Utilities --------------------
function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function loadFromStorage(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function showTab(tabId) {
  // hide detail view if visible
  recipeDetailSection.style.display = "none";

  // switch tabs
  document.querySelectorAll(".tab-section").forEach(sec => {
    sec.style.display = sec.id === tabId ? "block" : "none";
  });
  tabsNav.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });

  currentTab = tabId;
  lastListContext = tabId;

  // re-render target tab content
  if (tabId === "tab-all") renderRecipes();
  if (tabId === "tab-favorites") renderFavorites();
  if (tabId === "tab-recommended") renderRecommendations();
  if (tabId === "tab-weekly") renderWeeklyPlanPreview();
}

tabsNav.forEach(btn => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

// -------------------- Render Functions --------------------
function recipeCard(recipe, { removableFavorite = false } = {}) {
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

  return card;
}

function renderRecipes() {
  recipesListEl.innerHTML = "";
  recipes.forEach(recipe => {
    const card = recipeCard(recipe);
    recipesListEl.appendChild(card);
  });
}

function renderFavorites() {
  favoritesListEl.innerHTML = "";
  const favoriteRecipes = recipes.filter(r => favoriteIds.includes(r.id));
  const empty = favoriteRecipes.length === 0;
  favoritesEmptyMessageEl.style.display = empty ? "block" : "none";
  if (empty) return;

  favoriteRecipes.forEach(recipe => {
    const card = recipeCard(recipe, { removableFavorite: true });
    favoritesListEl.appendChild(card);
  });
}

// -------------------- Favorites --------------------
function toggleFavorite(recipeId) {
  if (favoriteIds.includes(recipeId)) {
    favoriteIds = favoriteIds.filter(id => id !== recipeId);
  } else {
    favoriteIds.push(recipeId);
  }
  userHistory.favorites = [...favoriteIds];

  saveToStorage("favoriteIds", favoriteIds);
  saveToStorage("userHistory", userHistory);

  // refresh visible tab
  if (currentTab === "tab-all") renderRecipes();
  if (currentTab === "tab-favorites") renderFavorites();
  renderRecommendations(); // keep recs fresh
}

// -------------------- Recipe Detail View --------------------
function showRecipeDetail(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  // Track viewed
  if (!userHistory.viewed.includes(recipeId)) {
    userHistory.viewed.push(recipeId);
    saveToStorage("userHistory", userHistory);
  }

  // Fill detail
  detailTitleEl.textContent = recipe.name;
  detailMetaEl.textContent = recipe.tags ? `Tags: ${recipe.tags.join(", ")}` : "";

  detailIngredientsEl.innerHTML = "";
  recipe.ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    detailIngredientsEl.appendChild(li);
  });

  detailStepsEl.innerHTML = "";
  recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    detailStepsEl.appendChild(li);
  });

  // Show detail and hide other sections (like a real tabbed site)
  recipeDetailSection.style.display = "block";
  document.querySelectorAll(".tab-section").forEach(sec => sec.style.display = "none");
}

document.getElementById("back-to-list").addEventListener("click", () => {
  recipeDetailSection.style.display = "none";
  showTab(lastListContext); // return to where you came from (All/Favorites/Recommended/Weekly)
});

// -------------------- Recommendations --------------------
function ingredientOverlapScore(target, baseSet) {
  const targetSet = new Set(target.map(i => i.toLowerCase()));
  let score = 0;
  baseSet.forEach(i => { if (targetSet.has(i.toLowerCase())) score++; });
  return score;
}

function tagOverlapScore(targetTags = [], baseTagsSet) {
  let score = 0;
  targetTags.forEach(t => { if (baseTagsSet.has(t)) score++; });
  return score;
}

function getRecommendations(limit = 5) {
  const interactedIds = [...new Set([...userHistory.viewed, ...userHistory.favorites])];
  const interacted = recipes.filter(r => interactedIds.includes(r.id));

  // If no history: fallback to not-random-every-time but simple rotation
  if (interacted.length === 0) {
    // prioritize vegetarian and quick for demo, then others
    const sorted = [...recipes].sort((a, b) => {
      const aScore = (a.tags?.includes("vegetarian") ? 1 : 0) + (a.tags?.includes("quick") ? 1 : 0);
      const bScore = (b.tags?.includes("vegetarian") ? 1 : 0) + (b.tags?.includes("quick") ? 1 : 0);
      return bScore - aScore;
    });
    return sorted.slice(0, limit);
  }

  // Build base ingredient and tag sets from history
  const baseIngredients = new Set(interacted.flatMap(r => r.ingredients));
  const baseTags = new Set(interacted.flatMap(r => r.tags || []));

  // Score non-interacted recipes by overlap
  const candidates = recipes.filter(r => !interactedIds.includes(r.id));
  const scored = candidates.map(r => {
    const ingScore = ingredientOverlapScore(r.ingredients, baseIngredients);
    const tagScore = tagOverlapScore(r.tags || [], baseTags);
    // weight tags slightly less than ingredients
    const total = ingScore * 1.0 + tagScore * 0.7;
    return { recipe: r, score: total };
  });

  // Sort by score and return top unique
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.recipe);
}

function renderRecommendations() {
  recommendationsListEl.innerHTML = "";
  const recs = getRecommendations(5);

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

    const desc = document.createElement("p");
    desc.className = "muted";
    desc.textContent = recipe.description;

    const favButton = document.createElement("button");
    favButton.className = "favorite-button";
    favButton.textContent = favoriteIds.includes(recipe.id) ? "★ Favorited" : "☆ Favorite";
    if (favoriteIds.includes(recipe.id)) favButton.classList.add("favorited");
    favButton.addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(recipe.id);
    });

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(favButton);

    recommendationsListEl.appendChild(card);
  });
}

document.getElementById("refresh-recommendations").addEventListener("click", () => {
  renderRecommendations();
  // Also ensure tab state persists and nothing "disappears"
  currentTab === "tab-recommended" && showTab("tab-recommended");
});

// -------------------- Weekly Plan (simple version) --------------------
function generateWeeklyPlan(days = 5) {
  const pool = [...recipes]; // could apply filters here
  const favs = pool.filter(r => favoriteIds.includes(r.id));
  const nonFavs = pool.filter(r => !favoriteIds.includes(r.id));

  const plan = [];
  const used = new Set();

  // prioritize favorites first
  for (let i = 0; i < days && favs.length > 0; i++) {
    const next = favs.shift();
    plan.push(next);
    used.add(next.id);
  }
  // fill remaining from non-favorites without repeats
  for (let i = plan.length; i < days && nonFavs.length > 0; i++) {
    const next = nonFavs.shift();
    if (!used.has(next.id)) {
      plan.push(next);
      used.add(next.id);
    }
  }
  return plan;
}

function renderWeeklyPlanPreview() {
  // passive preview (does not auto-generate)
  weeklyPlanEl.innerHTML = "";
  weeklyPlanEmptyEl.style.display = "block";
}

generatePlanBtn.addEventListener("click", () => {
  const days = Number(planDaysEl.value);
  const plan = generateWeeklyPlan(days);

  weeklyPlanEl.innerHTML = "";
  if (plan.length < days) {
    weeklyPlanEmptyEl.style.display = "block";
  } else {
    weeklyPlanEmptyEl.style.display = "none";
  }

  if (plan.length === 0) {
    weeklyPlanEmptyEl.style.display = "block";
    return;
  }

  plan.forEach((recipe, idx) => {
    const card = document.createElement("div");
    card.className = "plan-card";

    const title = document.createElement("h4");
    title.textContent = `Day ${idx + 1}: ${recipe.name}`;
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    const desc = document.createElement("p");
    desc.className = "muted";
    desc.textContent = recipe.description;

    card.appendChild(title);
    card.appendChild(desc);
    weeklyPlanEl.appendChild(card);
  });
});

// -------------------- Initial Render --------------------
function init() {
  renderRecipes();
  renderFavorites();
  renderRecommendations();
  renderWeeklyPlanPreview();
  showTab(currentTab);
}

init();
