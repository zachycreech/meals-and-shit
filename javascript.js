// global variables
const searchButton = $("#searchButton")
const apiKey = "45fa1958465544f1a8f06e376252e2a6"

//food variables
const foodTitle = $("#foodTitle")
const foodImg = $("#foodImg")
const foodIngredients = $(".foodIngredients")
const foodDescr = $("#foodDescription")
const foodGroup = $("#foodGroup")

// drink variables
const drinkTitle = $("#drinkTitle")
const drinkImg = $("#drinkImage")
const drinkIngredients = $(".drinkIngredients")
const drinkDescr = $("#drinkDescription")
const drinkGroup = $("#drinkGroup")

//hide images on load

if (drinkImg.attr("src") === "") {
  drinkImg.addClass("hidden")
}
if (foodImg.attr("src") === "") {
  foodImg.addClass("hidden")
}

//handle onclicks

foodGroup.children().on("click", function () {
  for (let i = 0; i < foodGroup.children().length; i++) {
    if (foodGroup.children([i]).hasClass("btn-primary")) {
      foodGroup.children([i]).removeClass("btn-primary")
      foodGroup.children([i]).addClass("btn-secondary")
    }
  }
  $(this).removeClass("btn-secondary")
  $(this).addClass("btn-primary")
})

drinkGroup.children().on("click", function () {
  for (let i = 0; i < drinkGroup.children().length; i++) {
    if (drinkGroup.children([i]).hasClass("btn-primary")) {
      drinkGroup.children([i]).removeClass("btn-primary")
      drinkGroup.children([i]).addClass("btn-secondary")
    }
  }
  $(this).removeClass("btn-secondary")
  $(this).addClass("btn-primary")
  getDrink()
})

// get food requests and post

const getRecipe = async function () {
  let foodGroupId
  if (foodGroup.find("button.btn-primary")) {
    foodGroupId = $(foodGroup).find("button.btn-primary").attr("id")
  }
  const inputText = $("#foodInput").val().split(",")
  const ingredientsQuery = []
  for (let i = 0; i < inputText.length; i++) {
    const singleItem = inputText[i].trim()
    ingredientsQuery.push("+" + singleItem)
  }
  ingredientsQuery.unshift(foodGroupId)

  let response = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsQuery}&number=1&apiKey=${apiKey}`
  )
  let data = await response.json()
  const { title, image, id } = data[0]

  let secondResponse = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
  )
  let secondData = await secondResponse.json()
  const { instructions, summary, extendedIngredients } = secondData

  let ingredients = []
  for (let i = 0; i < extendedIngredients.length; i++) {
    ingredients.push(extendedIngredients[i].original)
  }

  postRecipe(title, image, instructions, summary, ingredients)
}

const postRecipe = function (title, image, instructions, summary, ingredients) {
  foodTitle.html(title)
  foodImg.attr("src", image)
  foodImg.removeClass("hidden")
  if (instructions === "") {
    foodDescr.html(summary)
  } else {
    foodDescr.html(instructions)
  }
  foodIngredients.empty()
  for (let i = 0; i < ingredients.length; i++) {
    foodIngredients.append(`<li>${ingredients[i]}</li>`)
  }
}

// start the get request after search has been pressed

searchButton.click(getRecipe)

// get drinks and post them

const getDrink = async function () {
  let id
  if (drinkGroup.find("button.btn-primary")) {
    id = $(drinkGroup).find("button.btn-primary").attr("id")
  }
  let response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${id}`
  )
  let data = await response.json()
  let drink = data.drinks[Math.floor(Math.random() * data.drinks.length)]
  const { strDrink: title, strDrinkThumb: image } = drink

  let secondResponse = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${title}`
  )
  let secondData = await secondResponse.json()

  const { strInstructions: instructions } = secondData.drinks[0]

  let ingredients = []
  for (let i = 0; i < 15; i++) {
    const measurement = eval(`secondData.drinks[0].strMeasure${i}`)
    const ingredient = eval(`secondData.drinks[0].strIngredient${i}`)
    if (measurement && ingredient) {
      ingredients.push(`${measurement} ${ingredient}`)
    }
    if (!measurement && ingredient) {
      ingredients.push(ingredient)
    }
  }

  postDrink(title, image, instructions, ingredients)
}

const postDrink = function (title, image, instructions, ingredients) {
  drinkTitle.html(title)
  drinkImg.attr("src", image)
  drinkImg.removeClass("hidden")
  drinkDescr.html(instructions)
  drinkIngredients.empty()
  for (let i = 0; i < ingredients.length; i++) {
    drinkIngredients.append(`<li>${ingredients[i]}</li>`)
  }
}
