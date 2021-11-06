const Koa = require('koa')
const Router = require('./router')
const bodyParser = require('./node_modules/koa-bodyparser')
const cors = require('./node_modules/koa2-cors')
const swagger = require('./swagger')
const Config = require('./VCconfig');
const {
    koaSwagger
} = require('./node_modules/koa2-swagger-ui')
const app = new Koa()
console.log('VC satrt now.');
app.use(cors())
app.use(bodyParser())
app.use(koaSwagger({
    routePrefix: '/apis',
    swaggerOptions: {
        url: '/swagger.json',
    }
}))
app.use(Router)
app.use(swagger.routes(), swagger.allowedMethods())
app.listen(Config.servicePort)
console.log('now VC run in', Config.servicePort);