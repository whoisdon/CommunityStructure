#! /usr/bin/env node

const { glob } = require('glob');
const { promisify } = require('util');
const proGlob = promisify(glob);
const colors = require('colors');
const inquirer = require('inquirer');
const shell = require('shelljs');

const prompt = inquirer
  .prompt([
    {
      message: 'Você quer iniciar o eslint?',
      type: 'confirm',
      name: 'eslint',
    },
  ])
  .then((confirm) => {
    if (!confirm.eslint) return;

    const eslint = async () => {
      const filepush = await proGlob(`${process.cwd().replace(/\\/g, '/')}/src/**/**/*.js`, {
        ignore: '**/CLI/**',
      });
      const i = 0;
      filepush.forEach((file, i) => {
        let arquivo = file.substring(file.lastIndexOf('/') + 1);
        setTimeout(() => {
          shell.exec(`eslint ${file} --fix`);
          console.log(`[Check] Arquivo ${arquivo} aprimorado com sucesso!`.blue.dim);
        }, 4000 * i);
      });
    };
    eslint();
  });
