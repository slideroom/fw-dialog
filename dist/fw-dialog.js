import { Bus, CloseStack, ContainerInstance, ViewEngine, ViewRouterLocationChanged, inject } from 'fw';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */







function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}



function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var classes = {
    wrapper: "fw-dialog-wrapper",
    container: "fw-dialog",
    bodyOpen: "fw-dialog-open",
    open: "open"
};
var DialogService = function () {
    function DialogService(closeStack, bus) {
        var _this = this;

        classCallCheck(this, DialogService);

        this.closeStack = closeStack;
        this.bus = bus;
        this.opened = [];
        this.bus.subscribe(ViewRouterLocationChanged, function () {
            _this.opened.reverse().forEach(function (p) {
                return p();
            });
            _this.opened = [];
        });
    }

    createClass(DialogService, [{
        key: "open",
        value: function open(view, data, cssClass) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var ve, dialogElement, containerElement, resolver, returnPromise, controller, v, closer, stop, close, res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                ve = new ViewEngine(ContainerInstance);
                                dialogElement = document.createElement("div");

                                dialogElement.classList.add(classes.wrapper);
                                dialogElement.classList.add(cssClass);
                                document.body.appendChild(dialogElement);
                                containerElement = document.createElement("div");

                                containerElement.classList.add(classes.container);
                                containerElement.appendChild(document.createElement("div"));
                                dialogElement.appendChild(containerElement);
                                resolver = null;
                                returnPromise = new Promise(function (res) {
                                    return resolver = res;
                                });
                                controller = new DialogController(resolver);
                                v = ve.loadView(view, data, function (o) {
                                    o.use(DialogController, controller);
                                });

                                document.body.classList.add(classes.bodyOpen);
                                document.documentElement.classList.add(classes.bodyOpen);
                                v.renderTo(containerElement.children[0]);
                                setTimeout(function () {
                                    containerElement.classList.add(classes.open);
                                    dialogElement.classList.add(classes.open);
                                }, 100);
                                closer = this.closeStack.enroll(function () {
                                    return resolver({ canceled: true });
                                });

                                this.opened.push(function () {
                                    return closer.close();
                                });

                                stop = function stop(e) {
                                    e.stopPropagation();
                                    closer.closeAbove();
                                };
                                // setup key listener for ESC; and call cancel or close or something on the controller...


                                close = function close(e) {
                                    resolver({ canceled: true, result: null });
                                    stop(e);
                                };

                                dialogElement.addEventListener("click", close);
                                containerElement.addEventListener("click", stop);
                                _context.next = 25;
                                return v.activate();

                            case 25:
                                _context.next = 27;
                                return returnPromise;

                            case 27:
                                res = _context.sent;

                                closer.close();
                                // animate out??
                                containerElement.classList.remove(classes.open);
                                dialogElement.classList.remove(classes.open);
                                // remove after a bit.. preferabbly when all animations are done...
                                setTimeout(function () {
                                    v.remove();
                                    containerElement.removeEventListener("click", stop);
                                    containerElement.remove();
                                    dialogElement.removeEventListener("click", close);
                                    dialogElement.remove();
                                    document.body.classList.remove(classes.bodyOpen);
                                    document.documentElement.classList.remove(classes.bodyOpen);
                                }, 600);
                                return _context.abrupt("return", res);

                            case 33:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }]);
    return DialogService;
}();
DialogService = __decorate([inject, __metadata("design:paramtypes", [CloseStack, Bus])], DialogService);
var DialogController = function () {
    function DialogController(resolver) {
        classCallCheck(this, DialogController);

        this.resolver = resolver;
    }

    createClass(DialogController, [{
        key: "close",
        value: function close() {
            var canceled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var result = arguments[1];

            this.resolver({ canceled: canceled, result: result });
        }
    }, {
        key: "cancel",
        value: function cancel() {
            this.close(true);
        }
    }, {
        key: "ok",
        value: function ok(result) {
            this.close(false, result);
        }
    }]);
    return DialogController;
}();

/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition();else if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else this[name] = definition();
}('domready', function () {

  var fns = [],
      _listener,
      doc = document,
      hack = doc.documentElement.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

  if (!loaded) doc.addEventListener(domContentLoaded, _listener = function listener() {
    doc.removeEventListener(domContentLoaded, _listener);
    loaded = 1;
    while (_listener = fns.shift()) {
      _listener();
    }
  });

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  };
});



