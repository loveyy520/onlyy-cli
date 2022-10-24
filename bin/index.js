import{program as e}from"commander";import r from"chalk";import t from"figlet";import o from"minimist";import{relative as a,resolve as s}from"path";import n from"fs-extra";import i from"inquirer";import l from"validate-npm-package-name";import c from"events";import p from"axios";import m from"ora";import g from"download-git-repo";import{promisify as d}from"util";import{execa as u}from"execa";import h from"readline";import{exit as w}from"process";const y=p.create({timeout:6e4,baseURL:"https://api.github.com"});y.interceptors.request.use((e=>e)),y.interceptors.response.use((e=>e.data));const f=async(e,r,...t)=>{const o=m(r);try{o.start();const r=await e(...t);return o.succeed(),r}catch(s){return o.fail("failed to fetch resouorces, retrying..."),await(a=1,new Promise((e=>{setTimeout(e,1e3*a)}))),f(e,r,...t)}var a};const v=(e,r)=>{console.log("render processbar");const t=Math.min(Math.max(e/r,0),1),o=` ${e}/${r}`,a=Math.max(0,process.stderr.columns-o.length-3),s=Math.min(r,a),n=Math.round(s*t),i="#".repeat(n),l="-".repeat(s-n);var c;c=process.stderr,chalk.supportsColor?h.cursorTo(c,0):c.write("\r"),process.stderr.write(`[${i}${l}]${o}`)},k=new class extends c{constructor(){super(),this._progress=-1}get progress(){return this._progress}set progress(e){this._progress=e,this.emit("progress",e)}get enabled(){return-1!==this._progress}set enabled(e){this.progress=e?0:-1}log(e){this.emit("log",e)}},$={npm:{installDeps:["install","--loglevel","error"],installPackages:["install","--loglevel","error"],uninstallPackages:["uninstall","--loglevel","error"],updatePackages:["update","--loglevel","error"]},pnpm:{installDeps:["install","--loglevel","error","--shamefully-flatten"],installPackages:["install","--loglevel","error"],uninstallPackages:["uninstall","--loglevel","error"],updatePackages:["update","--loglevel","error"]},yarn:{installDeps:[],installPackages:["add"],uninstallPackages:["remove"],updatePackages:["upgrade"]}},P=(e,r,t)=>new Promise(((o,a)=>{k.enabled=!1;const s=u(e,r,{cwd:t,stdio:["inherit","inherit","inherit"]});"yarn"===e&&s.stderr?.on("data",(e=>{const r=e.toString();if(/warning/.test(r))return;const t=r.match(/\[.*\] (\d+)\/(\d+)/);t?v(t[1],t[2]):process.stderr.write(e)})),s.on("close",(t=>{0===t?o():a(`command failed: ${e} ${r.join(" ")}`)}))})),b=(e=>{if(!$.npm.hasOwnProperty(e))throw new Error("Invalid method.");return async(...r)=>{const[t,o,a,s,n]=r;if(!["npm","yarn","pnpm"].includes(o))throw new Error(`package manager ${o} is not supported.`);const i=$[o][e];switch(e){case"installPackages":n&&i.push("-D");case"uninstallPackages":case"updatePackages":s.split(" ").forEach((e=>i.push(e)))}await P(o,i,t)}})("installDeps");class D extends c{constructor(e,r){super(),this.appName=e,this.targetDir=r}async create(e={}){this.repo=await this.inquireRepoInfo(),this.tag=await this.inquireTagInfo(),console.log(`You have selected ${r.yellow(this.repo,this.tag)}\n       as a template.`),n.mkdirSync(this.targetDir),await this.download(),await this.installDeps(),this.success()}async inquireRepoInfo(){return S()}async inquireTagInfo(){return I(this.repo)}async download(){await(async(e,r,t)=>{const o=`zhurong-cli/${e}${r?"#"+r:""}`;console.log(o);const a=d(g);await f(a,"fetching templates...",o,t)})(this.repo,this.tag,this.targetDir)}async installDeps(){console.log("ctx: ",this.targetDir),await b(this.targetDir,"yarn")}success(){console.clear(),console.log(`\n        \r\n${r.green("Successfully")} created project ${r.cyan(this.appName)}\n        \r\n cd ${r.cyan(this.appName)}\n        \r\n npm run dev\n      `)}}const x=(e,t)=>async(...o)=>{try{const r=(await f(t,`fetching ${e.name} information...`,...o)).map((e=>e.name)),a=await new i.prompt(((e,r)=>[{...e,choices:r}])(e,r));return a[e.name]}catch(e){console.log(r.red(e))}},S=x({name:"repo",type:"list",message:"Please choose a template"},(async()=>y.get("/orgs/zhurong-cli/repos"))),I=x({name:"repo",type:"list",message:"Please choose a version"},(async e=>y.get(`/repos/zhurong-cli/${e}/tags`))),j=[{name:"willOverwrite",type:"list",message:"Target directory exists. Shall it be overwriten ?",choices:[{name:"Overwrite",value:!0},{name:"Cancel",value:!1}]}],q=async(e,t)=>{if(n.existsSync(e))try{if(!t){console.clear();const{willOverwrite:e}=await new i.prompt(j);if(!e)return console.error(r.yellow("\n ⚠️  Creation have been canceled.")),!1}return console.log("\n ⚠️ The old directory will be removed."),await f(n.remove,"deleting old directory...",e),!0}catch(e){return console.log(r.red(e)),!1}return!0},N=(async e=>await n.readJSON(e))("../package.json");e.on("--help",(()=>{console.log("\n"+r.cyanBright.bold(t.textSync("onlyy",{font:"3D-ASCII",horizontalLayout:"default",verticalLayout:"default",width:80,whitespaceBreak:!0}))),console.log(`Run ${r.cyan("onlyy-cli < command > --help")} for detailed usage of given command.`)})),e.name("onlyy").usage("<command> [options]").version(`onlyy-cli ${N.version}`),e.name("onlyy-cli").command("create <project-name>").description("You are trying to create a new project ...").option("-p, --preset <presetName>","Skip prompts and use saved or remote preset").option("-d, --default","Skip prompts and use default preset").option("-f, --force","Skip prompts and overwrite target directory if it exists").action(((e,t)=>{o(process.argv.slice(3))._.length>1&&console.log(r.yellow("\n ⚠️  Detected more than one name arguments inputed, only the 1st will be used as project name and others are aborted.")),(async(e,t={})=>{const o=t.cwd||process.cwd();e="."===e?a("../",o):e;const n=l(e);n.validForNewPackages||(console.error(r.red(`Invalid project name: "${e}\n"`)),n.errors?.forEach((e=>console.error("❌ "+r.red.dim(e)))),n.warnings?.forEach((e=>console.warn("⚠️ "+r.yellow.dim(e)))),w(1));const i=s(o,e);if(!await q(i,t.force))return;console.log(r.blue.bold("sstart"));const c=new D(e,i);await c.create(t)})(e,t)})),e.name("oblyy").command("page <page-name>").description("Create a new page").option("-f, --force","Overwrite target directory if it exists").action(((e,r)=>{cleanArgs(r)})),e.parse(process.argv);