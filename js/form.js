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
  var MAP_PINS = document.querySelector('.map__pins');
  var MAP_PIN_MAIN = document.querySelector('.map__pin--main');
  var MAP_PIN_MAIN_LEFT_COORDINATE = MAP_PIN_MAIN.style.left;
  var MAP_PIN_MAIN_TOP_COORDINATE = MAP_PIN_MAIN.style.top;
  var DIV_SUCCES = document.querySelector('.success');
  var MAP_FILTERS = document.querySelector('.map__filters');

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
    disabledNumberGuests();
  };

  var disabledEditAdForm = function (bool) {
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
    window.submitAd(evt.target, 'https://js.dump.academy/keksobooking', window.backend.onLoadSubmit, window.backend.onError);
  };

  var successForm = function () {
    window.map.deleteElem('.map__card');
    window.map.deletePins();
    AD_FORM.reset();
    MAP_PIN_MAIN.style.left = MAP_PIN_MAIN_LEFT_COORDINATE;
    MAP_PIN_MAIN.style.top = MAP_PIN_MAIN_TOP_COORDINATE;
    window.map.setValueAddress();
    window.map.togglerMapAndForm();
    disabledEditAdForm(true);
    DIV_SUCCES.classList.toggle('hidden');
  };

  var formFiltersOnChange = function (evt) {
    var filtersPins = {};
    var SELECTS = evt.currentTarget.querySelectorAll('.map__filter');
    var FEATURES = evt.currentTarget.querySelectorAll('[name=features]');
    for (var i = 0; i < SELECTS.length; i++) {
      if (SELECTS[i].value !== 'any') {
        filtersPins[SELECTS[i].name] = SELECTS[i].value;
      }
    }
    filtersPins.FEATURES = [];
    for (var j = 0; j < FEATURES.length; j++) {
      if (FEATURES[j].checked) {
        filtersPins.FEATURES.push(FEATURES[j].value);
      }
    }
    // console.log(filtersPins);
    var filtersHousingType = function (item, index, array) {
      return filtersPins['housing-type'] ? filtersPins['housing-type'] === array[index].offer.type : true;
    };

    var filtersHousingPrice = function (item, index, array) {
      var valuePrice = true;
      switch (filtersPins['housing-price']) {
        case 'low':
          valuePrice = array[index].offer.price > 0 && array[index].offer.price < 10000;
          break;
        case 'middle':
          valuePrice = array[index].offer.price >= 10000 && array[index].offer.price <= 50000;
          break;
        case 'high':
          valuePrice = array[index].offer.price > 50000;
          break;
      }
      return valuePrice;
    };

    var filtersHousingRooms = function (item, index, array) {
      return filtersPins['housing-rooms'] ? parseInt(filtersPins['housing-rooms'], 10) === array[index].offer.rooms : true;
    };

    var filtersHousingGuests = function (item, index, array) {
      return filtersPins['housing-guests'] ? parseInt(filtersPins['housing-guests'], 10) === array[index].offer.guests : true;
    };

    var filtersFeatures = function (item, index, array) {
      var isfeatures;
      if (filtersPins.FEATURES.length > 0) {
        for (var k = 0; k < array.length; k++) {
          isfeatures = array[index].offer.features.indexOf(filtersPins.FEATURES[k]) >= 0;
          break;
        }
      } else {
        isfeatures = true;
      }
      return isfeatures;
    };

    var isFilters = function () {
      window.map.deleteElem('.map__card');
      window.data.dataIncomingCopy = window.data.dataIncoming.filter(filtersHousingType).filter(filtersHousingPrice).filter(filtersHousingRooms).filter(filtersHousingGuests).filter(filtersFeatures);
      window.map.deletePins();
      MAP_PINS.appendChild(window.map.renderPins(window.data.dataIncomingCopy));
    };

    if (timerId) {
      clearTimeout(timerId);
    }
    var timerId = setTimeout(isFilters, 500);
  };

  minPrice();
  disabledNumberGuests();

  TYPE.addEventListener('change', typeChangeHandler);
  TIME_IN.addEventListener('change', timeInChangeHandler);
  TIME_OUT.addEventListener('change', timeOutChangeHandler);
  ROOM_NUMBER.addEventListener('change', roomChangeHandler);
  ROOM_NUMBER.addEventListener('change', validateCapacityHandler);
  CAPACITY.addEventListener('change', validateCapacityHandler);
  validateCapacity();
  AD_FORM.addEventListener('submit', submitHandler);
  MAP_FILTERS.addEventListener('change', formFiltersOnChange);


  window.form = {
    disabledEditAdForm: disabledEditAdForm,
    successForm: successForm
  };

})();
