import { API } from "darkcord";

const { GatewayIntentBits } = API;

const ClientIntents =
  GatewayIntentBits.Guilds |
  GatewayIntentBits.GuildMembers |
  GatewayIntentBits.GuildMessages |
  GatewayIntentBits.MessageContent;


export default ClientIntents;
