/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-23 11:23:18
 * @LastEditors: Loveyy 201357337@qq.com
 * @LastEditTime: 2022-10-23 11:23:23
 * @FilePath: \onlyy-cli\lib\options.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
exports.defaultPreset = "mobx";

exports.defaults = {
  lastChecked: undefined,
  latestVersion: undefined,

  packageManager: undefined,
  useTaobaoRegistry: undefined,
  presets: {
    default: exports.defaultPreset,
  },
};
