'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayMove = arrayMove;
exports.omit = omit;
exports.closest = closest;
exports.limit = limit;
exports.getElementMargin = getElementMargin;
exports.provideDisplayName = provideDisplayName;
exports.areEqualShallow = areEqualShallow;
exports.listDiff = listDiff;
function arrayMove(arr, previousIndex, newIndex) {
  var array = arr.slice(0);
  if (newIndex >= array.length) {
    var k = newIndex - array.length;
    while (k-- + 1) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
  return array;
}

function omit(obj) {
  for (var _len = arguments.length, keysToOmit = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keysToOmit[_key - 1] = arguments[_key];
  }

  return Object.keys(obj).reduce(function (acc, key) {
    if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
    return acc;
  }, {});
}

var events = exports.events = {
  start: ['touchstart', 'mousedown'],
  move: ['touchmove', 'mousemove'],
  end: ['touchend', 'touchcancel', 'mouseup']
};

var vendorPrefix = exports.vendorPrefix = function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ''; // server environment
  // fix for:
  //    https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  //    window.getComputedStyle() returns null inside an iframe with display: none
  // in this case return an array with a fake mozilla style in it.
  var styles = window.getComputedStyle(document.documentElement, '') || ['-moz-hidden-iframe'];
  var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];

  switch (pre) {
    case 'ms':
      return 'ms';
    default:
      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
  }
}();

function closest(el, fn) {
  while (el) {
    if (fn(el)) return el;
    el = el.parentNode;
  }
}

function limit(min, max, value) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function getCSSPixelValue(stringValue) {
  if (stringValue.substr(-2) === 'px') {
    return parseFloat(stringValue);
  }
  return 0;
}

function getElementMargin(element) {
  var style = window.getComputedStyle(element);

  return {
    top: getCSSPixelValue(style.marginTop),
    right: getCSSPixelValue(style.marginRight),
    bottom: getCSSPixelValue(style.marginBottom),
    left: getCSSPixelValue(style.marginLeft)
  };
}

function provideDisplayName(prefix, Component) {
  var componentName = Component.displayName || Component.name;

  return componentName ? prefix + '(' + componentName + ')' : prefix;
}

function areEqualShallow(a, b) {
  if (a === b) {
    return true;
  }

  for (var key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }
  for (var _key2 in b) {
    if (!(_key2 in a) || a[_key2] !== b[_key2]) {
      return false;
    }
  }
  return true;
}
/*
*
* We use this function for check if the list
* of prevHelper are different of newHelper list.
*
* Return an Object with 2 lists : toAdd and toRemove
*
* @param prevHelper : Array = List of prev helpers
* @param newHelper : Array = List of new helpers
* @return object : Object with 2 list : one to add and another to remove
*
*/
function listDiff(prevHelper, newHelper) {
  var classMap = {};
  prevHelper.concat(newHelper).forEach(function (className) {
    classMap[className] = true;
  });

  var classList = Object.keys(classMap);
  var result = {
    toAdd: [],
    toRemove: []
  };

  classList.forEach(function (className) {
    var before = prevHelper.indexOf(className) !== -1;
    var after = newHelper.indexOf(className) !== -1;

    if (before && after) {
      return;
    } else if (before && !after) {
      result.toRemove.push(className);
    } else if (!before && after) {
      result.toAdd.push(className);
    }
  });

  return result;
}