// /*
//  * @Author: Loveyy 201357337@qq.com
//  * @Date: 2022-10-23 11:46:11
//  * @LastEditors: Loveyy 201357337@qq.com
//  * @LastEditTime: 2022-10-23 14:33:04
//  * @FilePath: \onlyy-cli\helpers\generatePages.js
//  * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
//  */
// import chalk from "chalk";
// import { resolve } from "path";
// import fs from "fs-extra";
// import nunjucks from "nunjucks";

// // import { log, error, logWithSpinner, stopSpinner } from "./index.js";

// const tempPath = resolve(__dirname, "../../temp");
// const pageTempPath = resolve(tempPath, "page.js");
// const lessTempPath = resolve(tempPath, "page.less");
// const ioTempPath = resolve(tempPath, "io.js");
// const storeTempPath = resolve(tempPath, "store.js");

// async function generatePage(context, { lowerName, upperName }) {
//   logWithSpinner(`生成 ${chalk.yellow(`${upperName}/${upperName}.js`)}`);
//   const ioTemp = await fs.readFile(pageTempPath);
//   const ioContent = nunjucks.renderString(ioTemp.toString(), {
//     lowerName,
//     upperName,
//   });
//   await fs.writeFile(resolve(context, `./${upperName}.js`), ioContent, {
//     flag: "a",
//   });
//   stopSpinner();
// }

// async function generateLess(context, { lowerName, upperName }) {
//   logWithSpinner(`生成 ${chalk.yellow(`${upperName}/${upperName}.less`)}`);
//   const ioTemp = await fs.readFile(lessTempPath);
//   const ioContent = nunjucks.renderString(ioTemp.toString(), {
//     lowerName,
//     upperName,
//   });
//   await fs.writeFile(resolve(context, `./${upperName}.less`), ioContent, {
//     flag: "a",
//   });
//   stopSpinner();
// }

// async function generateIo(context, { lowerName, upperName }) {
//   logWithSpinner(`生成 ${chalk.yellow(`${upperName}/io.js`)}`);
//   const ioTemp = await fs.readFile(ioTempPath);
//   const ioContent = nunjucks.renderString(ioTemp.toString(), {
//     lowerName,
//     upperName,
//   });
//   await fs.writeFile(resolve(context, `./io.js`), ioContent, { flag: "a" });
//   stopSpinner();
// }

// async function generateStore(context, { lowerName, upperName }) {
//   logWithSpinner(`生成 ${chalk.yellow(`${upperName}/store-${lowerName}.js`)}`);
//   const ioTemp = await fs.readFile(storeTempPath);
//   const ioContent = nunjucks.renderString(ioTemp.toString(), {
//     lowerName,
//     upperName,
//   });
//   await fs.writeFile(resolve(context, `./store-${lowerName}.js`), ioContent, {
//     flag: "a",
//   });
//   stopSpinner();
// }

// export const generatePages = (context, nameObj) => {
//   Promise.all([
//     generateIo(context, nameObj),
//     generatePage(context, nameObj),
//     generateStore(context, nameObj),
//     generateLess(context, nameObj),
//   ]).catch((err) => {
//     stopSpinner(false);
//     error(err);
//   });
// };
