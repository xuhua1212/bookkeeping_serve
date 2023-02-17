/*
 * @Author: xuhua
 * @Date: 2023-02-15 16:31:49
 * @LastEditors: xuhua
 * @LastEditTime: 2023-02-17 17:15:56
 * @FilePath: /bookkeeping_serve/app/controller/bill.js
 * @Description: 账单相关接口
 */
const { Controller } = require("egg");
const AjaxRequest = require("../utils/ajaxRequest");
const moment = require("moment");

class BillController extends Controller {
  // 新增账单
  async addBill() {
    const { ctx, app } = this;
    const { pay_type, amount, type_id, type_name, date, remark = "" } = ctx.request.body;

    // 判空处理
    if (!pay_type || !amount || !type_id || !type_name || !date) {
      ctx.body = AjaxRequest.error("参数不完整");
      return;
    }

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;
      await ctx.service.bill.addBill({
        user_id,
        pay_type,
        amount,
        type_id,
        type_name,
        date,
        remark,
      });
      ctx.body = AjaxRequest.success("新增账单成功");
    } catch (error) {
      console.log(error);
      ctx.body = AjaxRequest.error(500, "系统错误");
    }
  }

  // 获取账单列表
  async getBillList() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 5, type_id = "all" } = ctx.query;

    try {
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;

      // 获取账单列表
      const billList = await ctx.service.bill.getBillList({ user_id });

      // 过滤账单列表
      let filterBillList = billList.filter((item) => {
        if (type_id !== "all") {
          return moment(Number(item.date)).format("YYYY-MM") === date && item.type_id === type_id;
        }
        return moment(Number(item.date)).format("YYYY-MM") === date;
      });

      // 格式化数据
      let listMap = filterBillList
        .reduce((curr, item) => {
          // 默认初始curr为空[]
          // 把第一个账单时间格式化为YYYY-MM-DD
          const date = moment(Number(item.date)).format("YYYY-MM-DD");

          const currFlag = curr && curr.length;
          const currFindIndex = curr.findIndex((item) => item.date == date);
          // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组。
          if (currFlag && currFindIndex > -1) {
            curr[currFindIndex].bills.push(item);
          }

          // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
          if (currFlag && currFindIndex == -1) {
            curr.push({
              date,
              bills: [item],
            });
          }

          // 如果 curr 为空数组，则默认添加第一个账单项 item ，格式化为下列模式
          if (!curr.length) {
            curr.push({
              date,
              bills: [item],
            });
          }

          return curr;
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date)); // 时间顺序倒叙,时间越新,排在上面

      // 分页处理
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);

      // 计算当月收入和支出
      // 1.获取当月所有账单列表
      let sameMonthBillList = billList.filter((item) => moment(Number(item.date)).format("YYYY-MM") == date);
      // 累加计算支出
      let totalExpense = sameMonthBillList.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      // 累加计算收入
      let totalIncome = sameMonthBillList.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      ctx.body = AjaxRequest.success("请求成功", {
        totalExpense, // 当月支出
        totalIncome, // 当月收入
        totalPage: Math.ceil(listMap.length / page_size),
        list: filterListMap || [],
      });
    } catch (error) {
      console.log("BillController ~ getBillList ~ error", error);
      ctx.body = AjaxRequest.error("系统错误");
    }
  }

  // 获取账单详情
  async getBillDetail() {
    const { ctx, app } = this;
    const { id = "" } = ctx.query;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;

    if (!id) {
      ctx.body = AjaxRequest.error("账单id不能为空");
      return;
    }

    try {
      const billDetail = await ctx.service.bill.getBillDetail(id, user_id);
      if (!billDetail) {
        ctx.body = AjaxRequest.error("订账单不存在");
        return;
      }
      ctx.body = AjaxRequest.success("请求成功", billDetail);
    } catch (error) {
      console.log("BillController ~ getBillDetail ~ error", error);
      ctx.body = AjaxRequest.error("系统错误");
    }
  }

  // 编辑账单
  async editBill() {
    const { ctx, app } = this;
    const { id, pay_type, amount, type_id, type_name, date, remark = "" } = ctx.request.body;
    //判空
    if (!pay_type || !amount || !type_id || !type_name || !date) {
      ctx.body = AjaxRequest.error("参数不完整");
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;

      const result = await ctx.service.bill.editBill({
        id,
        user_id,
        pay_type,
        amount,
        type_id,
        type_name,
        date,
        remark,
      });

      if (!result) {
        ctx.body = AjaxRequest.error("账单不存在");
        return;
      }
      ctx.body = AjaxRequest.success("编辑账单成功");
    } catch (error) {
      console.log("BillController ~ editBill ~ error", error);
      ctx.body = AjaxRequest.error("系统错误");
    }
  }

  // 删除账单
  async deleteBill() {
    const { ctx, app } = this;
    const { id = "" } = ctx.query;
    if (!id) {
      ctx.body = AjaxRequest.error("账单id不能为空");
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;

      const result = await ctx.service.bill.deleteBill(id, user_id);
      if (result.affectedRows == 0) {
        ctx.body = AjaxRequest.error("账单不存在");
        return;
      }
      ctx.body = AjaxRequest.success("删除账单成功");
    } catch (error) {
      console.log("BillController ~ deleteBill ~ error", error);
      ctx.body = AjaxRequest.error("系统错误");
    }
  }

  // 统计账单
  async getBillStatistics() {
    const { ctx, app } = this;
    const { date = "" } = ctx.query;

    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;

    if (!date) {
      ctx.body = AjaxRequest.error("时间参数不能为空");
      return;
    }

    try {
      // 1.获取账单列表
      const billList = await ctx.service.bill.getBillList({ user_id });
      // 2.根据时间参数,筛选出当月的账单列表
      const start = moment(date).startOf("month").unix() * 1000; // 月初时间
      const end = moment(date).endOf("month").unix() * 1000; // 月末时间
      const _data = billList.filter((item) => {
        if (item.date > start && item.date < end) {
          return item;
        }
      });

      // 总支出
      let totalExpense = _data.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount);
        }
        return curr;
      }, 0);

      // 总收入
      let totalIncome = _data.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount);
        }
        return curr;
      }, 0);

      // 收支构成
      let incomeAndExpense = _data.reduce((curr, item) => {
        const index = curr.findIndex((i) => i.type_id == item.type_id);
        if (index == -1) {
          curr.push({
            type_id: item.type_id,
            type_name: item.type_name,
            pay_type: item.pay_type,
            number: Number(item.amount),
          });
        }
        if (index > -1) {
          curr[index].number += Number(item.amount);
        }
        return curr;
      }, []);

      incomeAndExpense = incomeAndExpense.map((item) => {
        item.number = Number(Number(item.number).toFixed(2));
        return item;
      });

      ctx.body = AjaxRequest.success({ totalExpense, totalIncome, incomeAndExpense });
    } catch (error) {
      console.log("BillController ~ getBillStatistics ~ error", error);
      ctx.body = AjaxRequest.error("系统错误");
    }
  }
}

module.exports = BillController;