var ready = Object.freeze({

});

var domready = ( ready && undefined ) || ready;

var index$1 = function () {

	var support,
	    all,
	    a,
	    select,
	    opt,
	    input,
	    fragment,
	    eventName,
	    i,
	    isSupported,
	    clickFn,
	    div = document.createElement("div");

	// Setup
	div.setAttribute("className", "t");
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[0];
	if (!all || !a || !all.length) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild(document.createElement("option"));
	input = div.getElementsByTagName("input")[0];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test(a.getAttribute("style")),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test(a.style.opacity),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: input.value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode(true).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch (e) {
		support.deleteExpando = false;
	}

	if (!div.addEventListener && div.attachEvent && div.fireEvent) {
		div.attachEvent("onclick", clickFn = function clickFn() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode(true).fireEvent("onclick");
		div.detachEvent("onclick", clickFn);
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute("name", "t");

	div.appendChild(input);
	fragment = document.createDocumentFragment();
	fragment.appendChild(div.lastChild);

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild(input);
	fragment.appendChild(div);

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if (!div.addEventListener) {
		for (i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = eventName in div;
			if (!isSupported) {
				div.setAttribute(eventName, "return;");
				isSupported = typeof div[eventName] === "function";
			}
			support[i + "Bubbles"] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	domready(function () {
		var container,
		    div,
		    tds,
		    marginDiv,
		    divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
		    body = document.getElementsByTagName("body")[0];

		if (!body) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore(container, body.firstChild);

		// Construct the test element
		div = document.createElement("div");
		container.appendChild(div);

		//Check if table cells still have offsetWidth/Height when they are set
		//to display:none and there are still other visible table cells in a
		//table row; if so, offsetWidth/Height are not reliable for use when
		//determining if an element has been hidden directly using
		//display:none (it is still safe to use offsets if a parent element is
		//hidden; don safety goggles and see bug #4512 for more information).
		//(only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[0].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && tds[0].offsetHeight === 0;

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = div.offsetWidth === 4;
		support.doesNotIncludeMarginInBodyOffset = body.offsetTop !== 1;

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if (window.getComputedStyle) {
			support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== "1%";
			support.boxSizingReliable = (window.getComputedStyle(div, null) || { width: "4px" }).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild(marginDiv);
			support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight);
		}

		if (typeof div.style.zoom !== "undefined") {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = div.offsetWidth === 3;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = div.offsetWidth !== 3;

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild(container);
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild(div);
	all = a = select = opt = input = fragment = div = null;

	return support;
}();

/**
 * Module exports.
 */

var index$3 = getDocument;

// defined by w3c
var DOCUMENT_NODE = 9;

/**
 * Returns `true` if `w` is a Document object, or `false` otherwise.
 *
 * @param {?} d - Document object, maybe
 * @return {Boolean}
 * @private
 */

function isDocument(d) {
  return d && d.nodeType === DOCUMENT_NODE;
}

/**
 * Returns the `document` object associated with the given `node`, which may be
 * a DOM element, the Window object, a Selection, a Range. Basically any DOM
 * object that references the Document in some way, this function will find it.
 *
 * @param {Mixed} node - DOM node, selection, or range in which to find the `document` object
 * @return {Document} the `document` object associated with `node`
 * @public
 */

function getDocument(node) {
  if (isDocument(node)) {
    return node;
  } else if (isDocument(node.ownerDocument)) {
    return node.ownerDocument;
  } else if (isDocument(node.document)) {
    return node.document;
  } else if (node.parentNode) {
    return getDocument(node.parentNode);

    // Range support
  } else if (node.commonAncestorContainer) {
    return getDocument(node.commonAncestorContainer);
  } else if (node.startContainer) {
    return getDocument(node.startContainer);

    // Selection support
  } else if (node.anchorNode) {
    return getDocument(node.anchorNode);
  }
}

/**
 * Check if the DOM element `child` is within the given `parent` DOM element.
 *
 * @param {DOMElement|Range} child - the DOM element or Range to check if it's within `parent`
 * @param {DOMElement} parent  - the parent node that `child` could be inside of
 * @return {Boolean} True if `child` is within `parent`. False otherwise.
 * @public
 */

var index$5 = function within(child, parent) {
  // don't throw if `child` is null
  if (!child) return false;

  // Range support
  if (child.commonAncestorContainer) child = child.commonAncestorContainer;else if (child.endContainer) child = child.endContainer;

  // traverse up the `parentNode` properties until `parent` is found
  var node = child;
  while (node = node.parentNode) {
    if (node == parent) return true;
  }

  return false;
};

/**
 * Get offset of a DOM Element or Range within the document.
 *
 * @param {DOMElement|Range} el - the DOM element or Range instance to measure
 * @return {Object} An object with `top` and `left` Number values
 * @public
 */

var index = function offset(el) {
  var doc = index$3(el);
  if (!doc) return;

  // Make sure it's not a disconnected DOM node
  if (!index$5(el, doc)) return;

  var body = doc.body;
  if (body === el) {
    return bodyOffset(el);
  }

  var box = { top: 0, left: 0 };
  if (typeof el.getBoundingClientRect !== "undefined") {
    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    box = el.getBoundingClientRect();

    if (el.collapsed && box.left === 0 && box.top === 0) {
      // collapsed Range instances sometimes report 0, 0
      // see: http://stackoverflow.com/a/6847328/376773
      var span = doc.createElement("span");

      // Ensure span has dimensions and position by
      // adding a zero-width space character
      span.appendChild(doc.createTextNode('\u200B'));
      el.insertNode(span);
      box = span.getBoundingClientRect();

      // Remove temp SPAN and glue any broken text nodes back together
      var spanParent = span.parentNode;
      spanParent.removeChild(span);
      spanParent.normalize();
    }
  }

  var docEl = doc.documentElement;
  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;
  var scrollTop = window.pageYOffset || docEl.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft;

  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
};

function bodyOffset(body) {
  var top = body.offsetTop;
  var left = body.offsetLeft;

  if (index$1.doesNotIncludeMarginInBodyOffset) {
    top += parseFloat(body.style.marginTop || 0);
    left += parseFloat(body.style.marginLeft || 0);
  }

  return {
    top: top,
    left: left
  };
}

var PopoverCoordinator = function () {
    function PopoverCoordinator(bus) {
        classCallCheck(this, PopoverCoordinator);

        this.bus = bus;
        this.openPosition = {
            x: 0,
            y: 0,
            fixed: false
        };
        this.opened = [];
        this.openAwaiters = [];
        this.closeAwaiters = [];
        this.bus.subscribe(ViewRouterLocationChanged, this.closeAll.bind(this));
    }

    createClass(PopoverCoordinator, [{
        key: "openAt",
        value: function openAt(x, y) {
            var fixed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this.openPosition = { x: x, y: y, fixed: fixed };
            console.log(this.openPosition);
        }
    }, {
        key: "openAtElement",
        value: function openAtElement(element) {
            var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var offsetHeight = element.offsetHeight;

            var _offset = index(element),
                left = _offset.left,
                top = _offset.top;

            var y = top + offsetHeight;
            if (fixed) {
                y -= window.scrollY;
            }
            this.openAt(left, y, fixed);
        }
    }, {
        key: "getPosition",
        value: function getPosition(popoverWidth, popoverHeight) {
            var _window = window,
                viewPortWidth = _window.innerWidth,
                viewPortHeight = _window.innerHeight,
                scrollY = _window.scrollY;
            var _openPosition = this.openPosition,
                x = _openPosition.x,
                y = _openPosition.y,
                fixed = _openPosition.fixed;

            if (x + popoverWidth > viewPortWidth) {
                x = viewPortWidth - popoverWidth - 20;
            } else {
                x = Math.max(x, 20);
            }
            if (y + popoverHeight > viewPortHeight + scrollY) {
                y = viewPortHeight - popoverHeight - 20 + scrollY;
            }
            return { x: x, y: y, fixed: fixed };
        }
    }, {
        key: "closeAll",
        value: function closeAll() {
            this.opened.forEach(function (p) {
                return p({ canceled: true, result: null });
            });
            this.opened = [];
            this.closeAllAwaiters();
        }
    }, {
        key: "closeAllAwaiters",
        value: function closeAllAwaiters() {
            this.closeAwaiters.forEach(function (p) {
                return p();
            });
            this.closeAwaiters = [];
        }
    }, {
        key: "push",
        value: function push(resolver) {
            this.opened.push(resolver);
            this.openAwaiters.forEach(function (p) {
                return p();
            });
            this.openAwaiters = [];
        }
    }, {
        key: "waitForOpen",
        value: function waitForOpen() {
            var _this = this;

            return new Promise(function (res) {
                _this.openAwaiters.push(res);
            });
        }
    }, {
        key: "waitForClose",
        value: function waitForClose() {
            var _this2 = this;

            return new Promise(function (res) {
                _this2.closeAwaiters.push(res);
            });
        }
    }]);
    return PopoverCoordinator;
}();
PopoverCoordinator = __decorate([inject, __metadata("design:paramtypes", [Bus])], PopoverCoordinator);
var classes$1 = {
    wrapper: "fw-popover-wrapper",
    container: "fw-popover",
    open: "open"
};
var PopoverService = function () {
    function PopoverService(coordinator, closeStack) {
        classCallCheck(this, PopoverService);

        this.coordinator = coordinator;
        this.closeStack = closeStack;
    }

    createClass(PopoverService, [{
        key: "open",
        value: function open(view, data, element) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var _this3 = this;

                var ve, popoverElement, resolver, returnPromise, controller, v, closer, clickHandler, stopBubble, res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.coordinator.closeAll();
                                ve = new ViewEngine(ContainerInstance);
                                popoverElement = document.createElement("div");

                                popoverElement.classList.add(classes$1.wrapper);
                                popoverElement.appendChild(document.createElement("div"));
                                document.body.appendChild(popoverElement);
                                resolver = null;
                                returnPromise = new Promise(function (res) {
                                    return resolver = res;
                                });
                                controller = new PopoverController(resolver);
                                //newContainer.use(PopoverController, controller);

                                v = ve.loadView(view, data, function (o) {
                                    o.use(PopoverController, controller);
                                });

                                if (element != null) {
                                    this.coordinator.openAtElement(element);
                                }
                                v.renderTo(popoverElement.children[0]);
                                setTimeout(function () {
                                    var _coordinator$getPosit = _this3.coordinator.getPosition(popoverElement.clientWidth, popoverElement.clientHeight),
                                        x = _coordinator$getPosit.x,
                                        y = _coordinator$getPosit.y,
                                        fixed = _coordinator$getPosit.fixed;

                                    popoverElement.style.left = x + "px";
                                    popoverElement.style.top = y + "px";
                                    popoverElement.style.position = fixed ? "fixed" : null;
                                    popoverElement.classList.add(classes$1.open);
                                }, 10);
                                // setup key listener for ESC; and call cancel or close or something on the controller...
                                //
                                closer = this.closeStack.enroll(function () {
                                    return resolver({ canceled: true });
                                });

                                clickHandler = function clickHandler(e) {
                                    if (e.__getFile) return;
                                    _this3.coordinator.closeAll();
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();
                                    e.preventDefault();
                                };

                                stopBubble = function stopBubble(e) {
                                    closer.closeAbove();
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();
                                    // Removed the e.preventDefault() here because it prevents interaction with checkboxes in popovers
                                };

                                window.addEventListener("click", clickHandler);
                                popoverElement.addEventListener("click", stopBubble);
                                _context.next = 20;
                                return v.activate();

                            case 20:
                                this.coordinator.push(resolver);
                                _context.next = 23;
                                return returnPromise;

                            case 23:
                                res = _context.sent;

                                popoverElement.classList.remove(classes$1.open);
                                this.coordinator.closeAllAwaiters();
                                setTimeout(function () {
                                    v.remove();
                                    popoverElement.removeEventListener("click", stopBubble);
                                    popoverElement.remove();
                                    //document.removeEventListener("keydown", escHandler);
                                    window.removeEventListener("click", clickHandler);
                                }, 300);
                                return _context.abrupt("return", res);

                            case 28:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }]);
    return PopoverService;
}();
PopoverService = __decorate([inject, __metadata("design:paramtypes", [PopoverCoordinator, CloseStack])], PopoverService);
var PopoverController = function () {
    function PopoverController(resolver) {
        classCallCheck(this, PopoverController);

        this.resolver = resolver;
    }

    createClass(PopoverController, [{
        key: "close",
        value: function close() {
            var canceled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var result = arguments[1];

            this.resolver({ canceled: canceled, result: result });
        }
    }, {
        key: "cancel",
        value: function cancel() {
            this.close(true);
        }
    }, {
        key: "ok",
        value: function ok(result) {
            this.close(false, result);
        }
    }]);
    return PopoverController;
}();

export { DialogService, DialogController, PopoverCoordinator, PopoverService, PopoverController };
