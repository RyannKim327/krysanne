import { daily_verse, version } from "biblegateway-scrape";
import TelegramBot from "node-telegram-bot-api";

export default async function bibleVerse(api: TelegramBot, userId: number) {
  const date = new Date()

  const response = await daily_verse(version.ENG_NEW_INTERNATIONAL_VERSION,
    [date.getFullYear(), date.getMonth() + 1, date.getDate()])

  api.sendMessage(userId, `A daily bible verse for you\n\n${response.book}:\n${response.verses.join("\n")}`)
}
