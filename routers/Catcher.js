const router = require('../node_modules/koa-router')()
const getDB = require('../mongoDB')
/**
 * @swagger
 * /viewerCatch:
 *   post:
 *     summary: 标准统计
 *     description: 支持UV统计，仅支持Post请求方案，返回具体数据
 *     tags:
 *       - Catcher
 *     parameters:
 *       - name: d
 *         in: query
 *         required: true
 *         description: dDomain 主机域名 必填
 *         type: string
 *       - name: p
 *         in: query
 *         required: false
 *         description: Path 访问路径 默认为"/" 可指定
 *         type: string 
 *       - name: nv
 *         in: query
 *         required: false
 *         description: NewViewer 默认为false UV统计相关
 *         type: string 
 *     responses:
 *       200:
 *         description: 成功获取
 *       -1:
 *        description: 缺少参数 d
 */
router.post('/viewerCatch', async (ctx, next) => {
    if (!(ctx.header.origin || ctx.request.body.d)) {
        ctx.body = {
            code: -1
        }
        return
    }
    let data = {
        d: ctx.request.body.d || ctx.header.origin.replace(/^https?:\/\//, ''),
        p: ctx.request.body.p || "/",
    }
    console.log(data);
    let result1 = getDB.aggregate('page', [{
            $match: data
        },
        {
            $project: {
                _id: 0,
            }
        }
    ])
    let result2 = getDB.aggregate('page', [{
            $match: {
                d: data.d
            }
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
                _id: 0,
            }
        }
    ])
   await Promise.all([result1, result2]).then((result) => {
        if (result[0].length !== 0) {
            ctx.body = {
                data: {
                    ...result[0][0],
                    ...result[1][0]
                },
                code: 200
            }
            getDB.updateOne('page', data, {
                $inc: {
                    pv: 1,
                    uv: JSON.parse(ctx.request.body.nv || 'false') ? 1 : 0
                }
            })
        } else {
            ctx.body = {
                data: {
                    uv: 1,
                    pv: 0,
                    like: 0,
                    uv_sum: 0,
                    pv_sum: 0,
                    like_sum: 0,
                    ...data
                },
                code: 200
            }
            getDB.insertOne('page', {
                ...data,
                uv: 1,
                pv: 0,
                like: 0
            })
        }
    });
})
/**
 * @swagger
 * /simpleCatch:
 *   get:
 *     summary: 简单统计
 *     description: 无UV统计，支持script引用方案与Get请求方案，前者无返回，后者返回具体数据
 *     tags:
 *       - Catcher
 *     parameters:
 *       - name: d
 *         in: query
 *         required: true
 *         description: Domain 域名 script引用方案必填 Get请求方案可忽略
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
router.get('/simpleCatch', async (ctx, next) => {
    if (!(ctx.header.origin || ctx.query.d)) {
        ctx.body = {
            code: -1
        }
        return
    }
    let data = {
        d: ctx.query.d || ctx.header.origin.replace(/^https?:\/\//, ''),
        p: ctx.query.p || "/",
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
        getDB.updateOne('page', data, {
            $inc: {
                pv: 1,
            }
        })
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
            uv: 1,
            pv: 0,
            like: 0
        })
    }
})
module.exports = router.routes();