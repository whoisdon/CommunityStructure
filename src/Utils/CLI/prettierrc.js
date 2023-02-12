#! /usr/bin/env node

const { glob } = require('glob');
const { promisify } = require('util');
const proGlob = promisify(glob);
const inquirer = require('inquirer');
const shell = require('shelljs');

const prompt = inquirer
  .prompt([
    {
      message: 'Você quer iniciar o prettier?',
      type: 'confirm',
      name: 'prettier',
    },
  ])
  .then((confirm) => {
    if (!confirm.prettier) return;

    const prettier = async () => {
      const filepush = await proGlob(`${process.cwd().replace(/\\/g, '/')}/src/**/**/*.js`);

      let i = 0;
      filepush.forEach((file, i) => {
        let arquivo = file.substring(file.lastIndexOf('/') + 1);
        setTimeout(() => {
          shell.exec(`prettier --write ${file}`);
        }, 4000 * i);
      });
    };
    prettier();
  });
