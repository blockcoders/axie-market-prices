const Discord = require('discord.js')
const schedule = require('node-schedule')
const { updateActivity, scheduleRule } = require('./utils')

const client = new Discord.Client({ intents:[] });
client.login(process.env.ONE_BOT_TOKEN);

const updateClient = async () => {
  console.info('Bot ONE ready.')
  
  const promises = []

  try {
    client.guilds.cache.each((guild) => {
      const bot = guild.members.cache.first()
      const role = guild.roles.cache.find((role) => role.name === 'ONE Price')
      const user = client.user;
      
      promises.push(updateActivity('ONE', user, bot, role))
      
      schedule.scheduleJob(scheduleRule, async () => {
        await updateActivity('ONE', user, bot, role)
      })
    })

    await Promise.all(promises)
  } catch (err) {
    console.error(err)
  }
}

client.on('ready', updateClient)
client.on('guildCreate', updateClient)