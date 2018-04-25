'use strict';

(function () {

  var ADS_TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var ADS_TYPE = ['palace', 'flat', 'house', 'bungalo'];
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

  // случайное число от min до max
  var getRandomNumber = function (min, max) {
    return min + Math.floor(Math.random() * (max + 1 - min));
  };

  // случайный индекс из массива
  var getRandomIndex = function (array) {
    return getRandomNumber(0, array.length - 1);
  };

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

  window.data = {
    getAdsList: function (count) {
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
    },
    translateAdsType: function (obj, value) {
      return obj[value];
    }
  };

})();
