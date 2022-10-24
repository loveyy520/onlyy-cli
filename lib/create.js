/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-22 22:30:32
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 12:04:59
 * @FilePath: \onlyy-cli\lib\create.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { resolve, relative } from "path";
import fs from "fs-extra";
import Inquirer from "inquirer";
import chalk from "chalk";
import validate from "validate-npm-package-name";

import { Creator } from "./Creator.js";
import { callWithLoading } from "../helpers/index.js";
import { exit } from "process";
import { clearScreenDown } from "readline";

export const create = async (appName, options = {}) => {
  // 当前工作目录
  const cwd = options.cwd || process.cwd();
  // 是否在当前目录
  const inCurrent = appName === ".";
  appName = inCurrent ? relative("../", cwd) : appName;

  const validateNameResult = validate(appName);
  if (!validateNameResult.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${appName}\n"`));
    validateNameResult.errors?.forEach((e) =>
      console.error("❌ " + chalk.red.dim(e))
    );
    validateNameResult.warnings?.forEach((msg) =>
      console.warn("⚠️ " + chalk.yellow.dim(msg))
    );
    exit(1);
  }
  //
  const targetDirectory = resolve(cwd, appName);

  const validateDir = await validateTargetDir(targetDirectory, options.force);
  if (!validateDir) return;

  // 开始新建
  console.log(chalk.blue.bold("sstart"));
  const creator = new Creator(appName, targetDirectory);
  await creator.create(options);
};

const overwriteSelections = [
  // 返回值为promise
  {
    name: "willOverwrite",
    type: "list", // list 为单选，checkbox为多选
    message: "Target directory exists. Shall it be overwriten ?",
    choices: [
      // value 对应 willOverwrite 的值
      { name: "Overwrite", value: true },
      { name: "Cancel", value: false },
    ],
  },
];

const validateTargetDir = async (targetDirectory, force) => {
  if (fs.existsSync(targetDirectory)) {
    try {
      if (!force) {
        // 清空控制台
        console.clear();
        // 不强制覆盖，交给用户选择
        const { willOverwrite } = await new Inquirer.prompt(
          overwriteSelections
        );
        // 用户取消，直接返回
        if (!willOverwrite) {
          console.error(chalk.yellow("\n ⚠️  Creation have been canceled."));
          return false;
        }
      }
      console.log("\n ⚠️ The old directory will be removed.");
      // --force 或者 用户选择覆盖原目录
      await callWithLoading(
        fs.remove,
        "deleting old directory...",
        targetDirectory
      );
      return true;
    } catch (e) {
      console.log(chalk.red(e));
      return false;
    }
  }
  return true;
};
