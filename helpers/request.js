/*
 * @Author: Loveyy 201357337@qq.com
 * @Date: 2022-10-23 00:25:50
 * @LastEditors: Loveyy 201357337@qq.com
 * @LastEditTime: 2022-10-23 01:48:03
 * @FilePath: \onlyy-cli\helpers\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";

const timeout = 60000; // 60 s
const baseURL = "https://api.github.com";

// zhurong-cli 的 git 模版
const repoURL = "/orgs/zhurong-cli/repos";

const request = axios.create({
  timeout,
  baseURL,
});

// 请求拦截
request.interceptors.request.use((config) => config);

// 响应拦截：取出data
request.interceptors.response.use((res) => res.data);

/**
 * 获取仓库信息
 * @returns Promise 仓库信息
 */
export const getRepoList = async () => request.get(repoURL);

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise 版本信息
 */
export const getTagsByRepo = async (repo) =>
  request.get(`/repos/zhurong-cli/${repo}/tags`);
