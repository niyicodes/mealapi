// selecting the DOM element
const search = document.getElementById('search'),
      submit = document.getElementById('submit'),
      mealsEl = document.getElementById('meals'),
      resultHeading = document.getElementById('result-heading'),
      single_mealEl = document.getElementById('single-meal');

// Search meals and fetch from API
function searchMeal(e){

   // clear single meals
   single_mealEl.innerHTML = '';

   // get term
   const term = search.value;

   // check if input isnt empty
   if(term !== ''){
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
         .then(res => res.json())
         .then(data => {
            resultHeading.innerHTML = `<h2 class="mt2">Search results for '${term}' :</h2>`;

            // check the json file for the result
            if(data.meals === null){
               resultHeading.innerHTML = `<p>No search result for "${term}"</p>`
               mealsEl.innerHTML = '';
            }else{
               mealsEl.innerHTML = data.meals.map(meal => `
                  <div class="meal">
                     <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                     <div class="meal-info" data-mealID="${meal.idMeal}">
                        ${meal.strMeal}</h3>
                     </div>
                  </div>
               `).join('');
            }
         });
         // clear search input
         search.value = '';
   } else{
      alert('Please input a search item')
   }

   e.preventDefault();
};

// Fetch meal by id
function getMealByID(mealID){
   fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
      .then(res => res.json())
      .then(data => {
         const meal = data.meals[0];
         
         addMealToDOM(meal);
      });
};

// Fetch random meal by random icon

function randomMeal(){
   // clear fields
   mealsEl.innerHTML = '';
   resultHeading.innerHTML = '';

   // fetch meal
   fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then(res => res.json())
      .then(data => {
         const meal = data.meals[0];

         addMealToDOM(meal);
      });
}

// Add meal to DOM
function addMealToDOM(meal){
   const ingredients = [];

   for(let i = 1; i <= 20; i++){
      if(meal[`strIngredient${i}`]){
         ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
         
      }else{
         break;
      }
   };

   single_mealEl.innerHTML = `
      <div class="single-meal">
         <h1>${meal.strMeal}</h1>
         <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
         <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
         </div>
         <div class="main">
            <h2 class="mt2">Ingredients</h2>
            <ul>
               ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <h2 class="mt2">Instructions</h2>
            <p>${meal.strInstructions}</p>
         </div>
      </div>
   `;

   mealsEl.innerHTML = ''; // you can remove this if you wish to still have the search results present
};

// Event listerners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);

mealsEl.addEventListener('click', e => {
   const mealInfo = e.path.find(item => {
      if(item.classList.contains('meal-info')){
         return item.classList;
      }else{
         return false;
      }
   });
  if(mealInfo){
     const mealID = mealInfo.getAttribute('data-mealID');
     getMealByID(mealID);
  }
});