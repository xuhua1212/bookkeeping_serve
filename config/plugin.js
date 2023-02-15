/*
 * @Author: xuhua
 * @Date: 2023-02-14 17:31:59
 * @LastEditors: xuhua
 * @LastEditTime: 2023-02-15 16:07:20
 * @FilePath: /bookkeeping_serve/config/plugin.js
 * @Description:
 */
"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mysql: {
    enable: true,
    package: "egg-mysql",
  },
  jwt: {
    enable: true,
    package: "egg-jwt",
  },
  cros: {
    enable: true,
    package: "egg-cors",
  },
};
