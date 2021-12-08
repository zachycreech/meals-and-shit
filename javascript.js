// global variables

const foodTitle = $("#foodTitle")
const drinkTitle = $("#drinkTitle")
const foodDescr = $("#foodDescription")
const drinkDescr = $("#drinkDescription")
const foodGroup = $("#foodGroup")
const drinkGroup = $("#drinkGroup")
const searchButton = $("#searchButton")
const foodImg = $("#foodImg")
const drinkImg = $("#drinkImage")
const apiKey = "45fa1958465544f1a8f06e376252e2a6"
let id
// helper functions

if (drinkImg.attr("src") === "") {
  drinkImg.addClass("hidden")
}
if (foodImg.attr("src") === "") {
  foodImg.addClass("hidden")
}

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

const getRecipe = async function () {
  let foodGroupId
  if (foodGroup.find("button.btn-primary")) {
    foodGroupId = $(foodGroup).find("button.btn-primary").attr("id")
  }
  const inputText = $("#foodInput").val().split(",")
  const ingredients = []
  for (let i = 0; i < inputText.length; i++) {
    const singleItem = inputText[i].trim()
    ingredients.push("+" + singleItem)
  }
  ingredients.unshift(foodGroupId)

  let response = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=1&apiKey=${apiKey}`
  )
  let data = await response.json()
  const { title, image, id } = data[0]

  console.log(id)
  let secondResponse = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
  )
  let secondData = await secondResponse.json()
  const { instructions, summary } = secondData

  postRecipe(title, image, instructions, summary)
}

const postRecipe = function (title, image, instructions, summary) {
  foodTitle.html(title)
  foodImg.attr("src", image)
  foodImg.removeClass("hidden")
  if (instructions === "") {
    foodDescr.html(summary)
  } else {
    foodDescr.html(instructions)
  }
  console.log(summary)
}

searchButton.click(getRecipe)

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

  postDrink(title, image, instructions)
}

const postDrink = function (title, image, instructions) {
  drinkTitle.html(title)
  drinkImg.attr("src", image)
  drinkImg.removeClass("hidden")
  drinkDescr.html(instructions)
}
