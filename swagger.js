const router = require('./node_modules/koa-router')()
const swaggerJSDoc = require('./node_modules/swagger-jsdoc')
const swaggerDefinition = {
  info: {
    title: 'viewer-catch API',
    version: '1.0.0',
    description: 'API',
  },
  host: 'viewer-catch.herokuapp.com',
  basePath: '/'
};
const options = {
  swaggerDefinition,
  apis: ['./routers/*.js'],
};
const swaggerSpec = swaggerJSDoc(options)
router.get('/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json');
  ctx.body = swaggerSpec;
})
module.exports = router
