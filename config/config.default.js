/*
 * @Author: xuhua
 * @Date: 2023-02-14 17:31:59
 * @LastEditors: xuhua
 * @LastEditTime: 2023-03-02 16:36:40
 * @FilePath: /bookkeeping_serve/config/config.default.js
 * @Description:
 */
/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1676367113432_523";

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
  };
  // 上传文件类型
  config.multipart = {
    mode: "file",
  };
  // 跨域cros
  config.cors = {
    origin: "*", // 允许所有域名访问
    credentials: true, // 允许跨域携带cookie
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };
  config.bodyParser = {
    jsonLimit: "300mb",
  };
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: "127.0.0.1",
      // 端口号
      port: "3306",
      // 用户名
      user: "root",
      // 密码
      password: "123456", // 初始化密码，没设置的可以不写
      // 数据库名
      database: "bookkeeping", // 我们新建的数据库名称
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.jwt = {
    secret: "bookkeeping",
  };

  config.swaggerdoc = {
    dirScanner: "./app/controller",
    apiInfo: {
      title: "bookkeeping",
      description: "bookkeeping api doc",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    consumes: ["application/json", "multipart/form-data"],
    produces: ["application/json", "multipart/form-data"],
    enableSecurity: false,
    // enableValidate: true,
    routerMap: true,
    enable: true,
  };

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: "app/public/upload",
  };

  return {
    ...config,
    ...userConfig,
  };
};
