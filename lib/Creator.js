/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-23 00:15:52
 * @LastEditors: Loveyy 201357337@qq.com
 * @LastEditTime: 2022-10-23 16:58:26
 * @FilePath: \onlyy-cli\lib\Creator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import readline from "readline";

import EventEmitter from "events";
import chalk from "chalk";
import Inquirer from "inquirer";
import { execa } from "execa";

import {
  download,
  getRepoList,
  getTagsByRepo,
  callWithLoading,
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
    // this.tag = await this.inquireTagInfo();
    // console.log(`You have selected ${chalk.yellow(this.repo, this.tag)}
    //    as a template.`);

    // fs.mkdirSync(this.targetDir);
    // await this.download();
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
    console.log(
      `
        \r\n${chalk.green("Successfully")} created project ${chalk.cyan(
        this.appName
      )}
        \r\n cd ${chalk.cyan(this.appName)}
        \r\n npm install
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

const inquireRepoInfo = createInfoInquirer(repoInquirerConfig, getRepoList);

const inquireTagInfo = createInfoInquirer(tagInquirerConfig, getTagsByRepo);

// const installDeps = async (cmd, targetDir) => {
//   console.log(targetDir);
//   await callWithLoading(execa, "install dependencies...", cmd, {
//     cwd: targetDir,
//   });
// };

// todo: put into a seperate module

const packageManagerConfig = {
  npm: {
    installDeps: ["install", "--loglevel", "error"],
    installPackages: ["install", "--loglevel", "error"],
    uninstallPackages: ["uninstall", "--loglevel", "error"],
    updatePackages: ["update", "--loglevel", "error"],
  },

  pnpm: {
    installDeps: ["install", "--loglevel", "error", "--shamefully-flatten"],
    installPackages: ["install", "--loglevel", "error"],
    uninstallPackages: ["uninstall", "--loglevel", "error"],
    updatePackages: ["update", "--loglevel", "error"],
  },

  yarn: {
    installDeps: [],
    installPackages: ["add"],
    uninstallPackages: ["remove"],
    updatePackages: ["upgrade"],
  },
};

const createPkgmgrAction = (action) => {
  // targetDir, cmd, registry, pkgName, isDev
  if (!packageManagerConfig.npm.hasOwnProperty(action)) {
    throw new Error("Invalid method.");
  }
  return async (...rest) => {
    const [targetDir, command, registry, packageName, isDev] = rest;

    if (!["npm", "yarn", "pnpm"].includes(command))
      throw new Error(`package manager ${command} is not supported.`);

    const args = packageManagerConfig[command][action];
    console.log("init args:", args);

    // await addRegistryToArgs(command, args, registry);

    switch (action) {
      case "installPackages":
        // do not break then packageName can be pushed in.
        if (isDev) args.push("-D");
      case "uninstallPackages":
      // do not break too.
      case "updatePackages": // targetDir, command, registry, packageName
        packageName.split(" ").forEach((name) => args.push(name));
        break;
      default: // "installDeps"
        break;
    }
    console.log(chalk.blue(args));
    console.log(chalk.yellow(args.join(" ")));

    await executeCommand(command, args, targetDir);
  };
};

const installDeps = createPkgmgrAction("installDeps");

const executeCommand = (command, args, targetDir) => {
  return new Promise((resolve, reject) => {
    progress.enabled = false;

    const child = execa(command, args, {
      cwd: targetDir,
      stdio: ["inherit", "inherit", "inherit"],
    });

    // filter out unwanted yarn output
    if (command === "yarn") {
      console.log(chalk.yellow("use yarn"));

      console.log("stderr", child);

      // todo: checkout child.stderr === null
      child.stderr?.on("data", (buf) => {
        const str = buf.toString();
        if (/warning/.test(str)) {
          return;
        }

        // progress bar
        const progressBarMatch = str.match(/\[.*\] (\d+)\/(\d+)/);
        if (progressBarMatch) {
          // since yarn is in a child process, it's unable to get the width of
          // the terminal. reimplement the progress bar ourselves!
          renderProgressBar(progressBarMatch[1], progressBarMatch[2]);
          return;
        }

        process.stderr.write(buf);
      });
    }

    child.on("close", (code) => {
      if (code !== 0) {
        reject(`command failed: ${command} ${args.join(" ")}`);
        return;
      }
      resolve();
    });
  });
};

const addRegistryToArgs = async (command, args, cliRegistry) => {
  const altRegistry =
    cliRegistry ||
    ((await shouldUseTaobao(command)) ? registries.taobao : null);

  if (altRegistry) {
    args.push(`--registry=${altRegistry}`);
    if (altRegistry === registries.taobao) {
      args.push(`--disturl=${taobaoDistURL}`);
    }
  }
};

// progress

class InstallProgress extends EventEmitter {
  constructor() {
    super();

    this._progress = -1;
  }

  get progress() {
    return this._progress;
  }

  set progress(value) {
    this._progress = value;
    this.emit("progress", value);
  }

  get enabled() {
    return this._progress !== -1;
  }

  set enabled(value) {
    this.progress = value ? 0 : -1;
  }

  log(value) {
    this.emit("log", value);
  }
}

export const progress = new InstallProgress();

const toStartOfLine = (stream) => {
  if (!chalk.supportsColor) {
    stream.write("\r");
    return;
  }
  readline.cursorTo(stream, 0);
};

const renderProgressBar = (curr, total) => {
  console.log("render processbar");
  const ratio = Math.min(Math.max(curr / total, 0), 1);
  const bar = ` ${curr}/${total}`;
  const availableSpace = Math.max(0, process.stderr.columns - bar.length - 3);
  const width = Math.min(total, availableSpace);
  const completeLength = Math.round(width * ratio);
  const complete = `#`.repeat(completeLength);
  const incomplete = `-`.repeat(width - completeLength);
  toStartOfLine(process.stderr);
  process.stderr.write(`[${complete}${incomplete}]${bar}`);
};
