var popupHideTime = 2000;
var slideOutTime = 500;

let popupTimeout;

// Function to spawn a popup
function spawnPopup(type, message) {
    const popup = document.getElementById('popup');

    // If a popup is already being shown, reset its timeout
    if(popupTimeout) {
        clearTimeout(popupTimeout); 
    }
  
    // Update the message
    const messageElement = popup.querySelector('.popup-message');
    messageElement.textContent = message;
  
    // Remove all classes except for the popup class, set the right type for the popup and start the animation
    popup.className = 'popup';
    popup.classList.add(type);
    popup.classList.add('wobble-in'); 

    // Automatically hide the popup after X seconds
    popupTimeout = setTimeout(() => {
      closePopup();
    }, popupHideTime);
  }
  
  // Function to close the popup
  function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('slide-out'); 
  
    // After animation, hide the popup by adding the hidden class and slide out the popup
    setTimeout(() => {
            popup.className = 'popup hidden'; 
    }, slideOutTime); 
  }
  