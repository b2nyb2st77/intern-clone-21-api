const swaggerUi = require('swagger-ui-express')
const swaggereJsdoc = require('swagger-jsdoc')

const options = {
  swaggerDefinition: {
    components: {},
    definitions: {},
    info: {
      title: 'Carmore API',
      version: '1.0.0',
      description: 'Test API of Carmore'
    },
    host: 'ec2-52-78-81-30.ap-northeast-2.compute.amazonaws.com:3000',
    basePath: '/'
  },
  apis: ['./routes/*.js', './swagger/*']
}

const specs = swaggereJsdoc(options)

module.exports = {
  swaggerUi,
  specs
}
