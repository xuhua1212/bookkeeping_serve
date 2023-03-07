/*
 * @Author: xuhua
 * @Date: 2023-03-07 16:45:18
 * @LastEditors: xuhua
 * @LastEditTime: 2023-03-07 16:59:26
 * @FilePath: /bookkeeping_serve/app/service/type.js
 * @Description:
 */
const { Service } = require("egg");

class TypeService extends Service {
  // 获取类型列表
  async getTypeList() {
    const { app } = this;
    const queryStr = "id, name, user_id ,type";
    const sql = `select ${queryStr} from type`;
    const result = await app.mysql.query(sql);
    return result;
  }
}
module.exports = TypeService;
