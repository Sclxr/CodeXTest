import os
import discord
from discord.ext import commands

# Intents are required for the bot to function correctly
intents = discord.Intents.default()
intents.message_content = True

# Create bot instance with command prefix '!'
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.command()
async def hello(ctx):
    """Responds with a greeting"""
    await ctx.send('Hello!')

if __name__ == '__main__':
    token = os.getenv('DISCORD_BOT_TOKEN')
    if not token:
        raise RuntimeError('Please set the DISCORD_BOT_TOKEN environment variable')
    bot.run(token)
