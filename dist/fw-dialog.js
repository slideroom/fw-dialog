import { Bus, CloseStack, ViewRouterLocationChanged, inject, makeAndActivate } from '@derekpitt/fw';

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

var hideElement = function hideElement(el) {
    el.style.cssText = "border: 0;\n    clip: rect(0 0 0 0);\n    height: 1px;\n    margin: -1px;\n    overflow: hidden;\n    padding: 0;\n    position: absolute;\n    width: 1px;";
};
var focusElement = function focusElement(el) {
    if (el.getAttribute("tabindex") != null) {
        el.removeAttribute("tabindex");
    }
    switch (el.tagName) {
        case "A":
        case "BUTTON":
        case "INPUT":
        case "SELECT":
        case "TEXTAREA":
            el.setAttribute("tabindex", "0");
            break;
        default:
            el.setAttribute("tabindex", "-1");
    }
    el.focus();
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var classes = {
    wrapper: "fw-dialog-wrapper",
    container: "fw-dialog",
    bodyOpen: "fw-dialog-open",
    open: "open"
};
var defaultOptions = {
    closeOnClick: false
};
var DialogService = function () {
    function DialogService(closeStack, bus) {
        var _this = this;

        _classCallCheck(this, DialogService);

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

    _createClass(DialogService, [{
        key: "open",
        value: function open(view, data, opts) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var options, dialogElement, containerElement, getViewElement, tabLooper, tabLooperOnFocus, tabLooper2, resolver, returnPromise, controller, closer, stop, close, res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                options = Object.assign({}, defaultOptions, opts);
                                dialogElement = document.createElement("div");

                                dialogElement.classList.add(classes.wrapper);
                                dialogElement.setAttribute("role", "dialog");
                                if (options.cssClass) dialogElement.classList.add(options.cssClass);
                                containerElement = document.createElement("div");

                                containerElement.classList.add(classes.container);
                                containerElement.appendChild(document.createElement("div"));

                                getViewElement = function getViewElement() {
                                    return containerElement.children[0];
                                };

                                tabLooper = document.createElement("button");

                                tabLooperOnFocus = function tabLooperOnFocus() {
                                    return focusElement(getViewElement());
                                };

                                tabLooper.addEventListener("focus", tabLooperOnFocus);
                                tabLooper2 = document.createElement("button");

                                tabLooper2.addEventListener("focus", tabLooperOnFocus);
                                hideElement(tabLooper);
                                hideElement(tabLooper2);
                                tabLooper.setAttribute("aria-hidden", "true");
                                tabLooper2.setAttribute("aria-hidden", "true");
                                dialogElement.appendChild(tabLooper);
                                dialogElement.appendChild(containerElement);
                                dialogElement.appendChild(tabLooper2);
                                document.body.appendChild(dialogElement);
                                resolver = null;
                                returnPromise = new Promise(function (res) {
                                    return resolver = res;
                                });
                                controller = new DialogController(resolver);
                                _context.next = 27;
                                return makeAndActivate(view, getViewElement(), data, function (o) {
                                    return o.use(DialogController, controller);
                                });

                            case 27:
                                document.body.classList.add(classes.bodyOpen);
                                document.documentElement.classList.add(classes.bodyOpen);
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

                                if (options.closeOnClick) {
                                    dialogElement.addEventListener("click", close);
                                }
                                containerElement.addEventListener("click", stop);
                                _context.next = 38;
                                return returnPromise;

                            case 38:
                                res = _context.sent;

                                closer.close();
                                // animate out??
                                containerElement.classList.remove(classes.open);
                                dialogElement.classList.remove(classes.open);
                                // remove after a bit.. preferabbly when all animations are done...
                                setTimeout(function () {
                                    containerElement.removeEventListener("click", stop);
                                    containerElement.remove();
                                    if (options.closeOnClick) {
                                        dialogElement.removeEventListener("click", close);
                                    }
                                    tabLooper.removeEventListener("focus", tabLooperOnFocus);
                                    tabLooper2.removeEventListener("focus", tabLooperOnFocus);
                                    dialogElement.remove();
                                    document.body.classList.remove(classes.bodyOpen);
                                    document.documentElement.classList.remove(classes.bodyOpen);
                                }, 600);
                                return _context.abrupt("return", res);

                            case 44:
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
        _classCallCheck(this, DialogController);

        this.resolver = resolver;
    }

    _createClass(DialogController, [{
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

export { DialogService, DialogController, hideElement, focusElement };
