// /*
//  * @Author: Loveyy 201357337@qq.com
//  * @Date: 2022-10-23 11:51:57
//  * @LastEditors: Loveyy 201357337@qq.com
//  * @LastEditTime: 2022-10-23 13:01:26
//  * @FilePath: \onlyy-cli\lib\Creator2.js
//  * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
//  */
// import Inquirer from "inquirer";
// import EventEmitter from "events";

// import {
//   loadRemotePreset,
//   writeFileTree,
//   copyFile,
//   generateReadme,
//   installDeps,
//   defaults,
//   //
//   log,
//   error,
//   hasYarn,
//   hasGit,
//   hasProjectGit,
//   logWithSpinner,
//   clearConsole,
//   stopSpinner,
//   exit,
//   callWithLoading,
// } from "../helpers/index.js";

// class Creator extends EventEmitter {
//   constructor(appName, ctx) {
//     super();

//     this.appName = appName;
//     this.ctx = ctx;

//     this.run = this.run.bind(this);
//   }

//   async create(options = {}, preset = null) {
//     const { appName, ctc, run } = this;

//     const targetPreset = options.preset || defaults.presets.default;
//     // 获取预设信息
//     preset = await this.resolvePreset(targetPreset, options.clone);

//     await clearConsole();

//     logWithSpinner(`✨`, `正在创建项目 ${chalk.yellow(context)}.`);
//     this.emit("creation", { event: "creating" });

//     stopSpinner();

//     const { version, desc } = await new Inquirer.prompt([
//       {
//         name: "verssion",
//         message: "Input your project version: ",
//         default: "1.0.0",
//       },
//       {
//         name: "desc",
//         message: "Input the description of your project: ",
//         default: "This is a project created by onlyy-cli.",
//       },
//     ]);

//     const pkgJson = await copyFile(preset.temdir, preset.targetDir);

//     // package.json 的内容
//     const pkgContent = Object.assign(pkgJson, {
//       version,
//       description: desc,
//     });

//     // 生成package.json
//     await writeFileTree(ctx, {
//       "package.json": JSON.stringify(pkg, null, 2),
//     });

//     // 包管理工具
//     const pkgManager = hasYarn() ? "yarn" : hasPnpm3OrLater() ? "pnpm" : "npm";

//     // 根据 package.json 和 包管理工具 生成 readme.md
//     await writeFileTree(ctx, {
//       "readme.md": generateReadme(pkg, pkgManager),
//     });

//     const shouldInitGit = this.shouldInitGit(options);
//     if (shouldInitGit) {
//       logWithSpinner(`🗃`, `初始化Git仓库`);
//       this.emit("creation", "git-init");
//       await run("git init");
//     }
//     stopSpinner();

//     // 安装依赖 并 提交初始化状态
//     logWithSpinner(`⚙`, `安装依赖`);
//     await installDeps(ctx, pkgManager, options.registry);

//     // let gitCommitFailed = false;
//     if (shouldInitGit) {
//       await callWithLoading(run, "adding files...", "git add -A");
//       const msg = typeof options.git === "string" ? "options.git" : "init";
//       await callWithLoading(run, `commiting...`, ["commit", "-m", msg]);
//     }
//     stopSpinner();

//     // 创建成功
//     log(`🎉  Project ${chalk.yellow(appName)} is created successfully!`);
//     if (!options.skipGetStarted) {
//       log(
//         `👉  Follow the steps to get started.\n\n` +
//           (this.context === process.cwd()
//             ? ``
//             : chalk.cyan(` ${chalk.gray("$")} cd ${appName}\n`)) +
//           chalk.cyan(
//             ` ${chalk.gray("$")} ${
//               packageManager === "yarn"
//                 ? "yarn start"
//                 : packageManager === "pnpm"
//                 ? "pnpm run start"
//                 : "npm start"
//             }`
//           )
//       );
//     }
//     // todo: check evnetData
//     this.emit("creation", { event: "done" });

//     if (gitCommitFailed) {
//       warn(`Git commit failed. Please commit again by yourself later.`);
//     }
//   }

//   async resolvePreset(presetName, clone) {
//     let preset;
//     this.emit("creation", { event: "fetch-remote-preset" });

//     preset = await callWithLoading(
//       loadRemotePreset,
//       `Fetching remote preset ${chalk.cyan(presetName)}...`,
//       presetName,
//       this.ctx,
//       clone
//     );

//     if (presetName === "default" && !preset) {
//       error(`Can't find preset ${presetName}`);
//       exit(1);
//     }

//     return preset;
//   }

//   async run(command, args) {
//     // 按空白分隔
//     if (!args) [command, args] = command.split(/\s+/);
//     return execa(command, args, { cwd: this.ctx });
//   }

//   async shouldInitGit(options) {
//     switch (true) {
//       case !hasGit:
//       case options.git === false:
//       case options.git === "false":
//         return false;
//       case options.forceGit:
//         return true;
//       default:
//         return !hasProjectGit(this.ctx);
//     }
//   }
// }
