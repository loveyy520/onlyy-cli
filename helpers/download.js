/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-23 08:30:34
 * @LastEditors: Loveyy 201357337@qq.com
 * @LastEditTime: 2022-10-23 10:12:39
 * @FilePath: \onlyy-cli\helpers\download.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import downloadGitRepo from "download-git-repo";
import { promisify } from "util";
import { callWithLoading } from "./loading.js";

// downloadGitRepo 不支持 promise ，使用 node.js 的 util 为其提供 promise 能力
export const download = async (repo, tag, targetDir) => {
  // 模板下载地址
  const templateURL = `zhurong-cli/${repo}${tag ? "#" + tag : ""}`;
  console.log(templateURL);
  const download = promisify(downloadGitRepo);

  await callWithLoading(
    download,
    "fetching templates...",
    templateURL,
    targetDir
  );
};
