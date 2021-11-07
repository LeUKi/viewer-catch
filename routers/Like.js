const router = require('../node_modules/koa-router')()
const getDB = require('../mongoDB')
/**
 * @swagger
 * /like:
 *   post:
 *     summary: 点赞
 *     description: 返回点赞后的数据，点赞不能撤回
 *     tags:
 *       - Like
 *     parameters:
 *       - name: d
 *         in: header
 *         required: true
 *         description: dDomain 主机域名 必填
 *         type: string
 *       - name: p
 *         in: header
 *         required: false
 *         description: Path 访问路径 默认为"/" 可指定
 *         type: string 
 *     responses:
 *       200:
 *         description: 成功
 *       -1:
 *        description: 缺少参数 d
 */
router.post('/like', async (ctx, next) => {
    if (!(ctx.header.origin || ctx.header.d)) {
        ctx.body = {
            code: -1
        }
        return
    }
    let data = {
        d: ctx.header.d || ctx.header.origin.replace(/^https?:\/\//, ''),
        p: ctx.header.p || "/",
    }
    console.log(data);
    let result = await getDB.aggregate('page', [{
            $match: data
        },
        {
            $project: {
                _id: 0,
                uv: 0,
                pv: 0,
            }
        }
    ])
    if (result[0].length !== 0) {
        ctx.body = {
            data: {
                like: result[0].like + 1,
                ...data
            },
            code: 200
        }
        getDB.updateOne('page', data, {
            $inc: {
                like: 1,
            }
        })
    } else {
        ctx.body = {
            data: {
                like: 1,
                ...data
            },
            code: 200
        }
        getDB.insertOne('page', {
            ...data,
            uv: 1,
            pv: 0,
            like: 1
        })
    }
})
module.exports = router.routes();