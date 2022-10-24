/*
 * @Author: loveyy520 201357337@qq.com
 * @Date: 2022-10-24 12:55:39
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 20:36:16
 * @FilePath: \onlyy-cli\scripts\publish.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { resolve } from "path";

import { writeFile, readJson } from "../helpers/index.js";

const cwd = process.cwd();
const pkg = resolve(cwd, "package.json");

const devPkg = await readJson(pkg);

const ignoredKeys = ["devDependencies", "scripts"];

// 新版本
const [mainVersion, preVersion] = devPkg.version.split("-dev-");
const newVersion = String(parseInt(preVersion.replace(/\./g, "")) + 1)
  .padStart(3, "0")
  .split("")
  .join(".");
const version = `${mainVersion}-dev-${newVersion}`;

const publishedPkg = Reflect.ownKeys(devPkg).reduce((pre, cur, i) => {
  if (!ignoredKeys.includes(cur)) {
    pre[cur] = devPkg[cur];
  }
  return pre;
}, {});

publishedPkg.version = version;
devPkg.version = version;

const tempDir = resolve(cwd, "scripts/temp");
const pkgName = "package.json";

// 备份devPkg
writeFile(devPkg, tempDir, pkgName);
// 发布时的package.json
writeFile(publishedPkg, cwd, pkgName);
