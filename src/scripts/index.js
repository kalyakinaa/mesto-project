import '../pages/index.css';
import { initialCards } from './cards.js';
import avatarImage from '../images/avatar.jpg';
const avatar = document.querySelector('.profile__image');
avatar.style.backgroundImage = `url(${avatarImage})`;
import logoImage from '../images/logo.svg';
const logo = document.querySelector('.header__logo');
logo.src = logoImage;

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

const placesContainer = document.querySelector('.places__list');

function createCard(cardData, currentUserId) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const imagePopup = document.querySelector('.popup_type_image');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.card__like-count');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    imagePopup.addEventListener('click', handleOverlayClick);

    cardElement.querySelector('.card__image').src = cardData.link;
    cardElement.querySelector('.card__image').alt = cardData.name;
    cardElement.querySelector('.card__title').textContent = cardData.name;
    likeCount.textContent = cardData.likes.length;

    if (cardData.likes.some((user) => user._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    likeButton.addEventListener('click', () => {
        if (likeButton.classList.contains('card__like-button_is-active')) {
          unlikeCard(cardData._id)
            .then((updatedCard) => {
              likeButton.classList.remove('card__like-button_is-active');
              likeCount.textContent = updatedCard.likes.length;
            })
            .catch((err) => {
              console.error('Ошибка при снятии лайка:', err);
            });
        } else {
          likeCard(cardData._id)
            .then((updatedCard) => {
              likeButton.classList.add('card__like-button_is-active');
              likeCount.textContent = updatedCard.likes.length;
            })
            .catch((err) => {
              console.error('Ошибка при постановке лайка:', err);
            });
        }
    });

    if (cardData.owner._id !== currentUserId) {
        deleteButton.style.display = 'none';
    }

    deleteButton.addEventListener('click', () => {
        deleteCard(cardData._id)
          .then(() => {
            cardElement.remove();
          })
          .catch((err) => {
            console.error('Ошибка при удалении карточки:', err);
          });
    });

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

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = profilePopup.querySelector('.popup__form');
const profileInputName = profilePopup.querySelector('.popup__input_type_name');
const profileInputDescription = profilePopup.querySelector('.popup__input_type_description');
const profileInputAvatar = document.querySelector('.profile__image');
profileInputAvatar.style.backgroundImage = `url(${avatarImage})`;
const profileInputs = Array.from(profileFormElement.querySelectorAll('.popup__input'));
const profileSubmitButton = profileFormElement.querySelector('.popup__button');

let currentUserId = null;

getUserProfile()
  .then((userData) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
  })
  .catch((err) => {
    console.error(`Ошибка загрузки профиля: ${err}`);
  });

function toggleProfileSubmitButtons() {
    let profileValid = profileInputName.validity.valid && profileInputDescription.validity.valid;
    if (profileValid) {
        profileSubmitButton.classList.remove('popup__button_inactive');
        profileSubmitButton.disabled = false;
    } else {
        profileSubmitButton.classList.add('popup__button_inactive');
        profileSubmitButton.disabled = true;
    }
}

profileEditButton.addEventListener('click', () => {
    profileInputName.value = document.querySelector('.profile__title').textContent;
    if (!profileInputName.validity.valid) {
        showInputError(profileInputName);
    } else {
        hideInputError(profileInputName);
    }

    profileInputDescription.value = document.querySelector('.profile__description').textContent;
    if (!profileInputDescription.validity.valid) {
        showInputError(profileInputDescription);
    } else {
        hideInputError(profileInputDescription);
    }

    toggleProfileSubmitButtons();
    openModal(profilePopup);
});

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    const submitButton = evt.submitter;
    submitButton.textContent = 'Сохранение...';

    const updatedUserData = { name: profileInputName.value, about: profileInputDescription.value };
    updateUserProfile(updatedUserData)
       .then((userData) => {
            profileNameElement.textContent = userData.name;
            profileDescriptionElement.textContent = userData.about;
            closeModal(profilePopup);
        })
        .catch((err) => {
            console.error(`Ошибка обновления профиля: ${err}`);
        })
        .finally(() => {
            submitButton.textContent = 'Сохранить';
        });
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

function renderCards(cards) {
    cards.forEach((cardData) => {
      const cardElement = createCard(cardData, currentUserId);
      cardList.append(cardElement);
    });
}

getInitialCards()
    .then((cards) => {
        renderCards(cards);
})
    .catch((err) => {
        console.error(`Ошибка загрузки карточек: ${err}`);
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
        toggleProfileSubmitButtons();
        toggleCardSubmitButtons();
    }); 
});

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const submitButton = evt.submitter;
    submitButton.textContent = 'Создание...';

    const newCardData = { name: cardNameInput.value, link: cardLinkInput.value };
    addNewCard(newCardData)
        .then((cardData) => {
            const newCard = createCard(cardData, currentUserId);
            cardList.prepend(newCard);
            closeModal(cardPopup);
        })
        .catch((err) => {
            console.error(`Ошибка добавления карточки: ${err}`);
        })
        .finally(() => {
            submitButton.textContent = 'Создать';
        });
}

cardFormElement.addEventListener('submit', handleCardFormSubmit);

const avatarPopup = document.querySelector('.popup_type_update-avatar');
const avatarFormElement = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarFormElement.querySelector('.popup__input_type_avatar-url');

profileAvatar.addEventListener('click', () => {
  openModal(avatarPopup);
});

avatarFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const submitButton = evt.submitter;
    submitButton.textContent = 'Сохранение...';
    const avatarUrl = avatarInput.value;
    updateAvatar(avatarUrl)
        .then((userData) => {
        profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
        closeModal(avatarPopup);
        avatarFormElement.reset();
        })
        .catch((err) => {
            console.error(`Ошибка обновления аватара: ${err}`);
        })
        .finally(() => {
            submitButton.textContent = 'Сохранить';
        });
});

document.querySelectorAll('.popup').forEach((popup) => {
    popup.classList.add('popup_is-animated');
});
