const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-14",
  headers: {
    authorization: "a52cfbf8-543b-4585-8f12-92e5a6a3781d",
    "Content-Type": "application/json",
  },
};

const checkResponseStatus = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(`Ошибка ответа сервера: ${res.status}`);
};

const sendRequest = (url, options) => {
  return fetch(url, options).then(checkResponseStatus);
};

const getUserData = () => {
  return sendRequest(`${config.baseUrl}/users/me`, { headers: config.headers });
};

const getInitialCards = () => {
  return sendRequest(`${config.baseUrl}/cards`, { headers: config.headers });
};

const getInitialDataAPI = () => {
  return Promise.all([getUserData(), getInitialCards()]);
};

const updateProfileDataAPI = (profileData) => {
  return sendRequest(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: profileData.name,
      about: profileData.about,
    }),
  });
};

const updateProfileImageAPI = (imageURL) => {
  return sendRequest(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: imageURL,
    }),
  });
};

const addNewCardAPI = (cardData) => {
  return sendRequest(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: cardData.name,
      link: cardData.link,
    }),
  });
};

const deleteCardAPI = (cardId) => {
  return sendRequest(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
};

const likeCardAPI = (cardId) => {
  return sendRequest(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  });
};

const dislikeCardAPI = (cardId) => {
  return sendRequest(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  });
};

export {
  getInitialDataAPI,
  updateProfileDataAPI,
  updateProfileImageAPI,
  addNewCardAPI,
  deleteCardAPI,
  likeCardAPI,
  dislikeCardAPI,
};
