/*
 * @Author: xuhua
 * @Date: 2023-02-15 15:09:32
 * @LastEditors: xuhua
 * @LastEditTime: 2023-02-15 18:14:39
 * @FilePath: /bookkeeping_serve/app/utils/ajaxRequest.js
 * @Description:
 */
module.exports = {
  success(msg = "success", data = null) {
    return {
      code: 200,
      msg,
      data,
    };
  },
  error(msg = "error", data = null) {
    return {
      code: 500,
      msg,
      data,
    };
  },
};
