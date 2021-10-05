const Discord = require('discord.js')
const schedule = require('node-schedule')
const axios = require('axios')

function getPrice() {
  return axios.get('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT')
    .then(({ data }) => ({
      nickname: `ETH (${parseFloat(data.priceChangePercent) > 0 ? '↗' : '↘'})`,
      text: `${parseFloat(data.lastPrice).toFixed(2)} | ${parseFloat(data.priceChange).toFixed(2)} (${parseFloat(data.priceChangePercent).toFixed(2)}%) | ETH-USDT`,
      color: parseFloat(data.priceChangePercent) > 0 ? [105, 162, 53] : [220, 53, 69]
    }))
    .catch(() => ({
      nickname: 'ETH',
      text: 'Error: no price.',
      color: [220, 53, 69]
    }))
}

const client = new Discord.Client({ intents:[] });
client.login(process.env.ETH_BOT_TOKEN);

client.on('ready', async () => {
  try {
    const bot = client.guilds.cache.first().members.cache.first()
    const role = client.guilds.cache.first().roles.cache.find((role) => role.name === 'ETH Price')
    const user = client.user;
    const { nickname, text, color } = await getPrice()
    
    await Promise.all([
      bot.setNickname(nickname),
      user.setActivity({
        name: text,
        type: 'WATCHING'
      }),
      role.setColor(color)
    ]) 
    
    schedule.scheduleJob('*/5 * * * *', async () => {
      const { nickname, text, color } = await getPrice()
      
      await Promise.all([
        bot.setNickname(nickname),
        user.setActivity({
          name: text,
          type: 'WATCHING'
        }),
        role.setColor(color)
      ]) 
    }) 
  } catch (err) {
    console.error(err)
  }
})
