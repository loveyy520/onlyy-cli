import { execa } from "execa";
import { progress, renderProgressBar } from "./progress.js";
// support yarn, pnpm, npm
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
  if (!packageManagerConfig.npm.hasOwnProperty(action)) {
    throw new Error("Invalid method.");
  }
  return async (...rest) => {
    const [targetDir, command, registry, packageName, isDev] = rest;

    if (!["npm", "yarn", "pnpm"].includes(command))
      throw new Error(`package manager ${command} is not supported.`);

    const args = packageManagerConfig[command][action];

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
      stdio: ["inherit", "inherit", "inherit"],
    });

    // filter out unwanted yarn output
    if (command === "yarn") {
      // console.log("stderr", child);

      // todo: checkout child.stderr === null
      child.stderr?.on("data", (buf) => {
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

// todo: unfinished
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

export const installDeps = createPkgmgrAction("installDeps");
