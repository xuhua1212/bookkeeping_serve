/*
 * @Author: xuhua
 * @Date: 2023-02-14 18:19:53
 * @LastEditors: xuhua
 * @LastEditTime: 2023-03-02 16:38:26
 * @FilePath: /bookkeeping_serve/app/controller/user.js
 * @Description: 用户相关接口
 */
const { Controller } = require("egg");
const AjaxRequest = require("../utils/ajaxRequest");
const moment = require("moment");
const DEFAULT_AVATAR = "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png";
const DEFAULT_SIGNATURE = "这个人很懒，什么都没有留下";

/**
 * @Controller 用户相关接口
 */
class UserController extends Controller {
  /**
   * @summary 用户登录
   * @description 用户登录
   * @router post /api/user/login
   * @reponse 200 userResponse 登录成功
   */
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    // 先去查找是否存在该用户
    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.id) {
      ctx.body = AjaxRequest.error("账号不存在");
      return;
    }

    // 找到用户,判断密码是否正确
    if (userInfo && password != userInfo.password) {
      ctx.body = AjaxRequest.error("账号密码错误");
      return;
    }

    // 密码正确,生成token
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // token过期时间 24小时
      },
      app.config.jwt.secret
    );

    ctx.body = AjaxRequest.success("登录成功", { token });
  }

  // 注册
  async register() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      ctx.body = AjaxRequest.error("账号或密码不能为空");
      return;
    }
    // 判断库中是否存在该用户
    const userInfo = await ctx.service.user.getUserByName(username);
    if (userInfo) {
      ctx.body = AjaxRequest.error("账户名已被注册,请重新输入");
      return;
    }

    // 不存在则注册
    const result = await ctx.service.user.register({
      username,
      password,
      ctime: moment().format("X"),
      avatar: DEFAULT_AVATAR,
      signature: DEFAULT_SIGNATURE,
    });

    if (result) {
      ctx.body = AjaxRequest.success("注册成功");
    } else {
      ctx.body = AjaxRequest.error("注册失败,服务器异常,请重试");
    }
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;

    // 通过token 拿到用户信息
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);

    // 通过用户账号 去查找用户信息
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    if (!userInfo || !userInfo.username) {
      ctx.body = AjaxRequest.error("账号不存在");
      return;
    }

    // 不返回密码
    ctx.body = AjaxRequest.success("获取成功", {
      id: userInfo.id,
      username: userInfo.username,
      avatar: userInfo.avatar || DEFAULT_AVATAR,
      signature: userInfo.signature || DEFAULT_SIGNATURE,
    });
  }

  // 编辑用户信息
  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = "", avatar = "" } = ctx.request.body;

    try {
      // 通过token 拿到用户信息
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;

      // 通过用户账号 去查找用户信息
      const userInfo = await ctx.service.user.getUserByName(decode.username);

      // 通过用户信息 去修改用户信息
      await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });

      ctx.body = AjaxRequest.success("修改成功", {
        id: userInfo.id,
        username: userInfo.username,
        signature,
        avatar,
      });
    } catch (error) {
      console.log("UserController ~ editUserInfo ~ error", error);
      ctx.body = AjaxRequest.error("修改失败");
    }
  }

  // 验证方法
  async verify() {
    const { ctx, app } = this;

    // 通过token 拿到用户id
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);

    ctx.body = AjaxRequest.success("验证成功", { ...decode });
  }
}

module.exports = UserController;
