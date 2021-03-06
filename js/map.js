'use strict';

(function () {

  var MAP = document.querySelector('.map');
  var MAP_PINS = document.querySelector('.map__pins');
  var MAP_FILTERS_CONTAINER = document.querySelector('.map__filters-container');
  var MAP_PIN_MAIN = document.querySelector('.map__pin--main');
  var MAP_PIN_MAIN_WIDTH = 65;
  var AD_FORM = document.querySelector('.ad-form');
  var INPUT_ADDRESS = document.querySelector('#address');
  var ESC_CODE = 27;
  var MIN_TOP_STYLE_PIN_MAIN = 150;
  var MAX_TOP_STYLE_PIN_MAIN = 500;

  // метки
  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      if (i === 5) {
        break;
      }
      fragment.appendChild(window.pin.renderPin(pins[i], i));
    }

    return fragment;
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

  var popupCloseClickHandler = function (evt) {
    var target = evt.target;
    if (target.classList.contains('popup__close')) {
      deleteElem('.map__card');
      document.removeEventListener('click', popupCloseClickHandler);
    }
  };

  var popupCloseEscHandler = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      deleteElem('.map__card');
      document.removeEventListener('keydown', popupCloseEscHandler);
    }
  };

  var pinClickHandler = function (evt) {
    var target = evt.target;

    while (target !== MAP_PINS) {
      if (target.tagName === 'BUTTON') {
        var dataIndex = target.dataset.index;
        if (dataIndex) {
          MAP_FILTERS_CONTAINER.parentElement.insertBefore(window.card.renderAd(window.data.dataIncomingCopy ? window.data.dataIncomingCopy[dataIndex] : window.data.dataIncoming[dataIndex]), MAP_FILTERS_CONTAINER);
          document.addEventListener('click', popupCloseClickHandler);
          document.addEventListener('keydown', popupCloseEscHandler);
        }
        return;
      }
      target = target.parentNode;
    }

  };

  window.form.disableEditAdForm(true);

  var togglerMapAndForm = function () {
    MAP.classList.toggle('map--faded');
    AD_FORM.classList.toggle('ad-form--disabled');
  };

  var setValueAddress = function () {
    INPUT_ADDRESS.value = getCoordinatePin(MAP_PIN_MAIN);
  };

  var deletePins = function () {
    while (MAP_PINS.children.length > 2) {
      MAP_PINS.removeChild(MAP_PINS.lastChild);
    }
  };

  MAP_PIN_MAIN.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    window.form.setActiveMapAndForm();

    // начальные координаты указателя мыши
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // кординаты перемещения
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      var pinMainStyleTop = MAP_PIN_MAIN.offsetTop - shift.y;
      if (pinMainStyleTop < MIN_TOP_STYLE_PIN_MAIN) {
        pinMainStyleTop = MIN_TOP_STYLE_PIN_MAIN;
      }
      if (pinMainStyleTop > MAX_TOP_STYLE_PIN_MAIN) {
        pinMainStyleTop = MAX_TOP_STYLE_PIN_MAIN;
      }

      var pinMainStyleLeft = MAP_PIN_MAIN.offsetLeft - shift.x;
      if (pinMainStyleLeft < 0) {
        pinMainStyleLeft = 0;
      }
      if (pinMainStyleLeft > MAP_PINS.offsetWidth - MAP_PIN_MAIN_WIDTH) {
        pinMainStyleLeft = MAP_PINS.offsetWidth - MAP_PIN_MAIN_WIDTH;
      }

      MAP_PIN_MAIN.style.top = pinMainStyleTop + 'px';
      MAP_PIN_MAIN.style.left = pinMainStyleLeft + 'px';
      setValueAddress();
    };

    var onMouseUp = function () {
      setValueAddress();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  setValueAddress();

  window.map = {
    renderPins: renderPins,
    togglerMapAndForm: togglerMapAndForm,
    deleteElem: deleteElem,
    setValueAddress: setValueAddress,
    deletePins: deletePins,
    pinClickHandler: pinClickHandler
  };


})();
