"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const router = express.Router();
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Code crafters api documentation",
            version: "1.0.0",
            description: "Multi vendor ecommerce api docs",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "https",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        servers: [
            {
                url: "https://e-commerce-crafters-bn.onrender.com",
            },
        ],
    },
    apis: ["./src/docs/*.yaml"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
router.use("/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
exports.default = router;
