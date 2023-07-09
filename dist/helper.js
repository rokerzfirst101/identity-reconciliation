"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushIfValueNotNullAndNotInArray = void 0;
const pushIfValueNotNullAndNotInArray = (array, data) => {
    if (data === undefined || data === null) {
        return array;
    }
    if (array.indexOf(data) === -1) {
        array.push(data);
    }
    return array;
};
exports.pushIfValueNotNullAndNotInArray = pushIfValueNotNullAndNotInArray;
//# sourceMappingURL=helper.js.map