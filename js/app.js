/******************************************
Treehouse Techdegree:
FSJS project 5 - Public API Requests
--aiming for exceeds expectations--
******************************************/

const employeesArray = [];
const randomUserAPI = 'https://randomuser.me/api/?nat=us&results=12';
const searchDiv = document.querySelector('.search-container');
const galleryDiv = document.querySelector('#gallery');

/** 
---SEARCH BAR---
**/

// createSearch() dynamically creates and adds the search bar to the DOM.
function createSearch() {
    const html = `
                <form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search . . .">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                </form>
                `;

    searchDiv.innerHTML = html;
};
createSearch();

// Event listener filters employees in real-time based on user search input.
const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('keyup', (e) => {
    // Creates an array of just the employee names.
    const input = e.target.value.toLowerCase();
    const employeeNames = [];
    
    employeesArray.forEach(info => {
        const employeeName = `${info.name.first} ${info.name.last}`;
        employeeNames.push(employeeName.toLowerCase());
    });

    // Creates an array of the indexes of the employee cards whose names include the search input.
    const matchedIndexes = [];
    
    employeeNames.forEach(name => {   
        if(name.indexOf(input) >= 0) {
            const matchIndex = employeeNames.indexOf(name);
            matchedIndexes.push(matchIndex);
        };
    });

    // Creates an array of just the employee cards that match the search.
    const employeeCards = Array.from(document.querySelectorAll('.card'));
    const matchedCards = [];
    
    employeeCards.forEach(card => {
        for(let i = 0; i < matchedIndexes.length; i++) {
            const cardId = parseInt(card.id);
            if(cardId === matchedIndexes[i]) {
                matchedCards.push(card);
            };
        };
    });

    // Displays only the employee cards that match the search.
    employeeCards.forEach(card => card.style.display = 'none');
    matchedCards.forEach(card => card.style.display = 'inherit');
});

/** 
---EMPLOYEE CARDS---
**/

// createCards() dynamically creates and adds the employee cards to the DOM.
// An event listener is also added to each employee card, and other event listeners added to modal buttons.
// @param {array} data - the array containing every employee's set of info
function createCards(data) {
    let i = 0;
    let targetId;

    // Creates an employee card for each object in the data array.
    data.forEach(info => {
        const galleryCard = document.createElement('div');
        const html = `
                    <div class="card-img-container">
                        <img class="card-img" src="${info.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${info.name.first} ${info.name.last}</h3>
                        <p class="card-text">${info.email}</p>
                        <p class="card-text cap">${info.location.city}</p>
                    </div>
                    `;

        galleryDiv.appendChild(galleryCard);
        galleryCard.className = 'card';
        galleryCard.id = i++;
        galleryCard.innerHTML = html;
        employeesArray.push(info);
 
        // Event listener added to each card opens the modal window to display additional info about the selected employee.
        galleryCard.addEventListener('click', (e) => {
            setModalContent(info);
            targetId = parseInt(e.currentTarget.id);
        });
    });

    // Event listener closes the modal window when the user clicks on the X button in the corner.
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDiv = document.querySelector('.modal-container');

    modalCloseBtn.addEventListener('click', () => {
        modalDiv.style.display = 'none';
    });

    // Event listeners allow user to toggle to the previous or next employee's modal.
    const indexOfLastEmployee = data.length - 1;
    const modalPrevBtn = document.getElementById('modal-prev');
    const modalNextBtn = document.getElementById('modal-next');
    
    modalPrevBtn.addEventListener('click', () => {
        let prevData;
        
        if(targetId === 0) {
            prevData = data[indexOfLastEmployee];
            targetId = indexOfLastEmployee;
            setModalContent(prevData);
        } else {        
            prevData = data[targetId - 1];
            targetId -= 1;
            setModalContent(prevData);
        };
    });

    modalNextBtn.addEventListener('click', () => {
        if(targetId === indexOfLastEmployee) {
            nextData = data[0];
            targetId = 0;
            setModalContent(nextData);
        } else {        
            nextData = data[targetId + 1];
            targetId += 1;
            setModalContent(nextData);
        };
    });
};

/** 
---MODAL WINDOW---
**/

// createModal() dynamically creates and adds the modal to the DOM.
function createModal() {
    const modalDiv = document.createElement('div');
    const html = `
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container"></div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
                `;
    
    modalDiv.innerHTML = html;
    galleryDiv.insertAdjacentElement('afterend', modalDiv);
    modalDiv.className = 'modal-container';
    modalDiv.style.display = 'none';
};
createModal();

// setModalContent() sets/changes the employee info displayed.
// @param {object} data - the employee's set of info
function setModalContent(data) {
    // Note: the date code below is from https://stackoverflow.com/questions/11591854/format-date-to-mm-dd-yyyy-in-javascript
    // and it transorms the dob value into the required mm/dd/yyyy format.
    let date = new Date(data.dob.date);
    date = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();

    const modalDiv = document.querySelector('.modal-container');
    const modalInfo = document.querySelector('.modal-info-container');
    const html = `
                <img class="modal-img" src="${data.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
                <p class="modal-text">${data.email}</p>
                <p class="modal-text cap">${data.location.city}</p>
                <hr>
                <p class="modal-text">${data.cell}</p>
                <p class="modal-text">
                    ${data.location.street.number} ${data.location.street.name}
                    <br>        <!-- I took the liberty here to add a line break to help with readability of the address -->
                    ${data.location.city}, ${data.location.state} ${data.location.postcode}
                </p>
                <p class="modal-text">Birthday: ${date}</p>
                `;
    
    modalInfo.innerHTML = html;
    modalDiv.style.display = 'inherit';
};

/** 
---FETCH API---
**/

// getEmployees() fetches data of 12 random users (from the US) from the API
// and then calls the createCards() function to display the employees on the page.
// @param {string} url - the url of the API where the data is being fetched from
async function getEmployees(url) {
    const responses = await fetch(url);
    const responsesJSON = await responses.json();
    
    createCards(responsesJSON.results);
};
getEmployees(randomUserAPI);