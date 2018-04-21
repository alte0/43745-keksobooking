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
  var MAP_PIN_MAIN = document.querySelector('.map__pin--main');
  var AD_FORM = document.querySelector('.ad-form');
  var INPUT_ADDRESS = document.querySelector('#address');
  var listAds;
  var TYPE = document.querySelector('#type');
  var TYPE_MIN_PRICE = {'palace': 10000, 'flat': 1000, 'house': 5000, 'bungalo': 0};
  var TIME_IN = document.querySelector('#timein');
  var TIME_OUT = document.querySelector('#timeout');
  var ROOM_NUMBER = document.querySelector('#room_number');
  var CAPACITY = document.querySelector('#capacity');

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
  var renderPin = function (pin, dataIndex) {
    var element = MAP_PIN.cloneNode(true);

    element.style.left = pin.location.x + 'px';
    element.style.top = pin.location.y + 'px';
    element.style.marginLeft = -25 + 'px';
    element.style.marginTop = -70 + 'px';
    element.dataset.index = dataIndex;
    element.querySelector('img').src = pin.author.avatar;
    element.querySelector('img').alt = pin.offer.title;

    return element;
  };

  // метки
  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();

    pins.forEach(function (item, i) {
      fragment.appendChild(renderPin(item, i));
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
  var renderFeatures = function (features) {
    var fragment = document.createDocumentFragment();
    features.forEach(function (item) {
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
  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (item) {
      fragment.appendChild(renderPhoto(item));
    });

    return fragment;
  };

  // обьявление
  var renderAd = function (array, index) {
    var element = MAP_CARD.cloneNode(true);
    element.querySelector('.popup__title').textContent = array[index]['offer']['title'];
    element.querySelector('.popup__text--address').textContent = array[index].offer.address;
    element.querySelector('.popup__text--price').textContent = array[index].offer.price + '₽/ночь';
    element.querySelector('.popup__type').textContent = translateAdsType(ADS_TYPE_RUS, array[index].offer.type); // вывести русское название
    element.querySelector('.popup__text--capacity').textContent = array[index].offer.rooms + ' комнаты для ' + array[index].offer.guests + ' гостей';
    var ul = element.querySelector('.popup__features');
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    ul.appendChild(renderFeatures(array[index].offer.features)); // список фич
    element.querySelector('.popup__description').textContent = array[index].offer.description;
    var popupPhotos = element.querySelector('.popup__photos');
    while (popupPhotos.firstChild) {
      popupPhotos.removeChild(popupPhotos.firstChild);
    }
    popupPhotos.appendChild(renderPhotos(array[index].offer.photos)); // список изображений
    element.querySelector('.popup__avatar').src = array[index].author.avatar;

    return element;
  };

  var getCoordinatePin = function (pin) {
    var leftCoordinatePin = parseInt(pin.style.left, 10);
    var topCoordinatePin = parseInt(pin.style.top, 10);
    var heightPin = parseInt(getComputedStyle(pin).height, 10);
    var widthPin = Math.floor(parseInt(getComputedStyle(pin).width, 10) / 2);
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

  var clickPopupClose = function (evt) {
    var target = evt.target;
    if (target.classList.contains('popup__close')) {
      deleteElem('.map__card');
      document.removeEventListener('click', clickPopupClose);
    }
  };

  var pinClickHandler = function (evt) {
    var target = evt.target;

    while (target !== MAP_PINS) {
      if (target.tagName === 'BUTTON') {
        var dataIndex = target.dataset.index;
        if (dataIndex) {
          deleteElem('.map__card');
          MAP_FILTERS_CONTAINER.parentElement.insertBefore(renderAd(listAds, dataIndex), MAP_FILTERS_CONTAINER);
          document.addEventListener('click', clickPopupClose);
        }
        return;
      }
      target = target.parentNode;
    }

  };

  var mouseupHandler = function () {
    MAP.classList.remove('map--faded');
    AD_FORM.classList.remove('ad-form--disabled');
    INPUT_ADDRESS.value = getCoordinatePin(MAP_PIN_MAIN);
    listAds = getAdsList(ADS_COUNT);
    MAP_PINS.appendChild(renderPins(listAds));
    MAP_PIN_MAIN.removeEventListener('mouseup', mouseupHandler);
    MAP_PINS.addEventListener('click', pinClickHandler, true);
    disabledEditAdForm(false);
  };

  var disabledEditAdForm = function (bool) {
    var elementsFieldset = document.querySelectorAll('.ad-form fieldset');
    elementsFieldset.forEach(function (item) {
      item.disabled = bool;
    });
  };

  // form
  var minPrice = function () {
    var PRICE = document.querySelector('#price');
    PRICE.min = TYPE_MIN_PRICE[TYPE.value];
    PRICE.placeholder = TYPE_MIN_PRICE[TYPE.value];
  };

  var typeChangeHandler = function () {
    return minPrice();
  };

  var syncSelect = function (evt, elSync) {
    var index = evt.target.selectedIndex;
    elSync.children[index].selected = true;
  };

  var timeInChangeHandler = function (evt) {
    syncSelect(evt, TIME_OUT);
  };

  var timeOutChangeHandler = function (evt) {
    syncSelect(evt, TIME_IN);
  };

  var disabledNumberGuests = function () {

    for (var i = 0; i < ROOM_NUMBER.options.length; i++) {
      var option = ROOM_NUMBER.options[i];

      if (option.selected === true) {
        var firstValue = option.value;
        var ratioRooms = {
          1: [1],
          2: [1, 2],
          3: [1, 2, 3],
          100: [0]
        };

        for (var j = 0; j < CAPACITY.options.length; j++) {
          var secondValue = parseInt(CAPACITY.options[j].value, 10);

          for (var k = 0; k < ratioRooms[firstValue].length; k++) {
            var ratioValue = ratioRooms[firstValue][k];
            if (ratioValue === secondValue) {
              CAPACITY.options[j].disabled = false;
              break;
            }
            CAPACITY.options[j].disabled = true;
          }
        }
        break;
      }
    }
  };

  var roomChangeHandler = function () {
    disabledNumberGuests();
  };

  var validateCapacityHandler = function () {
    for (var g = 0; g < CAPACITY.options.length; g++) {
      if (CAPACITY.options[g].selected === true && CAPACITY.options[g].disabled === true) {
        CAPACITY.setCustomValidity('Выбирите значение из списка.');
        break;
      } else {
        CAPACITY.setCustomValidity('');
      }
    }
  };
  var validateCapacity = validateCapacityHandler;

  MAP_PIN_MAIN.addEventListener('mouseup', mouseupHandler);
  disabledEditAdForm(true);
  minPrice();
  disabledNumberGuests();

  TYPE.addEventListener('change', typeChangeHandler);
  TIME_IN.addEventListener('change', timeInChangeHandler);
  TIME_OUT.addEventListener('change', timeOutChangeHandler);
  ROOM_NUMBER.addEventListener('change', roomChangeHandler);
  ROOM_NUMBER.addEventListener('change', validateCapacityHandler);
  CAPACITY.addEventListener('change', validateCapacityHandler);
  validateCapacity();

})();
