let cardsParent = document.querySelector(".cards");
let cards = [];
var cardIndex = 0;

let numberOfPeople;
let roles = {};
let numberOfRoles = {}
let players = []

let words = {}; 
let selectedCategories = [];
let randomWord;

// Fetch words from external JSON file (categories.json)
fetch('categories.json')
.then(response => response.json())
.then(data => {
    words = data; 
})
.catch(error => {
    console.error('Error loading the words:', error);
});

// Fetch roles from external JSON file (roles.json)
fetch('roles.json')
.then(response => response.json())
.then(data => {
    roles = data; 
})
.catch(error => {
    console.error('Error loading the roles:', error);
});



function start(){
    // Get the number of people particifpating
    numberOfPeople = document.querySelector('#numberOfPeople').value;

    // Get all roles info input
    const inputs = document.querySelectorAll('.roles-input');
    inputs.forEach(input => {
        const roleName = input.name;
        const roleValue = parseInt(input.value); 
        numberOfRoles[roleName] = roleValue;
    });

    // Setup the game
    setupRoles();

    // Setup words
    getCategories();    
    getRandomWord();

    // Prepare all the cards
    loadCards();
    
    // Switch views
    document.querySelector(".setup").classList.add("hidden");
    document.querySelector(".cards").classList.remove("hidden");
}

function setupRoles(){
    // Reset players
    players = [];

    // Pick all the roles for all the players
    // First create a array containing all the neccesary roles 
    // by adding every role 
    let total = 0;
    for(const role in numberOfRoles){
        const count = numberOfRoles[role]; 
        total += count;
        for(let i = 0; i < count; i++){
            players.push(role); 
        }
    }
    // and then filling the rest with normal players
    const remainingPlayers = numberOfPeople - total;
    for (let i = 0; i < remainingPlayers; i++) {
        players.push('player');
    }

    // Shuffle the roles, by switching every element from back to front with a random element in front of it
    for(let i = numberOfPeople - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }
}

function loadCards() {
    for (let i = 0; i < numberOfPeople; i++) {
        let player = players[i];
        let role = roles[player] 

        // Create the cards data
        let cardData = {
            frontTitle: "Player " + (i + 1),
            backTitle: "You are a",
            frontLogo: "logos/logoShadow.png",
            frontText: "Tap to see role",
            backText: role.title,
            backLogo: role.logo,
            wordText: role.showRandomWord ? randomWord : "",
        }

        // Create a card and add it to the cards div
        let card = new Flashcard(cardData);
        cards.push(card);
        cardsParent.appendChild(card.flashcardElement);

        // If not the first card, just hide it
        if(i > 0){
            card.flashcardElement.classList.add("closed");
        }

        // If the card is flipped back to the front, just go to the next card
        card.flashcardElement.addEventListener('cardFlipped', (event) => {

            // Check if it's flipped to the back and front (so flipped twice)
            if(card.flipCount == 2){ 
                card.flashcardElement.classList.add("closed");

                // Check if this isn't the last card
                cardIndex++; 
                if(cardIndex == cards.length){
                    startTimer();
                    return;
                }

                // Show the other card, what a bit to make animation better
                setTimeout(function() {
                    cards[cardIndex].flashcardElement.classList.remove("closed");
                }, 250);
            }
            // If the user sees it's role add some JUICE
            else if(card.flipCount == 1){
                //card.flashcardElement.style.boxShadow = "0px 0 60px rgb(0 0 0), 0px 0 80px "+ role.color +", 0px 0 20px rgb(0 0 0); !important";
            }
        });
    }
}

function startTimer(){
    // Get time
    let time = parseInt(document.querySelector("#countdownTime").value);
    setCountdown(time)

    // Switch views
    document.querySelector(".cards").classList.add("hidden");
    document.querySelector(".countdown").classList.remove("hidden");
}

