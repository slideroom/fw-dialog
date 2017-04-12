import { ContainerInstance, ViewEngine } from 'fw';

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













function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var classes = {
    wrapper: "fw-dialog-wrapper",
    container: "fw-dialog",
    bodyOpen: "fw-dialog-open",
    open: "open"
};
var DialogService = function () {
    function DialogService() {
        _classCallCheck(this, DialogService);
    }

    _createClass(DialogService, [{
        key: "open",
        value: function open(view, data) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var ve, dialogElement, containerElement, resolver, returnPromise, controller, v, stop, close, escHandler, res;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                ve = new ViewEngine(ContainerInstance);
                                dialogElement = document.createElement("div");

                                dialogElement.classList.add(classes.wrapper);
                                document.body.appendChild(dialogElement);
                                containerElement = document.createElement("div");

                                containerElement.classList.add(classes.container);
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
                                v.renderTo(containerElement);
                                setTimeout(function () {
                                    containerElement.classList.add(classes.open);
                                    dialogElement.classList.add(classes.open);
                                }, 100);

                                stop = function stop(e) {
                                    e.stopPropagation();
                                };
                                // setup key listener for ESC; and call cancel or close or something on the controller...


                                close = function close(e) {
                                    resolver({ canceled: true, result: null });
                                    stop(e);
                                };

                                escHandler = function escHandler(e) {
                                    if (e.keyCode == 27) {
                                        close(e);
                                    }
                                };

                                dialogElement.addEventListener("click", close);
                                containerElement.addEventListener("click", stop);
                                document.addEventListener("keydown", escHandler);
                                _context.next = 23;
                                return v.activate();

                            case 23:
                                _context.next = 25;
                                return returnPromise;

                            case 25:
                                res = _context.sent;

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
                                    document.removeEventListener("keydown", escHandler);
                                    document.body.classList.remove(classes.bodyOpen);
                                    document.documentElement.classList.remove(classes.bodyOpen);
                                }, 600);
                                return _context.abrupt("return", res);

                            case 30:
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

export { DialogService, DialogController };
