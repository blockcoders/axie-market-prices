const Discord = require('discord.js')
const schedule = require('node-schedule')
const { updateActivity, scheduleRule } = require('./utils')

const client = new Discord.Client({ intents:[] });
client.login(process.env.LUNA_BOT_TOKEN);

const updateClient = async () => {
  console.info('Bot LUNA ready.')
  
  const promises = []

  try {
    client.guilds.cache.each((guild) => {
      const bot = guild.members.cache.first()
      const role = guild.roles.cache.find((role) => role.name === 'LUNA Price')
      const user = client.user;
      
      promises.push(updateActivity('LUNA', user, bot, role))
      
      schedule.scheduleJob(scheduleRule, async () => {
        await updateActivity('LUNA', user, bot, role)
      })
    })

    await Promise.all(promises)
  } catch (err) {
    console.error(err)
  }
}

client.on('ready', updateClient)
client.on('guildCreate', updateClient)