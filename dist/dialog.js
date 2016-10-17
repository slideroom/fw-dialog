"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fw = require("fw");

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};

var classes = {
    wrapper: "fw-dialog-wrapper",
    container: "fw-dialog",
    bodyOpen: "fw-dialog-open",
    open: "open"
};

var DialogService = (function () {
    function DialogService() {
        _classCallCheck(this, DialogService);
    }

    _createClass(DialogService, [{
        key: "open",
        value: function open(view, data) {
            return __awaiter(this, void 0, Promise, regeneratorRuntime.mark(function callee$2$0() {
                var ve, dialogElement, containerElement, resolver, returnPromise, controller, v, prevent, close, escHandler, res;
                return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            ve = new _fw.ViewEngine(_fw.ContainerInstance);
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

                            prevent = function prevent(e) {
                                e.stopImmediatePropagation();
                                e.stopPropagation();
                                e.preventDefault();
                            };

                            close = function close(e) {
                                resolver({ canceled: true, result: null });
                                prevent(e);
                            };

                            escHandler = function escHandler(e) {
                                if (e.keyCode == 27) {
                                    close(e);
                                }
                            };

                            dialogElement.addEventListener("click", close);
                            containerElement.addEventListener("click", prevent);
                            document.addEventListener("keydown", escHandler);
                            context$3$0.next = 23;
                            return v.activate();

                        case 23:
                            context$3$0.next = 25;
                            return returnPromise;

                        case 25:
                            res = context$3$0.sent;

                            // animate out??
                            containerElement.classList.remove(classes.open);
                            dialogElement.classList.remove(classes.open);
                            // remove after a bit.. preferabbly when all animations are done...
                            setTimeout(function () {
                                v.remove();
                                containerElement.removeEventListener("click", prevent);
                                containerElement.remove();
                                dialogElement.removeEventListener("click", close);
                                dialogElement.remove();
                                document.removeEventListener("keydown", escHandler);
                                document.body.classList.remove(classes.bodyOpen);
                                document.documentElement.classList.remove(classes.bodyOpen);
                            }, 600);
                            return context$3$0.abrupt("return", res);

                        case 30:
                        case "end":
                            return context$3$0.stop();
                    }
                }, callee$2$0, this);
            }));
        }
    }]);

    return DialogService;
})();

exports.DialogService = DialogService;

var DialogController = (function () {
    function DialogController(resolver) {
        _classCallCheck(this, DialogController);

        this.resolver = resolver;
    }

    _createClass(DialogController, [{
        key: "close",
        value: function close(canceled, result) {
            if (canceled === undefined) canceled = false;

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
})();

exports.DialogController = DialogController;

// setup key listener for ESC; and call cancel or close or something on the controller...