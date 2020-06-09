/******************************************
Treehouse Techdegree:
FSJS project 5 - Public API Requests
--aiming for exceeds expectations--
******************************************/

const randomUserAPI = 'https://randomuser.me/api/?nat=us&results=12';
const searchDiv = document.querySelector('.search-container');
const galleryDiv = document.querySelector('#gallery');


// createSearch() dynamically creates and adds the search bar to the DOM.
function createSearch() {
    const html = `
                <form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                </form>
                `;

    searchDiv.innerHTML = html;
};
createSearch();


// createCards() dynamically creates and adds the employee cards to the DOM.
// An event listener is also added to each employee card, and other event listeners added to modal buttons.
// @param {array} data - the array containing every employee's set of info
function createCards(data) {
    let i = 0;
    let targetId;

    data.forEach(info => {
        const galleryCard = document.createElement('div');
        const html = `
                    <div class="card-img-container">
                        <img class="card-img" src="${info.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${info.name.first} ${info.name.last}</h3>
                        <p class="card-text">${info.email}</p>
                        <p class="card-text cap">${info.location.city}, ${info.location.state}</p>
                    </div>
                    `;

        galleryDiv.appendChild(galleryCard);
        galleryCard.className = 'card';
        galleryCard.id = i++;
        galleryCard.innerHTML = html;
 
        // Event listener opens the modal window to display additional info about the selected employee.
        galleryCard.addEventListener('click', (e) => {
            setModalContent(info);
            targetId = parseInt(e.currentTarget.id);
        });
    });

    // Event listener closes the modal window when the user clicks on the X button in the corner.
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDiv = document.querySelector('.modal-container');
    modalCloseBtn.addEventListener('click', () => {
        modalDiv.hidden = true;
    });

    // Event listener allows user to toggle to the previous employee's modal.
    const modalPrevBtn = document.getElementById('modal-prev');
    modalPrevBtn.addEventListener('click', () => {
        let prevData;
        if(targetId === 0) {
            prevData = data[11];
            targetId = 11;
            setModalContent(prevData);
        } else {        
            prevData = data[targetId - 1];
            targetId -= 1;
            setModalContent(prevData);
        };
    });

    // Event listener allows user to toggle to the next employee's modal.
    const modalNextBtn = document.getElementById('modal-next');
    modalNextBtn.addEventListener('click', () => {
        if(targetId === 11) {
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
    modalDiv.hidden = true;
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
    modalDiv.hidden = false;
};

// getEmployees() fetches data of 12 random users (from the US) from the API
// and then calls the createCards() function to display the employees on the page.
// @param {string} url - the url of the API where the data is being fetched from
async function getEmployees(url) {
    const responses = await fetch(url);
    const responsesJSON = await responses.json();
    createCards(responsesJSON.results);
};
getEmployees(randomUserAPI);