function updateNumberOfPeople() {
    // Get total amount of people
    const peopleInput = document.getElementById('numberOfPeople');
    const totalPeople = parseInt(peopleInput.value, 10);

    // Store each amount of any role
    const roleCounts = {};
    for(const role in roles){
        const roleInput = document.getElementById(role);
        roleCounts[role] = roleInput ? parseInt(roleInput.value) : 0;
    }
    roleCounts['player'] = totalPeople;
    
    // Iterate through each role
    for(const role in roles){
        const roleData = roles[role];
        const roleInput = document.getElementById(role);
        const roleCount = roleInput ? parseInt(roleInput.value) : 0;

        // Calculate the max and min value based on the role
        let maxCount;
        if(roleData.max === "/"){
            maxCount = totalPeople;
        } 
        else{
            maxCount = eval(roleData.max.replace(/(\w+)/g, (match) => roleCounts[match] || match));
        }
        let minCount = eval(roleData.min.replace(/(\w+)/g, (match) => roleCounts[match] || match));

        // Check if the role count is within the min and max limits
        if(roleCount < minCount){
            // Adjust to the minium
            roleInput.value = minCount;
            spawnPopup("error", "To little of role " + role);
        } 
        else if(roleCount > maxCount){
            // Adjust to the maximum
            roleInput.value = maxCount;
            spawnPopup("error", "To many of role " + role);
        }
        else{
            console.log(`Valid count for ${role}: ${roleCount}.`);
        }
    }
}

function updateRole(role) {
    // Get total amount of people
    const peopleInput = document.getElementById('numberOfPeople');
    const totalPeople = parseInt(peopleInput.value, 10);

    // Get the current value of the input for the role
    const inputField = document.getElementById(role);
    let roleCount = parseInt(inputField.value, 10);
    const roleData = roles[role]; 

    // Store each amount of any role
    const roleCounts = {};
    for(const role in roles){
        const roleInput = document.getElementById(role);
        roleCounts[role] = roleInput ? parseInt(roleInput.value) : 0;
    }
    roleCounts['player'] = totalPeople;

    console.log(roleCounts);

    // Calculate the max and min value based on the role
    let maxCount;
    if(roleData.max === "/"){
        maxCount = totalPeople;
    } 
    else{
        maxCount = eval(roleData.max.replace(/(\w+)/g, (match) => roleCounts[match] || match));
    }
    let minCount = eval(roleData.min.replace(/(\w+)/g, (match) => roleCounts[match] || match));
    
    // Check if the role count is within the min and max limits
    if(roleCount < minCount){
        // Adjust to the minium
        inputField.value = minCount;
        spawnPopup("error", "To little of role " + role);
    } 
    else if(roleCount > maxCount){
        // Adjust to the maximum
        inputField.value = maxCount;
        spawnPopup("error", "To many of role " + role);
    }
    else{
        console.log(`Valid count for ${role}: ${roleCount}.`);
    }

    // Update the role count in numberOfRoles
    numberOfRoles[role] = roleCount;
}

// Function to get selected categories and update the display
function getCategories() {
    selectedCategories = [];
    const checkboxes = document.querySelectorAll('#categoryForm .form-check-input');
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
        selectedCategories.push(checkbox.value);
        }
    });
}

// Function to show a random word from the selected categories
function getRandomWord() {
    if(selectedCategories.length === 0){
        alert('Please select at least one category!');
        return;
    }

    let allWords = [];

    // Gather words from selected categories
    selectedCategories.forEach(category => {
        if(words[category]){
            allWords = allWords.concat(words[category]);
        }
    });

    // Pick a random word from the combined words
    randomWord = allWords[Math.floor(Math.random() * allWords.length)];
}

function setCountdown(time){
    var passed = 0;
    const timer = document.querySelector(".countdown-timer");
    timer.innerHTML =   String(parseInt(time / 60)).padStart(2, '0') + " : " + 
                        String(time % 60).padStart(2, '0');
    countdownInterval = setInterval(function() {
        passed++;
        let remainingTime = time - passed;

        timer.innerHTML =   String(parseInt(remainingTime / 60)).padStart(2, '0') + " : " + 
                            String(remainingTime % 60).padStart(2, '0');
        if(remainingTime == 0) {
            clearInterval(countdownInterval);
            timer.innerHTML = "Stop";
            countdownPassed();
        }
    }, 1000);
}
function resetCountdown(){
    clearInterval(countdownInterval);
    setCountdown();
}
function countdownPassed(){
    flashcard_container.classList.toggle('rotate');
    flashcard_container.style.transform  = transforms.apply(null, [0,0, flashcard_container]);
    side = !side;
    setTimeout(() => {
        nextFlashcard();
    }, 3000);
}
