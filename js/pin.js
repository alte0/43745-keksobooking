'use strict';

(function () {

  var TEMPLATE = document.querySelector('template').content;
  var MAP_PIN = TEMPLATE.querySelector('.map__pin');

  window.pin = {
    renderPin: function (pin, dataIndex) {
      var element = MAP_PIN.cloneNode(true);

      element.style.left = pin.location.x + 'px';
      element.style.top = pin.location.y + 'px';
      element.style.marginLeft = -25 + 'px';
      element.style.marginTop = -70 + 'px';
      element.dataset.index = dataIndex;
      element.querySelector('img').src = pin.author.avatar;
      element.querySelector('img').alt = pin.offer.title;

      return element;
    }
  };

})();
