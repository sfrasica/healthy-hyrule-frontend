


// Initial fetch to display all Dishes
getDishes = () => fetch('http://localhost:3000/dishes').then(resp => resp.json())
getDishes().then(dishes => dishes.forEach(renderDish))


//DOM Elements
    //Holds the UL of dish names
const dishUlistDiv = document.querySelector('#dishes-container') 
    //This is the UL of dish names
const dishUlist = document.createElement("ul") 
dishUlist.innerHTML = '<h1>Dishes</h1>'
dishUlist.id = 'dish-ul' 

const dishInnerDetailDiv = document.createElement('div')
dishInnerDetailDiv.id = 'dish-inner-detail'
dishUlistDiv.append(dishUlist)


    //Render Dish Name in unordered List
function renderDish(dishObj) {
    const dishLi = document.createElement('li')
    dishLi.innerHTML = dishObj.name
    dishLi.dataset.id = dishObj.id
    dishLi.addEventListener('click', (event) => (showDishDiv(event, dishObj)))

    dishUlist.append(dishLi)
     
    //callback function for dishLi Event Listener
    function showDishDiv(event, dishObj) {
        const dishDetailDiv = document.querySelector('#dish-detail-div')
        let dishId = dishObj.id
        dishInnerDetailDiv.innerHTML = `<h3>Dish Name: ${dishObj.name}</h3>
        <h3>Description: ${dishObj.description}</h3>
        <br>
        <img id="food" src="${dishObj.image_url}">`

        
        //where list of ingredients are rendered 
        let ingredientsUl = document.createElement('ul')
        ingredientsUl.id = "ingredients-ul"
        ingredientsUl.innerHTML = "<h4>Ingredients List</h4>"
        
    //DELETE button
        dishButton = document.createElement('button')
        dishButton.id = dishId
        dishButton.innerText = 'Devour' 
        dishInnerDetailDiv.append(dishButton)
        
    //  holding the Div that holds all of the dish details
        dishDetailDiv.append(dishInnerDetailDiv)

    //fetch to render a dish's list of ingredients in the dishInnerDetailDiv
        fetch(`http://localhost:3000/dishes/${dishId}`) 
        .then (resp => resp.json())
        .then(dish => 
            dish.ingredients.forEach(ingredient => {
                console.log(ingredient)
                let ingredientLi = document.createElement('li')
                let ingredientName = ingredient.name
                ingredientLi.innerHTML = `${ingredientName}`
                ingredientsUl.append(ingredientLi)
                dishInnerDetailDiv.append(ingredientsUl)
                dishInnerDetailDiv.append(ingredientForm)

                ingredientLi.addEventListener('click', (event) => {
                    console.log('is this working?')
                    
                    ingredientLi.remove()
                    console.log(ingredient.id)
                 fetch(`http://localhost:3000/ingredients/${ingredient.id}`, {
                 method: "DELETE"
                 
                })
                


                })

            
            }))

    // fetch for DELETING a dish
        dishButton.addEventListener('click', (event) => {

            fetch(`http://localhost:3000/dishes/${dishId}`, {
            method: "DELETE",
            headers: {
                   'Content-Type': 'application/json',
                   'Accept': 'application/json'
                }
            })
                .then(resp => resp.json())
                .then(dish => {
                    dishLi.remove()
                    dishInnerDetailDiv.remove()
                })
        })
    

        //Ingredient Form attributes to add new ingredient to dish
        const ingredientForm = document.createElement('form')
        const ingredientFormLabel = document.createElement('label')
        const ingredientFormNameInput = document.createElement('input')
        const ingredientFormSubmitInput = document.createElement('input')

        ingredientForm.dataset.id = dishId
        ingredientFormLabel.innerHTML = '<h4>New Ingredient</h4>'
        ingredientFormNameInput.setAttribute('type', 'text')
        ingredientFormNameInput.setAttribute('name', 'name')
        ingredientFormSubmitInput.setAttribute('type', 'submit')
        ingredientFormSubmitInput.setAttribute('value', 'Add Ingredient to Dish')

        ingredientForm.append(ingredientFormLabel, ingredientFormNameInput, ingredientFormSubmitInput)


        //eventlistener on form takes callback function to add ingredient to corresponding dish
        ingredientForm.addEventListener('submit', addNewIngredient)

        //callback function for eventListener
        function addNewIngredient(event) { 
            event.preventDefault()
            
            function getData(event){   //data to put in fetch
                return {
                    name: event.target.name.value,
                    dish_id: dishId
                }
            }

            //This is the new ingredient object set to a variable to make it accessible in the POST fetch
            const data = getData(event) 

            //fetch to add an ingredient to an existing dish
            fetch(`http://localhost:3000/ingredients`, 
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data) //Specially formatted string. can only send strings over internet
            }) 
            .then(resp => resp.json())
            .then(newIngredient => {
                
                const newIngredientLi = document.createElement('li')
                newIngredientLi.innerText = newIngredient.name
                console.log(newIngredient.id)
                ingredientsUl.append(newIngredientLi)
            })    
        } 
        
        
    }
 

    
}








 