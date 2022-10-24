/*
 * @Author: loveyy520 201357337@qq.com
 * @Date: 2022-10-24 13:42:49
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 14:02:37
 * @FilePath: \onlyy-cli\scripts\resetDevPkg.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { resolve } from "path";
import { writeFile, readJson, delDir } from "../helpers/index.js";

const cwd = process.cwd();
const tempDir = resolve(cwd, "scripts/temp"),
  filename = "package.json";

// 读取备份pkg
console.log("path: ", resolve(tempDir, filename));
const devPkg = await readJson(resolve(tempDir, filename));

console.log(devPkg);

// 恢复devPkg
writeFile(devPkg, cwd, filename);

// 删除备份
delDir(tempDir);
