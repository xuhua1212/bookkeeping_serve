"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  // 上传
  router.post("/api/upload", controller.upload.upload);
  // 注册
  router.post("/api/user/register", controller.user.register);
  // 登录
  router.post("/api/user/login", controller.user.login);
  // 获取用户信息
  router.get("/api/user/getUserInfo", _jwt, controller.user.getUserInfo);
  // 修改用户信息(签名,头像)
  router.post("/api/user/editUserInfo", _jwt, controller.user.editUserInfo);
  // 验证token
  router.get("/api/user/verify", _jwt, controller.user.verify);

  // 账单新增
  router.post("/api/bill/addBill", _jwt, controller.bill.addBill);
  // 账单列表
  router.get("/api/bill/getBillList", _jwt, controller.bill.getBillList);
};
