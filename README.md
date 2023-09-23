![](https://i.imgur.com/itlNpH6.png)

<h1 align="center"> 
	Kuruminha Source
</h1>

Ever wondered how to inject fun and joy into your Discord server? Look no further! Kuruminha is here to save your precious time, handling mundane tasks while you immerse yourself in a world of magical entertainment.

Your life is too precious to waste on dull tasks. Let me take care of the tedious stuff while you revel in your server!

With features that will amuse and engage your members, and customization so incredible it'll make you feel like a digital artist...

All of this is possible thanks to a 18-year-old determined to make the digital world a more innovative place!

Transforming your server into a unique and innovative space has never been simpler. Come discover what we can do for you!

## 📋 Project

* The enchantment behind Kuruminha lies within the structure of discord.js, which enables you to breathe life into bots and embark on adventures in the realm of Discord. It's akin to a treasure chest filled with objects that represent enchanted servers, magical channels, and mysterious messages. With enchanted methods and events at your fingertips, you can conjure wonders and grant the wishes of your users.

* Mastering this framework is akin to unlocking powerful spells that unveil the full potential of discord.js, allowing you to craft bespoke solutions and make your server's experience truly unique. <br>

## 💻 How to use

To clone and run this application, you will need [Git](https://git-scm.com) and  [Node.js](https://nodejs.org/en/download/). 
<br>
In your command line:

```bash
# Clone this repository
$ git clone -b Kuruminha https://github.com/whoisdon/CommunityStructure.git
```
```bash
# Go to the Back-end repository
$ cd CommunityStructure
```
```bash
# Install the dependencies
$ npm install
```
```bash
# Install the dependencies globally
$ npm install -g
```

## ⚙️ Settings

**Using shell for creating and managing environment variables:**

Within the `.env` file, we will store a few variables:

```plaintext
TOKEN=
```

1. To set up your application, follow these steps:

1. Locate the .env.example file in your project's repository.

1. Duplicate the .env.example file and rename the duplicate to .env.

1. Open the newly created .env file using a 1. text editor.

In the .env file, you will see a line that looks like this:

```plaintext
TOKEN=
```
5. After the equal sign (=), paste your Discord bot token. It should look like this:
```plaintext
TOKEN=your_bot_token_here
```
6. Save the .env file.

Now, your application is configured to use the Discord bot token you've provided in the .env file. Remember to keep this file secure and never share your token with anyone else.
## ✰ Start Project

You can easily start the project by directly using the command
```bash
node .
```
I personally recommend giving Bun a whirl to kickstart your project - it's a shiny, new tech that'll have you sailing smoothly into the coding adventure!
```bash
# with npm
npm install -g bun
```
To kickstart the project:
```plaintext
bun run index.js
```
## 🏗️ Structure
<details>
  <summary>Example of implementing slash (/) commands in Discord using the SlashCommandBuilder class as a foundation.
  </summary>

```js
import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder } from 'discord.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('.')  
    });
  }

  run = async (interaction) => {

  }
}
```
</details>
<details>
  <summary>Example of implementing prefix commands in Discord using the PrefixCommand class as a foundation.
  </summary>

```js
import PrefixCommands from '../../Structure/PrefixCommands.js';

export default class extends PrefixCommands {
    constructor(client) {
        super(client, {
            name: 'test',
            aliases: ['testing']
        });
    }
    run = (message, args) => {

    }
}
```
</details>

## 📝 License

This project is licensed under the Apache License. Please refer to the  [LICENSE](LICENSE) for details.

---

**🌟 Do you love this project as much as I do?**

If the answer is "yes," then I have a special request for you! Imagine that each "star" in my repository is like a magical spark that brings my work to life. ✨

I want you to join my galaxy of stars and help me illuminate the code universe! It's as easy as a click, and you'll become part of my constellation of supporters.

Leave your luminous mark on my repository by clicking on that shiny star above ⭐️ and help me keep spreading the magic!

Remember, the more shine, the more magic! Together, we can light up the code in a truly enchanting way. 🪄💫

Thank you for being part of this amazing development universe! 🚀🌌
