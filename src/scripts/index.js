import '../pages/index.css';
const avatarImg = document.querySelector('.profile__image');

import {
    getUserProfile,
    getInitialCards,
    updateUserProfile,
    addNewCard,
    deleteCard,
    likeCard,
    unlikeCard,
    updateAvatar,
} from './api.js';

import logoImage from '../images/logo.svg';
const logo = document.querySelector('.header__logo');
logo.src = logoImage;

const placesContainer = document.querySelector('.places__list');

function addCard(cardData, currentUserId) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const imagePopup = document.querySelector('.popup_type_image');
    imagePopup.addEventListener('click', handleOverlayClick);
    const cardLikeCount = cardElement.querySelector('.card__like-count');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardElement.querySelector('.card__image').src = cardData.link;
    cardElement.querySelector('.card__image').alt = cardData.name;
    cardElement.querySelector('.card__title').textContent = cardData.name;
    cardLikeCount.textContent = cardData.likes.length;

    if (cardData.owner._id !== currentUserId) {
        deleteButton.style.visibility = 'hidden';
    }
    deleteButton.addEventListener('click', function() {
        deleteCard(cardData._id)
        .then(function() {
            cardElement.remove();
        })
        .catch(function(err) {
            console.error(`deleteCard() error: ${err}`);
        });
    });
    
    if (cardData.likes.some((user) => user._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    likeButton.addEventListener('click', () => {
        if (likeButton.classList.contains('card__like-button_is-active')) {
          unlikeCard(cardData._id)
          .then((updatedCard) => {
              likeButton.classList.remove('card__like-button_is-active');
              cardLikeCount.textContent = updatedCard.likes.length;
          })
          .catch((err) => {
              console.error('unlikeCard() error:', err);
          });
        } else {
          likeCard(cardData._id)
          .then((updatedCard) => {
              likeButton.classList.add('card__like-button_is-active');
              cardLikeCount.textContent = updatedCard.likes.length;
          })
          .catch((err) => {
              console.error('likeCard() error:', err);
          });
        }
    });

    imagePopup.classList.add('popup_is-animated');
    cardElement.querySelector('.card__image').addEventListener('click', () => {
        const popupImage = imagePopup.querySelector('.popup__image');
        const popupCaption = imagePopup.querySelector('.popup__caption');

        popupImage.src = cardData.link;
        popupImage.alt = cardData.name;
        popupCaption.textContent = cardData.name;

        openModal(imagePopup);
    });

    return cardElement;
}

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

const avatarPopup = document.querySelector('.popup_type_new-avatar');
avatarPopup.addEventListener('click', handleOverlayClick);
const avatarForm = avatarPopup.querySelector('.popup__form');
const inputAvatarLink = avatarForm.querySelector('.popup__input_type_url');
const avatarSubmitButton = avatarForm.querySelector('.popup__button');

function toggleAvatarSubmitButtons() {
    let avatarValid = inputAvatarLink.validity.valid;
    if (avatarValid) {
        avatarSubmitButton.classList.remove('popup__button_inactive');
        avatarSubmitButton.disabled = false;
    } else {
        avatarSubmitButton.classList.add('popup__button_inactive');
        avatarSubmitButton.disabled = true;
    }
}

avatarImg.addEventListener('click', function() {
    inputAvatarLink.value = '';
    if (!inputAvatarLink.validity.valid) {
        showInputError(inputAvatarLink);
    } else {
        hideInputError(inputAvatarLink);
    }
    toggleAvatarSubmitButtons();
    openModal(avatarPopup);
});

const avatarPopupClose = avatarPopup.querySelector('.popup__close');
avatarPopupClose.addEventListener('click', function() {
    closeModal(avatarPopup);
});

avatarForm.addEventListener('submit', function handleAvatarFormSubmit(e) {
    e.preventDefault();
    const updatedAvatarLink = inputAvatarLink.value;
    updateAvatar(updatedAvatarLink)
    .then((userData) => {
      avatarImg.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error(`updateAvatar() error: ${err}`);
    })
});

const profilePopup = document.querySelector('.popup_type_edit');
profilePopup.classList.add('popup_is-animated');
profilePopup.addEventListener('click', handleOverlayClick);

const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = profilePopup.querySelector('.popup__form');
const nameInput = profilePopup.querySelector('.popup__input_type_name');
const jobInput = profilePopup.querySelector('.popup__input_type_description');
const profileInputs = Array.from(profileFormElement.querySelectorAll('.popup__input'));
const profileSubmitButton = profileFormElement.querySelector('.popup__button');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

let currentUserId = null;
getUserProfile()
.then(function(userData) {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarImg.style.backgroundImage = `url(${userData.avatar})`;
    currentUserId = userData._id;
})
.catch(function(err) {
    console.error(`getUser() error: ${err}`);
});

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
    nameInput.value = profileTitle.textContent;
    if (!nameInput.validity.valid) {
        showInputError(nameInput);
    } else {
        hideInputError(nameInput);
    }

    jobInput.value = profileDescription.textContent;
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
    const updatedUserData = {
        name: nameInput.value,
        about: jobInput.value
    };
    updateUserProfile(updatedUserData)
    .then(function(userData) {
        console.log(userData);
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        closeModal(profilePopup);
    })
    .catch((err) => {
        console.error(`updateUser() error: ${err}`);
    })
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

getInitialCards()
.then(function(cards) {
    cards.forEach((cardData) => {
        placesContainer.append(addCard(cardData, currentUserId));
    });
})
.catch(function(err) {
    console.error(`getInitialCards() error: ${err}`);
});

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
        toggleAvatarSubmitButtons();
        toggleProfileSubmitButtons();
        toggleCardSubmitButtons();
    });
});

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const newCardData = {
        name: cardNameInput.value,
        link: cardLinkInput.value
    };
    addNewCard(newCardData)
    .then(function(cardData) {
        placesContainer.prepend(addCard(cardData, currentUserId));
        closeModal(cardPopup);
    })
    .catch((err) => {
        console.error(`addNewCard() error: ${err}`);
    })
}
cardFormElement.addEventListener('submit', handleCardFormSubmit);