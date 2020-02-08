#! /usr/bin/env node
"use strict";const{resolve}=require("path"),fs=require("fs"),prompts=require("prompts"),{exec}=require("shelljs"),chalk=require("chalk"),updateNotifier=require("update-notifier"),{kebabCase}=require("lodash"),pkg=require("../package.json"),initProject=async()=>{const a=process.cwd(),{name:b}=await prompts({type:"text",name:"name",message:"Enter your project name:"});(null==b||""===b.trim())&&(console.log(chalk.red("Please input your project name.")),process.exit(1));const c=kebabCase(b),{description:d}=await prompts({type:"text",name:"description",message:"Describe your project name:"});(null==d||""===d.trim())&&(console.log(chalk.red("Please describe your project.")),process.exit(1));const e=resolve(__dirname,".."),f=resolve(e,"scripts","init.sh");await exec(`${f} ${c}`);const{license:g}=JSON.parse((await fs.readFileSync(resolve(a,c,"package.json"),"utf8"))),h={projectName:c,description:d,license:null==g?"":`## License\n\n**[${g}](LICENSE)** Licensed`},i=await fs.readFileSync(resolve(e,"templates","README.md"),"utf8"),j=i.replace(/\${(.*?)}/g,(a,b)=>h[b]),k=resolve(a,c,"README.md");await fs.writeFileSync(k,j),await fs.copyFileSync(resolve(e,"templates","CODE_OF_CONDUCT.md"),resolve(a,c,"CODE_OF_CONDUCT.md")),await fs.copyFileSync(resolve(e,"templates","CONTRIBUTING.md"),resolve(a,c,"CONTRIBUTING.md")),await fs.mkdirSync(resolve(a,c,".github","ISSUE_TEMPLATE"),{recursive:!0}),await fs.copyFileSync(resolve(e,"templates","PULL_REQUEST_TEMPLATE.md"),resolve(a,c,".github","CONTRIBUTING.md")),await fs.copyFileSync(resolve(e,"templates","BUG_REPORT.md"),resolve(a,c,".github","ISSUE_TEMPLATE","BUG_REPORT.md")),await fs.copyFileSync(resolve(e,"templates","FEATURE_REQUEST.md"),resolve(a,c,".github","ISSUE_TEMPLATE","FEATURE_REQUEST.md"))},notifier=updateNotifier({pkg});notifier.notify(),initProject();