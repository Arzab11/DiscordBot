const { Client, GatewayIntentBits, IntentsBitField, MessageEmbed } = require('discord.js');
require('dotenv').config();
const axios = require('axios')
const countryjs = require('countryjs');

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
    countryName
) => {
    const embed = {
        color: 0x0099ff,
        title: `Weather in ${countryName}`,
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
    const args = message.content.slice(prefix.length).split(/ +/); // Split by one or more spaces
    const command = args.shift().toLowerCase();
    if (message.content === prefix + 'hello') {
        message.reply('hey');
    } else if (command === 'w' || command === 'weather') {
        const city = args.join(' '); // Join the arguments back together with spaces
        axios
            .get(
                `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.apitoken}`
            )
            .then(response => {
                let apiData = response.data;
                let countryCode = apiData.sys.country;
                let countryName = countryjs.name(countryCode);
                let currentTemp = Math.ceil(apiData.main.temp);
                let humidity = apiData.main.humidity;
                let wind = apiData.wind.speed;
                let icon = apiData.weather[0].icon;
                // let country = apiData.sys.country;
                let pressure = apiData.main.pressure;
                let cloudiness = apiData.weather[0].description;
                message.channel.send(exampleEmbed(currentTemp, pressure, humidity, wind, cloudiness, icon, countryName));
            })
            .catch(err => {
                message.reply(`Enter a valid city name`);
                console.error(err); 
            });
    }
});



client.login(process.env.token)

