'use strict';

(function () {
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

  window.message = {
    showMessage: showMessage
  };

})();
