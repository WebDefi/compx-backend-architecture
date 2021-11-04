"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.checkIfExists = exports.uploadFile = void 0;
const awsConnector_1 = require("./awsConnector");
const uploadFile = (arrayBufferContent, fileName) => {
    // Setting up S3 upload parameters
    const params = {
        Bucket: 'compx-filestore',
        Key: fileName,
        Body: arrayBufferContent,
    };
    // Uploading files to the bucket
    awsConnector_1.s3.upload(params, (err, data) => {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};
exports.uploadFile = uploadFile;
const checkIfExists = (pathToFile) => {
    const params = {
        Bucket: 'compx-filestore',
        Key: pathToFile,
    };
    try {
        awsConnector_1.s3.headObject(params);
    }
    catch (err) {
        if (err && err.code === 'NotFound') {
            return { error: err };
        }
    }
    return {};
};
exports.checkIfExists = checkIfExists;
const deleteFile = (pathToFile) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: 'compx-filestore',
        Key: pathToFile,
    };
    return awsConnector_1.s3.deleteObject(params).promise();
});
exports.deleteFile = deleteFile;
(() => __awaiter(void 0, void 0, void 0, function* () {
    // await deleteFile('b55ddbe4-a692-4865-8076-8abe74ebc06f/sticker.jpg')
    // console.log(await s3.listObjects({Bucket: "file-storage-workbattle"}).promise());
}))();
