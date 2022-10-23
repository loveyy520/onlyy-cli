// /*
//  * @Author: Loveyy 201357337@qq.com
//  * @Date: 2022-10-23 13:54:07
//  * @LastEditors: Loveyy 201357337@qq.com
//  * @LastEditTime: 2022-10-23 13:54:28
//  * @FilePath: \onlyy-cli\helpers\loadCommand.js
//  * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
//  */
// export const loadCommand = (commandName, moduleName) => {
//   const isNotFoundError = (err) => {
//     return err.message.match(/Cannot find module/);
//   };
//   try {
//     return require(moduleName);
//   } catch (err) {
//     if (isNotFoundError(err)) {
//       try {
//         return require("import-global")(moduleName);
//       } catch (err2) {
//         if (isNotFoundError(err2)) {
//           const chalk = require("chalk");
//           const { hasYarn, hasPnpm3OrLater } = require("../utils/common");
//           let installCommand = `npm install -g`;
//           if (hasYarn()) {
//             installCommand = `yarn global add`;
//           } else if (hasPnpm3OrLater()) {
//             installCommand = `pnpm install -g`;
//           }
//           console.log();
//           console.log(
//             `  命令 ${chalk.cyan(
//               `onlyy-cli ${commandName}`
//             )} 依赖一些全局的插件\n` +
//               `  请执行 ${chalk.cyan(`${installCommand} ${moduleName}`)} 后重试`
//           );
//           console.log();
//           process.exit(1);
//         } else {
//           throw err2;
//         }
//       }
//     } else {
//       throw err;
//     }
//   }
// };
