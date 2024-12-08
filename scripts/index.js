const placesContainer = document.querySelector('.places__list');

function createCard(imageValue, titleValue) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const imagePopup = document.querySelector('.popup_type_image');

    cardElement.querySelector('.card__image').src = imageValue;
    cardElement.querySelector('.card__image').alt = titleValue;
    cardElement.querySelector('.card__title').textContent = titleValue;
    cardElement.querySelector('.card__like-button').addEventListener('click', function (evt) {
        evt.target.classList.toggle('card__like-button_is-active');
    });
    cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
        cardElement.remove();
    });

    cardElement.querySelector('.card__image').addEventListener('click', () => {
        const popupImage = imagePopup.querySelector('.popup__image');
        const popupCaption = imagePopup.querySelector('.popup__caption');

        popupImage.src = imageValue;
        popupImage.alt = titleValue;
        popupCaption.textContent = titleValue;

        openModal(imagePopup);
    });

    return cardElement;
}

initialCards.forEach((cardValues) => {
    placesContainer.append(createCard(cardValues.link, cardValues.name));
})

function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

const closeButtons = document.querySelectorAll('.popup__close');

closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const popup = event.target.closest('.popup');
        closeModal(popup);
    });
});

const profilePopup = document.querySelector('.popup_type_edit');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profilePopup.querySelector('.popup__input_type_name');
const jobInput = profilePopup.querySelector('.popup__input_type_description');

profileEditButton.addEventListener('click', () => {
    nameInput.value = document.querySelector('.profile__title').textContent;
    jobInput.value = document.querySelector('.profile__description').textContent;
    openModal(profilePopup);
});

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    document.querySelector('.profile__title').textContent = nameInput.value;
    document.querySelector('.profile__description').textContent = jobInput.value;
    closeModal(profilePopup);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

const cardPopup = document.querySelector('.popup_type_new-card');

const addCardButton = document.querySelector('.profile__add-button');
const cardFormElement = cardPopup.querySelector('.popup__form');
const placeNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');

addCardButton.addEventListener('click', () => {
    placeNameInput.value = '';
    cardLinkInput.value = '';
    openModal(cardPopup);
});

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const newCard = createCard(cardLinkInput.value, placeNameInput.value);
    placesContainer.prepend(newCard);
    closeModal(cardPopup);
}

cardFormElement.addEventListener('submit', handleCardFormSubmit);

document.querySelectorAll('.popup').forEach((popup) => {
    popup.classList.add('popup_is-animated');
});
