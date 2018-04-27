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
    window.submitAd(evt.target, 'https://js.dump.academy/keksobooking', window.backend.onLoadSubmit, window.backend.onErrorSubmit);
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


  window.form = {
    disabledEditAdForm: disabledEditAdForm
  };

})();
