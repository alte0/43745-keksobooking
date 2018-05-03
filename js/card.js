'use strict';

(function () {

  var TEMPLATE = document.querySelector('template').content;
  var POPUP_FEATURE = TEMPLATE.querySelector('.popup__feature');
  var POPUP_PHOTO = TEMPLATE.querySelector('.popup__photo');
  var MAP_CARD = TEMPLATE.querySelector('.map__card');
  var ADS_TYPE_RUS = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};

  // feature
  var renderFeature = function (feature) {
    var element = POPUP_FEATURE.cloneNode(true);
    element.className = 'popup__feature';
    element.classList.add('popup__feature--' + feature);

    return element;
  };

  // features
  var renderFeatures = function (features) {
    var fragment = document.createDocumentFragment();
    features.forEach(function (item) {
      fragment.appendChild(renderFeature(item));
    });

    return fragment;
  };

  // photo
  var renderPhoto = function (imgSrc) {
    var element = POPUP_PHOTO.cloneNode(true);
    element.src = imgSrc;

    return element;
  };

  // photos
  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (item) {
      fragment.appendChild(renderPhoto(item));
    });

    return fragment;
  };

  var renderAd = function (elArray) {
    window.map.deleteElem('.map__card');
    var element = MAP_CARD.cloneNode(true);
    element.querySelector('.popup__title').textContent = elArray.offer.title;
    element.querySelector('.popup__text--address').textContent = elArray.offer.address;
    element.querySelector('.popup__text--price').textContent = elArray.offer.price + '₽/ночь';
    element.querySelector('.popup__type').textContent = window.data.translateAdsType(ADS_TYPE_RUS, elArray.offer.type);
    element.querySelector('.popup__text--capacity').textContent = elArray.offer.rooms + ' комнаты для ' + elArray.offer.guests + ' гостей';
    var ul = element.querySelector('.popup__features');
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    ul.appendChild(renderFeatures(elArray.offer.features));
    element.querySelector('.popup__description').textContent = elArray.offer.description;
    var popupPhotos = element.querySelector('.popup__photos');
    while (popupPhotos.firstChild) {
      popupPhotos.removeChild(popupPhotos.firstChild);
    }
    popupPhotos.appendChild(renderPhotos(elArray.offer.photos));
    element.querySelector('.popup__avatar').src = elArray.author.avatar;

    return element;
  };

  window.card = {
    renderAd: renderAd
  };

})();
