# CodeXTest

This repository now contains a Discord bot written in Node.js that implements a simple ticket system.

## Running the bot

1. Install Node.js and install the required dependencies:
   ```bash
   npm install discord.js dotenv
   ```
2. Set the following environment variables:
   - `DISCORD_BOT_TOKEN` &mdash; your bot token
   - `STAFF_ROLE_ID` &mdash; the role allowed to view and manage tickets
3. Run the bot:
   ```bash
   node ticket_bot.js
   ```

### Commands
- `!ticket open [reason]` &mdash; create a private ticket channel
- `!ticket close` &mdash; close the ticket from inside the ticket channel
