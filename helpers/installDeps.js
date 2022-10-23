// import EventEmitter from "events";
// import chalk from "chalk";
// import { execa } from "execa";
// import readline from "readline";
// import { registries, shouldUseTaobao } from "./index.js";

// const taobaoDistURL = "https://npm.taobao.org/dist";

// const supportPackageManagerList = ["npm", "yarn", "pnpm"];

// const packageManagerConfig = {
//   npm: {
//     installDeps: ["install", "--loglevel", "error"],
//     installPackage: ["install", "--loglevel", "error"],
//     uninstallPackage: ["uninstall", "--loglevel", "error"],
//     updatePackage: ["update", "--loglevel", "error"],
//   },

//   pnpm: {
//     installDeps: ["install", "--loglevel", "error", "--shamefully-flatten"],
//     installPackage: ["install", "--loglevel", "error"],
//     uninstallPackage: ["uninstall", "--loglevel", "error"],
//     updatePackage: ["update", "--loglevel", "error"],
//   },

//   yarn: {
//     installDeps: [],
//     installPackage: ["add"],
//     uninstallPackage: ["remove"],
//     updatePackage: ["upgrade"],
//   },
// };

// class InstallProgress extends EventEmitter {
//   constructor() {
//     super();

//     this._progress = -1;
//   }

//   get progress() {
//     return this._progress;
//   }

//   set progress(value) {
//     this._progress = value;
//     this.emit("progress", value);
//   }

//   get enabled() {
//     return this._progress !== -1;
//   }

//   set enabled(value) {
//     this.progress = value ? 0 : -1;
//   }

//   log(value) {
//     this.emit("log", value);
//   }
// }

// export const progress = new InstallProgress()

// function toStartOfLine(stream) {
//   if (!chalk.supportsColor) {
//     stream.write("\r");
//     return;
//   }
//   readline.cursorTo(stream, 0);
// }

// function checkPackageManagerIsSupported(command) {
//   if (supportPackageManagerList.indexOf(command) === -1) {
//     throw new Error(`Unknown package manager: ${command}`);
//   }
// }

// function renderProgressBar(curr, total) {
//   const ratio = Math.min(Math.max(curr / total, 0), 1);
//   const bar = ` ${curr}/${total}`;
//   const availableSpace = Math.max(0, process.stderr.columns - bar.length - 3);
//   const width = Math.min(total, availableSpace);
//   const completeLength = Math.round(width * ratio);
//   const complete = `#`.repeat(completeLength);
//   const incomplete = `-`.repeat(width - completeLength);
//   toStartOfLine(process.stderr);
//   process.stderr.write(`[${complete}${incomplete}]${bar}`);
// }

// async function addRegistryToArgs(command, args, cliRegistry) {
//   const altRegistry =
//     cliRegistry ||
//     ((await shouldUseTaobao(command)) ? registries.taobao : null);

//   if (altRegistry) {
//     args.push(`--registry=${altRegistry}`);
//     if (altRegistry === registries.taobao) {
//       args.push(`--disturl=${taobaoDistURL}`);
//     }
//   }
// }

// function executeCommand(command, args, targetDir) {
//   return new Promise((resolve, reject) => {
//     progress.enabled = false;

//     const child = execa(command, args, {
//       cwd: targetDir,
//       // stdio: ['inherit', 'inherit', 'inherit']
//     });

//     // filter out unwanted yarn output
//     if (command === "yarn") {
//       child.stderr.on("data", (buf) => {
//         const str = buf.toString();
//         if (/warning/.test(str)) {
//           return;
//         }

//         // progress bar
//         const progressBarMatch = str.match(/\[.*\] (\d+)\/(\d+)/);
//         if (progressBarMatch) {
//           // since yarn is in a child process, it's unable to get the width of
//           // the terminal. reimplement the progress bar ourselves!
//           renderProgressBar(progressBarMatch[1], progressBarMatch[2]);
//           return;
//         }

//         process.stderr.write(buf);
//       });
//     }

//     child.on("close", (code) => {
//       if (code !== 0) {
//         reject(`command failed: ${command} ${args.join(" ")}`);
//         return;
//       }
//       resolve();
//     });
//   });
// }

// export async function installDeps(targetDir, command, cliRegistry) {
//   checkPackageManagerIsSupported(command);

//   const args = packageManagerConfig[command].installDeps;

//   await addRegistryToArgs(command, args, cliRegistry);
//   await executeCommand(command, args, targetDir);
// }

