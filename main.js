const { Client, GatewayIntentBits, IntentsBitField, MessageEmbed } = require('discord.js');
require('dotenv').config();
const axios = require('axios')

const prefix = '!';

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.username}`);
})

const exampleEmbed = (
    temp,
    pressure,
    humidity,
    wind,
    cloudiness,
    icon,
    country
) => {
    const embed = {
        color: 0x0099ff,
        title: `Weather in ${country}`,
        fields: [
            { name: 'Temperature', value: `${temp}°C`, inline: true },
            { name: 'Pressure', value: `${pressure} hPa`, inline: true },
            { name: 'Humidity', value: `${humidity}%`, inline: true },
            { name: 'Wind Speed', value: `${wind} m/s`, inline: true },
            { name: 'Cloudiness', value: cloudiness, inline: true },
        ],
        thumbnail: { url: `http://openweathermap.org/img/w/${icon}.png` },
    };

    return { embeds: [embed] };
};

client.on('messageCreate', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (message.content === prefix + 'hello') {
        message.reply('hey')
    }
    else if (command === 'w' || command === 'weather') {
        axios
            .get(
                `http://api.openweathermap.org/data/2.5/weather?q=${args.join(' ')}&appid=${process.env.apitoken}`
            )
            .then(response => {
                let apiData = response.data;
                let currentTemp = Math.ceil(apiData.data.main.temp)
                let humidity = apiData.data.main.humidity;
                let wind = apiData.data.wind.speed;
                let icon = apiData.data.weather[0].icon
                let country = apiData.data.sys.country
                let pressure = apiData.data.main.pressure;
                let cloudness = apiData.data.weather[0].description;
                message.channel.send(exampleEmbed(currentTemp, pressure, humidity, wind, cloudness, icon, country));
             })
            .catch(err => {
                message.reply(`Enter a valid city name`);
                console.error(err); 
            })
    }
})

// client.on('interactionCreate', (interaction) => {
//     if (!interaction.isChatInputCommand()) return;

//     if (interaction.commandName === 'hey') {
//         interaction.reply('hey!');
//     }
//     if (interaction.commandName === 'test') {
//         interaction.reply('testing');
//     }
// });

client.login(process.env.token)

