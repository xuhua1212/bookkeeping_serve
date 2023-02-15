/*
 * @Author: xuhua
 * @Date: 2023-02-15 14:59:55
 * @LastEditors: xuhua
 * @LastEditTime: 2023-02-15 15:02:31
 * @FilePath: /bookkeeping_serve/app/middleware/jwtErr.js
 * @Description: jwt校验中间件
 */
module.exports = (secret) => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;
    let decode;
    if(token != 'null' && token) {
     try {
        decode = ctx.app.jwt.verify(token, secret);
        await next();
     } catch (error) {
        console.log('jwtErr ~ error', error)
        ctx.status = 200;
        ctx.body = {
          msg:'token失效,请重新登录',
          code:401
        }
        return
     }
    }else{
      ctx.status = 200;
      ctx.body = {
        msg:'token不存在,请重新登录',
        code:401
      }
      return
    }
  }
}