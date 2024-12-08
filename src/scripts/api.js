const config = {
    baseUrl: 'https://nomoreparties.co/v1/frontend-st-cohort-201',
    headers: {
      authorization: '1f520b4d-df0f-445b-8e0c-d6ab7cd25a60',
      'Content-Type': 'application/json',
    },
  };
  // Общая функция проверки ответа сервера
  const checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  };
  // Получение карточек с сервера
  export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, { headers: config.headers })
      .then(checkResponse);
  };
  // Получение данных пользователя
  export const getUserProfile = () => {
    return fetch(`${config.baseUrl}/users/me`, { headers: config.headers })
      .then(checkResponse);
  };
  // Обновление данных пользователя
  export const updateUserProfile = (userData) => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify(userData),
    }).then(checkResponse);
  };
  // Добавление новой карточки
  export const addNewCard = (cardData) => {
    return fetch(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(cardData),
    }).then(checkResponse);
  };
  // Удаление карточки
  export const deleteCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: config.headers,
    }).then(checkResponse);
  };
  // Постановка лайка
  export const likeCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: config.headers,
    }).then(checkResponse);
  };
  // Снятие лайка
  export const unlikeCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: config.headers,
    }).then(checkResponse);
  };
  // Обновление аватара пользователя
  export const updateAvatar = (avatarUrl) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({ avatar: avatarUrl }),
    }).then(checkResponse);
  };