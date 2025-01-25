const TelegramBot = require("node-telegram-bot-api");
const config = require("config");

const bot = new TelegramBot(config.get("telegram.token"), { polling: false });

const sendOrderMessage = async (orderData) => {
  try {
    const { customer, phone, address, items, total, link } = orderData;

    const message =
      `🎁 Yangi Buyurtma!\n\n` +
      `👤 Customer: ${customer}\n` +
      `📱 Phone: ${phone}\n` +
      `📍 Address: ${address || "None"}\n\n` +
      `📦 Items:\n${items
        .map((item, index) => `${index + 1}. ${item}`)
        .join("\n")}\n\n` +
      `💰 Total: ${total} so'm`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "📋 Buyurtma tafsilotlarini ko'rish",
            url: link,
          },
        ],
      ],
    };

    await bot.sendMessage(config.get("telegram.chatId"), message, {
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyboard),
    });
  } catch (error) {
    console.error("Error sending telegram message:", error);
    throw error;
  }
};

module.exports = {
  sendOrderMessage,
};
