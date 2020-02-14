#! /usr/bin/env node

const { resolve } = require('path');
const fs = require('fs');
const prompts = require('prompts');
const { exec } = require('shelljs');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const { kebabCase } = require('lodash');
const pkg = require('../package.json');

const initProject = async () => {
  const cwd = process.cwd();

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Enter your project name:',
  });

  if (name == null || name.trim() === '') {
    console.log(chalk.red('Please input your project name.'));
    process.exit(1);
  }

  const projectName = kebabCase(name);

  const { description } = await prompts({
    type: 'text',
    name: 'description',
    message: 'Describe your project name:',
  });

  if (description == null || description.trim() === '') {
    console.log(chalk.red('Please describe your project.'));
    process.exit(1);
  }

  const dirname = resolve(__dirname, '..');
  const initSh = resolve(dirname, 'scripts', 'init.sh');

  await exec(`${initSh} ${projectName}`);

  const { license } = JSON.parse(await fs.readFileSync(resolve(cwd, projectName, 'package.json'), 'utf8'));

  const data = {
    projectName,
    description,
    license: license != null ? `## License\n\n**[${license}](LICENSE)** Licensed` : '',
  };

  const readmeTemplate = await fs.readFileSync(resolve(dirname, 'templates', 'README.md'), 'utf8');
  const readmeContent = readmeTemplate.replace(/\${(.*?)}/g, (_, key) => data[key]);
  const readmePath = resolve(cwd, projectName, 'README.md');

  await fs.writeFileSync(readmePath, readmeContent);

  await fs.copyFileSync(
    resolve(dirname, 'templates', 'CODE_OF_CONDUCT.md'),
    resolve(cwd, projectName, 'CODE_OF_CONDUCT.md')
  );

  await fs.copyFileSync(
    resolve(dirname, 'templates', 'CONTRIBUTING.md'),
    resolve(cwd, projectName, 'CONTRIBUTING.md')
  );

  await fs.mkdirSync(resolve(cwd, projectName, '.github', 'ISSUE_TEMPLATE'), { recursive: true });

  await fs.copyFileSync(
    resolve(dirname, 'templates', 'PULL_REQUEST_TEMPLATE.md'),
    resolve(cwd, projectName, '.github', 'CONTRIBUTING.md')
  );

  await fs.copyFileSync(
    resolve(dirname, 'templates', 'BUG_REPORT.md'),
    resolve(cwd, projectName, '.github', 'ISSUE_TEMPLATE', 'BUG_REPORT.md')
  );

  await fs.copyFileSync(
    resolve(dirname, 'templates', 'FEATURE_REQUEST.md'),
    resolve(cwd, projectName, '.github', 'ISSUE_TEMPLATE', 'FEATURE_REQUEST.md')
  );

  const commitSh = resolve(dirname, 'scripts', 'commit.sh');

  await exec(`${commitSh} ${projectName}`);
};

const notifier = updateNotifier({ pkg });
notifier.notify();

initProject();
