'use strict';

(function () {
  var MAP_PINS = document.querySelector('.map__pins');

  var onError = function (message) {
    console.error(message);
  };

  var onLoad = function (data) {
    window.backend.data = data;
    MAP_PINS.appendChild(window.map.renderPins(data));
  };

  window.load = function (url, success, error) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {
        success(xhr.response);
      } else {
        error('Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      console.log('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      console.log('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 3000;
    xhr.open('GET', url);
    xhr.send();
  };


  window.backend = {
    // data: incomingData,
    onError: onError,
    onLoad: onLoad,
  };

})();
