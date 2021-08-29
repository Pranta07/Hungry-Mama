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
        <div class="card h-100 border-0 shadow" style="max-width:300px">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title text-center">${meal.strMeal}</h5>
                    <ul id="list"></ul>
                </div>
                <button
                    onclick="addToCart('${meal.idMeal}')"
                    id="button-details"
                    class="btn btn-primary"
                    >
                        Add to cart
                </button>
        </div>
        `;
    // creating list of ingredient
    const list = document.getElementById("list");
    // console.log(list);
    for (let i = 1; i <= 20; i++) {
        const ingredientKey = "strIngredient" + i;
        const ingredient = meal[ingredientKey];
        const measureKey = "strMeasure" + i;
        const measure = meal[measureKey];

        const li = document.createElement("li");
        li.innerText = ingredient + " " + measure;
        if (
            (ingredient + measure).length > 1 &&
            ingredient != null &&
            measure != null
        )
            list.appendChild(li);
    }
    window.scrollTo(0, 30); //scroll vertical after adding
};

const addToCart = (id) => {
    // console.log(id);
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => cart(data.meals[0]));
};

//cart items array
let items = [];
const cart = (meal) => {
    const item = items.find((item) => item.id == meal.idMeal); //returns the item object or undefined
    console.log(item);
    if (item != undefined) {
        item.quantity++;
        const quantitySpan = document.getElementById(
            `quantity-${items.indexOf(item)}`
        );
        quantitySpan.innerText = item.quantity;
    } else {
        items = [
            ...items,
            {
                id: meal.idMeal,
                name: meal.strMeal,
                quantity: 1,
            },
        ];
        const cart = document.getElementById("cart");
        const item = document.createElement("div");
        item.className =
            "p-3 mb-3 border rounded shadow row border-dark align-items-center";
        item.innerHTML = `
                <div class="col-4">
                <img
                    src="${meal.strMealThumb}"
                    alt=""
                    class="rounded-circle"
                    width="100"
                    height="100"
                    />
                </div>
                <div class="col-8">
                    <h3>${meal.strMeal}</h3>
                    <p class="m-0">Quantity: 
                        <span id="quantity-${items.length - 1}">1</span>
                    </p>
                </div>
            `;
        cart.appendChild(item);
    }
    //update item count in nav
    document.getElementById("item-count").innerText = items.length;
};
