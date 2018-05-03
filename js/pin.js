'use strict';

(function () {

  var TEMPLATE = document.querySelector('template').content;
  var MAP_PIN = TEMPLATE.querySelector('.map__pin');
  var MAP_PIN_MARGIN_LEFT = '-25px';
  var MAP_PIN_MARGIN_TOP = '-70px';

  var renderPin = function (pin, dataIndex) {
    var element = MAP_PIN.cloneNode(true);

    element.style.left = pin.location.x + 'px';
    element.style.top = pin.location.y + 'px';
    element.style.marginLeft = MAP_PIN_MARGIN_LEFT;
    element.style.marginTop = MAP_PIN_MARGIN_TOP;
    element.dataset.index = dataIndex;
    element.querySelector('img').src = pin.author.avatar;
    element.querySelector('img').alt = pin.offer.title;

    return element;
  };

  window.pin = {
    renderPin: renderPin
  };

})();
