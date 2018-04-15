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
  var LIST_PHOTO = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MAP = document.querySelector('.map');
  var TEMPLATE = document.querySelector('template').content;
  var MAP_PIN = TEMPLATE.querySelector('.map__pin');
  var POPUP_FEATURE = TEMPLATE.querySelector('.popup__feature');
  var POPUP_PHOTO = TEMPLATE.querySelector('.popup__photo');
  var MAP_PINS = document.querySelector('.map__pins');
  var MAP_CARD = TEMPLATE.querySelector('.map__card');
  var MAP_FILTERS_CONTAINER = document.querySelector('.map__filters-container');
  var NUMBER_AD = 0;
  var MAP_PIN_MAIN = document.querySelector('.map__pin--main');
  var AD_FORM = document.querySelector('.ad-form');
  var INPUT_ADDRESS = document.querySelector('#address');
  // var mapPin = document.querySelector('.map__pin');
  var listAds;
  // var POPUP_CLOSE = document.querySelector('.popup__close');

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

  // var getSliceArray = function (array, endIndexArr) {
  //   return array.slice(0, endIndexArr + 1);
  // };

  var elementGetter = function (array) {
    var cloneArray = array.slice(0);
    return function () {
      var index = getRandomIndex(cloneArray);
      return cloneArray.splice(index, 1)[0];
    };
  };

  var getRandomArrayElements = function (array) {
    return array.filter(function () {
      return Math.random() > 0.49;
    });
  };

  var getAdsList = function (count) {
    var listAdsTemp = [];
    var getRandomTitle;

    getRandomTitle = elementGetter(ADS_TITLE);

    for (var i = 1; i <= count; i++) {
      var locationX = getRandomNumber(X_PIN_MIN, X_PIN_MAX);
      var locationY = getRandomNumber(Y_PIN_MIN, Y_PIN_MAX);
      var result = locationX.toString() + ', ' + locationY.toString();

      listAdsTemp.push({
        'author': {
          'avatar': 'img/avatars/user0' + i + '.png'
        },
        'offer': {
          'title': getRandomTitle(),
          'address': result,
          'price': getRandomNumber(PRICE_MIN, PRICE_MAX),
          'type': ADS_TYPE[getRandomIndex(ADS_TYPE)],
          'rooms': getRandomNumber(ROOMS_MIN, ROOMS_MAX),
          'guests': getRandomNumber(GUESTS_MIN, GUESTS_MAX),
          'checkin': FIXED_TIME[getRandomIndex(FIXED_TIME)],
          'checkout': FIXED_TIME[getRandomIndex(FIXED_TIME)],
          'features': getRandomArrayElements(FEATURES_ADS).slice(0, getRandomIndex(FEATURES_ADS) + 1),
          'description': '',
          'photos': LIST_PHOTO
        },
        'location': {
          'x': locationX,
          'y': locationY
        }
      });
    }

    return listAdsTemp;
  };

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

  // обьявление
  var renderAd = function (array, index) {
    var element = MAP_CARD.cloneNode(true);
    element.querySelector('.popup__title').textContent = array[index].offer.title;
    element.querySelector('.popup__text--address').textContent = array[index].offer.address;
    element.querySelector('.popup__text--price').textContent = array[index].offer.price + '₽/ночь';
    element.querySelector('.popup__type').textContent = translateAdsType(ADS_TYPE_RUS, array[index].offer.type); // вывести русское название
    element.querySelector('.popup__text--capacity').textContent = array[index].offer.rooms + ' комнаты для ' + array[index].offer.guests + ' гостей';
    var ul = element.querySelector('.popup__features');
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    ul.prepend(renderFeatures(array[index].offer.features)); // список фич
    element.querySelector('.popup__description').textContent = array[index].offer.description;
    element.querySelector('.popup__photo').replaceWith(renderPhotos(array[index].offer.photos)); // список изображений
    element.querySelector('.popup__avatar').src = array[index].author.avatar;

    return element;
  };

  var getCoordinatePin = function (pin) {
    var leftCoordinatePin = parseInt(pin.style.left, 10);
    var topCoordinatePin = parseInt(pin.style.top, 10);
    var heightPin = parseInt(getComputedStyle(pin).height, 10);
    var widthPin = parseInt(getComputedStyle(pin).width, 10) / 2;
    return (leftCoordinatePin + widthPin) + ', ' + (topCoordinatePin + heightPin);
  };

  // функции для событий
  var deleteElem = function (el) {
    var element = document.querySelector(el);
    if (element !== null) {
      var parentEl = element.parentElement;
      parentEl.removeChild(element);
    }
    return;
  };

  // тут хочу написать получение индекса элемента в наборе, чтоб выводить в объевлении не только первое. по типу этого - https://jquery-docs.ru/index/
  // var getIndexElementThis = function () {};

  var clickPopupClose = function (evt) {
    var target = evt.target;
    if (target.classList.contains('popup__close')) {
      deleteElem('.map__card');
      document.removeEventListener('click', clickPopupClose);
    }
  };

  var pinsClickHandler = function (evt) {
    var target = evt.target;
    if (target.classList.contains('map__pin--main') !== false) {
      return;
    }

    deleteElem('.map__card');
    MAP_FILTERS_CONTAINER.before(renderAd(listAds, NUMBER_AD));
    // MAP_FILTERS_CONTAINER.before(renderAd(listAds, getIndexElementThis()));
    document.addEventListener('click', clickPopupClose);
  };

  var mouseupHandler = function () {
    MAP.classList.remove('map--faded');
    AD_FORM.classList.remove('ad-form--disabled');
    INPUT_ADDRESS.value = getCoordinatePin(MAP_PIN_MAIN);
    listAds = getAdsList(ADS_COUNT);
    MAP_PINS.appendChild(renderPins(listAds));
    MAP_PIN_MAIN.removeEventListener('mouseup', mouseupHandler);
    MAP_PINS.addEventListener('click', pinsClickHandler);
    disabledEditAdForm(false);
  };

  var disabledEditAdForm = function (bool) {
    var elementsFieldset = document.querySelectorAll('.ad-form fieldset');
    // что правильнее использовать тут?
    // for (var i = 0; i < elementsFieldset.length; i++) {
    //   elementsFieldset[i].disabled = bool;
    // }
    elementsFieldset.forEach(function (item) {
      item.disabled = bool;
    });
  };

  MAP_PIN_MAIN.addEventListener('mouseup', mouseupHandler);
  disabledEditAdForm(true);
})();
