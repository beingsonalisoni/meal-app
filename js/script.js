// FAV MEAL ARRAY - IF NOT PRESENT IN LOCAL STORAGE
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// FETCH MEALS FROM API & RETURN
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// DISPLAY MEAL CARDS ACC TO SEARCH INPUT
function showMealList() {
    let inputValue = document.getElementById("my-search").value;
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = fetchMealsFromApi(url, inputValue);
    meals.then(data => {
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav = false;
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index] == element.idMeal) {
                        isFav = true;
                    }
                }
                if (isFav) {
                    html += `
                        <div id="card" class="card mb-3" style="width: 20rem;">
                            <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-5">
                                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">
                                        More Details
                                    </button>
                                    <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%; background-color: rgba(255, 193, 7, 1);">
                                        <i class="fa-solid fa-heart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    html += `
                        <div id="card" class="card mb-3" style="width: 20rem;">
                            <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-5">
                                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">
                                        More Details
                                    </button>
                                    <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%">
                                        <i class="fa-solid fa-heart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
        } else {
            html += `
                <div class="page-wrap d-flex flex-row align-items-center">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-12 text-center">
                                <span class="display-1 d-block">404</span>
                                <div class="mb-4 lead">
                                    The meal you are looking for was not found.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}

// MEAL DETAILS - SHOWN IN 'MAIN'
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        html += `
            <div id="meal-details" class="mb-5">
                <div id="meal-header" class="d-flex justify-content-around flex-wrap">
                    <div id="meal-thumbail">
                        <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
                    </div>
                    <div id="details">
                        <h3>${data.meals[0].strMeal}</h3>
                        <h6>Category : ${data.meals[0].strCategory}</h6>
                        <h6>Area : ${data.meals[0].strArea}</h6>
                    </div>
                </div>
                <div id="meal-instruction" class="mt-3">
                    <h5 class="text-center">Instructions:</h5>
                    <p>${data.meals[0].strInstructions}</p>
                </div>
                <div class="text-center">
                    <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3 yt-btn">
                        Watch Video
                    </a>
                </div>
            </div>
        `;
    });
    document.getElementById("main").innerHTML = html;
}

// FAV MEALS - IN 'FAV'
async function showFavMealList() {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    if (arr.length == 0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url, arr[index]).then(data => {
                html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                        <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${data.meals[0].strMeal}</h5>
                            <div class="d-flex justify-content-between mt-5">
                                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">
                                    More Details
                                </button>
                                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%; background-color: rgba(255, 193, 7, 1);">
                                    <i class="fa-solid fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    }
    document.getElementById("favourites-body").innerHTML = html;
}

// ADD OR REMOVE MEALS FROM FAV
function addRemoveToFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = false;
    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            contain = true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Your meal is removed from your Favourites!!");
    } else {
        arr.push(id);
        alert("Your meal is added to your Favourites!!");
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showMealList();
    showFavMealList();
}

// CREATE FOOTER ELEMENT
const footer = document.createElement('footer');
footer.classList.add('fixed-bottom');
footer.innerHTML = `
  <div class="container" style="margin-top: 20px;">
    <div class="row">
      <div class="col-md-12 text-center">
        <ul class="list-inline">
          <li class="list-inline-item"><a href="about.html" target="_blank">About</a></li>
          <li class="list-inline-item"><a href="https://www.linkedin.com/in/beingsonalisoni" target="_blank">LinkedIn</a></li>
          <li class="list-inline-item"><a href="https://github.com/beingsonalisoni" target="_blank">GitHub</a></li>
          <li class="list-inline-item"><a href="mailto:sonalisoni1998@gmail.com" target="_blank">Mail Us</a></li>
        </ul>
        <p>&copy; 2023 Meal App | Sonali Soni</p>
      </div>
    </div>
  </div>
`;

// APPEND FOOTER TO BODY
document.body.appendChild(footer);

// CHANGES IN THE PAGE HEIGHT
const changeInHeight = new MutationObserver(function (mutationsList) {

    for (let mutation of mutationsList) {

        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

            // SEARCH RESULTS ADDED TO PAGE - ADJUSTING FOOTER POSITION
            const body = document.body;
            const html = document.documentElement;
            const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            const windowHeight = window.innerHeight;
            const footerHeight = footer.offsetHeight;

            if (pageHeight > windowHeight) {
                footer.style.position = 'static';
            } else {
                footer.style.position = 'fixed';
                footer.style.bottom = '0';
            }

            // MINIMUM HEIGHT FOR THE CONTENT PART
            const content = document.querySelector('.content');
            if (content) {

                const contentHeight = content.offsetHeight;
                const minHeight = windowHeight - footerHeight;
                
                if (contentHeight < minHeight) {
                    content.style.minHeight = `${minHeight}px`;
                }
            }
        }
    }
});

// APPLY THE CHANGES
changeInHeight.observe(document.documentElement, { childList: true, subtree: true });