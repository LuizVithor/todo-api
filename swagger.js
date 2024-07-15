
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API com Swagger',
      version: '1.0.0',
    },
  },
  apis: ['./routes/index.js', './routes/auth.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;