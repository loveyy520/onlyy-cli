/*
 * @Author: loveyy520 201357337@qq.com
 * @Date: 2022-10-24 11:31:05
 * @LastEditors: loveyy520 201357337@qq.com
 * @LastEditTime: 2022-10-24 11:41:40
 * @FilePath: \onlyy-cli\helpers\progress.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import readline from "readline";
import EventEmitter from "events";

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

const toStartOfLine = (stream) => {
  if (!chalk.supportsColor) {
    stream.write("\r");
    return;
  }
  readline.cursorTo(stream, 0);
};

export const renderProgressBar = (curr, total) => {
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

export const progress = new InstallProgress();
