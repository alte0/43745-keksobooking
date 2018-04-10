'use strict';

(function () {

  var ADS_COUNT = 8;
  var ADS_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var ADS_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var ADS_TYPE_RUS = {'palace': 'Дворец', 'flat': 'Квартира', 'house': 'Дом', 'bungalo': 'Бунгало'};
  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;
  var GUESTS_MIN = 0;
  var GUESTS_MAX = 5;
  var FIXED_TIME = ['12: 00', '13: 00', '14: 00'];
  var X_PIN_MIN = 300;
  var X_PIN_MAX = 900;
  var Y_PIN_MIN = 150;
  var Y_PIN_MAX = 500;
  var FEATURES_ADS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var MAP = document.querySelector('.map');
  var TEMPLATE = document.querySelector('template').content;
  var MAP_PIN = TEMPLATE.querySelector('.map__pin');
  var POPUP_FEATURE = TEMPLATE.querySelector('.popup__feature');
  var POPUP_PHOTO = TEMPLATE.querySelector('.popup__photo');
  var MAP_PINS = document.querySelector('.map__pins');
  var MAP_CARD = TEMPLATE.querySelector('.map__card');
  var MAP_FILTERS_CONTAINER = document.querySelector('.map__filters-container');

  // перевод вида жилья
  var translateAdsType = function (obj, value) {
    return obj[value];
  };

  // случайное число от min до max
  var getRandomNumber = function (min, max) {
    return min + Math.floor(Math.random() * (max + 1 - min));
  };
  // случайный индекс из массива
  var getRandomIndex = function (array) {
    return getRandomNumber(0, array.length - 1);
  };
  // получение случайного элемента из массива
  var getRandomElement = function (array) {
    return array.splice(array[getRandomIndex(array)], 1);
  };

  var getSliceArray = function (array, endIndexArr) {
    return array.slice(0, endIndexArr + 1);
  };

  var getAdsList = function (count) {
    var listAds = [];
    var titleTemp = [];
    ADS_TITLE.forEach(function (item) {
      titleTemp.push(item);
    });

    for (var i = 1; i <= count; i++) {
      listAds.push({
        'author': {
          'avatar': 'img/avatars/user0' + i + '.png'
        },
        'offer': {
          'title': getRandomElement(titleTemp),
          'address': '600, 350',
          'price': getRandomNumber(PRICE_MIN, PRICE_MAX),
          'type': ADS_TYPE[getRandomIndex(ADS_TYPE)],
          'rooms': getRandomNumber(ROOMS_MIN, ROOMS_MAX),
          'guests': getRandomNumber(GUESTS_MIN, GUESTS_MAX),
          'checkin': FIXED_TIME[getRandomIndex(FIXED_TIME)],
          'checkout': FIXED_TIME[getRandomIndex(FIXED_TIME)],
          'features': getSliceArray(FEATURES_ADS, getRandomIndex(FEATURES_ADS)),
          'description': '',
          'photos': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
        },
        'location': {
          'x': getRandomNumber(X_PIN_MIN, X_PIN_MAX),
          'y': getRandomNumber(Y_PIN_MIN, Y_PIN_MAX)
        }
      });
    }

    return listAds;
  };
  var listAds = getAdsList(ADS_COUNT);

  MAP.classList.remove('map--faded');

  // метка
  var renderPin = function (pin) {
    var element = MAP_PIN.cloneNode(true);

    element.style.left = pin.location.x + 'px';
    element.style.top = pin.location.y + 'px';
    element.style.marginLeft = -25 + 'px';
    element.style.marginTop = -70 + 'px';
    element.querySelector('img').src = pin.author.avatar;
    element.querySelector('img').alt = pin.offer.title;

    return element;
  };

  // метки
  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();

    pins.forEach(function (item) {
      fragment.appendChild(renderPin(item));
    });

    return fragment;
  };
  // feature
  var renderFeature = function (feature) {
    var element = POPUP_FEATURE.cloneNode(true);
    element.className = 'popup__feature';
    element.classList.add('popup__feature--' + feature);

    return element;
  };
  // features
  var renderFeatures = function (array) {
    var fragment = document.createDocumentFragment();
    array.forEach(function (item) {
      fragment.appendChild(renderFeature(item));
    });

    return fragment;
  };
  // фото
  var renderPhoto = function (imgSrc) {
    var element = POPUP_PHOTO.cloneNode(true);
    element.src = imgSrc;

    return element;
  };
  // фотографии
  var renderPhotos = function (array) {
    var fragment = document.createDocumentFragment();
    array.forEach(function (item) {
      fragment.appendChild(renderPhoto(item));
    });

    return fragment;
  };

  MAP_PINS.appendChild(renderPins(listAds));
  // обьявление
  var renderAds = function (array) {
    var element = MAP_CARD.cloneNode(true);
    element.querySelector('.popup__title').textContent = array[0].offer.title;
    element.querySelector('.popup__text--address').textContent = array[0].offer.address;
    element.querySelector('.popup__text--price').textContent = array[0].offer.price + '₽/ночь';
    element.querySelector('.popup__type').textContent = translateAdsType(ADS_TYPE_RUS, array[0].offer.type); // вывести русское название
    element.querySelector('.popup__text--capacity').textContent = array[0].offer.rooms + ' комнаты для ' + array[0].offer.guests + ' гостей';
    var ul = element.querySelector('.popup__features');
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    ul.prepend(renderFeatures(array[0].offer.features)); // список фич
    element.querySelector('.popup__description').textContent = array[0].offer.description;
    element.querySelector('.popup__photo').replaceWith(renderPhotos(array[0].offer.photos)); // список изображений
    element.querySelector('.popup__avatar').src = array[0].author.avatar;

    return element;
  };
  MAP_FILTERS_CONTAINER.before(renderAds(listAds));

})();
