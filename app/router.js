/*
 * @Author: xuhua
 * @Date: 2023-02-14 17:31:59
 * @LastEditors: xuhua
 * @LastEditTime: 2023-03-20 14:54:17
 * @FilePath: /bookkeeping_serve/app/router.js
 * @Description:
 */
"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;

  // 重定向到swagger-ui.html
  router.redirect("/", "/swagger-ui.html", 302);

  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  // 上传
  router.post("/upload", controller.upload.upload);
  // 注册
  router.post("/user/register", controller.user.register);
  // 登录
  router.post("/user/login", controller.user.login);
  // 获取用户信息
  router.get("/user/getUserInfo", _jwt, controller.user.getUserInfo);
  // 修改用户信息(签名,头像)
  router.post("/user/editUserInfo", _jwt, controller.user.editUserInfo);
  // 验证token
  router.get("/user/verify", _jwt, controller.user.verify);
  // 重置密码
  router.post("/user/modifyPass", _jwt, controller.user.modifyPass);

  // 账单新增
  router.post("/bill/addBill", _jwt, controller.bill.addBill);
  // 账单列表
  router.get("/bill/getBillList", _jwt, controller.bill.getBillList);
  // 账单详情
  router.get("/bill/getBillDetail", _jwt, controller.bill.getBillDetail);
  // 编辑账单
  router.post("/bill/editBill", _jwt, controller.bill.editBill);
  // 删除账单
  router.get("/bill/deleteBill", _jwt, controller.bill.deleteBill);
  // 账单统计
  router.get("/bill/getBillStatistics", _jwt, controller.bill.getBillStatistics);

  // 类型列表
  router.get("/type/getTypeList", _jwt, controller.type.getTypeList);
};
