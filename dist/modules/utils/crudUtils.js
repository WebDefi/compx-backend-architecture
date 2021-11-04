"use strict";
// functions to create queries
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructUpdateQueryStringBasedOnParams = exports.constructCreateQueryStringBasedOnParams = void 0;
function constructCreateQueryStringBasedOnParams(tableName, columnObject) {
    let columnNames = [];
    let columnValues = [];
    Object.keys(columnObject).forEach((columnKey) => {
        let tempColumnValue = columnObject[columnKey];
        if (tempColumnValue != undefined) {
            columnNames.push(columnKey);
            columnValues.push(tempColumnValue);
        }
    });
    const createRecordQueryString = `INSERT INTO ${tableName} (${columnNames.join(", ")}) VALUES (${columnNames.map((elem) => `$${columnNames.indexOf(elem) + 1}`)}) returning *`;
    return { queryString: createRecordQueryString, valuesArray: columnValues };
}
exports.constructCreateQueryStringBasedOnParams = constructCreateQueryStringBasedOnParams;
function constructUpdateQueryStringBasedOnParams(tableName, id, columnObject) {
    let columnValues = [];
    let updateRecordQueryString = `UPDATE ${tableName} SET `;
    let counter = 1;
    Object.keys(columnObject).forEach((columnKey) => {
        let tempColumnValue = columnObject[columnKey];
        if (tempColumnValue != undefined) {
            updateRecordQueryString += `${columnKey} = $${counter}, `;
            columnValues.push(tempColumnValue);
            counter += 1;
        }
    });
    updateRecordQueryString = updateRecordQueryString.substring(0, updateRecordQueryString.length - 2);
    updateRecordQueryString += ` WHERE id = $${counter} returning *`;
    columnValues.push(id);
    return { queryString: updateRecordQueryString, valuesArray: columnValues };
}
exports.constructUpdateQueryStringBasedOnParams = constructUpdateQueryStringBasedOnParams;
