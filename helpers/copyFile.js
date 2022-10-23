/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-23 11:24:09
 * @LastEditors: Loveyy 201357337@qq.com
 * @LastEditTime: 2022-10-23 11:40:19
 * @FilePath: \onlyy-cli\helpers\copyFile.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from "fs-extra";
import { resolve } from "path";

// 将目标文件/目录拷贝到临时目录temp
export const copyFile = async (temp, target) => {
  await fs.copy(temp, target);
  await fs.remove(resolve(target, "./.git"));
  const pkgJson = await fs.readJson(target + "/package.json");
  return pkgJson;
};
