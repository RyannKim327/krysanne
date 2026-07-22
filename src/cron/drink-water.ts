/*
 * INFO: Drink Water.ts
 * This script will run based on the time set to the index.ts
 * This will remind each user to drink water for their own good
 */

import TelegramBot from "node-telegram-bot-api";

export default async function drinkWater(api: TelegramBot, userId: number) {
  const message = await api.sendMessage(userId, "Hello, please don't forget to drink water. An automated reminder")

  setTimeout(() => {
    api.deleteMessage(message.chat.id, message.message_id)
  }, 300000)
}
