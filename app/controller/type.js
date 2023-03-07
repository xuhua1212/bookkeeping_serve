/*
 * @Author: xuhua
 * @Date: 2023-03-07 16:41:14
 * @LastEditors: xuhua
 * @LastEditTime: 2023-03-07 16:58:10
 * @FilePath: /bookkeeping_serve/app/controller/type.js
 * @Description:
 */
const { Controller } = require("egg");
const AjaxRequest = require("../utils/ajaxRequest");
const moment = require("moment");

class TypeController extends Controller {
  async getTypeList() {
    // 通过token 拿到用户信息
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const typeList = await ctx.service.type.getTypeList();
    ctx.body = AjaxRequest.success("请求成功", { list: typeList });
  }
}
module.exports = TypeController;
