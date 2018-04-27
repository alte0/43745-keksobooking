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


  var onErrorSubmit = function (message) {
    console.error(message);
  };

  var onLoadSubmit = function () {
    window.form.successWorm();
  };

  window.submitAd = function (element, url, success, error) {
    var formData = new FormData(element);

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('readystatechange', function () {

      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.readyState === 4 && xhr.status === 200) {
        success();
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
    xhr.open('POST', url);
    xhr.send(formData);
  };


  window.backend = {
    onError: onError,
    onLoad: onLoad,
    onErrorSubmit: onErrorSubmit,
    onLoadSubmit: onLoadSubmit,
  };

})();
