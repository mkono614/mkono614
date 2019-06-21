(function() {
  'use strict';

  document.getElementById('fahrenheitInput').addEventListener('input', function(event) {
    celsiusInput.value=((this.value - 32) / 1.8).toFixed(2);
  });

  document.getElementById('celsiusInput').addEventListener('input', function(event) {
    fahrenheitInput.value=((this.value * 1.8) + 32).toFixed(2);
  });

})();
