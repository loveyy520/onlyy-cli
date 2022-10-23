// /*
//  * @Author: Loveyy 201357337@qq.com
//  * @Date: 2022-10-23 13:33:27
//  * @LastEditors: Loveyy 201357337@qq.com
//  * @LastEditTime: 2022-10-23 13:38:19
//  * @FilePath: \onlyy-cli\helpers\generateReadme.js
//  * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
//  */
// const descriptions = {
//   start: "启动项目",
//   build: "打包项目",
// };

// function printScripts(pkg, packageManager) {
//   const actionName = packageManager === "yarn" ? "" : "run";
//   return Object.keys(pkg.scripts || {})
//     .map((key) => {
//       if (!descriptions[key]) return "";
//       return [
//         `\n### ${descriptions[key]}`,
//         "```",
//         `${packageManager} ${actionName} ${key}`,
//         "```",
//         "",
//       ].join("\n");
//     })
//     .join("");
// }

// export const generateReadme = (pkg, packageManager) => {
//   return [
//     `# ${pkg.name}\n`,
//     "## Project setup",
//     "```",
//     `${packageManager} install`,
//     "```",
//     printScripts(pkg, packageManager),
//     "### Customize configuration",
//     "",
//   ].join("\n");
// };
