import "/src/pages/index.css";
import {
  createCardDOM,
  deleteCardDOM,
  toggleCardLikeState,
} from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getInitialDataAPI,
  updateProfileDataAPI,
  updateProfileImageAPI,
  addNewCardAPI,
  deleteCardAPI,
  likeCardAPI,
  dislikeCardAPI,
} from "./components/api.js";

const popups = document.querySelectorAll(".popup");
const placesList = document.querySelector(".places__list");

const profileInfo = document.querySelector(".profile__info");
const profileEditButton = document.querySelector(".profile__edit-button");
const popupEditProfile = document.querySelector(".popup_type_edit");
const profileTitleInput = popupEditProfile.querySelector(".popup__input_type_name");
const profileDescriptionInput = popupEditProfile.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const profileImage = document.querySelector(".profile__image");
const profileImageEditButton = document.querySelector(".profile__image-edit-button");
const popupEditProfileImageForm = document.forms["update-profile-image"];
const popupEditProfileImage = document.querySelector(".popup_type_update-profile-image");

const popupAddCardForm = document.forms["new-place"];
const cardAddButton = document.querySelector(".profile__add-button");
const popupAddCard = document.querySelector(".popup_type_new-card");
const cardNameInput = popupAddCard.querySelector(".popup__input_type_card-name");
const cardLinkInput = popupAddCard.querySelector(".popup__input_type_url");

const popupConfirmDeleteCard = document.querySelector(".popup_type_confirm-delete-card");
const confirmDeleteCardButton = popupConfirmDeleteCard.querySelector(".popup__button");

const popupImage = document.querySelector(".popup_type_image");
const popupCardImage = document.querySelector(".popup__image");
const popupCardCaption = document.querySelector(".popup__caption");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

function openPopupImage(evt) {
  popupCardImage.src = evt.target.src;
  popupCardImage.alt = evt.target.alt;
  popupCardCaption.textContent = evt.target.alt;
  openPopup(popupImage);
}

function deleteCard(cardElement) {
  popupConfirmDeleteCard.dataset.cardId = cardElement.dataset.cardId;
  openPopup(popupConfirmDeleteCard);
}

function changeLikeCard(cardId, buttonElement, likeCounter) {
  (buttonElement.classList.contains("card__like-button_is-active")
    ? dislikeCardAPI(cardId)
    : likeCardAPI(cardId)
  )
    .then((res) => {
      likeCounter.textContent = res.likes.length;
      toggleCardLikeState(buttonElement);
    })
    .catch((err) => {
      console.log("Ошибка обновления лайка: " + err);
    });
}

function changePopupLoadingStatus(popupElement, isLoading) {
  const popupButtonElement = popupElement.querySelector(".popup__button");
  isLoading
    ? (popupButtonElement.textContent = "Сохранение...")
    : (popupButtonElement.textContent = "Сохранить");
}

popups.forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (
      evt.target.classList.contains("popup_is-opened") ||
      evt.target.classList.contains("popup__close")
    ) {
      closePopup(popup);
    }
  });
});

profileImageEditButton.addEventListener("click", () => {
  popupEditProfileImageForm.reset();
  clearValidation(popupEditProfileImage, validationConfig);
  openPopup(popupEditProfileImage);
});

popupEditProfileImage.addEventListener("submit", (evt) => {
  evt.preventDefault();
  changePopupLoadingStatus(popupEditProfileImage, true);

  updateProfileImageAPI(
    popupEditProfileImageForm.elements["profile-image-input"].value
  )
    .then((res) => {
      profileImage.style = `background-image: url(${res.avatar})`;
      closePopup(popupEditProfileImage);
    })
    .catch((err) => {
      console.log("Ошибка обновления аватара: " + err);
    })
    .finally(() => {
      changePopupLoadingStatus(popupEditProfileImage, false);
    });
});

profileEditButton.addEventListener("click", () => {
  clearValidation(popupEditProfile, validationConfig);
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopup(popupEditProfile);
});

popupEditProfile.addEventListener("submit", (evt) => {
  evt.preventDefault();
  changePopupLoadingStatus(popupEditProfile, true);

  updateProfileDataAPI({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then(() => {
      profileTitle.textContent = profileTitleInput.value;
      profileDescription.textContent = profileDescriptionInput.value;
      closePopup(popupEditProfile);
    })
    .catch((err) => {
      console.log("Ошибка обновления данных профиля: " + err);
    })
    .finally(() => {
      changePopupLoadingStatus(popupEditProfile, false);
    });
});

cardAddButton.addEventListener("click", () => {
  popupAddCardForm.reset();
  clearValidation(popupAddCard, validationConfig);
  openPopup(popupAddCard);
});

popupAddCard.addEventListener("submit", (evt) => {
  evt.preventDefault();
  changePopupLoadingStatus(popupAddCard, true);

  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  addNewCardAPI(newCardData)
    .then((newCardResponse) => {
      const newCard = createCardDOM(
        newCardResponse,
        profileInfo.dataset.profileId,
        deleteCard,
        openPopupImage,
        changeLikeCard
      );
      placesList.prepend(newCard);
      closePopup(popupAddCard);
    })
    .catch((err) => {
      console.log("Ошибка добавления новой карточки: " + err);
    })
    .finally(() => {
      changePopupLoadingStatus(popupAddCard, false);
    });
});

confirmDeleteCardButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  const cardElement = document.querySelector(`[data-card-id="${popupConfirmDeleteCard.dataset.cardId}"]`);

  deleteCardAPI(cardElement.dataset.cardId)
    .then(() => {
      deleteCardDOM(cardElement);
      closePopup(popupConfirmDeleteCard);
    })
    .catch((err) => {
      console.log("Ошибка удаления карточки: " + err);
    });
});

enableValidation(validationConfig);

getInitialDataAPI()
  .then(([profileData, initialCards]) => {
    profileInfo.dataset.profileId = profileData._id;
    profileTitle.textContent = profileData.name;
    profileDescription.textContent = profileData.about;
    profileImage.style = `background-image: url(${profileData.avatar})`;

    initialCards.forEach((initialCard) => {
      const newCard = createCardDOM(
        initialCard,
        profileInfo.dataset.profileId,
        deleteCard,
        openPopupImage,
        changeLikeCard
      );
      placesList.append(newCard);
    });
  })
  .catch((err) => {
    console.log("Ошибка получения первичных данных: " + err);
  });
