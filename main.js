import TelegramBot from 'node-telegram-bot-api';
import { getSnippets } from "./labo.js"


const key = ""
const bot = new TelegramBot(key , { polling: true });
const hello_message = `
Hello! I am your Telegram bot.
- /subscribe - Subscribe to notifications
- /unsubscribe - Unsubscribe from notifications
`

let subscribed = []
let active = []

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, hello_message);
});

// Listen for /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! I am your Telegram bot.');
});

bot.onText(/\/subscribe/, (msg) => {
    const chatId = msg.chat.id;
    subscribed.push(chatId)
    bot.sendMessage(chatId, 'You are now subscribed');
    console.log(msg.chat.username, "subscribed")
})

bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    subscribed = subscribed.filter(id => id !== chatId)
    bot.sendMessage(chatId, 'You are now unsubscribed');
    console.log(msg.chat.username, "unsubscribed")
})

async function fetchAndNotify() {
    console.log("Fetching data...")
    const snippets = await getSnippets();

    let message = ""
    for (const [name, value] of Object.entries(snippets)) {
        if (active.includes(name)) continue
        if (value.toLowerCase() === "nein") continue
        active.push(name)
        message += `${name}: ${value}\n`
    }

    if (message === "") return
    for (const chatId of subscribed) {
        bot.sendMessage(chatId, message);
    }
}

// call the function every 5 minutes
setInterval(fetchAndNotify, 1 * 10 * 1000);
