/*
 * @Author: xuhua
 * @Date: 2023-02-15 16:59:42
 * @LastEditors: xuhua
 * @LastEditTime: 2023-02-15 18:24:25
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

  // 获取账单详情
  async getBillDetail(id, user_id) {
    const { app } = this;
    const result = await app.mysql.get("bill", { id, user_id });
    return result;
  }

  // 编辑
  async editBill(params) {
    const { app } = this;
    const result = await app.mysql.update(
      "bill",
      { ...params },
      {
        id: params.id,
        user_id: params.user_id,
      }
    );
    return result;
  }

  //删除
  async deleteBill(id, user_id) {
    const { app } = this;
    const result = await app.mysql.delete("bill", { id, user_id });
    return result;
  }
}
module.exports = BillService;
