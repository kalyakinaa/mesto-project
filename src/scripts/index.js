import '../pages/index.css';
import { initialCards } from './cards.js';
import avatarImage from '../images/avatar.jpg';
const avatar = document.querySelector('.profile__image');
avatar.style.backgroundImage = `url(${avatarImage})`;
import logoImage from '../images/logo.svg';
const logo = document.querySelector('.header__logo');
logo.src = logoImage;

const placesContainer = document.querySelector('.places__list');

function createCard(imageValue, titleValue) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const imagePopup = document.querySelector('.popup_type_image');
    imagePopup.addEventListener('click', handleOverlayClick);

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

function handleOverlayClick(e) {
    if (e.target.classList.contains('popup')) {
        closeModal(e.target);
    }
}

function handleEscClick(e) {
    if (e.key === 'Escape') {
        const currentPopup = document.querySelector('.popup_is-opened');
        if (currentPopup) {
            closeModal(currentPopup);
        }
    }
}
document.addEventListener('keydown', handleEscClick);

const closeButtons = document.querySelectorAll('.popup__close');

closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const popup = event.target.closest('.popup');
        closeModal(popup);
    });
});

const profilePopup = document.querySelector('.popup_type_edit');
profilePopup.addEventListener('click', handleOverlayClick);

const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profilePopup.querySelector('.popup__input_type_name');
const jobInput = profilePopup.querySelector('.popup__input_type_description');
const profileInputs = Array.from(profileFormElement.querySelectorAll('.popup__input'));
const profileSubmitButton = profileFormElement.querySelector('.popup__button');

function toggleProfileSubmitButtons() {
    let profileValid = nameInput.validity.valid && jobInput.validity.valid;
    if (profileValid) {
        profileSubmitButton.classList.remove('popup__button_inactive');
        profileSubmitButton.disabled = false;
    } else {
        profileSubmitButton.classList.add('popup__button_inactive');
        profileSubmitButton.disabled = true;
    }
}

profileEditButton.addEventListener('click', () => {
    nameInput.value = document.querySelector('.profile__title').textContent;
    if (!nameInput.validity.valid) {
        showInputError(nameInput);
    } else {
        hideInputError(nameInput);
    }

    jobInput.value = document.querySelector('.profile__description').textContent;
    if (!jobInput.validity.valid) {
        showInputError(jobInput);
    } else {
        hideInputError(jobInput);
    }

    toggleProfileSubmitButtons();
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
cardPopup.addEventListener('click', handleOverlayClick);

const addCardButton = document.querySelector('.profile__add-button');
const cardFormElement = cardPopup.querySelector('.popup__form');
const cardNameInput = cardPopup.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardPopup.querySelector('.popup__input_type_url');
const cardInputs = Array.from(cardFormElement.querySelectorAll('.popup__input'));
const cardSubmitButton = cardFormElement.querySelector('.popup__button');

function toggleCardSubmitButtons() {
    let cardValid = cardNameInput.validity.valid && cardLinkInput.validity.valid;
    if (cardValid) {
        cardSubmitButton.classList.remove('popup__button_inactive');
        cardSubmitButton.disabled = false;
    } else {
        cardSubmitButton.classList.add('popup__button_inactive');
        cardSubmitButton.disabled = true;
    }
}

addCardButton.addEventListener('click', () => {
    cardNameInput.value = '';
    if (!cardNameInput.validity.valid) {
        showInputError(cardNameInput);
    } else {
        hideInputError(cardNameInput);
    }

    cardLinkInput.value = '';
    if (!cardLinkInput.validity.valid) {
        showInputError(cardLinkInput);
    } else {
        hideInputError(cardLinkInput);
    }

    toggleCardSubmitButtons();

    openModal(cardPopup);
});

function showInputError(input) {
    input.classList.add('popup__input_error');
    let inputErrorMessage = document.querySelector(`.${input.id}-error-message`);
    inputErrorMessage.classList.add('popup__input_error-message_active');
    inputErrorMessage.textContent = input.validationMessage;
}

function hideInputError(input) {
    input.classList.remove('popup__input_error');
    let inputErrorMessage = document.querySelector(`.${input.id}-error-message`);
    inputErrorMessage.classList.remove('popup__input_error-message_active');
}

const inputs = Array.from(document.querySelectorAll('.popup__input'));
inputs.forEach(function(input) {
    input.addEventListener('input', function(e) {
        if (!e.target.validity.valid) {
            showInputError(e.target);
        } else {
            hideInputError(e.target);
        }
        toggleProfileSubmitButtons();
        toggleCardSubmitButtons();
    }); 
});

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const newCard = createCard(cardLinkInput.value, cardNameInput.value);
    placesContainer.prepend(newCard);
    closeModal(cardPopup);
}

cardFormElement.addEventListener('submit', handleCardFormSubmit);

document.querySelectorAll('.popup').forEach((popup) => {
    popup.classList.add('popup_is-animated');
});
