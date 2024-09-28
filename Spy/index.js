let cardsParent = document.querySelector(".cards");
let cards = [];
var cardIndex = 0;

let numberOfPlayers;
let numberOfSpies;
let players = []

const roles = [
    { role: 'spy', title: 'Spy', count: 1, logo: "logos/spyLogo.png" },
    { role: 'medic', title: 'Medic', count: 0, logo: "logos/medicLogo.png" },
    { role: 'leader', title: 'Leader', count: 0, logo: "logos/leaderLogo.png" },
    { role: 'player', title: 'Player', count: 2, logo: "logos/playerLogo.png" } 
];

function start(){
    // Get form output
    numberOfPlayers = document.querySelector("#people").value;
    numberOfSpies = document.querySelector("#spies").value;

    // Setup the game
    setupGame();

    // Prepare all the cards
    loadCards();
    
    // Switch views
    document.querySelector(".setup").classList.add("hidden");
    document.querySelector(".cards").classList.remove("hidden");
}

function setupGame(){
    // Pick all the roles for all the players
    // First create a array containing all the neccesary roles
    roles.forEach(roleInfo => {
        for(let i = 0; i < roleInfo.count; i++) {
            players.push(roleInfo.role);
        }
    });

    // Shuffle the roles, by switching every element from back to front with a random element in front of it
    for(let i = numberOfPlayers - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }
}

function loadCards() {
    for (let i = 0; i < numberOfPlayers; i++) {
        let player = players[i];
        let role = getRoleInfo(player); 

        // Create the cards data
        let cardData = {
            frontTitle: "Player " + (i + 1),
            backTitle: "You are a",
            frontLogo: "logos/logo.png",
            frontText: "Tap to see role",
            backText: role.title,
            backLogo: role.logo,
        }

        // Create a card and add it to the cards div
        let card = new Flashcard(cardData);
        cards.push(card);
        cardsParent.appendChild(card.flashcardElement);

        // If not the first card, just hide it
        if(i > 0){
            console.log(card.flashcardElement);
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
                    return;
                }

                // Show the other card, what a bit to make animation better
                setTimeout(function() {
                    cards[cardIndex].flashcardElement.classList.remove("closed");
                }, 250);
            }
        });
    }
}

function updateSpies() {
    const peopleInput = document.getElementById('people');
    const spiesInput = document.getElementById('spies');

    // Get the current number of people and spies
    const people = parseInt(peopleInput.value, 10);
    const spies = parseInt(spiesInput.value, 10);
    
    // Update the spies input if it exceeds the number of people
    if(spies > people - 1) {
        spiesInput.value = people - 1;
    }
}

function limitSpies() {
    const peopleInput = document.getElementById('people');
    const spiesInput = document.getElementById('spies');

    // Get the current number of people
    const people = parseInt(peopleInput.value, 10);
    
    // Calculate the maximum number of spies
    const maxSpies = Math.max(0, people - 1);

    // If spies input exceeds max, set it to max
    if (parseInt(spiesInput.value, 10) > maxSpies) {
        spawnPopup("error", "Error occurred!");
        spiesInput.value = maxSpies;
    }
}


function setCounter() {
    let count = index + 1;
    counter.innerHTML = count + " / " + cards.length;
}

function setCountdown(){
    var passed = 0;
    document.querySelector(".countdownTime").innerHTML = countdownTimer
    countdownInterval = setInterval(function() {
        passed++;
        document.querySelector(".countdownTime").innerHTML = countdownTimer - passed;
        if(countdownTimer - passed == 0) {
            clearInterval(countdownInterval);
            document.querySelector(".countdownTime").innerHTML = "Stop";
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


// Function to get the role details for a player
function getRoleInfo(playerRole) {
    return roles.find(role => role.role === playerRole);
}