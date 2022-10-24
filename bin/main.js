#! /usr/bin/env node

/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-22 19:07:52
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 14:36:41
 * @FilePath: \onlyy-cli\bin\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { program } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import minimist from "minimist";

import { create } from "../lib/create.js";
import { readJson } from "../helpers/index.js";
// console.log(Inquirer);

const pkg = readJson("../package.json");

// console.log(program);

// 优化 --help 提示体验
program.on("--help", () => {
  console.log(
    "\n" +
      chalk.cyanBright.bold(
        figlet.textSync("onlyy", {
          font: "3D-ASCII",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 80,
          whitespaceBreak: true,
        })
      )
  );
  console.log(
    `Run ${chalk.cyan(
      "onlyy-cli < command > --help"
    )} for detailed usage of given command.`
  );
});

// 处理命令
program
  .name("onlyy")
  .usage("<command> [options]") // 命令形式：命令 + 参数选项
  .version(`onlyy-cli ${pkg.version}`); // 版本

// 处理 create 命令
program
  .name("onlyy-cli")
  .command("create <project-name>")
  .description("You are trying to create a new project ...")
  .option(
    "-p, --preset <presetName>",
    "Skip prompts and use saved or remote preset"
  )
  .option("-d, --default", "Skip prompts and use default preset")
  .option(
    "-f, --force",
    "Skip prompts and overwrite target directory if it exists"
  )
  .action((name, cmd) => {
    // console.log(name, cmd);
    // 检测输入的名称参数数量
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(
        chalk.yellow(
          "\n ⚠️  Detected more than one name arguments inputed, only the 1st will be used as project name and others are aborted."
        )
      );
    }

    // 导入的create函数
    create(name, cmd);
  });

// 创建页面的命令
program
  .name("oblyy")
  .command("page <page-name>")
  .description("Create a new page")
  .option("-f, --force", "Overwrite target directory if it exists")
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    //
  });

// 解析参数，若不执行这一步，则command无法接收到命令行的参数
program.parse(process.argv);
