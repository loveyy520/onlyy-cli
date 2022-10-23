/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-22 22:59:13
 * @LastEditors: Loveyy 201357337@qq.com
 * @LastEditTime: 2022-10-22 23:23:25
 * @FilePath: \onlyy-cli\helpers\read.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 读取 json 和 js 文件

import fs from "fs-extra";

export const read = (file) => {
  let res = fs.readFileSync(file, "utf8");
  if (file.endsWith(".json")) {
    res = res && JSON.parse(res);
  } else if (file.endsWith(".js")) {
    const module = { exports: {} };
    let exports = module.exports;
    new Function(res)();
    res = module.exports;

    console.log(res);
  }
  if (!res) {
    console.error(chalk.red("read file failed"));
  }
  return res;
};
