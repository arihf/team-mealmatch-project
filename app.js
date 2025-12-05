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
let dietaryFilters = [];

// -------------------- Element References --------------------
const tabs = document.querySelectorAll(".tab-button");
const recipesListEl = document.getElementById("recipes-list");
const favoritesListEl = document.getElementById("favorites-list");
const favoritesEmptyMessageEl = document.getElementById("favorites-empty-message");
const recommendationsListEl = document.getElementById("recommendations-list");
const noResultsEl = document.getElementById("no-results");
const weeklyPlanEl = document.getElementById("weekly-plan");
const weeklyPlanEmptyEl = document.getElementById("weekly-plan-empty");
const planDaysEl = document.getElementById("plan-days");

// -------------------- Tabs --------------------
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab-button.active").classList.remove("active");
    tab.classList.add("active");

    document.querySelectorAll(".tab-section").forEach(sec => sec.style.display = "none");
    document.getElementById(tab.dataset.tab).style.display = "block";
  });
});

// -------------------- Render Functions --------------------
function renderRecipes() {
  recipesListEl.innerHTML = "";
  const selectedFilters = dietaryFilters;

  const filtered = recipes.filter(r => {
    // dietary filter
    const hasTags = selectedFilters.every(f => r.tags.includes(f));
    return hasTags;
  });

  if(filtered.length === 0){
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
    title.addEventListener("click", () => showRecipeDetail(recipe.id));

    const favButton = document.createElement("button");
    favButton.className = "favorite-button";
    favButton.textContent = favoriteIds.includes(recipe.id) ? "★ Favorited" : "☆ Favorite";
    if(favoriteIds.includes(recipe.id)) favButton.classList.add("favorited");
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

function renderFavorites(){
  favoritesListEl.innerHTML = "";
  const favRecipes = recipes.filter(r => favoriteIds.includes(r.id));

  if(favRecipes.length === 0){
    favoritesEmptyMessageEl.style.display = "block";
    return;
  } else favoritesEmptyMessageEl.style.display = "none";

  favRecipes.forEach(recipe => {
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

function renderRecommendations(){
  recommendationsListEl.innerHTML = "";
  const interacted = [...new Set([...userHistory.viewed, ...userHistory.favorites])];
  const recs = recipes.filter(r => !interacted.includes(r.id));

  if(recs.length === 0){
    document.getElementById("no-recommendations").style.display = "block";
    return;
  } else {
    document.getElementById("no-recommendations").style.display = "none";
  }

  recs.forEach(r => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.textContent = r.name;
    card.addEventListener("click", () => showRecipeDetail(r.id));
    recommendationsListEl.appendChild(card);
  });
}

// -------------------- Favorites --------------------
function toggleFavorite(id){
  if(favoriteIds.includes(id)) favoriteIds = favoriteIds.filter(f => f!==id);
  else favoriteIds.push(id);

  userHistory.favorites = [...favoriteIds];
  renderFavorites();
  renderRecipes();
  renderRecommendations();
}

// -------------------- Detail --------------------
function showRecipeDetail(id){
  const recipe = recipes.find(r => r.id === id);
  if(!recipe) return;

  if(!userHistory.viewed.includes(id)) userHistory.viewed.push(id);

  document.querySelectorAll(".tab-section").forEach(sec => sec.style.display="none");
  document.getElementById("recipe-detail-section").style.display = "block";

  document.getElementById("detail-title").textContent = recipe.name;
  const ingredientsEl = document.getElementById("detail-ingredients");
  ingredientsEl.innerHTML = "";
  recipe.ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ingredientsEl.appendChild(li);
  });

  const stepsEl = document.getElementById("detail-steps");
  stepsEl.innerHTML = "";
  recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsEl.appendChild(li);
  });
}

// Back button
document.getElementById("back-to-list").addEventListener("click", ()=>{
  document.getElementById("recipe-detail-section").style.display="none";
  document.getElementById("tab-all").style.display="block";
});

// -------------------- Dietary Filters --------------------
document.querySelectorAll("#dietary-filters input[type='checkbox']").forEach(cb => {
  cb.addEventListener("change", () => {
    dietaryFilters = Array.from(document.querySelectorAll("#dietary-filters input:checked")).map(c => c.value);
    renderRecipes();
  });
});

document.getElementById("clear-filters").addEventListener("click", () => {
  dietaryFilters = [];
  document.querySelectorAll("#dietary-filters input").forEach(i => i.checked = false);
  renderRecipes();
});

// -------------------- Weekly Plan --------------------
document.getElementById("generate-plan").addEventListener("click", ()=>{
  const days = parseInt(planDaysEl.value);
  const favRecipes = recipes.filter(r=>favoriteIds.includes(r.id));
  weeklyPlanEl.innerHTML = "";

  if(favRecipes.length < days){
    weeklyPlanEmptyEl.style.display="block";
    return;
  } else weeklyPlanEmptyEl.style.display="none";

  // shuffle
  const shuffled = [...favRecipes].sort(()=> Math.random()-0.5);
  for(let i=0; i<days; i++){
    const card = document.createElement("div");
    card.className="plan-card";
    card.innerHTML = `<h4>Day ${i+1}</h4><p>${shuffled[i].name}</p>`;
    weeklyPlanEl.appendChild(card);
  }
});

// -------------------- Initial Render --------------------
renderRecipes();
renderFavorites();
renderRecommendations();
