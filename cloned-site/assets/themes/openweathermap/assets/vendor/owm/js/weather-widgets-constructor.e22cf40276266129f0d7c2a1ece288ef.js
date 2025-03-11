(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Работа с куками
var Cookies = function () {
  function Cookies() {
    _classCallCheck(this, Cookies);
  }

  _createClass(Cookies, [{
    key: "setCookie",
    value: function setCookie(name, value) {
      var expires = new Date();
      expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * 365);
      document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() + "; path=/";
    }

    // возвращает cookie с именем name, если есть, если нет, то undefined

  }, {
    key: "getCookie",
    value: function getCookie(name) {
      var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
  }, {
    key: "deleteCookie",
    value: function deleteCookie() {
      this.setCookie(name, "", {
        expires: -1
      });
    }
  }]);

  return Cookies;
}();

exports.default = Cookies;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _generatorWidget = require('./generator-widget');

var _generatorWidget2 = _interopRequireDefault(_generatorWidget);

var _renderWidgets = require('./renderWidgets');

var _renderWidgets2 = _interopRequireDefault(_renderWidgets);

var _clearWidgetContainer = require('./clearWidgetContainer');

var _clearWidgetContainer2 = _interopRequireDefault(_clearWidgetContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Created by Denis on 21.10.2016.
*/

var Promise = require('es6-promise').Promise;
require('String.fromCodePoint');

var Cities = function () {
  function Cities(params) {
    _classCallCheck(this, Cities);

    //cityName, container, widgetTypeActive
    this.params = params;
    this.generateWidget = new _generatorWidget2.default();
    this.generateWidget.setInitialStateForm();
    this.params.units = this.generateWidget.unitsTemp[0];
    if (!this.params.cityName) {
      return false;
    }
    this.chooseCity = this.chooseCity.bind(this);
    this.cityName = this.params.cityName.replace(/(\s|-)+/g, ' ').toLowerCase();
    this.container = this.container || '';
    this.url = '//' + this.params.baseDomain + '/data/2.5/find?q=' + this.cityName + '&type=like&sort=population&cnt=30&appid=' + this.params.appid;
  }

  _createClass(Cities, [{
    key: 'getCities',
    value: function getCities() {
      var _this = this;

      if (!this.params.cityName) {
        return null;
      }

      this.httpGet(this.url).then(function (response) {
        _this.getSearchData(response);
      }, function (error) {
        console.log('\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 ' + error);
      });
    }
  }, {
    key: 'renderWidget',
    value: function renderWidget() {
      (0, _clearWidgetContainer2.default)();
      (0, _renderWidgets2.default)(this.params.cityId, this.params.appid, this.params.baseDomain, this.params.widgetTypeActive, this.params.units);
    }
  }, {
    key: 'getSearchData',
    value: function getSearchData(JSONobject) {
      if (!JSONobject.list.length) {
        console.log('City not found');
        return;
      }
      this.cityList = document.getElementById('city-list');
      if (this.cityList) {
        this.cityList.removeEventListener('click', this.selectedCity);
        this.cityList.parentNode.removeChild(this.cityList);
      }

      var html = '';
      for (var i = 0; i < JSONobject.list.length; i += 1) {
        var name = JSONobject.list[i].name + ', ' + JSONobject.list[i].sys.country;
        var flag = 'http://openweathermap.org/images/flags/' + JSONobject.list[i].sys.country.toLowerCase() + '.png';
        html += '\n      <li class="city-list__item">\n        <label class="city-list__label">\n          <input\n            type="radio"\n            class="city-list__radio"\n            name="city-list"\n            id="' + JSONobject.list[i].id + '"\n            value="' + name + '"\n          >\n          <span class="city-list__link">\n            ' + name + '\n            <img src="' + flag + '" width="16" height="11" alt="' + name + '">\n          </span>\n        </label>\n      </li>';
      }

      html = '<ul class="city-list" id="city-list">' + html + '</ul>';
      this.params.container.insertAdjacentHTML('afterbegin', html);

      this.cityList = document.getElementById('city-list');
      this.cityList.addEventListener('click', this.chooseCity);
      // активируем первый пункт списка
      if (this.cityList.children[0]) {
        var radio = this.cityList.children[0].querySelector('.city-list__radio');
        if (radio) {
          radio.checked = true;
          this.selectedCity(radio.id, radio.value);
        }
      }
    }

    /**
     * [chooseCity description Обработка события по выбору города]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */

  }, {
    key: 'chooseCity',
    value: function chooseCity(e) {
      var element = e.target;
      if (element.classList.contains('city-list__radio')) {
        this.selectedCity(element.id, element.value);
      }
    }

    /**
     * [selectedCity Выбор города и перерисовка виджетов]
     * @param  {[type]} cityID   [description]
     * @param  {[type]} cityName [description]
     * @return {[type]}          [description]
     */

  }, {
    key: 'selectedCity',
    value: function selectedCity(cityID, cityName) {
      this.generateWidget.setInitialStateForm(cityID, cityName);
      this.params.cityId = cityID;
      this.paramscityName = cityName;
      this.renderWidget();
    }

    /**
    * Обертка обещение для асинхронных запросов
    * @param url
    * @returns {Promise}
    */

  }, {
    key: 'httpGet',
    value: function httpGet(url) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status === 200) {
            resolve(JSON.parse(this.response));
          } else {
            var error = new Error(this.statusText);
            error.code = this.status;
            reject(that.error);
          }
        };

        xhr.ontimeout = function (e) {
          reject(new Error('\u0412\u0440\u0435\u043C\u044F \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443 API \u0438\u0441\u0442\u0435\u043A\u043B\u043E ' + e.type + ' ' + e.timeStamp.toFixed(2)));
        };

        xhr.onerror = function (e) {
          reject(new Error('\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443 ' + e));
        };

        xhr.open('GET', url, true);
        xhr.send(null);
      });
    }
  }]);

  return Cities;
}();

