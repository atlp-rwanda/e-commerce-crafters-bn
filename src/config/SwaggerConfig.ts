import express = require("express");

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
     type: "http",
     scheme: "bearer",
     bearerFormat: "JWT",
    },
   },
  },
  servers: [
   {
    url: "http://localhost:5000",
   },
   {
    url: "https://e-commerce-crafters-bn-6aiy.onrender.com",
   },
  ],
 },
 apis: ["./src/docs/*.yaml"],
};
const swaggerSpec = swaggerJSDoc(options);

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
