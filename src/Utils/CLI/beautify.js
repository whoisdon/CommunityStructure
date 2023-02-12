#! /usr/bin/env node

const { glob } = require('glob');
const { promisify } = require('util');
const proGlob = promisify(glob);
const colors = require('colors');
const inquirer = require('inquirer');
const beautify = require('js-beautify').js;
const fs = require('fs');

const prompt = inquirer
  .prompt([
    {
      message: 'Você quer iniciar o beautify?',
      type: 'confirm',
      name: 'beautify',
    },
  ])
  .then((confirm) => {
    if (!confirm.beautify) return;

    const beautifier = async () => {
      const filepush = await proGlob(`${process.cwd().replace(/\\/g, '/')}/src/**/**/*.js`);
      const i = 0;
      filepush.forEach((print, i) => {
        setTimeout(() => {
          fs.readFile(print, (err, data) => {
            const beaut = beautify(Buffer?.from(data).toString());
            const arquivo = print.substring(print.lastIndexOf('/') + 1);
            fs.writeFile(print, beaut, (err) => {
              if (err) {
                console.log(`[Error] Arquivo ${arquivo} falhou ao ser embelezado.`.red.dim);
                throw err;
              }
              console.log(`[Check] Arquivo ${arquivo} editado com sucesso!`.green.dim);
            });
          });
        }, 4000 * i);
      });
    };
    beautifier();
  });
