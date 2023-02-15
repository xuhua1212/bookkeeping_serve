/*
 * @Author: xuhua
 * @Date: 2023-02-15 16:59:42
 * @LastEditors: xuhua
 * @LastEditTime: 2023-02-15 17:54:14
 * @FilePath: /bookkeeping_serve/app/service/bill.js
 * @Description:
 */
const { Service } = require("egg");

class BillService extends Service {
  // 新增账单
  async addBill(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert("bill", params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 获取账单列表
  async getBillList({ user_id }) {
    const { ctx, app } = this;
    const queryStr = "id, pay_type, amount, date, type_id, type_name, remark";
    const sql = `select ${queryStr} from bill where user_id = ${user_id}`;
    const result = await app.mysql.query(sql);
    return result;
  }
}
module.exports = BillService;
