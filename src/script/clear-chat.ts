import { aiResponse, EventInterface } from "@/interface";
import gist from "@/utils/gist";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { decrypt, encrypt } from "json-enc-dec";
import TelegramBot from "node-telegram-bot-api";

export default async function script(api: TelegramBot, event: EventInterface, body: aiResponse) {
  let user = event.from?.id.toString() || event.chat.id.toString()

  if (event.reply_to_message?.message_thread_id) {
    user += `_${event.reply_to_message?.message_thread_id}`
  }

  const store = await gist("chats.json")
  delete store[user]
  gist("chats.json", store)

  api.deleteForumTopic(event.chat.id, event.message_thread_id as number)

  const message = await api.sendMessage(event.chat.id, `The thread ${event.reply_to_message?.forum_topic_created?.name} is now deleted`)
  setTimeout(() => {
    api.deleteMessage(message.chat.id, message.message_id)
  }, 5000)
}

