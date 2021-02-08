const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    mealsElement = document.getElementById('meals'),
    headingResult = document.getElementById('heading-result'),
    singleMealElement = document.getElementById('single-meal');

// Functions
function searchMeal(e) {
    e.preventDefault();

    singleMealElement.innerHTML = '';

    const sort = search.value;

    if (sort.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${sort}`)
            .then(res => res.json())
            .then(data => {
                if (data.meals === null) {
                    headingResult.innerHTML = `There are no search results. Try again!`;
                } else {
                    mealsElement.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                          <img src="${meal.strMealThumb}" alt="" />
                          <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                          </div>
                        </div>
                    `).join('');
                }
            });
        search.value = '';
    } else {
        alert('Please enter a search again');
    }
}

// Fetch meal 
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMeal(meal);
        });
}

// Add meal
function addMeal(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealElement.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Event listener
submit.addEventListener('submit', searchMeal);


mealsElement.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});