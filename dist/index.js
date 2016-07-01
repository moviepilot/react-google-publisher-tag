'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dimensions = exports.Format = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dimensions;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _forOwn = require('lodash/forOwn');

var _forOwn2 = _interopRequireDefault(_forOwn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * https://developers.google.com/doubleclick-gpt/reference
                                                                                                                                                                                                                  */


var Format = exports.Format = (0, _keymirror2.default)({
  HORIZONTAL: null,
  RECTANGLE: null,
  VERTICAL: null,
  MOBILE: null
});

var Dimensions = exports.Dimensions = (_Dimensions = {}, _defineProperty(_Dimensions, Format.HORIZONTAL, [[970, 90], [728, 90], [468, 60], [234, 60]]), _defineProperty(_Dimensions, Format.RECTANGLE, [[336, 280], [300, 250], [250, 250], [200, 200], [180, 150], [125, 125]]), _defineProperty(_Dimensions, Format.VERTICAL, [[300, 600], [160, 600], [120, 600], [120, 240]]), _defineProperty(_Dimensions, Format.MOBILE, [[320, 50]]), _defineProperty(_Dimensions, '300x600', [[300, 600], [160, 600]]), _defineProperty(_Dimensions, '336x280', [[336, 280], [300, 250]]), _defineProperty(_Dimensions, '728x90', [[728, 90], [468, 60]]), _defineProperty(_Dimensions, '970x90', [[970, 90], [728, 90], [468, 60]]), _Dimensions);

function prepareDimensions(dimensions) {
  var format = arguments.length <= 1 || arguments[1] === undefined ? Format.HORIZONTAL : arguments[1];
  var canBeLower = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  if (!dimensions || !dimensions.length) {
    return Dimensions[format] || [];
  }

  if (dimensions.length === 1 && canBeLower) {
    var dimension = dimensions[0];
    var key = dimension[0] + 'x' + dimension[1];

    if (Dimensions[key]) {
      return Dimensions[key] || [];
    }
  }

  return dimensions;
}

var nextID = 1;
var googletag = null;

function getNextID() {
  return 'rgpt-' + nextID++;
}

function loadScript(_ref) {
  var src = _ref.src;
  var loadAsync = _ref.loadAsync;
  var onload = _ref.onload;

  var theScript = document.createElement('script');

  if (loadAsync) {
    theScript.async = true;
  }
  if (onload) {
    theScript.onload = onload;
  }

  theScript.type = 'text/javascript';
  theScript.src = src;

  var head = document.getElementsByTagName('head')[0];
  head.appendChild(theScript);
}

var getAmazonAds = function getAmazonAds() {
  if (window.amznads) {
    window.amznads.getAdsCallback('3366', function () {
      googletag = googletag || {};
      googletag.cmd = googletag.cmd || [];
      window.amznads.setTargetingForGPTAsync('amznslots');
    });
  }
};

function loadScripts(options) {
  var openX = options.openX;
  var amazon = options.amazon;


  if (openX && openX.enabled) {
    loadScript({ src: openX.src, loadAsync: false });
  }
  if (amazon && amazon.enabled) {
    loadScript({ src: amazon.src, loadAsync: false, onload: getAmazonAds });
  }

  loadScript({
    src: '//www.googletagservices.com/tag/js/gpt.js',
    loadAsync: true
  });
}

function initGooglePublisherTag(props) {
  var exitAfterAddingCommands = !!googletag;

  if (!googletag) {
    googletag = window.googletag = window.googletag || {};
    googletag.cmd = googletag.cmd || [];
  }

  var onImpressionViewable = props.onImpressionViewable;
  var onSlotRenderEnded = props.onSlotRenderEnded;
  var path = props.path;
  var _props$enableServices = props.enableServices;
  var enableServices = _props$enableServices === undefined ? true : _props$enableServices;

  // Execute callback when the slot is visible in DOM (thrown before 'impressionViewable' )

  if (typeof onSlotRenderEnded === 'function') {
    googletag.cmd.push(function () {
      googletag.pubads().addEventListener('slotRenderEnded', function (event) {
        // check if the current slot is the one the callback
        // was added to (as addEventListener is global)
        if (event && event.slot && event.slot.getAdUnitPath() === path) {
          onSlotRenderEnded(event);
        }
      });
    });
  }
  // Execute callback when ad is completely visible in DOM
  if (typeof onImpressionViewable === 'function') {
    googletag.cmd.push(function () {
      googletag.pubads().addEventListener('impressionViewable', function (event) {
        if (event && event.slot && event.slot.getAdUnitPath() === path) {
          onImpressionViewable(event);
        }
      });
    });
  }

  if (exitAfterAddingCommands) {
    return;
  }

  if (enableServices) {
    googletag.cmd.push(function () {
      // add support for async loading
      googletag.pubads().enableAsyncRendering();

      // collapse div without ad
      googletag.pubads().collapseEmptyDivs();

      // load ad with slot refresh
      googletag.pubads().disableInitialLoad();

      // enable google publisher tag
      googletag.enableServices();
    });
  }

  loadScripts(props);
}

var GooglePublisherTag = function (_Component) {
  _inherits(GooglePublisherTag, _Component);

  function GooglePublisherTag() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, GooglePublisherTag);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(GooglePublisherTag)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.handleResize = function () {
      _this.update(_this.props);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GooglePublisherTag, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      initGooglePublisherTag(this.props);

      if (this.props.responsive) {
        window.addEventListener('resize', this.handleResize);
      }

      googletag.cmd.push(function () {
        _this2.initialized = true;

        _this2.update(_this2.props);
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      this.update(props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // TODO sometimes can props changed
      if (this.props.responsive) {
        window.removeEventListener('resize', this.handleResize);
      }

      this.removeSlot();
    }
  }, {
    key: 'update',
    value: function update(props) {
      if (!this.initialized) {
        return;
      }

      var node = (0, _reactDom.findDOMNode)(this);
      if (!node) {
        return;
      }

      var componentWidth = node.offsetWidth;
      var availableDimensions = prepareDimensions(props.dimensions, props.format, props.canBeLower);

      // filter by available node space
      var dimensions = props.responsive ? availableDimensions.filter(function (dimension) {
        return dimension[0] <= componentWidth;
      }) : availableDimensions;

      // filter by min and max width
      var windowWidth = window.innerWidth;
      var minWindowWidth = props.minWindowWidth;
      var maxWindowWidth = props.maxWindowWidth;
      var targeting = props.targeting;
      var collapseEmptyDiv = props.collapseEmptyDiv;
      var onDisplayCallback = props.onDisplayCallback;


      if (minWindowWidth !== -1 && minWindowWidth < windowWidth) {
        dimensions = [];
      } else if (maxWindowWidth !== -1 && maxWindowWidth > windowWidth) {
        dimensions = [];
      }

      // do nothink
      if (JSON.stringify(dimensions) === JSON.stringify(this.currentDimensions)) {
        return;
      }

      this.currentDimensions = dimensions;

      if (this.slot) {
        // remove current slot because dimensions is changed and current slot is old
        this.removeSlot();
      }

      // there is nothink to display
      if (!dimensions || !dimensions.length) {
        return;
      }

      if (!this.refs.holder) {
        console.log('RGPT holder is undefined');
        return;
      }

      // prepare new node
      var id = getNextID();
      this.refs.holder.innerHTML = '<div id="' + id + '"></div>';

      // prepare new slot
      var slot = this.slot = googletag.defineSlot(props.path, dimensions, id);

      if (window.amznads && window.amznads.getTokens) {
        var amazonTargetingKey = 'amznslots';
        var amazonTargetingValues = window.amznads.getTokens();
        slot.setTargeting(amazonTargetingKey, amazonTargetingValues);
      }
      // set targeting
      if (targeting) {
        (0, _forOwn2.default)(targeting, function (value, key) {
          slot.setTargeting(key, value);
        });
      }

      if (typeof collapseEmptyDiv !== 'undefined') {
        if (Array.isArray(collapseEmptyDiv)) {
          slot.setCollapseEmptyDiv.apply('setCollapseEmptyDiv', collapseEmptyDiv);
        } else {
          slot.setCollapseEmptyDiv(collapseEmptyDiv);
        }
      }

      slot.addService(googletag.pubads());

      if (onDisplayCallback) {
        onDisplayCallback({ id: id, slot: slot });
      } else {
        // display new slot
        googletag.display(id);
        googletag.pubads().refresh([slot]);
      }
    }
  }, {
    key: 'removeSlot',
    value: function removeSlot() {
      if (!this.slot) {
        return;
      }

      googletag.pubads().clear([this.slot]);
      this.slot = null;

      if (this.refs.holder) {
        this.refs.holder.innerHTML = null;
      }
    }
  }, {
    key: 'refreshSlot',
    value: function refreshSlot() {
      if (this.slot) {
        googletag.pubads().refresh([this.slot]);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: this.props.className, ref: 'holder' });
    }
  }]);

  return GooglePublisherTag;
}(_react.Component);

GooglePublisherTag.propTypes = {
  className: _react.PropTypes.string,
  path: _react.PropTypes.string.isRequired,
  format: _react.PropTypes.string.isRequired,
  responsive: _react.PropTypes.bool.isRequired,
  canBeLower: _react.PropTypes.bool.isRequired, // can be ad lower than original size,

  dimensions: _react.PropTypes.array, // [[300, 600], [160, 600]]

  minWindowWidth: _react.PropTypes.number.isRequired,
  maxWindowWidth: _react.PropTypes.number.isRequired,
  targeting: _react.PropTypes.object,
  enableServices: _react.PropTypes.bool,
  onSlotRenderEnded: _react.PropTypes.func,
  onImpressionViewable: _react.PropTypes.func,
  onDisplayCallback: _react.PropTypes.func
};
GooglePublisherTag.defaultProps = {
  format: Format.HORIZONTAL,
  responsive: true,
  canBeLower: true,
  dimensions: null,
  minWindowWidth: -1,
  maxWindowWidth: -1
};
exports.default = GooglePublisherTag;