// export async function installPackage(
//   targetDir,
//   command,
//   cliRegistry,
//   packageName,
//   dev = true
// ) {
//   checkPackageManagerIsSupported(command);

//   const args = packageManagerConfig[command].installPackage;

//   if (dev) args.push("-D");

//   await addRegistryToArgs(command, args, cliRegistry);

//   args.push(packageName);

//   debug(`command: `, command);
//   debug(`args: `, args);

//   await executeCommand(command, args, targetDir);
// }

// export async function uninstallPackage(
//   targetDir,
//   command,
//   cliRegistry,
//   packageName
// ) {
//   checkPackageManagerIsSupported(command);

//   const args = packageManagerConfig[command].uninstallPackage;

//   await addRegistryToArgs(command, args, cliRegistry);

//   args.push(packageName);

//   debug(`command: `, command);
//   debug(`args: `, args);

//   await executeCommand(command, args, targetDir);
// }

// export async function updatePackage(
//   targetDir,
//   command,
//   cliRegistry,
//   packageName
// ) {
//   checkPackageManagerIsSupported(command);

//   const args = packageManagerConfig[command].updatePackage;

//   await addRegistryToArgs(command, args, cliRegistry);

//   packageName.split(" ").forEach((name) => args.push(name));

//   debug(`command: `, command);
//   debug(`args: `, args);

//   await executeCommand(command, args, targetDir);
// }

const packageManagerConfig = {
  npm: {
    installDeps: ["install", "--loglevel", "error"],
    installPackages: ["install", "--loglevel", "error"],
    uninstallPackages: ["uninstall", "--loglevel", "error"],
    updatePackages: ["update", "--loglevel", "error"],
  },

  pnpm: {
    installDeps: ["install", "--loglevel", "error", "--shamefully-flatten"],
    installPackages: ["install", "--loglevel", "error"],
    uninstallPackages: ["uninstall", "--loglevel", "error"],
    updatePackages: ["update", "--loglevel", "error"],
  },

  yarn: {
    installDeps: [],
    installPackages: ["add"],
    uninstallPackages: ["remove"],
    updatePackages: ["upgrade"],
  },
};

const createPkgmgrAction = (action) => {
  // targetDir, cmd, registry, pkgName, isDev
  if (Reflect.ownKeys(packageManagerConfig[rest[1]])) {
    throw new Error("Invalid method.");
  }
  return async (...rest) => {
    const [targetDir, command, registry, packageName, isDev] = rest;

    if (!["npm", "yarn", "pnpm"].includes(command))
      throw new Error(`package manager ${command} is not supported.`);

    const args = packageManagerConfig[command].updatePackage;

    // await addRegistryToArgs(command, args, registry);

    switch (action) {
      case "installPackages":
        // do not break then packageName can be pushed in.
        if (isDev) args.push("-D");
      case "uninstallPackages":
      // do not break too.
      case "updatePackages": // targetDir, command, registry, packageName
        packageName.split(" ").forEach((name) => args.push(name));
        break;
      default: // "installDeps"
        break;
    }

    await executeCommand(command, args, targetDir);
  };
};

const executeCommand = (command, args, targetDir) => {
  return new Promise((resolve, reject) => {
    progress.enabled = false;

    const child = execa(command, args, {
      cwd: targetDir,
      // stdio: ['inherit', 'inherit', 'inherit']
    });

    // filter out unwanted yarn output
    if (command === "yarn") {
      child.stderr.on("data", (buf) => {
        const str = buf.toString();
        if (/warning/.test(str)) {
          return;
        }

        // progress bar
        const progressBarMatch = str.match(/\[.*\] (\d+)\/(\d+)/);
        if (progressBarMatch) {
          // since yarn is in a child process, it's unable to get the width of
          // the terminal. reimplement the progress bar ourselves!
          renderProgressBar(progressBarMatch[1], progressBarMatch[2]);
          return;
        }

        process.stderr.write(buf);
      });
    }

    child.on("close", (code) => {
      if (code !== 0) {
        reject(`command failed: ${command} ${args.join(" ")}`);
        return;
      }
      resolve();
    });
  });
};

const addRegistryToArgs = async (command, args, cliRegistry) => {
  const altRegistry =
    cliRegistry ||
    ((await shouldUseTaobao(command)) ? registries.taobao : null);

  if (altRegistry) {
    args.push(`--registry=${altRegistry}`);
    if (altRegistry === registries.taobao) {
      args.push(`--disturl=${taobaoDistURL}`);
    }
  }
};
