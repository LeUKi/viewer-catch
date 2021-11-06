const router = require('../node_modules/koa-router')()
const getDB = require('../mongoDB')
/**
 * @swagger
 * /query:
 *   get:
 *     summary: 查询数据
 *     description: 返回具体数据
 *     tags:
 *       - Query
 *     parameters:
 *       - name: d
 *         in: query
 *         required: true
 *         description: Domain 域名 必填
 *         type: string
 *       - name: p
 *         in: query
 *         required: false
 *         description: Path 访问路径 默认为"/" 可指定
 *         type: string 
 *     responses:
 *       200:
 *         description: 成功获取
 *       -1:
 *        description: 缺少参数 d
 */
router.get('/query', async (ctx, next) => {
    if (!(ctx.header.origin || ctx.request.query.d)) {
        ctx.body = {
            code: -1
        }
        return
    }
    let data = {
        d: ctx.request.query.d || ctx.header.origin.replace(/^https?:\/\//, ''),
        p: ctx.request.query.p || "/",
    }
    console.log(data);
    let result = await getDB.aggregate('page', [{
            $match: data
        },
        {
            $project: {
                _id: 0,
            }
        }
    ])
    if (result.length !== 0) {
        ctx.body = {
            data: {
                ...result[0]
            },
            code: 200
        }
    } else {
        ctx.body = {
            data: {
                uv: 0,
                pv: 0,
                like: 0,
                ...data
            },
            code: 200
        }
        getDB.insertOne('page', {
            ...data,
            uv: 0,
            pv: 0,
            like: 0
        })
    }

})
/**
 * @swagger
 * /queryAll:
 *   get:
 *     summary: 查询数据
 *     description: 返回具体数据
 *     tags:
 *       - Query
 *     parameters:
 *       - name: d
 *         in: query
 *         required: true
 *         description: Domain 域名 必填
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       -1:
 *        description: 缺少参数 d
 */
router.get('/queryAll', async (ctx, next) => {
    if (!(ctx.header.origin || ctx.request.query.d)) {
        ctx.body = {
            code: -1
        }
        return
    }
    console.log(data);
    let data = {
        d: ctx.request.query.d || ctx.header.origin.replace(/^https?:\/\//, '')
    }
    let result = await getDB.aggregate('page', [{
            $match: data
        },
        {
            $group: {
                _id: null,
                pv_sum: {
                    $sum: '$pv'
                },
                uv_sum: {
                    $sum: '$uv'
                },
                like_sum: {
                    $sum: '$like'
                },
                path_count: {
                    $sum: 1,
                }
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ])
    if (result.length !== 0) {
        ctx.body = {
            data: {
                ...result[0]
            },
            code: 200
        }
    } else {
        ctx.body = {
            data: {
                uv: 0,
                pv: 0,
                like: 0,
                ...data
            },
            code: 200
        }
        getDB.insertOne('page', {
            ...data,
            uv: 0,
            pv: 0,
            like: 0
        })
    }

})
module.exports = router.routes();