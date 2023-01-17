"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
function errorMiddleware(error, req, res, next) {
    console.log(error);
    console.log(typeof error);
    console.log("\x1b[33m%s\x1b[0m", error);
    res.status(400).send({ message: error.message });
}
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map