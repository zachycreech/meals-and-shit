// global variables
// const chickenBtn = $("#chicken")
// const lambBtn = $("#lamb")
// const fishBtn = $("#fish")
// const shrimpBtn = $("#shrimp")
// const turkeyBtn = $("#turkey")
// const duckBtn = $("#duck")
const titleEl = $(".title")
const descr = $(".decsription")
const buttonGroup = $("#buttonGroup")
const searchButton = $("#searchButton")
const imageEl = $("#foodImg")
const apiKey = "45fa1958465544f1a8f06e376252e2a6"
let id
// helper functions

buttonGroup.children().on("click", function () {
  for (let i = 0; i < buttonGroup.children().length; i++) {
    if (buttonGroup.children([i]).hasClass("btn-primary")) {
      buttonGroup.children([i]).removeClass("btn-primary")
      buttonGroup.children([i]).addClass("btn-secondary")
    }
  }
  $(this).removeClass("btn-secondary")
  $(this).addClass("btn-primary")
})

const getRecipe = async function () {
  let id
  if (buttonGroup.find("button.btn-primary")) {
    id = $(buttonGroup).find("button.btn-primary").attr("id")
  }
  const inputText = $("#inputText").val().split(",")
  const ingredients = []
  for (let i = 0; i < inputText.length; i++) {
    const singleItem = inputText[i].trim()
    ingredients.push("+" + singleItem)
  }
  ingredients.unshift(id)
  console.log(ingredients)

  let response = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=1&apiKey=${apiKey}`
  )
  let data = await response.json()
  postRecipe(data)
}

const postRecipe = function (data) {
  const { title, image } = data[0]
  titleEl.html(title)
  imageEl.attr("src", image)
}

searchButton.click(getRecipe)

// main function
