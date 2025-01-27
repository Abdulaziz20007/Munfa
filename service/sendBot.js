const TelegramBot = require("node-telegram-bot-api");
const config = require("config");

const bot = new TelegramBot(config.get("telegram.token"), { polling: false });

const sendOrderMessage = async (order) => {
  try {
    if (!order) {
      throw new Error("Buyurtma ma'lumotlari noto'g'ri");
    }

    const { products, address, total, comment, _id, user, createdAt } = order;

    const message =
      `🛍 Yangi Buyurtma!\n\n` +
      `👤 Mijoz: ${user.name || ""} ${user.surname || ""}\n` +
      `📞 Telefon: ${user.phone || ""}\n` +
      `📍 Manzil: ${address}\n` +
      `💭 Izoh: ${comment}\n\n` +
      `🛒 Mahsulotlar:\n${products
        .map(
          (item, index) =>
            `${index + 1}. ${item.product.name} x${item.quantity} = ${
              item.priceAtOrder * item.quantity
            } so'm`
        )
        .join("\n")}\n\n` +
      `💰 Jami: ${total} so'm\n` +
      `📅 Sana: ${new Date(createdAt).toLocaleString()}\n\n` +
      `<a href="https://example.com/orders/${_id}">📋 Buyurtma tafsilotlarini ko'rish</a>`;

    await bot.sendMessage(config.get("telegram.chatId"), message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (error) {
    console.error("Telegram xabar yuborishda xatolik:", error);
    throw error;
  }
};

module.exports = {
  sendOrderMessage,
};