exports.default = Cities;

},{"./clearWidgetContainer":3,"./generator-widget":4,"./renderWidgets":6,"String.fromCodePoint":8,"es6-promise":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var clearWidgetContainer = function clearWidgetContainer() {
  var i = 1;
  var containers = [];
  while (i < 100) {
    var container = document.getElementById('openweathermap-widget-' + i);
    if (container) {
      containers.push(container);
    }
    i++;
  };

  containers.forEach(function (elem) {
    elem.innerText = '';
  });
};

exports.default = clearWidgetContainer;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Denis on 13.10.2016.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Cookies = require('./Cookies');

var _Cookies2 = _interopRequireDefault(_Cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeneratorWidget = function () {
  function GeneratorWidget() {
    _classCallCheck(this, GeneratorWidget);

    // this.baseDomain = 'localhost:3000';
    this.baseDomain = document.location.hostname === 'phase.owm.io' ? 'openweathermap.phase.owm.io' : 'openweathermap.org';
    this.baseURL = '//' + this.baseDomain + '/themes/openweathermap/assets/vendor/owm';
    this.scriptD3SRC = this.baseURL + '/js/libs/d3.min.js';
    this.scriptSRC = this.baseURL + '/js/weather-widget-generator.js';
    this.controlsWidget = {
      // Первая половина виджетов
      cityName: document.querySelectorAll('.widget-left-menu__header'),
      temperature: document.querySelectorAll('.weather-left-card__number'),
      naturalPhenomenon: document.querySelectorAll('.weather-left-card__means'),
      windSpeed: document.querySelectorAll('.weather-left-card__wind'),
      mainIconWeather: document.querySelectorAll('.weather-left-card__img'),
      calendarItem: document.querySelectorAll('.calendar__item'),
      graphic: document.getElementById('graphic'),
      // Вторая половина виджетов
      cityName2: document.querySelectorAll('.widget-right__title'),
      temperature2: document.querySelectorAll('.weather-right__temperature'),
      temperatureFeels: document.querySelectorAll('.weather-right__feels'),
      temperatureMin: document.querySelectorAll('.weather-right-card__temperature-min'),
      temperatureMax: document.querySelectorAll('.weather-right-card__temperature-max'),
      naturalPhenomenon2: document.querySelectorAll('.widget-right__description'),
      windSpeed2: document.querySelectorAll('.weather-right__wind-speed'),
      mainIconWeather2: document.querySelectorAll('.weather-right__icon'),
      humidity: document.querySelectorAll('.weather-right__humidity'),
      pressure: document.querySelectorAll('.weather-right__pressure'),
      dateReport: document.querySelectorAll('.widget__date'),
      apiKey: document.getElementById('api-key'),
      errorKey: document.getElementById('error-key')
    };
    this.initForm = false;
    this.initialMetricTemperature();
    this.validationAPIkey();
    this.setInitialStateForm();
  }

  /**
   * [mapWidgets метод для сопоставления всех виджетов с
   * кнопкой-инициатором их вызова для генерации кода]
   * @param  {[type]} widgetID [description]
   * @return {[type]}          [description]
   */


  _createClass(GeneratorWidget, [{
    key: 'mapWidgets',
    value: function mapWidgets(widgetID) {
      switch (widgetID) {
        case 'widget-1-left-blue':
          return {
            id: 1,
            code: this.getCodeForGenerateWidget(1),
            schema: 'blue'
          };
          break;
        case 'widget-2-left-blue':
          return {
            id: 2,
            code: this.getCodeForGenerateWidget(2),
            schema: 'blue'
          };
          break;
        case 'widget-3-left-blue':
          return {
            id: 3,
            code: this.getCodeForGenerateWidget(3),
            schema: 'blue'
          };
          break;
        case 'widget-4-left-blue':
          return {
            id: 4,
            code: this.getCodeForGenerateWidget(4),
            schema: 'blue'
          };
          break;
        case 'widget-5-right-blue':
          return {
            id: 5,
            code: this.getCodeForGenerateWidget(5),
            schema: 'blue'
          };
          break;
        case 'widget-6-right-blue':
          return {
            id: 6,
            code: this.getCodeForGenerateWidget(6),
            schema: 'blue'
          };
          break;
        case 'widget-7-right-blue':
          return {
            id: 7,
            code: this.getCodeForGenerateWidget(7),
            schema: 'blue'
          };
          break;
        case 'widget-8-right-blue':
          return {
            id: 8,
            code: this.getCodeForGenerateWidget(8),
            schema: 'blue'
          };
          break;
        case 'widget-9-right-blue':
          return {
            id: 9,
            code: this.getCodeForGenerateWidget(9),
            schema: 'blue'
          };
          break;
        case 'widget-1-left-brown':
          return {
            id: 11,
            code: this.getCodeForGenerateWidget(11),
            schema: 'brown'
          };
          break;
        case 'widget-2-left-brown':
          return {
            id: 12,
            code: this.getCodeForGenerateWidget(12),
            schema: 'brown'
          };
          break;
        case 'widget-3-left-brown':
          return {
            id: 13,
            code: this.getCodeForGenerateWidget(13),
            schema: 'brown'
          };
          break;
        case 'widget-4-left-brown':
          return {
            id: 14,
            code: this.getCodeForGenerateWidget(14),
            schema: 'brown'
          };
          break;
        case 'widget-5-right-brown':
          return {
            id: 15,
            code: this.getCodeForGenerateWidget(15),
            schema: 'brown'
          };
          break;
        case 'widget-6-right-brown':
          return {
            id: 16,
            code: this.getCodeForGenerateWidget(16),
            schema: 'brown'
          };
          break;
        case 'widget-7-right-brown':
          return {
            id: 17,
            code: this.getCodeForGenerateWidget(17),
            schema: 'brown'
          };
          break;
        case 'widget-8-right-brown':
          return {
            id: 18,
            code: this.getCodeForGenerateWidget(18),
            schema: 'brown'
          };
          break;
        case 'widget-9-right-brown':
          return {
            id: 19,
            code: this.getCodeForGenerateWidget(19),
            schema: 'brown'
          };
          break;
        case 'widget-1-left-white':
          return {
            id: 21,
            code: this.getCodeForGenerateWidget(21),
            schema: 'none'
          };
          break;
        case 'widget-2-left-white':
          return {
            id: 22,
            code: this.getCodeForGenerateWidget(22),
            schema: 'none'
          };
          break;
        case 'widget-3-left-white':
          return {
            id: 23,
            code: this.getCodeForGenerateWidget(23),
            schema: 'none'
          };
          break;
        case 'widget-4-left-white':
          return {
            id: 24,
            code: this.getCodeForGenerateWidget(24),
            schema: 'none'
          };
          break;
        case 'widget-31-right-brown':
          return {
            id: 31,
            code: this.getCodeForGenerateWidget(31),
            schema: 'brown'
          };
          break;
      }
    }
  }, {
    key: 'initialMetricTemperature',


    /**
     * Инициализация единиц измерения в виджетах
     * */
    value: function initialMetricTemperature() {

      var setUnits = function setUnits(checkbox, cookie) {
        var units = 'metric';
        if (checkbox.checked == false) {
          checkbox.checked = false;
          units = 'imperial';
        }
        cookie.setCookie('units', units);
      };

      var getUnits = function getUnits(units) {
        switch (units) {
          case 'metric':
            return [units, '°C'];
          case 'imperial':
            return [units, '°F'];
        }
        return ['metric', '°C'];
      };

      var cookie = new _Cookies2.default();
      //Определение единиц измерения
      var unitsCheck = document.getElementById("units_check");

      unitsCheck.addEventListener("change", function (event) {
        setUnits(unitsCheck, cookie);
        window.location.reload();
      });

      var units = "metric";
      var text_unit_temp = null;
      if (cookie.getCookie('units')) {
        this.unitsTemp = getUnits(cookie.getCookie('units')) || ['metric', '°C'];

        var _unitsTemp = _slicedToArray(this.unitsTemp, 2);

        units = _unitsTemp[0];
        text_unit_temp = _unitsTemp[1];

        if (units == "metric") unitsCheck.checked = true;else unitsCheck.checked = false;
      } else {
        unitsCheck.checked = true;
        setUnits(unitsCheck, cookie);
        this.unitsTemp = getUnits(units);

        var _unitsTemp2 = _slicedToArray(this.unitsTemp, 2);

        units = _unitsTemp2[0];
        text_unit_temp = _unitsTemp2[1];
      }
    }
    /**
     * Свойство установки единиц измерения для виджетов
     * @param units
     */

  }, {
    key: 'validationAPIkey',
    value: function validationAPIkey() {
      var validationAPI = function validationAPI() {
        /* TODO Bykov D.S.
        * На данный момент работа только http протоколом
        * после реализации кросспротокольной реализации
        * установить протоколозависимый URL
        * */
        var url = '//api.openweathermap.org/data/2.5/widgets/forecast?id=524901&units=' + this.unitsTemp[0] + '&cnt=8&appid=' + this.controlsWidget.apiKey.value;
        var xhr = new XMLHttpRequest();
        var that = this;
        xhr.onload = function () {
          if (xhr.status === 200) {
            that.controlsWidget.errorKey.innerText = 'Validation accept';
            that.controlsWidget.errorKey.classList.add('widget-form--good');
            that.controlsWidget.errorKey.classList.remove('widget-form--error');
            return;
          }
          that.controlsWidget.errorKey.innerText = 'Validation error';
          that.controlsWidget.errorKey.classList.remove('widget-form--good');
          that.controlsWidget.errorKey.classList.add('widget-form--error');
        };

        xhr.onerror = function (e) {
          console.log('\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438 ' + e);
          that.controlsWidget.errorKey.innerText = 'Validation error';
          that.controlsWidget.errorKey.classList.remove('widget-form--good');
          that.controlsWidget.errorKey.classList.add('widget-form--error');
        };

        xhr.open('GET', url);
        xhr.send();
      };
      this.boundValidationMethod = validationAPI.bind(this);
      this.controlsWidget.apiKey.addEventListener('change', this.boundValidationMethod);
      //this.removeEventListener(this.boundValidationMethod);
    }
  }, {
    key: 'getCodeForGenerateWidget',
    value: function getCodeForGenerateWidget(id) {
      var appid = this.paramsWidget.appid;
      if (id && (this.paramsWidget.cityId || this.paramsWidget.cityName)) {
        var code = '';
        if (parseInt(id) === 1 || parseInt(id) === 11 || parseInt(id) === 21 || parseInt(id) === 31) {
          code = '<script src=\'' + this.baseURL + '/js/d3.min.js\'></script>';
        }
        var codeWidget = '<div id="openweathermap-widget-' + id + '"></div>\r\n' + code + ('<script>window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];\n            window.myWidgetParam.push({\n                id: ' + id + ',\n                cityid: \'' + this.paramsWidget.cityId + '\',\n                appid: \'' + appid + '\',\n                units: \'' + this.paramsWidget.units + '\',\n                containerid: \'openweathermap-widget-' + id + '\',\n            });\n            (function() {\n                var script = document.createElement(\'script\');\n                script.async = true;\n                script.charset = "utf-8";\n                script.src = "' + this.baseURL + '/js/weather-widget-generator.js";\n                var s = document.getElementsByTagName(\'script\')[0];\n                s.parentNode.insertBefore(script, s);\n            })();\n          </script>').replace(/[\r\n] | [\s] /g, '');
        return codeWidget;
      }

      return null;
    }
  }, {
    key: 'setInitialStateForm',
    value: function setInitialStateForm() {
      var cityId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2643743;
      var cityName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'London';


      this.paramsWidget = {
        cityId: cityId,
        cityName: cityName,
        lang: 'en',
        appid: document.getElementById('api-key').value,
        units: this.unitsTemp[0],
        textUnitTemp: this.unitsTemp[1], // 248
        baseURL: this.baseURL,
        urlDomain: '//api.openweathermap.org'
      };

      // Работа с формой для инициали
      this.cityName = document.getElementById('city-name');
      this.cities = document.getElementById('cities');
      this.searchCity = document.getElementById('search-city');

      this.urls = {
        urlWeatherAPI: this.paramsWidget.urlDomain + '/data/2.5/widgets/weather?id=' + this.paramsWidget.cityId + '&units=' + this.paramsWidget.units + '&appid=' + this.paramsWidget.appid,
        paramsUrlForeDaily: this.paramsWidget.urlDomain + '/data/2.5/widgets/forecast?id=' + this.paramsWidget.cityId + '&units=' + this.paramsWidget.units + '&cnt=8&appid=' + this.paramsWidget.appid,
        windSpeed: this.baseURL + '/data/wind-speed-data.json',
        windDirection: this.baseURL + '/data/wind-direction-data.json',
        clouds: this.baseURL + '/data/clouds-data.json',
        naturalPhenomenon: this.baseURL + '/data/natural-phenomenon-data.json'
      };
    }
  }, {
    key: 'defaultAppIdProps',


    /**
     * [defaultAppIdProps description]
     * @return {[type]} [description]
     */
    get: function get() {
      return this.defaultAppid;
    }
    /**
     * [defaultAppIdProps description]
     * @param  {[type]} appid [description]
     * @return {[type]}       [description]
     */
    ,
    set: function set(appid) {
      this.defaultAppid = appid;
    }
  }, {
    key: 'unitsTemp',
    set: function set(units) {
      this.units = units;
    }
    /**
     * Свойство получения единиц измерения для виджетов
     * @returns {*}
     */
    ,
    get: function get() {
      return this.units;
    }
  }]);

  return GeneratorWidget;
}();

exports.default = GeneratorWidget;

},{"./Cookies":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _generatorWidget = require('./generator-widget');

var _generatorWidget2 = _interopRequireDefault(_generatorWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Popup = function () {
  function Popup(cityId, cityName, appid) {
    _classCallCheck(this, Popup);

    this.cityIdProps = cityId;
    this.cityNameProps = cityName;

    this.generateWidget = new _generatorWidget2.default();
    this.generateWidget.defaultAppIdProps = appid;
    this.form = document.getElementById('frm-landing-widget');
    this.popup = document.getElementById('popup');
    this.popupTitle = document.getElementById('popup-title');
    this.popupShadow = document.querySelector('.popup-shadow');
    this.popupClose = document.getElementById('popup-close');
    this.contentJSGeneration = document.getElementById('js-code-generate');
    this.copyContentJSCode = document.getElementById('copy-js-code');
    this.apiKey = document.getElementById('api-key');

    this.popupShow = this.popupShow.bind(this);
    this.eventPopupClose = this.eventPopupClose.bind(this);
    this.eventCopyContentJSCode = this.eventCopyContentJSCode.bind(this);
    // Фиксируем клики на форме, и открываем popup окно при нажатии на кнопку
    this.form.addEventListener('click', this.popupShow);
    // Закрываем окно при нажатии на крестик
    document.addEventListener('click', this.eventPopupClose);
    // Копирование в буфер обмена JS кода
    this.copyContentJSCode.addEventListener('click', this.eventCopyContentJSCode);
  }

  /**
   * [cityIdProps description]
   * @return {[type]} [description]
   */


  _createClass(Popup, [{
    key: 'popupShow',


    /**
     * [popupShow метод открытия попап окна]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    value: function popupShow(event) {
      var element = event.target;
      var apiKey = this.apiKey.value;
      if (element.id && element.classList.contains('container-custom-card__btn')) {
        event.preventDefault();
        var radio = document.querySelector("input[class='city-list__radio']:checked");
        if (!radio) {
          return;
        }
        if (!apiKey || apiKey === this.generateWidget.defaultAppIdProps) {
          var title = 'Important! You need to\n            <a href="https://home.openweathermap.org/" target="_blank"> get API key </a>';
          var description = '';
          this.popupTitle.innerHTML = title;
          this.contentJSGeneration.value = '';
          this.copyContentJSCode.innerHTML = '<i class="fa fa-window-close-o"></i> Close';
          this.popupWorkLogic(this.popup);
          return;
        } else {
          var _title = 'Get a code for posting a weather forecast widget on your site.';
          this.popupTitle.textContent = _title;
          this.copyContentJSCode.innerHTML = '<i class="fa fa-clone"></i> Copy in buffer';
          this.generateWidget.setInitialStateForm(radio.id, radio.value);
          this.contentJSGeneration.value = this.generateWidget.getCodeForGenerateWidget(this.generateWidget.mapWidgets(element.id)['id']);
          this.popupWorkLogic(this.popup);
        }
      }
    }

    /**
     * [popupWorkLogic Логика работы с попап окном]
     * @param  {[type]} popup [description]
     * @return {[type]}       [description]
     */

  }, {
    key: 'popupWorkLogic',
    value: function popupWorkLogic(popup) {
      if (!popup.classList.contains('popup--visible')) {
        document.body.style.overflow = 'hidden';
        popup.classList.add('popup--visible');
        this.popupShadow.classList.add('popup-shadow--visible');
      }
    }
  }, {
    key: 'eventPopupClose',
    value: function eventPopupClose(event) {
      var element = event.target;
      if ((!element.classList.contains('popupClose') || element === popup) && !element.classList.contains('container-custom-card__btn') && !element.classList.contains('popup__title') && !element.classList.contains('popup__items') && !element.classList.contains('popup__layout') && !element.classList.contains('popup__btn')) {
        this.popup.classList.remove('popup--visible');
        this.popupShadow.classList.remove('popup-shadow--visible');
        document.body.style.overflow = 'auto';
      }
    }
  }, {
    key: 'eventCopyContentJSCode',
    value: function eventCopyContentJSCode(event) {
      event.preventDefault();
      this.contentJSGeneration.select();

      try {
        var txtCopy = document.execCommand('copy');
        var msg = txtCopy ? 'successful' : 'unsuccessful';
        console.log('Copy email command was ' + msg);
      } catch (e) {
        console.log('\u041E\u0448\u0438\u0431\u043A\u0430 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F ' + e.errLogToConsole);
      }

      this.popup.classList.remove('popup--visible');
      this.popupShadow.classList.remove('popup-shadow--visible');
      document.body.style.overflow = 'auto';
      this.copyContentJSCode.disabled = !document.queryCommandSupported('copy');
    }
  }, {
    key: 'cityIdProps',
    get: function get() {
      return this.cityId;
    }

    /**
     * [cityIdProps description]
     * @param  {[type]} cityId [description]
     * @return {[type]}        [description]
     */
    ,
    set: function set(cityId) {
      this.cityId = cityId;
    }

    /**
     * [cityNameProps description]
     * @return {[type]} [description]
     */

  }, {
    key: 'cityNameProps',
    get: function get() {
      return this.cityName;
    }

    /**
     * [cityNameProps description]
     * @param  {[type]} cityName [description]
     * @return {[type]}          [description]
     */
    ,
    set: function set(cityName) {
      this.cityName = cityName;
    }
  }]);

  return Popup;
}();

exports.default = Popup;

},{"./generator-widget":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderWidgets;
function renderWidgets(cityId, appid, baseDomain) {
  var typeActive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'widget-brown';
  var units = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'metric';

  window.myWidgetParam = [];
  var baseURL = '//' + baseDomain + '/themes/openweathermap/assets/vendor/owm';
  var widgetBrownContainer = document.getElementById('widget-brown-container');
  var widgetBlueContainer = document.getElementById('widget-blue-container');
  var widgetGrayContainer = document.getElementById('widget-gray-container');
  widgetBrownContainer.classList.remove('widget__layout--visible');
  widgetBlueContainer.classList.remove('widget__layout--visible');
  widgetGrayContainer.classList.remove('widget__layout--visible');
  var schema = 'dashboard';
  if (typeActive === 'widget-brown') {
    widgetBrownContainer.classList.add('widget__layout--visible');
    window.myWidgetParam.push({
      id: 11,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-11',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 12,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-12',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 13,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-13',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 14,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-14',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 15,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-15',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 16,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-16',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 17,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-17',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 18,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-18',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 19,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-19',
      schema: schema
    });
  } else if (typeActive === 'widget-blue') {
    widgetBlueContainer.classList.add('widget__layout--visible');
    window.myWidgetParam.push({
      id: 1,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-1',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 2,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-2',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 3,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-3',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 4,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-4',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 5,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-5',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 6,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-6',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 7,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-7',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 8,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-8',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 9,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-9',
      schema: schema
    });
  } else if (typeActive === 'widget-gray') {
    widgetGrayContainer.classList.add('widget__layout--visible');
    window.myWidgetParam.push({
      id: 21,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-21',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 22,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-22',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 23,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-23',
      schema: schema
    });
    window.myWidgetParam.push({
      id: 24,
      cityid: cityId,
      appid: appid,
      units: units,
      containerid: 'openweathermap-widget-24',
      schema: schema
    });
  }
  var scripts = document.getElementById('scripts');
  if (scripts) {
    var script = document.createElement('script');
    script.async = true;
    script.src = baseURL + '/js/weather-widget-generator.js';
    scripts.textContent = '';
    scripts.appendChild(script);
  }
};

},{}],7:[function(require,module,exports){
'use strict';
// Модуль диспетчер для отрисовки баннерров на конструкторе

var _cities = require('./cities');

var _cities2 = _interopRequireDefault(_cities);

var _popup = require('./popup');

var _popup2 = _interopRequireDefault(_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchCity = document.getElementById('search-city');
var btnRenderWidgets = document.getElementById('append-scripts');
var scripts = document.getElementById('scripts');
// Работа с формой для инициали
var cityName = document.getElementById('city-name');
var cities = document.getElementById('cities');
var appid = document.getElementById('api-key');

//проверяем активную вкладку
var widgetChoose = document.querySelector('.widget-choose');
var widgetTypeActive = widgetChoose.querySelector('input[type="radio"]:checked');

// Работает с localStorage с ключиком
var appidFromLS = localStorage.getItem('appid');
if (appidFromLS && appid) {
  appid.value = appidFromLS;
}

var params = {
  cityId: 2643743,
  cityName: cityName.value,
  widgetTypeActive: widgetTypeActive.id,
  container: cities,
  appid: '439d4b804bc8187953eb36d2a8c26a02',
  appidUser: appid ? appid.value : '',
  baseDomain: document.location.hostname === 'openweathermap.phase.owm.io' ? 'openweathermap.phase.owm.io' : 'openweathermap.org'
};

var popup = new _popup2.default(params.cityId, params.cityName, params.appid);
widgetChoosen = widgetChoosen.bind(undefined);
// прослушивание событий изменения по отображению типа виджетов
widgetChoose.addEventListener('click', widgetChoosen, false);

var objCities = new _cities2.default(params);
objCities.getCities();
objCities.renderWidget();

searchCity.addEventListener('click', function () {
  params.cityName = cityName.value;
  var objCities = new _cities2.default(params);
  objCities.getCities();
  // записываем ключик в localStorage
  if (appid) {
    localStorage.setItem('appid', appid.value);
  }
});

appid.addEventListener('change', function (e) {
  return localStorage.setItem('appid', e.target.value);
});

function widgetChoosen(event) {
  var element = event.target;
  if (element.id) {
    params.widgetTypeActive = element.id;
    var _objCities = new _cities2.default(params);
    _objCities.renderWidget();
  } else
    // for IE 11
    if (element.getAttribute('class') === 'widget-choose__img') {
      var label = element.parentNode;
      var radio = label.querySelector('.widget-choose__radio');
      radio.checked = 'checked';
      params.widgetTypeActive = radio.id;
      var _objCities2 = new _cities2.default(params);
      _objCities2.renderWidget();
    }
}

},{"./cities":2,"./popup":5}],8:[function(require,module,exports){
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
if (!String.fromCodePoint) {
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var stringFromCharCode = String.fromCharCode;
		var floor = Math.floor;
		var fromCodePoint = function(_) {
			var MAX_SIZE = 0x4000;
			var codeUnits = [];
			var highSurrogate;
			var lowSurrogate;
			var index = -1;
			var length = arguments.length;
			if (!length) {
				return '';
			}
			var result = '';
			while (++index < length) {
				var codePoint = Number(arguments[index]);
				if (
					!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
					codePoint < 0 || // not a valid Unicode code point
					codePoint > 0x10FFFF || // not a valid Unicode code point
					floor(codePoint) != codePoint // not an integer
				) {
					throw RangeError('Invalid code point: ' + codePoint);
				}
				if (codePoint <= 0xFFFF) { // BMP code point
					codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
					// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					highSurrogate = (codePoint >> 10) + 0xD800;
					lowSurrogate = (codePoint % 0x400) + 0xDC00;
					codeUnits.push(highSurrogate, lowSurrogate);
				}
				if (index + 1 == length || codeUnits.length > MAX_SIZE) {
					result += stringFromCharCode.apply(null, codeUnits);
					codeUnits.length = 0;
				}
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String, 'fromCodePoint', {
				'value': fromCodePoint,
				'configurable': true,
				'writable': true
			});
		} else {
			String.fromCodePoint = fromCodePoint;
		}
	}());
}

},{}],9:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));





}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":10}],10:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvQ29va2llcy5qcyIsImFzc2V0cy9qcy9jaXRpZXMuanMiLCJhc3NldHMvanMvY2xlYXJXaWRnZXRDb250YWluZXIuanMiLCJhc3NldHMvanMvZ2VuZXJhdG9yLXdpZGdldC5qcyIsImFzc2V0cy9qcy9wb3B1cC5qcyIsImFzc2V0cy9qcy9yZW5kZXJXaWRnZXRzLmpzIiwiYXNzZXRzL2pzL3NjcmlwdC5qcyIsIm5vZGVfbW9kdWxlcy9TdHJpbmcuZnJvbUNvZGVQb2ludC9mcm9tY29kZXBvaW50LmpzIiwibm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvZXM2LXByb21pc2UuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBO0lBQ3FCLE87Ozs7Ozs7OEJBRVQsSSxFQUFNLEssRUFBTztBQUNyQixVQUFJLFVBQVUsSUFBSSxJQUFKLEVBQWQ7QUFDQSxjQUFRLE9BQVIsQ0FBZ0IsUUFBUSxPQUFSLEtBQXFCLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsRUFBakIsR0FBc0IsR0FBM0Q7QUFDQSxlQUFTLE1BQVQsR0FBa0IsT0FBTyxHQUFQLEdBQWEsT0FBTyxLQUFQLENBQWIsR0FBNkIsWUFBN0IsR0FBNEMsUUFBUSxXQUFSLEVBQTVDLEdBQXFFLFVBQXZGO0FBQ0Q7O0FBRUQ7Ozs7OEJBQ1UsSSxFQUFNO0FBQ2QsVUFBSSxVQUFVLFNBQVMsTUFBVCxDQUFnQixLQUFoQixDQUFzQixJQUFJLE1BQUosQ0FDbEMsYUFBYSxLQUFLLE9BQUwsQ0FBYSw4QkFBYixFQUE2QyxNQUE3QyxDQUFiLEdBQW9FLFVBRGxDLENBQXRCLENBQWQ7QUFHQSxhQUFPLFVBQVUsbUJBQW1CLFFBQVEsQ0FBUixDQUFuQixDQUFWLEdBQTJDLFNBQWxEO0FBQ0Q7OzttQ0FFYztBQUNiLFdBQUss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QUNMLGdCQUFJLENBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLENBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLENBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLENBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLENBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUssc0JBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUssc0JBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUssc0JBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUssc0JBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUssc0JBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdBQVA7QUFLQTtBQUNGLGFBQUsscUJBQUw7QUFDRSxpQkFBTztBQUNMLGdCQUFJLEVBREM7QUFFTCxrQkFBTSxLQUFLLHdCQUFMLENBQThCLEVBQTlCLENBRkQ7QUFHTCxvQkFBUTtBQUhILFdB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vINCg0LDQsdC+0YLQsCDRgSDQutGD0LrQsNC80LhcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvb2tpZXMge1xuXG4gIHNldENvb2tpZShuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcbiAgICBleHBpcmVzLnNldFRpbWUoZXhwaXJlcy5nZXRUaW1lKCkgKyAoMTAwMCAqIDYwICogNjAgKiAyNCAqIDM2NSkpO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjsgZXhwaXJlcz1cIiArIGV4cGlyZXMudG9HTVRTdHJpbmcoKSArICBcIjsgcGF0aD0vXCI7XG4gIH1cblxuICAvLyDQstC+0LfQstGA0LDRidCw0LXRgiBjb29raWUg0YEg0LjQvNC10L3QtdC8IG5hbWUsINC10YHQu9C4INC10YHRgtGMLCDQtdGB0LvQuCDQvdC10YIsINGC0L4gdW5kZWZpbmVkXG4gIGdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cChcbiAgICAgIFwiKD86Xnw7IClcIiArIG5hbWUucmVwbGFjZSgvKFtcXC4kPyp8e31cXChcXClcXFtcXF1cXFxcXFwvXFwrXl0pL2csICdcXFxcJDEnKSArIFwiPShbXjtdKilcIlxuICAgICkpO1xuICAgIHJldHVybiBtYXRjaGVzID8gZGVjb2RlVVJJQ29tcG9uZW50KG1hdGNoZXNbMV0pIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZGVsZXRlQ29va2llKCkge1xuICAgIHRoaXMuc2V0Q29va2llKG5hbWUsIFwiXCIsIHtcbiAgICAgIGV4cGlyZXM6IC0xXG4gICAgfSlcbiAgfVxufVxuIiwiLyoqXG4qIENyZWF0ZWQgYnkgRGVuaXMgb24gMjEuMTAuMjAxNi5cbiovXG5cbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdlczYtcHJvbWlzZScpLlByb21pc2U7XG5yZXF1aXJlKCdTdHJpbmcuZnJvbUNvZGVQb2ludCcpO1xuaW1wb3J0IEdlbmVyYXRvcldpZGdldCBmcm9tICcuL2dlbmVyYXRvci13aWRnZXQnO1xuXG5pbXBvcnQgcmVuZGVyV2lkZ2V0cyBmcm9tICcuL3JlbmRlcldpZGdldHMnO1xuaW1wb3J0IGNsZWFyV2lkZ2V0Q29udGFpbmVyIGZyb20gJy4vY2xlYXJXaWRnZXRDb250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaXRpZXMge1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIC8vY2l0eU5hbWUsIGNvbnRhaW5lciwgd2lkZ2V0VHlwZUFjdGl2ZVxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgIHRoaXMuZ2VuZXJhdGVXaWRnZXQgPSBuZXcgR2VuZXJhdG9yV2lkZ2V0KCk7XG4gICAgdGhpcy5nZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XG4gICAgdGhpcy5wYXJhbXMudW5pdHMgPSB0aGlzLmdlbmVyYXRlV2lkZ2V0LnVuaXRzVGVtcFswXTtcbiAgICBpZiAoIXRoaXMucGFyYW1zLmNpdHlOYW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuY2hvb3NlQ2l0eSA9IHRoaXMuY2hvb3NlQ2l0eS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2l0eU5hbWUgPSB0aGlzLnBhcmFtcy5jaXR5TmFtZS5yZXBsYWNlKC8oXFxzfC0pKy9nLCcgJykudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyIHx8ICcnO1xuICAgIHRoaXMudXJsID0gYC8vJHt0aGlzLnBhcmFtcy5iYXNlRG9tYWlufS9kYXRhLzIuNS9maW5kP3E9JHt0aGlzLmNpdHlOYW1lfSZ0eXBlPWxpa2Umc29ydD1wb3B1bGF0aW9uJmNudD0zMCZhcHBpZD0ke3RoaXMucGFyYW1zLmFwcGlkfWA7XG4gIH1cblxuICBnZXRDaXRpZXMoKSB7XG4gICAgaWYgKCF0aGlzLnBhcmFtcy5jaXR5TmFtZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5odHRwR2V0KHRoaXMudXJsKVxuICAgICAgLnRoZW4oXG4gICAgICAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdGhpcy5nZXRTZWFyY2hEYXRhKHJlc3BvbnNlKTtcbiAgICAgIH0sXG4gICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYNCS0L7Qt9C90LjQutC70LAg0L7RiNC40LHQutCwICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgcmVuZGVyV2lkZ2V0KCkge1xuICAgIGNsZWFyV2lkZ2V0Q29udGFpbmVyKCk7XG4gICAgcmVuZGVyV2lkZ2V0cyhcbiAgICAgIHRoaXMucGFyYW1zLmNpdHlJZCxcbiAgICAgIHRoaXMucGFyYW1zLmFwcGlkLFxuICAgICAgdGhpcy5wYXJhbXMuYmFzZURvbWFpbixcbiAgICAgIHRoaXMucGFyYW1zLndpZGdldFR5cGVBY3RpdmUsXG4gICAgICB0aGlzLnBhcmFtcy51bml0c1xuICAgICk7XG4gIH1cblxuICBnZXRTZWFyY2hEYXRhKEpTT05vYmplY3QpIHtcbiAgICBpZiAoIUpTT05vYmplY3QubGlzdC5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDaXR5IG5vdCBmb3VuZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNpdHlMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NpdHktbGlzdCcpO1xuICAgIGlmICh0aGlzLmNpdHlMaXN0KSB7XG4gICAgICB0aGlzLmNpdHlMaXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zZWxlY3RlZENpdHkpO1xuICAgICAgdGhpcy5jaXR5TGlzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuY2l0eUxpc3QpO1xuICAgIH1cblxuICAgIGxldCBodG1sID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBKU09Ob2JqZWN0Lmxpc3QubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBgJHtKU09Ob2JqZWN0Lmxpc3RbaV0ubmFtZX0sICR7SlNPTm9iamVjdC5saXN0W2ldLnN5cy5jb3VudHJ5fWA7XG4gICAgICBjb25zdCBmbGFnID0gYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1hZ2VzL2ZsYWdzLyR7SlNPTm9iamVjdC5saXN0W2ldLnN5cy5jb3VudHJ5LnRvTG93ZXJDYXNlKCl9LnBuZ2A7XG4gICAgICBodG1sICs9IGBcbiAgICAgIDxsaSBjbGFzcz1cImNpdHktbGlzdF9faXRlbVwiPlxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaXR5LWxpc3RfX2xhYmVsXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgY2xhc3M9XCJjaXR5LWxpc3RfX3JhZGlvXCJcbiAgICAgICAgICAgIG5hbWU9XCJjaXR5LWxpc3RcIlxuICAgICAgICAgICAgaWQ9XCIke0pTT05vYmplY3QubGlzdFtpXS5pZH1cIlxuICAgICAgICAgICAgdmFsdWU9XCIke25hbWV9XCJcbiAgICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaXR5LWxpc3RfX2xpbmtcIj5cbiAgICAgICAgICAgICR7bmFtZX1cbiAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtmbGFnfVwiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxMVwiIGFsdD1cIiR7bmFtZX1cIj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICA8L2xpPmA7XG4gICAgfVxuXG4gICAgaHRtbCA9IGA8dWwgY2xhc3M9XCJjaXR5LWxpc3RcIiBpZD1cImNpdHktbGlzdFwiPiR7aHRtbH08L3VsPmA7XG4gICAgdGhpcy5wYXJhbXMuY29udGFpbmVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xuXG4gICAgdGhpcy5jaXR5TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LWxpc3QnKTtcbiAgICB0aGlzLmNpdHlMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jaG9vc2VDaXR5KTtcbiAgICAvLyDQsNC60YLQuNCy0LjRgNGD0LXQvCDQv9C10YDQstGL0Lkg0L/Rg9C90LrRgiDRgdC/0LjRgdC60LBcbiAgICBpZiAodGhpcy5jaXR5TGlzdC5jaGlsZHJlblswXSkge1xuICAgICAgY29uc3QgcmFkaW8gPSB0aGlzLmNpdHlMaXN0LmNoaWxkcmVuWzBdLnF1ZXJ5U2VsZWN0b3IoJy5jaXR5LWxpc3RfX3JhZGlvJyk7XG4gICAgICBpZiAocmFkaW8pIHtcbiAgICAgICAgcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDaXR5KHJhZGlvLmlkLCByYWRpby52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFtjaG9vc2VDaXR5IGRlc2NyaXB0aW9uINCe0LHRgNCw0LHQvtGC0LrQsCDRgdC+0LHRi9GC0LjRjyDQv9C+INCy0YvQsdC+0YDRgyDQs9C+0YDQvtC00LBdXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBjaG9vc2VDaXR5KGUpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaXR5LWxpc3RfX3JhZGlvJykpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRDaXR5KGVsZW1lbnQuaWQsIGVsZW1lbnQudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBbc2VsZWN0ZWRDaXR5INCS0YvQsdC+0YAg0LPQvtGA0L7QtNCwINC4INC/0LXRgNC10YDQuNGB0L7QstC60LAg0LLQuNC00LbQtdGC0L7Qsl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBjaXR5SUQgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gY2l0eU5hbWUgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHNlbGVjdGVkQ2l0eShjaXR5SUQsIGNpdHlOYW1lKSB7XG4gICAgdGhpcy5nZW5lcmF0ZVdpZGdldC5zZXRJbml0aWFsU3RhdGVGb3JtKGNpdHlJRCwgY2l0eU5hbWUpO1xuICAgIHRoaXMucGFyYW1zLmNpdHlJZCA9IGNpdHlJRDtcbiAgICB0aGlzLnBhcmFtc2NpdHlOYW1lID0gY2l0eU5hbWU7XG4gICAgdGhpcy5yZW5kZXJXaWRnZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAqINCe0LHQtdGA0YLQutCwINC+0LHQtdGJ0LXQvdC40LUg0LTQu9GPINCw0YHQuNC90YXRgNC+0L3QvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxuICAqIEBwYXJhbSB1cmxcbiAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgKi9cbiAgaHR0cEdldCh1cmwpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKHRoaXMuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgZXJyb3IuY29kZSA9IHRoaXMuc3RhdHVzO1xuICAgICAgICAgIHJlamVjdCh0aGF0LmVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0JLRgNC10LzRjyDQvtC20LjQtNCw0L3QuNGPINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyBBUEkg0LjRgdGC0LXQutC70L4gJHtlLnR5cGV9ICR7ZS50aW1lU3RhbXAudG9GaXhlZCgyKX1gKSk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg0J7RiNC40LHQutCwINC+0LHRgNCw0YnQtdC90LjRjyDQuiDRgdC10YDQstC10YDRgyAke2V9YCkpO1xuICAgICAgfTtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgICB4aHIuc2VuZChudWxsKTtcbiAgICB9KTtcbiAgfVxuXG59XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBjbGVhcldpZGdldENvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuICBsZXQgaSA9IDE7XG4gIGNvbnN0IGNvbnRhaW5lcnMgPSBbXTtcbiAgd2hpbGUoaSA8IDEwMCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBvcGVud2VhdGhlcm1hcC13aWRnZXQtJHtpfWApO1xuICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lcnMucHVzaChjb250YWluZXIpO1xuICAgIH1cbiAgICBpKytcbiAgfTtcblxuICBjb250YWluZXJzLmZvckVhY2goZnVuY3Rpb24oZWxlbSkge1xuICAgIGVsZW0uaW5uZXJUZXh0ID0gJyc7XG4gIH0pO1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGVhcldpZGdldENvbnRhaW5lcjtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBEZW5pcyBvbiAxMy4xMC4yMDE2LlxuICovXG5pbXBvcnQgQ29va2llcyBmcm9tICcuL0Nvb2tpZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmF0b3JXaWRnZXQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyB0aGlzLmJhc2VEb21haW4gPSAnbG9jYWxob3N0OjMwMDAnO1xuICAgICAgICB0aGlzLmJhc2VEb21haW4gPSBkb2N1bWVudC5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ3BoYXNlLm93bS5pbycgP1xuICAgICAgICAgICdvcGVud2VhdGhlcm1hcC5waGFzZS5vd20uaW8nIDogJ29wZW53ZWF0aGVybWFwLm9yZyc7XG4gICAgICAgIHRoaXMuYmFzZVVSTCA9IGAvLyR7dGhpcy5iYXNlRG9tYWlufS90aGVtZXMvb3BlbndlYXRoZXJtYXAvYXNzZXRzL3ZlbmRvci9vd21gO1xuICAgICAgICB0aGlzLnNjcmlwdEQzU1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy9saWJzL2QzLm1pbi5qc2A7XG4gICAgICAgIHRoaXMuc2NyaXB0U1JDID0gYCR7dGhpcy5iYXNlVVJMfS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanNgO1xuICAgICAgICB0aGlzLmNvbnRyb2xzV2lkZ2V0ID0ge1xuICAgICAgICAgICAgLy8g0J/QtdGA0LLQsNGPINC/0L7Qu9C+0LLQuNC90LAg0LLQuNC00LbQtdGC0L7QslxuICAgICAgICAgICAgY2l0eU5hbWU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aWRnZXQtbGVmdC1tZW51X19oZWFkZXInKSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1sZWZ0LWNhcmRfX251bWJlcicpLFxuICAgICAgICAgICAgbmF0dXJhbFBoZW5vbWVub246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9fbWVhbnMnKSxcbiAgICAgICAgICAgIHdpbmRTcGVlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItbGVmdC1jYXJkX193aW5kJyksXG4gICAgICAgICAgICBtYWluSWNvbldlYXRoZXI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLWxlZnQtY2FyZF9faW1nJyksXG4gICAgICAgICAgICBjYWxlbmRhckl0ZW06IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYWxlbmRhcl9faXRlbScpLFxuICAgICAgICAgICAgZ3JhcGhpYzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyYXBoaWMnKSxcbiAgICAgICAgICAgIC8vINCS0YLQvtGA0LDRjyDQv9C+0LvQvtCy0LjQvdCwINCy0LjQtNC20LXRgtC+0LJcbiAgICAgICAgICAgIGNpdHlOYW1lMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fdGl0bGUnKSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlYXRoZXItcmlnaHRfX3RlbXBlcmF0dXJlJyksXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZUZlZWxzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9fZmVlbHMnKSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlTWluOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1taW4nKSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlTWF4OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodC1jYXJkX190ZW1wZXJhdHVyZS1tYXgnKSxcbiAgICAgICAgICAgIG5hdHVyYWxQaGVub21lbm9uMjogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldC1yaWdodF9fZGVzY3JpcHRpb24nKSxcbiAgICAgICAgICAgIHdpbmRTcGVlZDI6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X193aW5kLXNwZWVkJyksXG4gICAgICAgICAgICBtYWluSWNvbldlYXRoZXIyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VhdGhlci1yaWdodF9faWNvbicpLFxuICAgICAgICAgICAgaHVtaWRpdHk6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19odW1pZGl0eScpLFxuICAgICAgICAgICAgcHJlc3N1cmU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWF0aGVyLXJpZ2h0X19wcmVzc3VyZScpLFxuICAgICAgICAgICAgZGF0ZVJlcG9ydDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpZGdldF9fZGF0ZScpLFxuICAgICAgICAgICAgYXBpS2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBpLWtleScpLFxuICAgICAgICAgICAgZXJyb3JLZXk6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvci1rZXknKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pbml0Rm9ybSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmluaXRpYWxNZXRyaWNUZW1wZXJhdHVyZSgpO1xuICAgICAgICB0aGlzLnZhbGlkYXRpb25BUElrZXkoKTtcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGVGb3JtKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogW21hcFdpZGdldHMg0LzQtdGC0L7QtCDQtNC70Y8g0YHQvtC/0L7RgdGC0LDQstC70LXQvdC40Y8g0LLRgdC10YUg0LLQuNC00LbQtdGC0L7QsiDRgVxuICAgICAqINC60L3QvtC/0LrQvtC5LdC40L3QuNGG0LjQsNGC0L7RgNC+0Lwg0LjRhSDQstGL0LfQvtCy0LAg0LTQu9GPINCz0LXQvdC10YDQsNGG0LjQuCDQutC+0LTQsF1cbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHdpZGdldElEIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBtYXBXaWRnZXRzKHdpZGdldElEKSB7XG4gICAgICBzd2l0Y2god2lkZ2V0SUQpIHtcbiAgICAgICAgY2FzZSAnd2lkZ2V0LTEtbGVmdC1ibHVlJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMSksXG4gICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtMi1sZWZ0LWJsdWUnIDpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IDIsXG4gICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyKSxcbiAgICAgICAgICAgIHNjaGVtYTogJ2JsdWUnLFxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3dpZGdldC0zLWxlZnQtYmx1ZScgOlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogMyxcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDMpLFxuICAgICAgICAgICAgc2NoZW1hOiAnYmx1ZScsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnd2lkZ2V0LTQtbGVmdC1ibHVlJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiA0LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNCksXG4gICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtNS1yaWdodC1ibHVlJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiA1LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNSksXG4gICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtNi1yaWdodC1ibHVlJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiA2LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNiksXG4gICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtNy1yaWdodC1ibHVlJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiA3LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoNyksXG4gICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtOC1yaWdodC1ibHVlJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiA4LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOCksXG4gICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtOS1yaWdodC1ibHVlJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiA5LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoOSksXG4gICAgICAgICAgICBzY2hlbWE6ICdibHVlJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtMS1sZWZ0LWJyb3duJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAxMSxcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDExKSxcbiAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtMi1sZWZ0LWJyb3duJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAxMixcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEyKSxcbiAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtMy1sZWZ0LWJyb3duJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAxMyxcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDEzKSxcbiAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtNC1sZWZ0LWJyb3duJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAxNCxcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE0KSxcbiAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtNS1yaWdodC1icm93bicgOlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogMTUsXG4gICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxNSksXG4gICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnd2lkZ2V0LTYtcmlnaHQtYnJvd24nIDpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IDE2LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTYpLFxuICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3dpZGdldC03LXJpZ2h0LWJyb3duJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAxNyxcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDE3KSxcbiAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtOC1yaWdodC1icm93bicgOlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogMTgsXG4gICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgxOCksXG4gICAgICAgICAgICBzY2hlbWE6ICdicm93bicsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnd2lkZ2V0LTktcmlnaHQtYnJvd24nIDpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IDE5LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMTkpLFxuICAgICAgICAgICAgc2NoZW1hOiAnYnJvd24nLFxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3dpZGdldC0xLWxlZnQtd2hpdGUnIDpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IDIxLFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjEpLFxuICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnd2lkZ2V0LTItbGVmdC13aGl0ZScgOlxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogMjIsXG4gICAgICAgICAgICBjb2RlOiB0aGlzLmdldENvZGVGb3JHZW5lcmF0ZVdpZGdldCgyMiksXG4gICAgICAgICAgICBzY2hlbWE6ICdub25lJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3aWRnZXQtMy1sZWZ0LXdoaXRlJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAyMyxcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDIzKSxcbiAgICAgICAgICAgIHNjaGVtYTogJ25vbmUnLFxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3dpZGdldC00LWxlZnQtd2hpdGUnIDpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IDI0LFxuICAgICAgICAgICAgY29kZTogdGhpcy5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoMjQpLFxuICAgICAgICAgICAgc2NoZW1hOiAnbm9uZScsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnd2lkZ2V0LTMxLXJpZ2h0LWJyb3duJyA6XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAzMSxcbiAgICAgICAgICAgIGNvZGU6IHRoaXMuZ2V0Q29kZUZvckdlbmVyYXRlV2lkZ2V0KDMxKSxcbiAgICAgICAgICAgIHNjaGVtYTogJ2Jyb3duJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBbZGVmYXVsdEFwcElkUHJvcHMgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgZ2V0IGRlZmF1bHRBcHBJZFByb3BzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdEFwcGlkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBbZGVmYXVsdEFwcElkUHJvcHMgZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBhcHBpZCBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgc2V0IGRlZmF1bHRBcHBJZFByb3BzKGFwcGlkKSB7XG4gICAgICB0aGlzLmRlZmF1bHRBcHBpZCA9IGFwcGlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC10LTQuNC90LjRhiDQuNC30LzQtdGA0LXQvdC40Y8g0LIg0LLQuNC00LbQtdGC0LDRhVxuICAgICAqICovXG4gICAgaW5pdGlhbE1ldHJpY1RlbXBlcmF0dXJlKCkge1xuXG4gICAgICAgIGNvbnN0IHNldFVuaXRzID0gZnVuY3Rpb24oY2hlY2tib3gsIGNvb2tpZSl7XG4gICAgICAgICAgICB2YXIgdW5pdHMgPSAnbWV0cmljJztcbiAgICAgICAgICAgIGlmKGNoZWNrYm94LmNoZWNrZWQgPT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB1bml0cyA9ICdpbXBlcmlhbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb29raWUuc2V0Q29va2llKCd1bml0cycsIHVuaXRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBnZXRVbml0cyA9IGZ1bmN0aW9uKHVuaXRzKXtcbiAgICAgICAgICAgIHN3aXRjaCh1bml0cyl7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWV0cmljJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt1bml0cywgJ8KwQyddO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2ltcGVyaWFsJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt1bml0cywgJ8KwRiddO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFsnbWV0cmljJywgJ8KwQyddO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjb29raWUgPSBuZXcgQ29va2llcygpO1xuICAgICAgICAvL9Ce0L/RgNC10LTQtdC70LXQvdC40LUg0LXQtNC40L3QuNGGINC40LfQvNC10YDQtdC90LjRj1xuICAgICAgICB2YXIgdW5pdHNDaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5pdHNfY2hlY2tcIik7XG5cbiAgICAgICAgdW5pdHNDaGVjay5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHNldFVuaXRzKHVuaXRzQ2hlY2ssIGNvb2tpZSk7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB1bml0cyA9IFwibWV0cmljXCI7XG4gICAgICAgIHZhciB0ZXh0X3VuaXRfdGVtcCA9IG51bGw7XG4gICAgICAgIGlmKGNvb2tpZS5nZXRDb29raWUoJ3VuaXRzJykpe1xuICAgICAgICAgICAgdGhpcy51bml0c1RlbXAgPSBnZXRVbml0cyhjb29raWUuZ2V0Q29va2llKCd1bml0cycpKSB8fCBbJ21ldHJpYycsICfCsEMnXTtcbiAgICAgICAgICAgIFt1bml0cywgdGV4dF91bml0X3RlbXBdID0gdGhpcy51bml0c1RlbXA7XG4gICAgICAgICAgICBpZih1bml0cyA9PSBcIm1ldHJpY1wiKVxuICAgICAgICAgICAgICAgIHVuaXRzQ2hlY2suY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdW5pdHNDaGVjay5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHVuaXRzQ2hlY2suY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICBzZXRVbml0cyh1bml0c0NoZWNrLCBjb29raWUpO1xuICAgICAgICAgICAgdGhpcy51bml0c1RlbXAgPSBnZXRVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBbdW5pdHMsIHRleHRfdW5pdF90ZW1wXSA9IHRoaXMudW5pdHNUZW1wO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgLyoqXG4gICAgICog0KHQstC+0LnRgdGC0LLQviDRg9GB0YLQsNC90L7QstC60Lgg0LXQtNC40L3QuNGGINC40LfQvNC10YDQtdC90LjRjyDQtNC70Y8g0LLQuNC00LbQtdGC0L7QslxuICAgICAqIEBwYXJhbSB1bml0c1xuICAgICAqL1xuICAgIHNldCB1bml0c1RlbXAodW5pdHMpIHtcbiAgICAgICAgdGhpcy51bml0cyA9IHVuaXRzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQodCy0L7QudGB0YLQstC+INC/0L7Qu9GD0YfQtdC90LjRjyDQtdC00LjQvdC40YYg0LjQt9C80LXRgNC10L3QuNGPINC00LvRjyDQstC40LTQttC10YLQvtCyXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZ2V0IHVuaXRzVGVtcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudW5pdHM7XG4gICAgfVxuXG4gICAgdmFsaWRhdGlvbkFQSWtleSgpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRpb25BUEkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLyogVE9ETyBCeWtvdiBELlMuXG4gICAgICAgICog0J3QsCDQtNCw0L3QvdGL0Lkg0LzQvtC80LXQvdGCINGA0LDQsdC+0YLQsCDRgtC+0LvRjNC60L4gaHR0cCDQv9GA0L7RgtC+0LrQvtC70L7QvFxuICAgICAgICAqINC/0L7RgdC70LUg0YDQtdCw0LvQuNC30LDRhtC40Lgg0LrRgNC+0YHRgdC/0YDQvtGC0L7QutC+0LvRjNC90L7QuSDRgNC10LDQu9C40LfQsNGG0LjQuFxuICAgICAgICAqINGD0YHRgtCw0L3QvtCy0LjRgtGMINC/0YDQvtGC0L7QutC+0LvQvtC30LDQstC40YHQuNC80YvQuSBVUkxcbiAgICAgICAgKiAqL1xuICAgICAgICBsZXQgdXJsID0gYC8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93aWRnZXRzL2ZvcmVjYXN0P2lkPTUyNDkwMSZ1bml0cz0ke3RoaXMudW5pdHNUZW1wWzBdfSZjbnQ9OCZhcHBpZD0ke3RoaXMuY29udHJvbHNXaWRnZXQuYXBpS2V5LnZhbHVlfWA7XG4gICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5pbm5lclRleHQgPSAnVmFsaWRhdGlvbiBhY2NlcHQnO1xuICAgICAgICAgICAgICAgIHRoYXQuY29udHJvbHNXaWRnZXQuZXJyb3JLZXkuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0LWZvcm0tLWdvb2QnKTtcbiAgICAgICAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1lcnJvcicpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmlubmVyVGV4dCA9ICdWYWxpZGF0aW9uIGVycm9yJztcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1nb29kJyk7XG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QuYWRkKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcbiAgICAgICAgfTtcblxuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKGDQntGI0LjQsdC60LAg0LLQsNC70LjQtNCw0YbQuNC4ICR7ZX1gKTtcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmlubmVyVGV4dCA9ICdWYWxpZGF0aW9uIGVycm9yJztcbiAgICAgICAgICB0aGF0LmNvbnRyb2xzV2lkZ2V0LmVycm9yS2V5LmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldC1mb3JtLS1nb29kJyk7XG4gICAgICAgICAgdGhhdC5jb250cm9sc1dpZGdldC5lcnJvcktleS5jbGFzc0xpc3QuYWRkKCd3aWRnZXQtZm9ybS0tZXJyb3InKTtcbiAgICAgICAgfVxuXG4gICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCA9IHZhbGlkYXRpb25BUEkuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jb250cm9sc1dpZGdldC5hcGlLZXkuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJyx0aGlzLmJvdW5kVmFsaWRhdGlvbk1ldGhvZCk7XG4gICAgICAgIC8vdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuYm91bmRWYWxpZGF0aW9uTWV0aG9kKTtcbiAgICB9XG5cbiAgICBnZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQoaWQpIHtcbiAgICAgIGNvbnN0IGFwcGlkID0gdGhpcy5wYXJhbXNXaWRnZXQuYXBwaWQ7XG4gICAgICBpZihpZCAmJiAodGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkIHx8IHRoaXMucGFyYW1zV2lkZ2V0LmNpdHlOYW1lKSkge1xuICAgICAgICAgIGxldCBjb2RlID0gJyc7XG4gICAgICAgICAgaWYocGFyc2VJbnQoaWQpID09PSAxIHx8IHBhcnNlSW50KGlkKSA9PT0gMTEgfHwgcGFyc2VJbnQoaWQpID09PSAyMSB8fCBwYXJzZUludChpZCkgPT09IDMxKSB7XG4gICAgICAgICAgICAgIGNvZGUgPSBgPHNjcmlwdCBzcmM9JyR7dGhpcy5iYXNlVVJMfS9qcy9kMy5taW4uanMnPjwvc2NyaXB0PmA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGNvZGVXaWRnZXQgPSBgPGRpdiBpZD1cIm9wZW53ZWF0aGVybWFwLXdpZGdldC0ke2lkfVwiPjwvZGl2PlxcclxcbiR7Y29kZX0keyhgPHNjcmlwdD53aW5kb3cubXlXaWRnZXRQYXJhbSA/IHdpbmRvdy5teVdpZGdldFBhcmFtIDogd2luZG93Lm15V2lkZ2V0UGFyYW0gPSBbXTtcbiAgICAgICAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiAke2lkfSxcbiAgICAgICAgICAgICAgICBjaXR5aWQ6ICcke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0nLFxuICAgICAgICAgICAgICAgIGFwcGlkOiAnJHthcHBpZH0nLFxuICAgICAgICAgICAgICAgIHVuaXRzOiAnJHt0aGlzLnBhcmFtc1dpZGdldC51bml0c30nLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LSR7aWR9JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSBcIiR7dGhpcy5iYXNlVVJMfS9qcy93ZWF0aGVyLXdpZGdldC1nZW5lcmF0b3IuanNcIjtcbiAgICAgICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgICAgICAgICBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgcyk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIDwvc2NyaXB0PmApLnJlcGxhY2UoL1tcXHJcXG5dIHwgW1xcc10gL2csJycpfWA7XG4gICAgICAgICAgcmV0dXJuIGNvZGVXaWRnZXQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICBzZXRJbml0aWFsU3RhdGVGb3JtKGNpdHlJZD0yNjQzNzQzLCBjaXR5TmFtZT0nTG9uZG9uJykge1xuXG4gICAgICAgIHRoaXMucGFyYW1zV2lkZ2V0ID0ge1xuICAgICAgICAgICAgY2l0eUlkOiBjaXR5SWQsXG4gICAgICAgICAgICBjaXR5TmFtZTogY2l0eU5hbWUsXG4gICAgICAgICAgICBsYW5nOiAnZW4nLFxuICAgICAgICAgICAgYXBwaWQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5JykudmFsdWUsXG4gICAgICAgICAgICB1bml0czogdGhpcy51bml0c1RlbXBbMF0sXG4gICAgICAgICAgICB0ZXh0VW5pdFRlbXA6IHRoaXMudW5pdHNUZW1wWzFdLCAgLy8gMjQ4XG4gICAgICAgICAgICBiYXNlVVJMOiB0aGlzLmJhc2VVUkwsXG4gICAgICAgICAgICB1cmxEb21haW46ICcvL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vINCg0LDQsdC+0YLQsCDRgSDRhNC+0YDQvNC+0Lkg0LTQu9GPINC40L3QuNGG0LjQsNC70LhcbiAgICAgICAgdGhpcy5jaXR5TmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5LW5hbWUnKTtcbiAgICAgICAgdGhpcy5jaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJyk7XG4gICAgICAgIHRoaXMuc2VhcmNoQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY2l0eScpO1xuXG4gICAgICAgIHRoaXMudXJscyA9IHtcbiAgICAgICAgICB1cmxXZWF0aGVyQVBJOiBgJHt0aGlzLnBhcmFtc1dpZGdldC51cmxEb21haW59L2RhdGEvMi41L3dpZGdldHMvd2VhdGhlcj9pZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmNpdHlJZH0mdW5pdHM9JHt0aGlzLnBhcmFtc1dpZGdldC51bml0c30mYXBwaWQ9JHt0aGlzLnBhcmFtc1dpZGdldC5hcHBpZH1gLFxuICAgICAgICAgIHBhcmFtc1VybEZvcmVEYWlseTogYCR7dGhpcy5wYXJhbXNXaWRnZXQudXJsRG9tYWlufS9kYXRhLzIuNS93aWRnZXRzL2ZvcmVjYXN0P2lkPSR7dGhpcy5wYXJhbXNXaWRnZXQuY2l0eUlkfSZ1bml0cz0ke3RoaXMucGFyYW1zV2lkZ2V0LnVuaXRzfSZjbnQ9OCZhcHBpZD0ke3RoaXMucGFyYW1zV2lkZ2V0LmFwcGlkfWAsXG4gICAgICAgICAgd2luZFNwZWVkOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvd2luZC1zcGVlZC1kYXRhLmpzb25gLFxuICAgICAgICAgIHdpbmREaXJlY3Rpb246IGAke3RoaXMuYmFzZVVSTH0vZGF0YS93aW5kLWRpcmVjdGlvbi1kYXRhLmpzb25gLFxuICAgICAgICAgIGNsb3VkczogYCR7dGhpcy5iYXNlVVJMfS9kYXRhL2Nsb3Vkcy1kYXRhLmpzb25gLFxuICAgICAgICAgIG5hdHVyYWxQaGVub21lbm9uOiBgJHt0aGlzLmJhc2VVUkx9L2RhdGEvbmF0dXJhbC1waGVub21lbm9uLWRhdGEuanNvbmAsXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IEdlbmVyYXRvcldpZGdldCBmcm9tICcuL2dlbmVyYXRvci13aWRnZXQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9wdXAge1xyXG5cclxuICBjb25zdHJ1Y3RvcihjaXR5SWQsIGNpdHlOYW1lLCBhcHBpZCkge1xyXG5cclxuICAgIHRoaXMuY2l0eUlkUHJvcHMgPSBjaXR5SWQ7XHJcbiAgICB0aGlzLmNpdHlOYW1lUHJvcHMgPSBjaXR5TmFtZTtcclxuXHJcbiAgICB0aGlzLmdlbmVyYXRlV2lkZ2V0ID0gbmV3IEdlbmVyYXRvcldpZGdldCgpO1xyXG4gICAgdGhpcy5nZW5lcmF0ZVdpZGdldC5kZWZhdWx0QXBwSWRQcm9wcyA9IGFwcGlkO1xyXG4gICAgdGhpcy5mb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZybS1sYW5kaW5nLXdpZGdldCcpO1xyXG4gICAgdGhpcy5wb3B1cCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cCcpO1xyXG4gICAgdGhpcy5wb3B1cFRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLXRpdGxlJyk7XHJcbiAgICB0aGlzLnBvcHVwU2hhZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvcHVwLXNoYWRvdycpO1xyXG4gICAgdGhpcy5wb3B1cENsb3NlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcHVwLWNsb3NlJyk7XHJcbiAgICB0aGlzLmNvbnRlbnRKU0dlbmVyYXRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtY29kZS1nZW5lcmF0ZScpO1xyXG4gICAgdGhpcy5jb3B5Q29udGVudEpTQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3B5LWpzLWNvZGUnKTtcclxuICAgIHRoaXMuYXBpS2V5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwaS1rZXknKTtcclxuXHJcbiAgICB0aGlzLnBvcHVwU2hvdyA9IHRoaXMucG9wdXBTaG93LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmV2ZW50UG9wdXBDbG9zZSA9IHRoaXMuZXZlbnRQb3B1cENsb3NlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmV2ZW50Q29weUNvbnRlbnRKU0NvZGUgPSB0aGlzLmV2ZW50Q29weUNvbnRlbnRKU0NvZGUuYmluZCh0aGlzKTtcclxuICAgIC8vINCk0LjQutGB0LjRgNGD0LXQvCDQutC70LjQutC4INC90LAg0YTQvtGA0LzQtSwg0Lgg0L7RgtC60YDRi9Cy0LDQtdC8IHBvcHVwINC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60L3QvtC/0LrRg1xyXG4gICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5wb3B1cFNob3cpO1xyXG4gICAgLy8g0JfQsNC60YDRi9Cy0LDQtdC8INC+0LrQvdC+INC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwINC60YDQtdGB0YLQuNC6XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZXZlbnRQb3B1cENsb3NlKTtcclxuICAgIC8vINCa0L7Qv9C40YDQvtCy0LDQvdC40LUg0LIg0LHRg9GE0LXRgCDQvtCx0LzQtdC90LAgSlMg0LrQvtC00LBcclxuICAgIHRoaXMuY29weUNvbnRlbnRKU0NvZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmV2ZW50Q29weUNvbnRlbnRKU0NvZGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogW2NpdHlJZFByb3BzIGRlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIGdldCBjaXR5SWRQcm9wcygpIHtcclxuICAgIHJldHVybiB0aGlzLmNpdHlJZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFtjaXR5SWRQcm9wcyBkZXNjcmlwdGlvbl1cclxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGNpdHlJZCBbZGVzY3JpcHRpb25dXHJcbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIHNldCBjaXR5SWRQcm9wcyhjaXR5SWQpIHtcclxuICAgIHRoaXMuY2l0eUlkID0gY2l0eUlkO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogW2NpdHlOYW1lUHJvcHMgZGVzY3JpcHRpb25dXHJcbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXHJcbiAgICovXHJcbiAgZ2V0IGNpdHlOYW1lUHJvcHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jaXR5TmFtZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFtjaXR5TmFtZVByb3BzIGRlc2NyaXB0aW9uXVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gY2l0eU5hbWUgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIHNldCBjaXR5TmFtZVByb3BzKGNpdHlOYW1lKSB7XHJcbiAgICB0aGlzLmNpdHlOYW1lID0gY2l0eU5hbWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBbcG9wdXBTaG93INC80LXRgtC+0LQg0L7RgtC60YDRi9GC0LjRjyDQv9C+0L/QsNC/INC+0LrQvdCwXVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZXZlbnQgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIHBvcHVwU2hvdyhldmVudCkge1xyXG4gICAgbGV0IGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBhcGlLZXkgPSB0aGlzLmFwaUtleS52YWx1ZTtcclxuICAgIGlmKGVsZW1lbnQuaWQgJiYgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbnRhaW5lci1jdXN0b20tY2FyZF9fYnRuJykpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHJhZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0W2NsYXNzPSdjaXR5LWxpc3RfX3JhZGlvJ106Y2hlY2tlZFwiKTtcclxuICAgICAgICBpZiAoIXJhZGlvKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghYXBpS2V5IHx8IGFwaUtleSA9PT0gdGhpcy5nZW5lcmF0ZVdpZGdldC5kZWZhdWx0QXBwSWRQcm9wcykge1xyXG4gICAgICAgICAgY29uc3QgdGl0bGUgPSBgSW1wb3J0YW50ISBZb3UgbmVlZCB0b1xyXG4gICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9ob21lLm9wZW53ZWF0aGVybWFwLm9yZy9cIiB0YXJnZXQ9XCJfYmxhbmtcIj4gZ2V0IEFQSSBrZXkgPC9hPmA7XHJcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgdGhpcy5wb3B1cFRpdGxlLmlubmVySFRNTCA9IHRpdGxlO1xyXG4gICAgICAgICAgdGhpcy5jb250ZW50SlNHZW5lcmF0aW9uLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICB0aGlzLmNvcHlDb250ZW50SlNDb2RlLmlubmVySFRNTCA9IGA8aSBjbGFzcz1cImZhIGZhLXdpbmRvdy1jbG9zZS1vXCI+PC9pPiBDbG9zZWA7XHJcbiAgICAgICAgICB0aGlzLnBvcHVwV29ya0xvZ2ljKHRoaXMucG9wdXApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCB0aXRsZSA9ICdHZXQgYSBjb2RlIGZvciBwb3N0aW5nIGEgd2VhdGhlciBmb3JlY2FzdCB3aWRnZXQgb24geW91ciBzaXRlLic7XHJcbiAgICAgICAgICB0aGlzLnBvcHVwVGl0bGUudGV4dENvbnRlbnQgPSB0aXRsZTtcclxuICAgICAgICAgIHRoaXMuY29weUNvbnRlbnRKU0NvZGUuaW5uZXJIVE1MID0gYDxpIGNsYXNzPVwiZmEgZmEtY2xvbmVcIj48L2k+IENvcHkgaW4gYnVmZmVyYDtcclxuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVXaWRnZXQuc2V0SW5pdGlhbFN0YXRlRm9ybShyYWRpby5pZCwgcmFkaW8udmFsdWUpO1xyXG4gICAgICAgICAgdGhpcy5jb250ZW50SlNHZW5lcmF0aW9uLnZhbHVlID0gdGhpcy5nZW5lcmF0ZVdpZGdldC5nZXRDb2RlRm9yR2VuZXJhdGVXaWRnZXQodGhpcy5nZW5lcmF0ZVdpZGdldC5tYXBXaWRnZXRzKGVsZW1lbnQuaWQpWydpZCddKTtcclxuICAgICAgICAgIHRoaXMucG9wdXBXb3JrTG9naWModGhpcy5wb3B1cCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogW3BvcHVwV29ya0xvZ2ljINCb0L7Qs9C40LrQsCDRgNCw0LHQvtGC0Ysg0YEg0L/QvtC/0LDQvyDQvtC60L3QvtC8XVxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcG9wdXAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gICAqL1xyXG4gIHBvcHVwV29ya0xvZ2ljKHBvcHVwKSB7XHJcbiAgICBpZighcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cC0tdmlzaWJsZScpKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKCdwb3B1cC0tdmlzaWJsZScpO1xyXG4gICAgdGhpcy5wb3B1cFNoYWRvdy5jbGFzc0xpc3QuYWRkKCdwb3B1cC1zaGFkb3ctLXZpc2libGUnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV2ZW50UG9wdXBDbG9zZShldmVudCl7XHJcbiAgICAgIHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICBpZigoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cENsb3NlJykgfHwgZWxlbWVudCA9PT0gcG9wdXApXHJcbiAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb250YWluZXItY3VzdG9tLWNhcmRfX2J0bicpXHJcbiAgICAgICAgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9fdGl0bGUnKVxyXG4gICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2l0ZW1zJylcclxuICAgICAgICAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BvcHVwX19sYXlvdXQnKVxyXG4gICAgICAgICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncG9wdXBfX2J0bicpKSB7XHJcbiAgICAgICAgdGhpcy5wb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tdmlzaWJsZScpO1xyXG4gICAgICAgIHRoaXMucG9wdXBTaGFkb3cuY2xhc3NMaXN0LnJlbW92ZSgncG9wdXAtc2hhZG93LS12aXNpYmxlJyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV2ZW50Q29weUNvbnRlbnRKU0NvZGUoZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy5jb250ZW50SlNHZW5lcmF0aW9uLnNlbGVjdCgpO1xyXG5cclxuICAgICAgdHJ5e1xyXG4gICAgICAgICAgY29uc3QgdHh0Q29weSA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XHJcbiAgICAgICAgICB2YXIgbXNnID0gdHh0Q29weSA/ICdzdWNjZXNzZnVsJyA6ICd1bnN1Y2Nlc3NmdWwnO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0NvcHkgZW1haWwgY29tbWFuZCB3YXMgJyArIG1zZyk7XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2goZSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhg0J7RiNC40LHQutCwINC60L7Qv9C40YDQvtCy0LDQvdC40Y8gJHtlLmVyckxvZ1RvQ29uc29sZX1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5wb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdwb3B1cC0tdmlzaWJsZScpO1xyXG4gICAgICB0aGlzLnBvcHVwU2hhZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3BvcHVwLXNoYWRvdy0tdmlzaWJsZScpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xyXG4gICAgICB0aGlzLmNvcHlDb250ZW50SlNDb2RlLmRpc2FibGVkID0gIWRvY3VtZW50LnF1ZXJ5Q29tbWFuZFN1cHBvcnRlZCgnY29weScpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW5kZXJXaWRnZXRzIChjaXR5SWQsIGFwcGlkLCBiYXNlRG9tYWluLCB0eXBlQWN0aXZlID0gJ3dpZGdldC1icm93bicsIHVuaXRzID0gJ21ldHJpYycpIHtcbiAgd2luZG93Lm15V2lkZ2V0UGFyYW0gPSBbXTtcbiAgY29uc3QgYmFzZVVSTCA9IGAvLyR7YmFzZURvbWFpbn0vdGhlbWVzL29wZW53ZWF0aGVybWFwL2Fzc2V0cy92ZW5kb3Ivb3dtYDtcbiAgY29uc3Qgd2lkZ2V0QnJvd25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2lkZ2V0LWJyb3duLWNvbnRhaW5lcicpO1xuICBjb25zdCB3aWRnZXRCbHVlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpZGdldC1ibHVlLWNvbnRhaW5lcicpO1xuICBjb25zdCB3aWRnZXRHcmF5Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpZGdldC1ncmF5LWNvbnRhaW5lcicpO1xuICB3aWRnZXRCcm93bkNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCd3aWRnZXRfX2xheW91dC0tdmlzaWJsZScpO1xuICB3aWRnZXRCbHVlQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3dpZGdldF9fbGF5b3V0LS12aXNpYmxlJyk7XG4gIHdpZGdldEdyYXlDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnd2lkZ2V0X19sYXlvdXQtLXZpc2libGUnKTtcbiAgY29uc3Qgc2NoZW1hID0gJ2Rhc2hib2FyZCc7XG4gIGlmICh0eXBlQWN0aXZlID09PSAnd2lkZ2V0LWJyb3duJykge1xuICAgIHdpZGdldEJyb3duQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3dpZGdldF9fbGF5b3V0LS12aXNpYmxlJyk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTEsXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTExJyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTIsXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTEyJyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTMsXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTEzJyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTQsXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE0JyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTUsXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE1JyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTYsXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE2JyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTcsXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE3JyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTgsXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE4JyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICBpZDogMTksXG4gICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTE5JyxcbiAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZUFjdGl2ZSA9PT0gJ3dpZGdldC1ibHVlJykge1xuICAgICAgd2lkZ2V0Qmx1ZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd3aWRnZXRfX2xheW91dC0tdmlzaWJsZScpO1xuICAgICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICAgIGlkOiAxLFxuICAgICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgICAgYXBwaWQ6IGFwcGlkLFxuICAgICAgICB1bml0czogdW5pdHMsXG4gICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTEnLFxuICAgICAgICBzY2hlbWE6IHNjaGVtYVxuICAgICAgfSk7XG4gICAgICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcbiAgICAgICAgaWQ6IDIsXG4gICAgICAgIGNpdHlpZDogY2l0eUlkLFxuICAgICAgICBhcHBpZDogYXBwaWQsXG4gICAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMicsXG4gICAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xuICAgICAgICBpZDogMyxcbiAgICAgICAgY2l0eWlkOiBjaXR5SWQsXG4gICAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgICAgdW5pdHM6IHVuaXRzLFxuICAgICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0zJyxcbiAgICAgICAgc2NoZW1hOiBzY2hlbWFcbiAgICAgIH0pO1xuICAgICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICAgIGlkOiA0LFxuICAgICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgICAgYXBwaWQ6IGFwcGlkLFxuICAgICAgICB1bml0czogdW5pdHMsXG4gICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTQnLFxuICAgICAgICBzY2hlbWE6IHNjaGVtYVxuICAgICAgfSk7XG4gICAgICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcbiAgICAgICAgaWQ6IDUsXG4gICAgICAgIGNpdHlpZDogY2l0eUlkLFxuICAgICAgICBhcHBpZDogYXBwaWQsXG4gICAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtNScsXG4gICAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xuICAgICAgICBpZDogNixcbiAgICAgICAgY2l0eWlkOiBjaXR5SWQsXG4gICAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgICAgdW5pdHM6IHVuaXRzLFxuICAgICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC02JyxcbiAgICAgICAgc2NoZW1hOiBzY2hlbWFcbiAgICAgIH0pO1xuICAgICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICAgIGlkOiA3LFxuICAgICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgICAgYXBwaWQ6IGFwcGlkLFxuICAgICAgICB1bml0czogdW5pdHMsXG4gICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTcnLFxuICAgICAgICBzY2hlbWE6IHNjaGVtYVxuICAgICAgfSk7XG4gICAgICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcbiAgICAgICAgaWQ6IDgsXG4gICAgICAgIGNpdHlpZDogY2l0eUlkLFxuICAgICAgICBhcHBpZDogYXBwaWQsXG4gICAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtOCcsXG4gICAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xuICAgICAgICBpZDogOSxcbiAgICAgICAgY2l0eWlkOiBjaXR5SWQsXG4gICAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgICAgdW5pdHM6IHVuaXRzLFxuICAgICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC05JyxcbiAgICAgICAgc2NoZW1hOiBzY2hlbWFcbiAgICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVBY3RpdmUgPT09ICd3aWRnZXQtZ3JheScpIHtcbiAgICAgIHdpZGdldEdyYXlDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnd2lkZ2V0X19sYXlvdXQtLXZpc2libGUnKTtcbiAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xuICAgICAgICBpZDogMjEsXG4gICAgICAgIGNpdHlpZDogY2l0eUlkLFxuICAgICAgICBhcHBpZDogYXBwaWQsXG4gICAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMjEnLFxuICAgICAgICBzY2hlbWE6IHNjaGVtYVxuICAgICAgfSk7XG4gICAgICB3aW5kb3cubXlXaWRnZXRQYXJhbS5wdXNoKHtcbiAgICAgICAgaWQ6IDIyLFxuICAgICAgICBjaXR5aWQ6IGNpdHlJZCxcbiAgICAgICAgYXBwaWQ6IGFwcGlkLFxuICAgICAgICB1bml0czogdW5pdHMsXG4gICAgICAgIGNvbnRhaW5lcmlkOiAnb3BlbndlYXRoZXJtYXAtd2lkZ2V0LTIyJyxcbiAgICAgICAgc2NoZW1hOiBzY2hlbWFcbiAgICAgIH0pO1xuICAgICAgd2luZG93Lm15V2lkZ2V0UGFyYW0ucHVzaCh7XG4gICAgICAgIGlkOiAyMyxcbiAgICAgICAgY2l0eWlkOiBjaXR5SWQsXG4gICAgICAgIGFwcGlkOiBhcHBpZCxcbiAgICAgICAgdW5pdHM6IHVuaXRzLFxuICAgICAgICBjb250YWluZXJpZDogJ29wZW53ZWF0aGVybWFwLXdpZGdldC0yMycsXG4gICAgICAgIHNjaGVtYTogc2NoZW1hXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5teVdpZGdldFBhcmFtLnB1c2goe1xuICAgICAgICBpZDogMjQsXG4gICAgICAgIGNpdHlpZDogY2l0eUlkLFxuICAgICAgICBhcHBpZDogYXBwaWQsXG4gICAgICAgIHVuaXRzOiB1bml0cyxcbiAgICAgICAgY29udGFpbmVyaWQ6ICdvcGVud2VhdGhlcm1hcC13aWRnZXQtMjQnLFxuICAgICAgICBzY2hlbWE6IHNjaGVtYVxuICAgICAgfSk7XG4gIH1cbiAgY29uc3Qgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JpcHRzJyk7XG4gIGlmIChzY3JpcHRzKSB7XG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICBzY3JpcHQuc3JjID0gYCR7YmFzZVVSTH0vanMvd2VhdGhlci13aWRnZXQtZ2VuZXJhdG9yLmpzYDtcbiAgICBzY3JpcHRzLnRleHRDb250ZW50ID0gJyc7XG4gICAgc2NyaXB0cy5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8g0JzQvtC00YPQu9GMINC00LjRgdC/0LXRgtGH0LXRgCDQtNC70Y8g0L7RgtGA0LjRgdC+0LLQutC4INCx0LDQvdC90LXRgNGA0L7QsiDQvdCwINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQtVxuaW1wb3J0IENpdGllcyBmcm9tICcuL2NpdGllcyc7XG5pbXBvcnQgUG9wdXAgZnJvbSAnLi9wb3B1cCc7XG5cbmNvbnN0IHNlYXJjaENpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWNpdHknKTtcbmNvbnN0IGJ0blJlbmRlcldpZGdldHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwZW5kLXNjcmlwdHMnKTtcbmNvbnN0IHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyaXB0cycpO1xuLy8g0KDQsNCx0L7RgtCwINGBINGE0L7RgNC80L7QuSDQtNC70Y8g0LjQvdC40YbQuNCw0LvQuFxuY29uc3QgY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XG5jb25zdCBjaXRpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0aWVzJyk7XG5jb25zdCBhcHBpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcGkta2V5Jyk7XG5cbi8v0L/RgNC+0LLQtdGA0Y/QtdC8INCw0LrRgtC40LLQvdGD0Y4g0LLQutC70LDQtNC60YNcbmNvbnN0IHdpZGdldENob29zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aWRnZXQtY2hvb3NlJyk7XG5jb25zdCB3aWRnZXRUeXBlQWN0aXZlID0gd2lkZ2V0Q2hvb3NlLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXTpjaGVja2VkJyk7XG5cbi8vINCg0LDQsdC+0YLQsNC10YIg0YEgbG9jYWxTdG9yYWdlINGBINC60LvRjtGH0LjQutC+0LxcbmNvbnN0IGFwcGlkRnJvbUxTID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FwcGlkJyk7XG5pZiAoYXBwaWRGcm9tTFMgJiYgYXBwaWQpIHtcbiAgYXBwaWQudmFsdWUgPSBhcHBpZEZyb21MUztcbn1cblxuY29uc3QgcGFyYW1zID0ge1xuICBjaXR5SWQ6IDI2NDM3NDMsXG4gIGNpdHlOYW1lOiBjaXR5TmFtZS52YWx1ZSxcbiAgd2lkZ2V0VHlwZUFjdGl2ZTogd2lkZ2V0VHlwZUFjdGl2ZS5pZCxcbiAgY29udGFpbmVyOiBjaXRpZXMsXG4gIGFwcGlkOiAnYjY5MDdkMjg5ZTEwZDcxNGE2ZTg4YjMwNzYxZmFlMjInLFxuICBhcHBpZFVzZXI6IGFwcGlkID8gYXBwaWQudmFsdWUgOiAnJyxcbiAgYmFzZURvbWFpbjogZG9jdW1lbnQubG9jYXRpb24uaG9zdG5hbWUgPT09ICdvcGVud2VhdGhlcm1hcC5waGFzZS5vd20uaW8nID9cbiAgJ29wZW53ZWF0aGVybWFwLnBoYXNlLm93bS5pbycgOiAnb3BlbndlYXRoZXJtYXAub3JnJyxcbn07XG5cbmNvbnN0IHBvcHVwID0gbmV3IFBvcHVwKHBhcmFtcy5jaXR5SWQsIHBhcmFtcy5jaXR5TmFtZSwgcGFyYW1zLmFwcGlkKTtcbndpZGdldENob29zZW4gPSB3aWRnZXRDaG9vc2VuLmJpbmQodGhpcyk7XG4vLyDQv9GA0L7RgdC70YPRiNC40LLQsNC90LjQtSDRgdC+0LHRi9GC0LjQuSDQuNC30LzQtdC90LXQvdC40Y8g0L/QviDQvtGC0L7QsdGA0LDQttC10L3QuNGOINGC0LjQv9CwINCy0LjQtNC20LXRgtC+0LJcbndpZGdldENob29zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHdpZGdldENob29zZW4sIGZhbHNlKTtcblxuY29uc3Qgb2JqQ2l0aWVzID0gbmV3IENpdGllcyhwYXJhbXMpO1xub2JqQ2l0aWVzLmdldENpdGllcygpO1xub2JqQ2l0aWVzLnJlbmRlcldpZGdldCgpO1xuXG5zZWFyY2hDaXR5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gIHBhcmFtcy5jaXR5TmFtZSA9IGNpdHlOYW1lLnZhbHVlO1xuICBjb25zdCBvYmpDaXRpZXMgPSBuZXcgQ2l0aWVzKHBhcmFtcyk7XG4gIG9iakNpdGllcy5nZXRDaXRpZXMoKTtcbiAgLy8g0LfQsNC/0LjRgdGL0LLQsNC10Lwg0LrQu9GO0YfQuNC6INCyIGxvY2FsU3RvcmFnZVxuICBpZiAoYXBwaWQpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYXBwaWQnLCBhcHBpZC52YWx1ZSk7XG4gIH1cbn0pO1xuXG5hcHBpZC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBlID0+IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhcHBpZCcsIGUudGFyZ2V0LnZhbHVlKSk7XG5cbmZ1bmN0aW9uIHdpZGdldENob29zZW4oZXZlbnQpe1xuICBjb25zdCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICBpZiAoZWxlbWVudC5pZCkge1xuICAgIHBhcmFtcy53aWRnZXRUeXBlQWN0aXZlID0gZWxlbWVudC5pZDtcbiAgICBjb25zdCBvYmpDaXRpZXMgPSBuZXcgQ2l0aWVzKHBhcmFtcyk7XG4gICAgb2JqQ2l0aWVzLnJlbmRlcldpZGdldCgpO1xuICB9IGVsc2VcbiAgLy8gZm9yIElFIDExXG4gIGlmKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpID09PSAnd2lkZ2V0LWNob29zZV9faW1nJykge1xuICAgIGNvbnN0IGxhYmVsID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIGNvbnN0IHJhZGlvID0gbGFiZWwucXVlcnlTZWxlY3RvcignLndpZGdldC1jaG9vc2VfX3JhZGlvJyk7XG4gICAgcmFkaW8uY2hlY2tlZCA9ICdjaGVja2VkJztcbiAgICBwYXJhbXMud2lkZ2V0VHlwZUFjdGl2ZSA9IHJhZGlvLmlkO1xuICAgIGNvbnN0IG9iakNpdGllcyA9IG5ldyBDaXRpZXMocGFyYW1zKTtcbiAgICBvYmpDaXRpZXMucmVuZGVyV2lkZ2V0KCk7XG4gIH1cbn1cbiIsIi8qISBodHRwOi8vbXRocy5iZS9mcm9tY29kZXBvaW50IHYwLjIuMSBieSBAbWF0aGlhcyAqL1xuaWYgKCFTdHJpbmcuZnJvbUNvZGVQb2ludCkge1xuXHQoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gSUUgOCBvbmx5IHN1cHBvcnRzIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG9uIERPTSBlbGVtZW50c1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIG9iamVjdCA9IHt9O1xuXHRcdFx0XHR2YXIgJGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gJGRlZmluZVByb3BlcnR5KG9iamVjdCwgb2JqZWN0LCBvYmplY3QpICYmICRkZWZpbmVQcm9wZXJ0eTtcblx0XHRcdH0gY2F0Y2goZXJyb3IpIHt9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0oKSk7XG5cdFx0dmFyIHN0cmluZ0Zyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5cdFx0dmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblx0XHR2YXIgZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uKF8pIHtcblx0XHRcdHZhciBNQVhfU0laRSA9IDB4NDAwMDtcblx0XHRcdHZhciBjb2RlVW5pdHMgPSBbXTtcblx0XHRcdHZhciBoaWdoU3Vycm9nYXRlO1xuXHRcdFx0dmFyIGxvd1N1cnJvZ2F0ZTtcblx0XHRcdHZhciBpbmRleCA9IC0xO1xuXHRcdFx0dmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdFx0XHRpZiAoIWxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmVzdWx0ID0gJyc7XG5cdFx0XHR3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuXHRcdFx0XHR2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0IWlzRmluaXRlKGNvZGVQb2ludCkgfHwgLy8gYE5hTmAsIGArSW5maW5pdHlgLCBvciBgLUluZmluaXR5YFxuXHRcdFx0XHRcdGNvZGVQb2ludCA8IDAgfHwgLy8gbm90IGEgdmFsaWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHRcdFx0Y29kZVBvaW50ID4gMHgxMEZGRkYgfHwgLy8gbm90IGEgdmFsaWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHRcdFx0Zmxvb3IoY29kZVBvaW50KSAhPSBjb2RlUG9pbnQgLy8gbm90IGFuIGludGVnZXJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0dGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCBjb2RlIHBvaW50OiAnICsgY29kZVBvaW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY29kZVBvaW50IDw9IDB4RkZGRikgeyAvLyBCTVAgY29kZSBwb2ludFxuXHRcdFx0XHRcdGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG5cdFx0XHRcdH0gZWxzZSB7IC8vIEFzdHJhbCBjb2RlIHBvaW50OyBzcGxpdCBpbiBzdXJyb2dhdGUgaGFsdmVzXG5cdFx0XHRcdFx0Ly8gaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcblx0XHRcdFx0XHRjb2RlUG9pbnQgLT0gMHgxMDAwMDtcblx0XHRcdFx0XHRoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDA7XG5cdFx0XHRcdFx0bG93U3Vycm9nYXRlID0gKGNvZGVQb2ludCAlIDB4NDAwKSArIDB4REMwMDtcblx0XHRcdFx0XHRjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChpbmRleCArIDEgPT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xuXHRcdFx0XHRcdHJlc3VsdCArPSBzdHJpbmdGcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcblx0XHRcdFx0XHRjb2RlVW5pdHMubGVuZ3RoID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChkZWZpbmVQcm9wZXJ0eSkge1xuXHRcdFx0ZGVmaW5lUHJvcGVydHkoU3RyaW5nLCAnZnJvbUNvZGVQb2ludCcsIHtcblx0XHRcdFx0J3ZhbHVlJzogZnJvbUNvZGVQb2ludCxcblx0XHRcdFx0J2NvbmZpZ3VyYWJsZSc6IHRydWUsXG5cdFx0XHRcdCd3cml0YWJsZSc6IHRydWVcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRTdHJpbmcuZnJvbUNvZGVQb2ludCA9IGZyb21Db2RlUG9pbnQ7XG5cdFx0fVxuXHR9KCkpO1xufVxuIiwiLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3N0ZWZhbnBlbm5lci9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICB2NC4yLjgrMWU2OGRjZTZcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuRVM2UHJvbWlzZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHg7XG4gIHJldHVybiB4ICE9PSBudWxsICYmICh0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnZnVuY3Rpb24nKTtcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuXG5cbnZhciBfaXNBcnJheSA9IHZvaWQgMDtcbmlmIChBcnJheS5pc0FycmF5KSB7XG4gIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbn0gZWxzZSB7XG4gIF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xufVxuXG52YXIgaXNBcnJheSA9IF9pc0FycmF5O1xuXG52YXIgbGVuID0gMDtcbnZhciB2ZXJ0eE5leHQgPSB2b2lkIDA7XG52YXIgY3VzdG9tU2NoZWR1bGVyRm4gPSB2b2lkIDA7XG5cbnZhciBhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gIHF1ZXVlW2xlbl0gPSBjYWxsYmFjaztcbiAgcXVldWVbbGVuICsgMV0gPSBhcmc7XG4gIGxlbiArPSAyO1xuICBpZiAobGVuID09PSAyKSB7XG4gICAgLy8gSWYgbGVuIGlzIDIsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIGlmIChjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgY3VzdG9tU2NoZWR1bGVyRm4oZmx1c2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBzZXRTY2hlZHVsZXIoc2NoZWR1bGVGbikge1xuICBjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG59XG5cbmZ1bmN0aW9uIHNldEFzYXAoYXNhcEZuKSB7XG4gIGFzYXAgPSBhc2FwRm47XG59XG5cbnZhciBicm93c2VyV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG52YXIgYnJvd3Nlckdsb2JhbCA9IGJyb3dzZXJXaW5kb3cgfHwge307XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4vLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxudmFyIGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuLy8gbm9kZVxuZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1am9qcy93aGVuL2lzc3Vlcy80MTAgZm9yIGRldGFpbHNcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG59XG5cbi8vIHZlcnR4XG5mdW5jdGlvbiB1c2VWZXJ0eFRpbWVyKCkge1xuICBpZiAodHlwZW9mIHZlcnR4TmV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmVydHhOZXh0KGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbn1cblxuZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBub2RlLmRhdGEgPSBpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMjtcbiAgfTtcbn1cblxuLy8gd2ViIHdvcmtlclxuZnVuY3Rpb24gdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIGVzNi1wcm9taXNlIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuICAvLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbiAgdmFyIGdsb2JhbFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnbG9iYWxTZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgfTtcbn1cblxudmFyIHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBxdWV1ZVtpXTtcbiAgICB2YXIgYXJnID0gcXVldWVbaSArIDFdO1xuXG4gICAgY2FsbGJhY2soYXJnKTtcblxuICAgIHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgIHF1ZXVlW2kgKyAxXSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGxlbiA9IDA7XG59XG5cbmZ1bmN0aW9uIGF0dGVtcHRWZXJ0eCgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdmVydHggPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpLnJlcXVpcmUoJ3ZlcnR4Jyk7XG4gICAgdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICByZXR1cm4gdXNlVmVydHhUaW1lcigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbiAgfVxufVxuXG52YXIgc2NoZWR1bGVGbHVzaCA9IHZvaWQgMDtcbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAoaXNOb2RlKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xufSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xufSBlbHNlIGlmIChpc1dvcmtlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbn0gZWxzZSBpZiAoYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSBhdHRlbXB0VmVydHgoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIHBhcmVudCA9IHRoaXM7XG5cbiAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKGNoaWxkW1BST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcbiAgICBtYWtlUHJvbWlzZShjaGlsZCk7XG4gIH1cblxuICB2YXIgX3N0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuXG4gIGlmIChfc3RhdGUpIHtcbiAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbX3N0YXRlIC0gMV07XG4gICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaW52b2tlQ2FsbGJhY2soX3N0YXRlLCBjaGlsZCwgY2FsbGJhY2ssIHBhcmVudC5fcmVzdWx0KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG4vKipcbiAgYFByb21pc2UucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZXNvbHZlZCB3aXRoIHRoZVxuICBwYXNzZWQgYHZhbHVlYC4gSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSB2YWx1ZSB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aFxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZSQxKG9iamVjdCkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgcmVzb2x2ZShwcm9taXNlLCBvYmplY3QpO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxudmFyIFBST01JU0VfSUQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMik7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG52YXIgUEVORElORyA9IHZvaWQgMDtcbnZhciBGVUxGSUxMRUQgPSAxO1xudmFyIFJFSkVDVEVEID0gMjtcblxuZnVuY3Rpb24gc2VsZkZ1bGZpbGxtZW50KCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XG59XG5cbmZ1bmN0aW9uIGNhbm5vdFJldHVybk93bigpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbn1cblxuZnVuY3Rpb24gdHJ5VGhlbih0aGVuJCQxLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gIHRyeSB7XG4gICAgdGhlbiQkMS5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuJCQxKSB7XG4gIGFzYXAoZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgdmFyIGVycm9yID0gdHJ5VGhlbih0aGVuJCQxLCB0aGVuYWJsZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH1cbiAgfSwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IEZVTEZJTExFRCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgIHJlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkMSkge1xuICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3RvciAmJiB0aGVuJCQxID09PSB0aGVuICYmIG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gcmVzb2x2ZSQxKSB7XG4gICAgaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoZW4kJDEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odGhlbiQkMSkpIHtcbiAgICAgIGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICByZWplY3QocHJvbWlzZSwgc2VsZkZ1bGZpbGxtZW50KCkpO1xuICB9IGVsc2UgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIHRoZW4kJDEgPSB2b2lkIDA7XG4gICAgdHJ5IHtcbiAgICAgIHRoZW4kJDEgPSB2YWx1ZS50aGVuO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCB0aGVuJCQxKTtcbiAgfSBlbHNlIHtcbiAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgaWYgKHByb21pc2UuX29uZXJyb3IpIHtcbiAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gIH1cblxuICBwdWJsaXNoKHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHByb21pc2UuX3Jlc3VsdCA9IHZhbHVlO1xuICBwcm9taXNlLl9zdGF0ZSA9IEZVTEZJTExFRDtcblxuICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwcm9taXNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgYXNhcChwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICB2YXIgbGVuZ3RoID0gX3N1YnNjcmliZXJzLmxlbmd0aDtcblxuXG4gIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgX3N1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdID0gb25SZWplY3Rpb247XG5cbiAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwYXJlbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdm9pZCAwLFxuICAgICAgY2FsbGJhY2sgPSB2b2lkIDAsXG4gICAgICBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICB9XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHZhciBoYXNDYWxsYmFjayA9IGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgdmFsdWUgPSB2b2lkIDAsXG4gICAgICBlcnJvciA9IHZvaWQgMCxcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG5cbiAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbHVlID0gY2FsbGJhY2soZGV0YWlsKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzdWNjZWVkZWQgPSBmYWxzZTtcbiAgICAgIGVycm9yID0gZTtcbiAgICB9XG5cbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIHJlamVjdChwcm9taXNlLCBjYW5ub3RSZXR1cm5Pd24oKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZGV0YWlsO1xuICB9XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgLy8gbm9vcFxuICB9IGVsc2UgaWYgKGhhc0NhbGxiYWNrICYmIHN1Y2NlZWRlZCkge1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKHN1Y2NlZWRlZCA9PT0gZmFsc2UpIHtcbiAgICByZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IEZVTEZJTExFRCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcikge1xuICB0cnkge1xuICAgIHJlc29sdmVyKGZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHZhbHVlKSB7XG4gICAgICByZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZWplY3QocHJvbWlzZSwgZSk7XG4gIH1cbn1cblxudmFyIGlkID0gMDtcbmZ1bmN0aW9uIG5leHRJZCgpIHtcbiAgcmV0dXJuIGlkKys7XG59XG5cbmZ1bmN0aW9uIG1ha2VQcm9taXNlKHByb21pc2UpIHtcbiAgcHJvbWlzZVtQUk9NSVNFX0lEXSA9IGlkKys7XG4gIHByb21pc2UuX3N0YXRlID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3N1YnNjcmliZXJzID0gW107XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvcigpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG59XG5cbnZhciBFbnVtZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCkge1xuICAgIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG5cbiAgICBpZiAoIXRoaXMucHJvbWlzZVtQUk9NSVNFX0lEXSkge1xuICAgICAgbWFrZVByb21pc2UodGhpcy5wcm9taXNlKTtcbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuXG4gICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICAgIHRoaXMuX2VudW1lcmF0ZShpbnB1dCk7XG4gICAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWplY3QodGhpcy5wcm9taXNlLCB2YWxpZGF0aW9uRXJyb3IoKSk7XG4gICAgfVxuICB9XG5cbiAgRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uIF9lbnVtZXJhdGUoaW5wdXQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IFBFTkRJTkcgJiYgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9lYWNoRW50cnkoaW5wdXRbaV0sIGkpO1xuICAgIH1cbiAgfTtcblxuICBFbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24gX2VhY2hFbnRyeShlbnRyeSwgaSkge1xuICAgIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgICB2YXIgcmVzb2x2ZSQkMSA9IGMucmVzb2x2ZTtcblxuXG4gICAgaWYgKHJlc29sdmUkJDEgPT09IHJlc29sdmUkMSkge1xuICAgICAgdmFyIF90aGVuID0gdm9pZCAwO1xuICAgICAgdmFyIGVycm9yID0gdm9pZCAwO1xuICAgICAgdmFyIGRpZEVycm9yID0gZmFsc2U7XG4gICAgICB0cnkge1xuICAgICAgICBfdGhlbiA9IGVudHJ5LnRoZW47XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRpZEVycm9yID0gdHJ1ZTtcbiAgICAgICAgZXJyb3IgPSBlO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoZW4gPT09IHRoZW4gJiYgZW50cnkuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgX3RoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG4gICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgICAgfSBlbHNlIGlmIChjID09PSBQcm9taXNlJDEpIHtcbiAgICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhub29wKTtcbiAgICAgICAgaWYgKGRpZEVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIGVudHJ5LCBfdGhlbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uIChyZXNvbHZlJCQxKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUkJDEoZW50cnkpO1xuICAgICAgICB9KSwgaSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlJCQxKGVudHJ5KSwgaSk7XG4gICAgfVxuICB9O1xuXG4gIEVudW1lcmF0b3IucHJvdG90eXBlLl9zZXR0bGVkQXQgPSBmdW5jdGlvbiBfc2V0dGxlZEF0KHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuXG5cbiAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgICAgIHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgfVxuICB9O1xuXG4gIEVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbiBfd2lsbFNldHRsZUF0KHByb21pc2UsIGkpIHtcbiAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgICBzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gRW51bWVyYXRvcjtcbn0oKTtcblxuLyoqXG4gIGBQcm9taXNlLmFsbGAgYWNjZXB0cyBhbiBhcnJheSBvZiBwcm9taXNlcywgYW5kIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaFxuICBpcyBmdWxmaWxsZWQgd2l0aCBhbiBhcnJheSBvZiBmdWxmaWxsbWVudCB2YWx1ZXMgZm9yIHRoZSBwYXNzZWQgcHJvbWlzZXMsIG9yXG4gIHJlamVjdGVkIHdpdGggdGhlIHJlYXNvbiBvZiB0aGUgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gYmUgcmVqZWN0ZWQuIEl0IGNhc3RzIGFsbFxuICBlbGVtZW50cyBvZiB0aGUgcGFzc2VkIGl0ZXJhYmxlIHRvIHByb21pc2VzIGFzIGl0IHJ1bnMgdGhpcyBhbGdvcml0aG0uXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlc29sdmUoMik7XG4gIGxldCBwcm9taXNlMyA9IHJlc29sdmUoMyk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBUaGUgYXJyYXkgaGVyZSB3b3VsZCBiZSBbIDEsIDIsIDMgXTtcbiAgfSk7XG4gIGBgYFxuXG4gIElmIGFueSBvZiB0aGUgYHByb21pc2VzYCBnaXZlbiB0byBgYWxsYCBhcmUgcmVqZWN0ZWQsIHRoZSBmaXJzdCBwcm9taXNlXG4gIHRoYXQgaXMgcmVqZWN0ZWQgd2lsbCBiZSBnaXZlbiBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmV0dXJuZWQgcHJvbWlzZXMnc1xuICByZWplY3Rpb24gaGFuZGxlci4gRm9yIGV4YW1wbGU6XG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IHJlc29sdmUoMSk7XG4gIGxldCBwcm9taXNlMiA9IHJlamVjdChuZXcgRXJyb3IoXCIyXCIpKTtcbiAgbGV0IHByb21pc2UzID0gcmVqZWN0KG5ldyBFcnJvcihcIjNcIikpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnMgYmVjYXVzZSB0aGVyZSBhcmUgcmVqZWN0ZWQgcHJvbWlzZXMhXG4gIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgLy8gZXJyb3IubWVzc2FnZSA9PT0gXCIyXCJcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgYWxsXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gZW50cmllcyBhcnJheSBvZiBwcm9taXNlc1xuICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gYWxsIGBwcm9taXNlc2AgaGF2ZSBiZWVuXG4gIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQgaWYgYW55IG9mIHRoZW0gYmVjb21lIHJlamVjdGVkLlxuICBAc3RhdGljXG4qL1xuZnVuY3Rpb24gYWxsKGVudHJpZXMpIHtcbiAgcmV0dXJuIG5ldyBFbnVtZXJhdG9yKHRoaXMsIGVudHJpZXMpLnByb21pc2U7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yYWNlYCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2ggaXMgc2V0dGxlZCBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlXG4gIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIHNldHRsZS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMicpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIHJlc3VsdCA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBpdCB3YXMgcmVzb2x2ZWQgYmVmb3JlIHByb21pc2UxXG4gICAgLy8gd2FzIHJlc29sdmVkLlxuICB9KTtcbiAgYGBgXG5cbiAgYFByb21pc2UucmFjZWAgaXMgZGV0ZXJtaW5pc3RpYyBpbiB0aGF0IG9ubHkgdGhlIHN0YXRlIG9mIHRoZSBmaXJzdFxuICBzZXR0bGVkIHByb21pc2UgbWF0dGVycy4gRm9yIGV4YW1wbGUsIGV2ZW4gaWYgb3RoZXIgcHJvbWlzZXMgZ2l2ZW4gdG8gdGhlXG4gIGBwcm9taXNlc2AgYXJyYXkgYXJndW1lbnQgYXJlIHJlc29sdmVkLCBidXQgdGhlIGZpcnN0IHNldHRsZWQgcHJvbWlzZSBoYXNcbiAgYmVjb21lIHJlamVjdGVkIGJlZm9yZSB0aGUgb3RoZXIgcHJvbWlzZXMgYmVjYW1lIGZ1bGZpbGxlZCwgdGhlIHJldHVybmVkXG4gIHByb21pc2Ugd2lsbCBiZWNvbWUgcmVqZWN0ZWQ6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcigncHJvbWlzZSAyJykpO1xuICAgIH0sIDEwMCk7XG4gIH0pO1xuXG4gIFByb21pc2UucmFjZShbcHJvbWlzZTEsIHByb21pc2UyXSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgcHJvbWlzZSAyIGJlY2FtZSByZWplY3RlZCBiZWZvcmVcbiAgICAvLyBwcm9taXNlIDEgYmVjYW1lIGZ1bGZpbGxlZFxuICB9KTtcbiAgYGBgXG5cbiAgQW4gZXhhbXBsZSByZWFsLXdvcmxkIHVzZSBjYXNlIGlzIGltcGxlbWVudGluZyB0aW1lb3V0czpcblxuICBgYGBqYXZhc2NyaXB0XG4gIFByb21pc2UucmFjZShbYWpheCgnZm9vLmpzb24nKSwgdGltZW91dCg1MDAwKV0pXG4gIGBgYFxuXG4gIEBtZXRob2QgcmFjZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IHByb21pc2VzIGFycmF5IG9mIHByb21pc2VzIHRvIG9ic2VydmVcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2Ugd2hpY2ggc2V0dGxlcyBpbiB0aGUgc2FtZSB3YXkgYXMgdGhlIGZpcnN0IHBhc3NlZFxuICBwcm9taXNlIHRvIHNldHRsZS5cbiovXG5mdW5jdGlvbiByYWNlKGVudHJpZXMpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAoIWlzQXJyYXkoZW50cmllcykpIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChfLCByZWplY3QpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gIGBQcm9taXNlLnJlamVjdGAgcmV0dXJucyBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgcGFzc2VkIGByZWFzb25gLlxuICBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgIC8vIENvZGUgaGVyZSBkb2Vzbid0IHJ1biBiZWNhdXNlIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAnV0hPT1BTJ1xuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZWplY3RcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FueX0gcmVhc29uIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBnaXZlbiBgcmVhc29uYC5cbiovXG5mdW5jdGlvbiByZWplY3QkMShyZWFzb24pIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gbmVlZHNSZXNvbHZlcigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xufVxuXG5mdW5jdGlvbiBuZWVkc05ldygpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbn1cblxuLyoqXG4gIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcbiAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gIFRlcm1pbm9sb2d5XG4gIC0tLS0tLS0tLS0tXG5cbiAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cbiAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxuICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxuICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXG4gIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cblxuICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxuICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxuXG4gIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxuICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxuICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXG4gIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgQmFzaWMgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLVxuXG4gIGBgYGpzXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgLy8gb24gc3VjY2Vzc1xuICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgLy8gb24gZmFpbHVyZVxuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIEFkdmFuY2VkIFVzYWdlOlxuICAtLS0tLS0tLS0tLS0tLS1cblxuICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gIGBYTUxIdHRwUmVxdWVzdGBzLlxuXG4gIGBgYGpzXG4gIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cblxuICBgYGBqc1xuICBQcm9taXNlLmFsbChbXG4gICAgZ2V0SlNPTignL3Bvc3RzJyksXG4gICAgZ2V0SlNPTignL2NvbW1lbnRzJylcbiAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cbiAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9KTtcbiAgYGBgXG5cbiAgQGNsYXNzIFByb21pc2VcbiAgQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZXJcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAY29uc3RydWN0b3JcbiovXG5cbnZhciBQcm9taXNlJDEgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgICB0aGlzW1BST01JU0VfSURdID0gbmV4dElkKCk7XG4gICAgdGhpcy5fcmVzdWx0ID0gdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICAgIGlmIChub29wICE9PSByZXNvbHZlcikge1xuICAgICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIG5lZWRzUmVzb2x2ZXIoKTtcbiAgICAgIHRoaXMgaW5zdGFuY2VvZiBQcm9taXNlID8gaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpIDogbmVlZHNOZXcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cbiAgIGBgYGpzXG4gIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gIH0pO1xuICBgYGBcbiAgIENoYWluaW5nXG4gIC0tLS0tLS0tXG4gICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAgYGBganNcbiAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gIH0pO1xuICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLy8gbmV2ZXIgcmVhY2hlZFxuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgfSk7XG4gIGBgYFxuICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cbiAgIGBgYGpzXG4gIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvLyBuZXZlciByZWFjaGVkXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLy8gbmV2ZXIgcmVhY2hlZFxuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgfSk7XG4gIGBgYFxuICAgQXNzaW1pbGF0aW9uXG4gIC0tLS0tLS0tLS0tLVxuICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cbiAgIGBgYGpzXG4gIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gIH0pO1xuICBgYGBcbiAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuICAgYGBganNcbiAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgfSk7XG4gIGBgYFxuICAgU2ltcGxlIEV4YW1wbGVcbiAgLS0tLS0tLS0tLS0tLS1cbiAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgIGBgYGphdmFzY3JpcHRcbiAgbGV0IHJlc3VsdDtcbiAgIHRyeSB7XG4gICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgIC8vIHN1Y2Nlc3NcbiAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAvLyBmYWlsdXJlXG4gIH1cbiAgYGBgXG4gICBFcnJiYWNrIEV4YW1wbGVcbiAgIGBgYGpzXG4gIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgIGlmIChlcnIpIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH1cbiAgfSk7XG4gIGBgYFxuICAgUHJvbWlzZSBFeGFtcGxlO1xuICAgYGBgamF2YXNjcmlwdFxuICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgIC8vIHN1Y2Nlc3NcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyBmYWlsdXJlXG4gIH0pO1xuICBgYGBcbiAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgLS0tLS0tLS0tLS0tLS1cbiAgIFN5bmNocm9ub3VzIEV4YW1wbGVcbiAgIGBgYGphdmFzY3JpcHRcbiAgbGV0IGF1dGhvciwgYm9va3M7XG4gICB0cnkge1xuICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgIC8vIHN1Y2Nlc3NcbiAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAvLyBmYWlsdXJlXG4gIH1cbiAgYGBgXG4gICBFcnJiYWNrIEV4YW1wbGVcbiAgIGBgYGpzXG4gICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG4gICB9XG4gICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuICAgfVxuICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgaWYgKGVycikge1xuICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICB9XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfVxuICB9KTtcbiAgYGBgXG4gICBQcm9taXNlIEV4YW1wbGU7XG4gICBgYGBqYXZhc2NyaXB0XG4gIGZpbmRBdXRob3IoKS5cbiAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgIC8vIGZvdW5kIGJvb2tzXG4gIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgfSk7XG4gIGBgYFxuICAgQG1ldGhvZCB0aGVuXG4gIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuXG4gIC8qKlxuICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG4gIGBgYGpzXG4gIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZG4ndCBmaW5kIHRoYXQgYXV0aG9yJyk7XG4gIH1cbiAgLy8gc3luY2hyb25vdXNcbiAgdHJ5IHtcbiAgZmluZEF1dGhvcigpO1xuICB9IGNhdGNoKHJlYXNvbikge1xuICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICB9XG4gIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gIH0pO1xuICBgYGBcbiAgQG1ldGhvZCBjYXRjaFxuICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG5cblxuICBQcm9taXNlLnByb3RvdHlwZS5jYXRjaCA9IGZ1bmN0aW9uIF9jYXRjaChvblJlamVjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICB9O1xuXG4gIC8qKlxuICAgIGBmaW5hbGx5YCB3aWxsIGJlIGludm9rZWQgcmVnYXJkbGVzcyBvZiB0aGUgcHJvbWlzZSdzIGZhdGUganVzdCBhcyBuYXRpdmVcbiAgICB0cnkvY2F0Y2gvZmluYWxseSBiZWhhdmVzXG4gIFxuICAgIFN5bmNocm9ub3VzIGV4YW1wbGU6XG4gIFxuICAgIGBgYGpzXG4gICAgZmluZEF1dGhvcigpIHtcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBBdXRob3IoKTtcbiAgICB9XG4gIFxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZmluZEF1dGhvcigpOyAvLyBzdWNjZWVkIG9yIGZhaWxcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICByZXR1cm4gZmluZE90aGVyQXV0aGVyKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vIGFsd2F5cyBydW5zXG4gICAgICAvLyBkb2Vzbid0IGFmZmVjdCB0aGUgcmV0dXJuIHZhbHVlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBBc3luY2hyb25vdXMgZXhhbXBsZTpcbiAgXG4gICAgYGBganNcbiAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIHJldHVybiBmaW5kT3RoZXJBdXRoZXIoKTtcbiAgICB9KS5maW5hbGx5KGZ1bmN0aW9uKCl7XG4gICAgICAvLyBhdXRob3Igd2FzIGVpdGhlciBmb3VuZCwgb3Igbm90XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgZmluYWxseVxuICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cblxuXG4gIFByb21pc2UucHJvdG90eXBlLmZpbmFsbHkgPSBmdW5jdGlvbiBfZmluYWxseShjYWxsYmFjaykge1xuICAgIHZhciBwcm9taXNlID0gdGhpcztcbiAgICB2YXIgY29uc3RydWN0b3IgPSBwcm9taXNlLmNvbnN0cnVjdG9yO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aHJvdyByZWFzb247XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2UudGhlbihjYWxsYmFjaywgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJldHVybiBQcm9taXNlO1xufSgpO1xuXG5Qcm9taXNlJDEucHJvdG90eXBlLnRoZW4gPSB0aGVuO1xuUHJvbWlzZSQxLmFsbCA9IGFsbDtcblByb21pc2UkMS5yYWNlID0gcmFjZTtcblByb21pc2UkMS5yZXNvbHZlID0gcmVzb2x2ZSQxO1xuUHJvbWlzZSQxLnJlamVjdCA9IHJlamVjdCQxO1xuUHJvbWlzZSQxLl9zZXRTY2hlZHVsZXIgPSBzZXRTY2hlZHVsZXI7XG5Qcm9taXNlJDEuX3NldEFzYXAgPSBzZXRBc2FwO1xuUHJvbWlzZSQxLl9hc2FwID0gYXNhcDtcblxuLypnbG9iYWwgc2VsZiovXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgdmFyIGxvY2FsID0gdm9pZCAwO1xuXG4gIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIGxvY2FsID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgIGxvY2FsID0gc2VsZjtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIFAgPSBsb2NhbC5Qcm9taXNlO1xuXG4gIGlmIChQKSB7XG4gICAgdmFyIHByb21pc2VUb1N0cmluZyA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIHByb21pc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gc2lsZW50bHkgaWdub3JlZFxuICAgIH1cblxuICAgIGlmIChwcm9taXNlVG9TdHJpbmcgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgbG9jYWwuUHJvbWlzZSA9IFByb21pc2UkMTtcbn1cblxuLy8gU3RyYW5nZSBjb21wYXQuLlxuUHJvbWlzZSQxLnBvbHlmaWxsID0gcG9seWZpbGw7XG5Qcm9taXNlJDEuUHJvbWlzZSA9IFByb21pc2UkMTtcblxucmV0dXJuIFByb21pc2UkMTtcblxufSkpKTtcblxuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVzNi1wcm9taXNlLm1hcFxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiJdfQ==
