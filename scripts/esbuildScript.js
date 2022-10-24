/*
 * @Author: loveyy520 201357337@qq.com
 * @Date: 2022-10-24 10:16:09
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 12:51:35
 * @FilePath: \onlyy-cli\build.js
 * @Description: 打包为 cjs 模块
 */

import { buildSync } from "esbuild";

const buildOptions = {
  entryPoints: ["./bin/main.js"],
  bundle: true,
  format: "cjs",
  platform: "node",
  external: ["node_modules", "electron"],
  outfile: "./bin/index.common.js",
};

buildSync(buildOptions);
