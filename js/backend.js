'use strict';

(function () {
  var MAP_PINS = document.querySelector('.map__pins');

  var showMessage = function (message) {
    var p = document.createElement('p');
    p.textContent = message;
    p.style.position = 'fixed';
    p.style.left = 0;
    p.style.right = 0;
    p.style.backgroundColor = 'gray';
    p.style.zIndex = 999;
    p.style.color = 'red';
    p.style.fontSize = '40px';
    p.style.textAlign = 'center';

    document.body.prepend(p);

    setTimeout(function () {
      p.parentNode.removeChild(p);
    }, 5000);
  };

  var onError = showMessage;

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
        error('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 3000;
    xhr.open('GET', url);
    xhr.send();
  };

  var onLoadSubmit = function () {
    window.form.successForm();
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
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 3000;
    xhr.open('POST', url);
    xhr.send(formData);
  };


  window.backend = {
    onError: onError,
    onLoad: onLoad,
    onLoadSubmit: onLoadSubmit,
  };

})();
