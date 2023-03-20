/*
 * @Author: xuhua
 * @Date: 2023-02-14 18:23:28
 * @LastEditors: xuhua
 * @LastEditTime: 2023-03-20 14:53:18
 * @FilePath: /bookkeeping_serve/app/service/user.js
 * @Description:
 */
const Service = require("egg").Service;

class UserService extends Service {
  // 通过用户名获取用户信息
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get("user", { username });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 修改用户信息
  async editUserInfo(params) {
    const { app } = this;
    try {
      const result = await app.mysql.update(
        "user",
        {
          ...params, // 修改的参数
        },
        {
          id: params.id, // 条件
        }
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 注册
  async register(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert("user", params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async modifyPass(params) {
    const { ctx, app } = this;
    try {
      let result = await app.mysql.update(
        "user",
        {
          ...params,
        },
        {
          id: params.id,
        }
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
