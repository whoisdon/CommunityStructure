<h1 align="center"> 
	🔐 CommunityStructure.
</h1>
<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/whoisdon/CommunityStructure?color=%2304D361">
	
  <img alt="Repository issues" src="https://img.shields.io/github/languages/top/whoisdon/CommunityStructure">	
	
  <a href="https://discord.gg/3Cps7AuNQ6">
    <img alt="Made by ঔৣ☬✞𝓓𝖔𝖓✞☬ঔৣ#0552" src="https://img.shields.io/badge/made%20by-whoisdon-%2304D361">
  </a>

  <a href="https://github.com/whoisdon/APIExpress/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/whoisdon/CommunityStructure">
  </a>

  <a href="https://github.com/whoisdon/APIExpress/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/whoisdon/CommunityStructure">
  </a>
</p>


<p align="center">
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-usar">Como usar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">Licença</a>
</p>

## 📋 Projeto

* 🔐 A estrutura do discord.js permite criar bots e interagir com o Discord, com objetos que representam servidores, canais, mensagens, entre outros. Há métodos e eventos disponíveis para manipular esses objetos e responder a ações do usuário. Conhecer bem a estrutura é importante para aproveitar ao máximo as capacidades do discord.js e criar soluções personalizadas. <br>

## 💻 Como usar

Para clonar e rodar essa aplicação você precisará do [Git](https://git-scm.com) e [Node.js](https://nodejs.org/en/download/). 
<br>
Na sua linha de comando:

```bash
# Clone esse repositório
$ git clone https://github.com/whoisdon/CommunityStructure.git
```
```bash
# Vá para o repositório Back-end
$ cd CommunityStructure
```
```bash
# Instale as dependencias
$ npm install
```
```bash
# Instale as dependencias globalmente  
$ npm install -g
```

## ⚙️ Configuração

Utilizando shell para criação e manipulação de variáveis de ambiente:
```shell
# Criando arquivo .env
touch .env
```
Dentro do arquivo `.env` iremos armazenar algumas variáveis:
```
TOKEN=
MONGODB_URL=
```

## ✰ Iniciar Projeto

Você pode dar início ao projeto com facilidade, utilizando diretamente o comando:
```
node .
```
Você pode dar início ao projeto usando o nodemon, garantindo assim uma atualização em tempo real dos seus avanços.
```bash
npm run dev
```

## 🏗️ Estrutura
<details>
  <summary>Exemplo de implementação de comandos slash (/) no Discord, usando a base padrão do repositório.</summary>

```js
import Commands from '../../Handlers/commands.js';

export default class extends Commands {
	constructor(client) {
	  super(client, {
            name: 'name',
            description: 'description',
 });
}

run(interaction) {

 }
}
```
</details>
<details>
  <summary>Exemplo de implementação de comandos slash (/) no Discord, usando a classe SlashCommandBuilder como base.</summary>

```js
import Commands from '../../Handlers/commands.js';
import { SlashCommandBuilder } from 'discord.js';

export default class extends Commands {
	constructor(client) {
	  super(client, {
	    data: new SlashCommandBuilder()
            .setName('nome')
            .setDescription('descrição'),
 });
}

run(interaction) {

 }
}
```
</details>

## 📝 License

Este projeto está sob a licença Apache. Consulte o [LICENSE](LICENSE) para obter detalhes.

---

Feito por ঔৣ☬✞𝓓𝖔𝖓✞☬ঔৣ#0552 e Juaum • 愛#4009 :wave: 

Discord Don: [Entre em contato comigo!](https://discord.com/users/828677274659586068)
Github Don: [github.com/whoisdon](https://github.com/whoisdon) &nbsp;

Discord Juaum: [Entre em contato com Juaum!](https://discord.com/users/518207099302576160)
Github Juaum: [github.com/joaolumertz](https://github.com/joaolumertz) &nbsp;
