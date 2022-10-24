/*
 * @Author: loveyy520 201357337@qq.com
 * @Date: 2022-10-24 11:00:50
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 14:45:53
 * @FilePath: \onlyy-cli\rollup.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { terser } from "rollup-plugin-terser";

export default {
  input: "./bin/main.js",
  output: {
    file: "./bin/index.js",
    format: "es",
    plugins: [terser()],
  },
  external: [
    "commander",
    "chalk",
    "figlet",
    "minimist",
    "path",
    "fs-extra",
    "inquirer",
    "axios",
    "ora",
    "download-git-repo",
    "util",
    "execa",
    "events",
    "validate-npm-package-name",
    "process",
    "readline",
  ],
};
