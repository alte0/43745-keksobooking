'use strict';

(function () {

  var TYPE = document.querySelector('#type');
  var TYPE_MIN_PRICE = {'palace': 10000, 'flat': 1000, 'house': 5000, 'bungalo': 0};
  var TIME_IN = document.querySelector('#timein');
  var TIME_OUT = document.querySelector('#timeout');
  var ROOM_NUMBER = document.querySelector('#room_number');
  var CAPACITY = document.querySelector('#capacity');
  var RATIO_ROOMS = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };
  var AD_FORM = document.querySelector('.ad-form');
  var MAP = document.querySelector('.map');
  var MAP_PINS = document.querySelector('.map__pins');
  var MAP_PIN_MAIN = document.querySelector('.map__pin--main');
  var MAP_PIN_MAIN_LEFT_COORDINATE = MAP_PIN_MAIN.style.left;
  var MAP_PIN_MAIN_TOP_COORDINATE = MAP_PIN_MAIN.style.top;
  var DIV_SUCCES = document.querySelector('.success');
  var MAP_FILTERS = document.querySelector('.map__filters');
  var AD_FORM_RESET = document.querySelector('.ad-form__reset');

  var setMinPrice = function () {
    var PRICE = document.querySelector('#price');
    PRICE.min = TYPE_MIN_PRICE[TYPE.value];
    PRICE.placeholder = TYPE_MIN_PRICE[TYPE.value];
  };

  var typeChangeHandler = function () {
    return setMinPrice();
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

  var setDisabledNumberGuests = function () {

    for (var i = 0; i < ROOM_NUMBER.options.length; i++) {
      var option = ROOM_NUMBER.options[i];

      if (option.selected === true) {
        var firstValue = option.value;

        [].forEach.call(CAPACITY.options, function (item) {
          var secondValue = parseInt(item.value, 10);

          for (var k = 0; k < RATIO_ROOMS[firstValue].length; k++) {
            var ratioValue = RATIO_ROOMS[firstValue][k];
            if (ratioValue === secondValue) {
              item.disabled = false;
              break;
            }
            item.disabled = true;
          }
        });
        break;
      }
    }
  };

  var roomChangeHandler = function () {
    setDisabledNumberGuests();
  };

  var disableEditAdForm = function (bool) {
    var elementsFieldset = document.querySelectorAll('.ad-form fieldset');
    elementsFieldset.forEach(function (item) {
      item.disabled = bool;
    });
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

  var submitHandler = function (evt) {
    evt.preventDefault();
    var formData = new FormData(evt.target);
    window.backend.submitAd(formData, 'https://js.dump.academy/keksobooking', sendValidForm, window.backend.onError);
  };

  var loadedSucces = function (data) {
    window.data.dataIncoming = data;
    MAP_PINS.appendChild(window.map.renderPins(data));
  };

  var setNoActiveMapAndForm = function () {
    var DELAY = 0;
    window.map.deleteElem('.map__card');
    window.map.deletePins();
    MAP_PIN_MAIN.style.left = MAP_PIN_MAIN_LEFT_COORDINATE;
    MAP_PIN_MAIN.style.top = MAP_PIN_MAIN_TOP_COORDINATE;
    window.map.togglerMapAndForm();
    disableEditAdForm(true);
    setTimeout(function () {
      window.map.setValueAddress();
    }, DELAY);
  };

  var setActiveMapAndForm = function () {
    if (MAP.classList.contains('map--faded')) {
      window.map.togglerMapAndForm();
      window.map.setValueAddress();
      window.backend.loadData('https://js.dump.academy/keksobooking/data', loadedSucces, window.backend.onError);
      MAP_PINS.addEventListener('click', window.map.pinClickHandler, true);
      disableEditAdForm(false);
    }
  };

  var formResetHandler = function () {
    setNoActiveMapAndForm();
  };

  var sendValidForm = function () {
    var DELAY = 3000;
    AD_FORM.reset();
    setNoActiveMapAndForm();
    DIV_SUCCES.classList.toggle('hidden');
    setTimeout(function () {
      DIV_SUCCES.classList.toggle('hidden');
    }, DELAY);
  };

  var formFilterChangeHandler = function (evt) {
    var filtersPins = {};
    var SELECTS = evt.currentTarget.querySelectorAll('.map__filter');
    var FEATURES = evt.currentTarget.querySelectorAll('[name=features]');
    var DELAY = 500;

    SELECTS.forEach(function (item) {
      if (item.value !== 'any') {
        filtersPins[item.name] = item.value;
      }
    });
    filtersPins.FEATURES = [];
    FEATURES.forEach(function (item) {
      if (item.checked) {
        filtersPins.FEATURES.push(item.value);
      }
    });

    var filterHousingType = function (item, index, array) {
      return filtersPins['housing-type'] ? filtersPins['housing-type'] === array[index].offer.type : true;
    };

    var filterHousingPrice = function (item, index, array) {
      var valuePrice = true;
      var minHousingPrice = 0;
      var middleHousingPrice = 10000;
      var maxHousingPrice = 50000;

      switch (filtersPins['housing-price']) {
        case 'low':
          valuePrice = array[index].offer.price > minHousingPrice && array[index].offer.price < middleHousingPrice;
          break;
        case 'middle':
          valuePrice = array[index].offer.price >= middleHousingPrice && array[index].offer.price <= maxHousingPrice;
          break;
        case 'high':
          valuePrice = array[index].offer.price > maxHousingPrice;
          break;
      }

      return valuePrice;
    };

    var filterHousingRooms = function (item, index, array) {
      return filtersPins['housing-rooms'] ? parseInt(filtersPins['housing-rooms'], 10) === array[index].offer.rooms : true;
    };

    var filterHousingGuests = function (item, index, array) {
      return filtersPins['housing-guests'] ? parseInt(filtersPins['housing-guests'], 10) === array[index].offer.guests : true;
    };

    var filterFeatures = function (item, index, array) {
      var isfeatures;
      var counter = 0;

      if (filtersPins.FEATURES.length > 0) {

        for (var k = 0; k < array.length; k++) {
          array[index].offer.features.forEach(function (itemFeature) {
            if (filtersPins.FEATURES[k] === itemFeature) {
              counter++;
            }
          });
        }

        if (counter === filtersPins.FEATURES.length) {
          isfeatures = array[index];
        }

      } else {
        isfeatures = true;
      }

      return isfeatures;
    };

    var filterAd = function (item, i, array) {
      return filterHousingType(item, i, array) && filterHousingPrice(item, i, array) && filterHousingRooms(item, i, array) && filterHousingGuests(item, i, array) && filterFeatures(item, i, array) ? true : false;
    };

    var renderFilteringData = function () {
      window.map.deleteElem('.map__card');
      window.data.dataIncomingCopy = window.data.dataIncoming.filter(filterAd);
      window.map.deletePins();
      MAP_PINS.appendChild(window.map.renderPins(window.data.dataIncomingCopy));
    };

    if (timerId) {
      clearTimeout(timerId);
    }
    var timerId = setTimeout(renderFilteringData, DELAY);
  };

  var addEventListeners = function () {
    TYPE.addEventListener('change', typeChangeHandler);
    TIME_IN.addEventListener('change', timeInChangeHandler);
    TIME_OUT.addEventListener('change', timeOutChangeHandler);
    ROOM_NUMBER.addEventListener('change', roomChangeHandler);
    ROOM_NUMBER.addEventListener('change', validateCapacityHandler);
    CAPACITY.addEventListener('change', validateCapacityHandler);
    AD_FORM.addEventListener('submit', submitHandler);
    MAP_FILTERS.addEventListener('change', formFilterChangeHandler);
    AD_FORM_RESET.addEventListener('click', formResetHandler);
  };

  setMinPrice();
  setDisabledNumberGuests();
  validateCapacity();
  addEventListeners();

  window.form = {
    disableEditAdForm: disableEditAdForm,
    setActiveMapAndForm: setActiveMapAndForm
  };

})();
