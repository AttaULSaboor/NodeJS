
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const token = 'MTE2Mjc4MjAyNTIyNTM1OTQ0Mg.GKKCzt.UTIuOd_kz_48oME7DI8tGcs_1JibgV2E_dsIso'; 
const prefix = '!'; // Set your bot's command prefix here

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('Bot is now ready to receive commands.');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Check if the message starts with the command prefix
  if (!message.content.startsWith(prefix)) return;

  console.log(`Received command: ${command}`);

  // Check if the command is one of the valid commands
  if (command === 'pricebtc') {
    try {
      // Fetch Bitcoin (BTC) data from the Coinlore API using the ID for BTC (90)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=90');

      if (response.data.length === 0) {
        message.reply('Bitcoin (BTC) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const priceUSD = coinData.price_usd;

      const replyMessage = `Current price of Bitcoin (BTC): $${priceUSD}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Bitcoin (BTC) data.');
    }
  }

  if (command === 'priceeth') {
    try {
      // Fetch Bitcoin (ETH) data from the Coinlore API using the ID for ETH (80)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=80');

      if (response.data.length === 0) {
        message.reply('Ethereum (ETH) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const priceUSD = coinData.price_usd;

      const replyMessage = `Current price of Ethereum (ETH): $${priceUSD}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Ethereum (ETH) data.');
    }
  }

  if (command === 'priceltc') {
    try {
      // Fetch Bitcoin (LTC) data from the Coinlore API using the ID for LTC (1)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=1');

      if (response.data.length === 0) {
        message.reply('Litecoin (LTC) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const priceUSD = coinData.price_usd;

      const replyMessage = `Current price of Litecoin (LTC): $${priceUSD}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Litecoin (LTC) data.');
    }
  }

  if (command === 'rankbtc') {
    try {
      // Fetch Bitcoin (BTC) data from the Coinlore API using the ID for BTC (90)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=90');

      if (response.data.length === 0) {
        message.reply('Bitcoin (BTC) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const rank = coinData.rank;

      const replyMessage = `Current rank of Bitcoin (BTC): ${rank}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Bitcoin (BTC) data.');
    }
  }

  if (command === 'ranketh') {
    try {
      // Fetch Bitcoin (ETH) data from the Coinlore API using the ID for ETH (80)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=80');

      if (response.data.length === 0) {
        message.reply('Ethereum (ETH) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const rank = coinData.rank;

      const replyMessage = `Current rank of Bitcoin (BTC): ${rank}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Ethereum (ETH) data.');
    }
  }

  if (command === 'rankltc') {
    try {
      // Fetch Bitcoin (LTC) data from the Coinlore API using the ID for LTC (1)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=1');

      if (response.data.length === 0) {
        message.reply('Litecoin (LTC) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const rank = coinData.rank;

      const replyMessage = `Current rank of Bitcoin (BTC): ${rank}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Litecoin (LTC) data.');
    }
  }

  if (command === 'volume24btc') {
    try {
      // Fetch Bitcoin (BTC) data from the Coinlore API using the ID for BTC (90)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=90');

      if (response.data.length === 0) {
        message.reply('Bitcoin (BTC) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const volume = coinData.volume24;

      const replyMessage = `24-hour trading volume of ${coinData.name} ${coinData.symbol}: ${volume}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Bitcoin (BTC) data.');
    }
  }
  
  if (command === 'volume24eth') {
    try {
      // Fetch Bitcoin (ETH) data from the Coinlore API using the ID for ETH (80)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=80');

      if (response.data.length === 0) {
        message.reply('Ethereum (ETH) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const volume = coinData.volume24;

      const replyMessage = `24-hour trading volume of ${coinData.name} ${coinData.symbol}: ${volume}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Ethereum (ETH) data.');
    }
  }

  if (command === 'volume24ltc') {
    try {
      // Fetch Bitcoin (ETH) data from the Coinlore API using the ID for ETH (1)
      const response = await axios.get('https://api.coinlore.net/api/ticker/?id=1');

      if (response.data.length === 0) {
        message.reply('Ethereum (ETH) was not found.');
        return;
      }

      // Process the response data and send it back to Discord.
      const coinData = response.data[0];
      const volume = coinData.volume24;

      const replyMessage = `24-hour trading volume of ${coinData.name} ${coinData.symbol}: ${volume}`;

      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply('An error occurred while fetching Ethereum (ETH) data.');
    }
  }

  if (command === 'infobtc') {  
    try {
      const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=90`);
  
      if (response.data.length === 0) {
        message.reply(`Bitcoin (BTC) was not found.`);
        return;
      }
  
      const coinData = response.data[0];
      const name = coinData.name;
      const symbol = coinData.symbol;
      const rank = coinData.rank;
      const priceUSD = coinData.price_usd;
      const change24h = coinData.percent_change_24h;
      const volume24h = coinData.volume24;
  
      const replyMessage = `
        **${name} (${symbol})**
        Rank: ${rank}
        Current Price (USD): $${priceUSD}
        24-hour Change: ${change24h}%
        24-hour Trading Volume: ${volume24h}
      `;
  
      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply(`An error occurred while fetching ${cryptoSymbol} data.`);
    }
  }

  if (command === 'infoeth') {  
    try {
      const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=80`);
  
      if (response.data.length === 0) {
        message.reply(`Bitcoin (BTC) was not found.`);
        return;
      }
  
      const coinData = response.data[0];
      const name = coinData.name;
      const symbol = coinData.symbol;
      const rank = coinData.rank;
      const priceUSD = coinData.price_usd;
      const change24h = coinData.percent_change_24h;
      const volume24h = coinData.volume24;
  
      const replyMessage = `
        **${name} (${symbol})**
        Rank: ${rank}
        Current Price (USD): $${priceUSD}
        24-hour Change: ${change24h}%
        24-hour Trading Volume: ${volume24h}
      `;
  
      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply(`An error occurred while fetching ${cryptoSymbol} data.`);
    }
  }

  if (command === 'infoltc') {  
    try {
      const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=1`);
  
      if (response.data.length === 0) {
        message.reply(`Bitcoin (BTC) was not found.`);
        return;
      }
  
      const coinData = response.data[0];
      const name = coinData.name;
      const symbol = coinData.symbol;
      const rank = coinData.rank;
      const priceUSD = coinData.price_usd;
      const change24h = coinData.percent_change_24h;
      const volume24h = coinData.volume24;
  
      const replyMessage = `
        **${name} (${symbol})**
        Rank: ${rank}
        Current Price (USD): $${priceUSD}
        24-hour Change: ${change24h}%
        24-hour Trading Volume: ${volume24h}
      `;
  
      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply(`An error occurred while fetching ${cryptoSymbol} data.`);
    }
  }

  if (command === 'changebtc') {
    try {
      const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=90`);
  
      if (response.data.length === 0) {
        message.reply(`${cryptoSymbol} was not found.`);
        return;
      }
  
      const coinData = response.data[0];
      const change24h = coinData.percent_change_24h;
  
      const replyMessage = `24-hour change of ${coinData.name} ${coinData.symbol}: ${change24h}%`;
  
      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply(`An error occurred while fetching ${cryptoSymbol} data.`);
    }
  }

  if (command === 'changeeth') {
    try {
      const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=80`);
  
      if (response.data.length === 0) {
        message.reply(`${cryptoSymbol} was not found.`);
        return;
      }
  
      const coinData = response.data[0];
      const change24h = coinData.percent_change_24h;
  
      const replyMessage = `24-hour change of ${coinData.name} ${coinData.symbol}: ${change24h}%`;
  
      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply(`An error occurred while fetching ${cryptoSymbol} data.`);
    }
  }

  if (command === 'changeltc') {
    try {
      const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=1`);
  
      if (response.data.length === 0) {
        message.reply(`${cryptoSymbol} was not found.`);
        return;
      }
  
      const coinData = response.data[0];
      const change24h = coinData.percent_change_24h;
  
      const replyMessage = `24-hour change of ${coinData.name} ${coinData.symbol}: ${change24h}%`;
  
      message.reply(replyMessage);
    } catch (error) {
      console.error('API Error:', error);
      message.reply(`An error occurred while fetching ${cryptoSymbol} data.`);
    }
  }
  
});

client.login(token);
