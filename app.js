// const fetchData = (url) => {
//     const res = fetch(url);
//     const data = res.json();
//     return data;
// };

// display error message
const errorMessage = (text) => {
    const errorDiv = document.getElementById("error-msg");
    errorDiv.innerHTML = `<p>
        <strong class="fs-4">Dear Sir/Mam,</strong><br />
        Your search --<strong>${text}</strong>-- did not match any of
        our meal. Please, enter a correct name.
        </p>`;
    errorDiv.classList.remove("d-none");
};

const buttonSearch = document.getElementById("button-search");
buttonSearch.addEventListener("click", () => {
    document.getElementById("error-msg").classList.add("d-none"); //hide error msg
    document.getElementById("meal-details").innerHTML = ""; // clear prev meal details
    document.getElementById("meals-container").innerHTML = ""; // clears previous search results
    document.getElementById("spinner").classList.remove("d-none"); //shiow spinner

    const searchField = document.getElementById("search-field");
    const searchText = searchField.value;
    searchField.value = "";
    loadData(searchText);
});

//load data based on search text
const loadData = (searchText) => {
    if (searchText.length == 0) {
        document.getElementById("spinner").classList.add("d-none"); //hide spinner
        errorMessage(searchText);
    } else {
        let url;
        if (searchText.length == 1) {
            url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchText}`;
        } else {
            url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
        }
        fetch(url)
            .then((res) => res.json())
            .then((data) => displayMeals(data.meals, searchText));
    }
};

const displayMeals = (meals, text) => {
    document.getElementById("spinner").classList.add("d-none"); //hide spinner

    // if no results found show error msg else display all meals
    if (meals == null) {
        errorMessage(text);
    } else {
        meals.forEach((meal) => {
            const { idMeal, strMeal, strMealThumb } = meal; // destructuring meal object
            const mealsContainer = document.getElementById("meals-container");
            const div = document.createElement("div");
            div.className = "col";
            div.innerHTML = `
            <div class="card h-100 text-center">
                <img src="${strMealThumb}" class="card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title">${strMeal}</h5>
                </div>
                <button onclick="loadDetails('${idMeal}')" id="button-details" class="btn btn-primary">
                    Details
                </button>
            </div>
        `;
            mealsContainer.appendChild(div);
        });
    }
};

const loadDetails = (id) => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayDetails(data.meals[0]));
};

const displayDetails = (meal) => {
    // console.log(meal);
    const detailsDiv = document.getElementById("meal-details");
    detailsDiv.innerHTML = `
        <div class="text-center card h-100" style="max-width:300px">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                </div>
                <button
                    onclick=""
                    id="button-details"
                    class="btn btn-primary"
                    >
                        Add to cart
                </button>
        </div>
        `;
    window.scrollTo(0, 30);
};
