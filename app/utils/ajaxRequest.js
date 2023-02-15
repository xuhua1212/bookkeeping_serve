/*
 * @Author: xuhua
 * @Date: 2023-02-15 15:09:32
 * @LastEditors: xuhua
 * @LastEditTime: 2023-02-15 16:54:06
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
  error(code = 500, msg = "error", data = null) {
    return {
      code,
      msg,
      data,
    };
  },
};
