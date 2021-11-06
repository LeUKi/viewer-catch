const router = require('../node_modules/koa-router')()
const Config = require('../VCconfig');
router.get('/client.js', async (ctx, next) => {
    ctx.set('Content-Type', 'application/javascript');
    ctx.body = `var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(a){return a.raw=a};$jscomp.createTemplateTagFirstArgWithRaw=function(a,b){a.raw=b;return a};function k(){for(var a=document.cookie.split(";"),b=0;b<a.length;b++)if(0==a[b].trim().indexOf("vcc_"+location.host))return!1;a=new Date;a.setTime(a.getTime()+864E5);document.cookie="vcc_"+location.host+"=1; expires="+a.toGMTString();return!0}fetch('${Config.serviceURL}:${Config.truePort}/viewerCatch',{method:"POST",headers:{host:location.host,path:location.pathname,nv:k()}}).then(function(a){return a.json()}).then(function(a){"pv uv like pv_sum uv_sum like_sum path_count".split(" ").forEach(function(b){document.querySelectorAll(".VCC .VCC_"+b+",.VCC.VCC_"+b).forEach(function(c){c.innerHTML=a.data[b]})});document.querySelectorAll(".VCC VCC_visibility,.VCC.VCC_visibility").forEach(function(b){b.style.visibility="visible"})});`
})
module.exports = router.routes();