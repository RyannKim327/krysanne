import { verse } from "biblegateway-scrape";
import TelegramBot, { Message } from "node-telegram-bot-api";

export default async function bible(api: TelegramBot, event: Message, body: string, params: string) {
  const response = await verse(params)
  api.sendMessage(event.chat.id, `${body}\n\n${response.book}\n${response.verses}`)
}
