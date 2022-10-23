// import fs from "fs-extra";
// import { resolve } from "path";
// import chalk from "chalk";
// import Inquirer from "inquirer";
// import PageCreator from "./PageCreator.js";
// import validFilename from "valid-filename";
// import { error, stopSpinner, exit, clearConsole } from "../helpers/index.js";

// /**
//  * 创建项目
//  * @param {*} pageName
//  * @param {*} options
//  */
// async function create(pageName, options) {
//   // 检测文件名是否合规
//   const validName = validFilename(pageName);
//   // 如果所输入的不是合法npm包名，则退出
//   if (!validName) {
//     console.error(chalk.red(`不合法的文件名: "${pageName}"`));
//     exit(1);
//   }

//   const cwd = options.cwd || process.cwd();
//   const pagePath = resolve(
//     cwd,
//     "./src/pages",
//     pageName.charAt(0).toUpperCase()
//     //  + pageName.slice(1).toLowerCase()
//   );
//   const pkgJsonFile = resolve(cwd, "package.json");

//   // 如果不存在package.json，说明不再根目录，不能创建
//   if (!fs.existsSync(pkgJsonFile)) {
//     console.error(
//       chalk.red("\n" + "⚠️  请确认您是否在项目根目录下运行此命令\n")
//     );
//     return;
//   }

//   // 如果page已经存在，询问覆盖还是取消
//   if (fs.existsSync(pagePath)) {
//     if (!options.force) {
//       await clearConsole();
//       const { action } = await Inquirer.prompt([
//         {
//           name: "action",
//           type: "list",
//           message: `File ${chalk.cyan(
//             pageName
//           )} exists,. Please select an action: `,
//           choices: [
//             { name: "覆盖", value: true },
//             { name: "取消", value: false },
//           ],
//         },
//       ]);
//       if (!action) {
//         return;
//       }
//     }
//     console.log(`\nRemoving ${chalk.cyan(pagePath)}...`);
//     await fs.remove(pagePath);
//   }

//   // 前面完成准备工作，正式开始创建页面
//   const pageCreator = new PageCreator(pageName, pagePath);
//   await pageCreator.create(options);
// }

// export const createPage = (...args) => {
//   return create(...args).catch((err) => {
//     stopSpinner(false);
//     error(err);
//   });
// };
