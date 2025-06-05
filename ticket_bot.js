// Discord Ticket Bot in Node.js
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_BOT_TOKEN;
const staffRoleId = process.env.STAFF_ROLE_ID; // ID of the staff role with access to tickets

if (!token) {
  console.error('DISCORD_BOT_TOKEN environment variable is required');
  process.exit(1);
}
if (!staffRoleId) {
  console.error('STAFF_ROLE_ID environment variable is required');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TICKET_CATEGORY_NAME = 'Tickets';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Helper to find or create the ticket category
async function ensureTicketCategory(guild) {
  let category = guild.channels.cache.find(
    (ch) => ch.type === 4 && ch.name === TICKET_CATEGORY_NAME
  );
  if (!category) {
    category = await guild.channels.create({
      name: TICKET_CATEGORY_NAME,
      type: 4,
    });
  }
  return category;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const args = message.content.trim().split(/\s+/);
  if (args[0] !== '!ticket') return;

  const subcommand = args[1];

  if (subcommand === 'open') {
    const reason = args.slice(2).join(' ') || 'No reason provided';
    const existing = message.guild.channels.cache.find(
      (c) => c.name === `ticket-${message.author.id}`
    );
    if (existing) {
      message.reply('You already have an open ticket.');
      return;
    }

    const category = await ensureTicketCategory(message.guild);

    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.id}`,
      type: 0, // GUILD_TEXT
      parent: category.id,
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: message.author.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
        {
          id: staffRoleId,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
        },
      ],
    });

    channel.send(`Ticket opened by <@${message.author.id}>\nReason: ${reason}`);
    message.reply(`Your ticket has been created: ${channel.toString()}`);
  } else if (subcommand === 'close') {
    if (!message.channel.name.startsWith('ticket-')) {
      message.reply('This command can only be used inside a ticket channel.');
      return;
    }

    const isRequester = message.channel.name === `ticket-${message.author.id}`;
    const isStaff = message.member.roles.cache.has(staffRoleId);

    if (!isRequester && !isStaff) {
      message.reply('Only the ticket creator or staff can close this ticket.');
      return;
    }

    await message.channel.delete('Ticket closed');
  } else {
    message.reply('Usage: !ticket open [reason] | !ticket close');
  }
});

client.login(token);
