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

<p align="center">
   <img src="https://i.imgur.com/8eQ4xSd.png" width="746" alt="darkcord">
</p>

<p align="center">
   <a href="https://discord.com/users/630493603575103519" target="_blank"><img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" target="_blank"></a>
   <a href="https://github.com/JustAWaifuHunter" target="_blank"><img src="https://img.shields.io/github/followers/JustAWaifuHunter?style=for-the-badge&logo=github&color=blue" target="_blank"></a>
   <a href="https://darkcord.denkylabs.com" target="_blank"><img src="https://img.shields.io/badge/Darkcord-black?style=for-the-badge&logo=discord&logoColor=white" target="_blank"></a>
</p>

## 📋 Projeto

* 🔐 A estrutura do DarkCord permite criar bots e interagir com o Discord, com objetos que representam servidores, canais, mensagens, entre outros. Há métodos e eventos disponíveis para manipular esses objetos e responder a ações do usuário. Conhecer bem a estrutura é importante para aproveitar ao máximo as capacidades do DarkCord e criar soluções personalizadas. <br>

## 💻 Como usar

Para clonar e rodar essa aplicação você precisará do [Git](https://git-scm.com) e [Node.js](https://nodejs.org/en/download/). 
<br>
Na sua linha de comando:

```bash
# Clone esse repositório
$ git clone -b DarkCord https://github.com/whoisdon/CommunityStructure.git
```
```bash
# Vá para o repositório Back-end
$ cd CommunityStructure
```
```bash
# Instale as dependencias
$ npm install
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
import Commands from '../../Handlers/CommandsMap.js';

export default class extends Commands {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Veja o ping do bot'
    });
  }
   run(interaction) {
     
    const latency = performance.now();
     
    interaction
      .editOriginalReply({
      content: 'Calculando sa bosta'
      })
      .then(() => {
       const textPing = `Latência da minha WS: \`${this.client.websocket.ping}ms\`\nLatência da Resposta: \`${
          (performance.now() - latency) >> 0
        }ms\``;

        interaction.editOriginalReply({
          content: textPing
        });

      });
  };
};
```
</details>

## 📝 License

Este projeto está sob a licença Apache. Consulte o [LICENSE](LICENSE) para obter detalhes.
