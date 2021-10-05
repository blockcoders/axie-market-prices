const axios = require('axios')

const restclient = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
  responseType: 'json',
  timeout: 8000,
})
const green = [105, 162, 53]
const red = [220, 53, 69]
const scheduleRule = '*/5 * * * *'

const get24hPrice = async (_symbol = '') => {
  const symbol = _symbol.toUpperCase()

  try {
    const { data } = await restclient.get(`/ticker/24hr?symbol=${symbol}USDT`)
    const priceChangePercent = parseFloat(data.priceChangePercent)
    
    return {
      nickname: `${symbol} (${priceChangePercent > 0 ? '↗' : '↘'})`,
      text: `${parseFloat(data.lastPrice).toFixed(2)} | ${parseFloat(data.priceChange).toFixed(2)} (${priceChangePercent.toFixed(2)}%) | ${symbol}-USDT`,
      color: priceChangePercent > 0 ? green : red
    }
  } catch (error) {
    console.error('Error trying to get price for %s: ', symbol, err)
    
    return {
      nickname: symbol,
      text: 'Error: no price.',
      color: red
    }
  }
}

const updateActivity = async (symbol, user, bot, role) => {
  try {
    const { nickname, text, color } = await get24hPrice(symbol)
    
    return Promise.all([
      bot.setNickname(nickname),
      user.setActivity({
        name: text,
        type: ''
      }),
      role.setColor(color)
    ])
  } catch (err) {
    console.error('Error trying to update activity: ', err)
  }
}

module.exports = {
  get24hPrice,
  updateActivity,
  scheduleRule,
}
