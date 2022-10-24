/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-23 00:15:52
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 20:13:28
 * @FilePath: \onlyy-cli\lib\Creator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import EventEmitter from "events";
import fs from "fs-extra";
import chalk from "chalk";
import Inquirer from "inquirer";

import {
  download,
  // getRepoList,
  getRepo,
  getTagsByRepo,
  callWithLoading,
  installDeps,
} from "../helpers/index.js";

export class Creator extends EventEmitter {
  constructor(appName, targetDir) {
    super();
    this.appName = appName;
    this.targetDir = targetDir;
  }
  async create(options = {}) {
    // console.log();
    // this.repo = await this.inquireRepoInfo();
    this.repo = getRepo();
    this.tag = await this.inquireTagInfo();
    console.log(`You have selected ${chalk.yellow(this.repo, this.tag)}
       as a template.`);

    fs.mkdirSync(this.targetDir);
    console.log(this.repo, this.tag);
    await this.download();
    await this.installDeps();
    this.success();
  }
  async inquireRepoInfo() {
    return inquireRepoInfo();
  }
  async inquireTagInfo() {
    return inquireTagInfo(this.repo);
  }
  async download() {
    await download(this.repo, this.tag, this.targetDir);
  }
  async installDeps() {
    console.log("ctx: ", this.targetDir);
    await installDeps(this.targetDir, "yarn");
  }
  success() {
    // 创建成功后，模板使用提示
    console.clear();
    console.log(
      `
        \r\n${chalk.green("Successfully")} created project ${chalk.cyan(
        this.appName
      )}
        \r\n cd ${chalk.cyan(this.appName)}
        \r\n npm run dev
      `
    );
  }
}

const repoInquirerConfig = {
  name: "repo",
  type: "list",
  message: "Please choose a template",
};

const tagInquirerConfig = {
  name: "repo",
  type: "list",
  message: "Please choose a version",
};

const genRepoSelections = (baseConfig, choices) => [
  {
    ...baseConfig,
    choices,
  },
];

const createInfoInquirer =
  (baseConfig, requestFn) =>
  async (...args) => {
    try {
      const infoList = await callWithLoading(
        requestFn,
        `fetching ${baseConfig.name} information...`,
        ...args
      );
      const nameList = infoList.map((info) => info.name);
      const selection = await new Inquirer.prompt(
        genRepoSelections(baseConfig, nameList)
      );
      return selection[baseConfig.name];
    } catch (e) {
      console.log(chalk.red(e));
    }
  };

// const inquireRepoInfo = createInfoInquirer(repoInquirerConfig, getRepoList);

const inquireTagInfo = createInfoInquirer(tagInquirerConfig, getTagsByRepo);
