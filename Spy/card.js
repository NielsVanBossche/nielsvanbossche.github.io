class Flashcard {
    constructor(cardData) {
        // Create the flashcard element and append it to the body
        this.flashcardElement = this.createFlashcardElement();
        
        // Structure
        this.flashcardContainer = this.flashcardElement.querySelector('.flashcard_container');
        this.titleFront = this.flashcardElement.querySelector('.title_front');
        this.titleBack = this.flashcardElement.querySelector('.title_back');
        this.frontText = this.flashcardElement.querySelector('.text_front');
        this.backText = this.flashcardElement.querySelector('.text_back');
        this.wordText = this.flashcardElement.querySelector('.word_text');
        this.frontLogo = this.flashcardElement.querySelector('.front_logo');
        this.backLogo = this.flashcardElement.querySelector('.back_logo');
        this.front = this.flashcardElement.querySelector('.front');
        this.back = this.flashcardElement.querySelector('.back');

        // Variables
        this.side = true; 
        this.cardData = cardData;
        this.constrain = 50;
        this.flipCount = 0;

        // Set up the initial card content
        this.setupCard();

        // Event listeners
        this.flashcardElement.addEventListener('click', this.rotateCard.bind(this));
        this.flashcardElement.onmousemove = this.flashcardElement.onclick = this.handleMouseMove.bind(this);
    }

    createFlashcardElement() {
        // Define the card HTML structure
        const cardHTML = `
            <div class="cardbody">
                <div class="flashcard">
                    <div class="flashcard_container">
                        <div class="contents front">
                            <div class="depth">
                                <div>
                                    <div class="cardtitle title_front"></div>
                                    <div class="cardtext text_front"></div>
                                    <img src="" alt="Logo Front" class="logo front_logo">
                                </div>
                            </div>
                        </div>
                        <div class="contents back">
                            <div class="depth">
                                <div>
                                    <div class="cardtitle title_back"></div>
                                    <div class="cardtext text_back"></div>
                                    <img src="" alt="Logo Back" class="logo back_logo">
                                    <div class="cardtext word_text"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        // Create a div and set its innerHTML to the card HTML
        const container = document.createElement('div');
        container.innerHTML = cardHTML;

        return container.firstElementChild; 
    }

    rotateCard() {
        this.flashcardContainer.classList.toggle('rotate');
        this.side = !this.side;
        this.flipCount++;

        // Create rotate events (can be used in other javascripts to react on them)
        const event = new CustomEvent('cardFlipped', {});
        this.flashcardElement.dispatchEvent(event); 
    }

    setupCard() {
        this.titleFront.innerHTML = this.cardData.frontTitle;
        this.titleBack.innerHTML = this.cardData.backTitle;
        
        this.frontText.innerHTML = this.cardData.frontText.replace(/\r?\n/g, '<br />');
        this.backText.innerHTML = this.cardData.backText.replace(/\r?\n/g, '<br />');

        this.wordText.innerHTML = this.cardData.wordText;

        this.frontLogo.src = this.cardData.frontLogo;
        this.backLogo.src = this.cardData.backLogo;
    }

    handleMouseMove(e) {
        const xy = [e.clientX, e.clientY];
        const position = xy.concat([this.flashcardContainer]);

        window.requestAnimationFrame(() => {
            this.transformElement(this.flashcardContainer, position);
        });
    }

    transforms(x, y, el) {
        const box = el.getBoundingClientRect();
        let calcX, calcY;

        if (el.classList.contains('rotate')) {
            calcX = -(y - box.y - (box.height / 2)) / this.constrain;
            calcY = 180 + (x - box.x - (box.width / 2)) / this.constrain;
        } else {
            calcX = -(y - box.y - (box.height / 2)) / this.constrain;
            calcY = (x - box.x - (box.width / 2)) / this.constrain;
        }

        return `rotateX(${calcX}deg) rotateY(${calcY}deg)`;
    }

    transformElement(el, xyEl) {
        el.style.transform = this.transforms.apply(this, xyEl);
    }
}
