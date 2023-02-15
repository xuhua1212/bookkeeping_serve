/*
 * @Author: xuhua
 * @Date: 2023-02-15 15:53:17
 * @LastEditors: xuhua
 * @LastEditTime: 2023-02-15 16:18:18
 * @FilePath: /bookkeeping_serve/app/controller/upload.js
 * @Description:  上传文件
 */
const AjaxRequest = require("../utils/ajaxRequest");
const fs = require("fs");
const moment = require("moment");
const mkdirp = require("mkdirp");
const path = require("path");

const { Controller } = require("egg");

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    // 需要前往 config/config.default.js 设置 config.multipart 的 mode 属性为 file
    let file = ctx.request.files[0];
    let uploadDir = "";

    try {
      // ctx.request.files[0] 表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
      let f = fs.readFileSync(file.filepath);
      // 获取当前日期
      let day = moment(new Date()).format("YYYYMMDD");
      // 获取保路径
      let dir = path.join(this.config.uploadDir, day);
      // 毫秒数
      let date = Date.now();
      // 创建文件夹
      await mkdirp(dir);
      // 返回图片保存路径
      uploadDir = path.join(dir, date + path.extname(file.filename));
      // 写入文件夹
      fs.writeFileSync(uploadDir, f);
    } catch (error) {
      console.log(error);
      ctx.body = AjaxRequest.error("上传失败");
    } finally {
      // 删除临时文件
      ctx.cleanupRequestFiles();
    }

    ctx.body = AjaxRequest.success("上传成功", {
      uploadDir: uploadDir.replace(/app/g, ""),
    });
  }
}

module.exports = UploadController;
