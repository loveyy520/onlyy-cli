/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-23 11:24:09
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 13:56:16
 * @FilePath: \onlyy-cli\helpers\copyFile.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from "fs-extra";
import { resolve } from "path";

// 将目标文件/目录拷贝到临时文件
export const copyFile = async (temp, target) => {
  await fs.copy(temp, target);
  await fs.remove(resolve(target, "./.git"));
  const pkgJson = await fs.readJson(target + "/package.json");
  return pkgJson;
};

// 写入
export const writeFile = async (src, targetDir, filename) => {
  if (!fs.existsSync(targetDir)) {
    await fs.mkdir(targetDir);
  }
  const data = typeof src === "string" ? src : toJson(src);
  await fs.writeFile(resolve(targetDir, filename), data);
};

// 删除目录
export const delDir = async (dir) => await fs.remove(dir);

// 读取 Json
export const readJson = async (jsonFile) => await fs.readJSON(jsonFile);

// 对象转Json
export const toJson = (obj) => JSON.stringify(obj, null, 2);
