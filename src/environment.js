"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var v = require("valibot");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var nonEmptyString = v.pipe(v.string(), v.nonEmpty());
var environmentSchema = v.object({
    ALGOLIA_ADMIN_API_KEY: nonEmptyString,
    ALGOLIA_APP_ID: nonEmptyString,
    ALGOLIA_INDEX_NAME: nonEmptyString,
});
var environment = v.parse(environmentSchema, process.env);
exports.default = environment;
