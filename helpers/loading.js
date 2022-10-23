/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-23 01:40:30
 * @LastEditors: Loveyy 201357337@qq.com
 * @LastEditTime: 2022-10-23 10:01:30
 * @FilePath: \onlyy-cli\helpers\loading.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ora from "ora";

export const sleep = (n) =>
  new Promise((resolve) => {
    setTimeout(resolve, n * 1000);
  });

export const callWithLoading = async (asyncFn, msg, ...args) => {
  const spinner = ora(msg);
  try {
    spinner.start();
    const res = await asyncFn(...args);
    spinner.succeed();
    return res;
  } catch (e) {
    // 失败重试
    spinner.fail("failed to fetch resouorces, retrying...");
    await sleep(1);
    return callWithLoading(asyncFn, msg, ...args);
  }
};
