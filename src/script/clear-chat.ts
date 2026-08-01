/*
 * INFO: Clear-Chat.ts
 * This script is one of the feature of the AI, where it can be
 * automatically execute by asking to clear the chat. The purpose
 * of this is to maintain the user's privacy by letting user
 * to ask the AI to clear the messages for them.
 */

import { TELEGRAM } from "@/contants";
import { aiResponse, EventInterface } from "@/interface";
import gist from "@/utils/gist";
import TelegramBot from "node-telegram-bot-api";

export default async function script(body: aiResponse, api?: TelegramBot, event?: EventInterface) {
  if (api && event) {
    const chatId = event.chat.id.toString()
    const threadId = (event.message_thread_id ?? event.reply_to_message?.message_thread_id ?? 0).toString()

    const param = (body.parameter ?? "").toLowerCase().trim()
    const isClearAll = ["all", "all-threads", "all_threads", "all threads", "everything"].includes(param)

    const topic = event.reply_to_message?.forum_topic_created?.name ?? "Last Thread"
    const startMsg = isClearAll
      ? "All threads in this chat will be cleared after 3 seconds"
      : `The thread ${topic} will be deleted after 3 seconds`

    const message = await api.sendMessage(event.chat.id, startMsg, {
      message_thread_id: event.message_thread_id
    })

    const store = (await gist(TELEGRAM)) as Record<string, any> || {}

    if (isClearAll) {
      delete store[chatId]
    } else if (store[chatId] && typeof store[chatId] === "object" && !Array.isArray(store[chatId])) {
      delete store[chatId][threadId]
      if (Object.keys(store[chatId]).length === 0) {
        delete store[chatId]
      }
    } else {
      delete store[chatId]
    }

    delete store[`${chatId}_${threadId}`]

    await gist(TELEGRAM, store)

    if (event.message_thread_id && !isClearAll) {
      setTimeout(() => {
        api.deleteForumTopic(event.chat.id, event.message_thread_id as number)
      }, 3000)

      await api.editMessageText(`The thread "${topic}" is now deleted`, {
        chat_id: message.chat.id,
        message_id: message.message_id
      })
    } else if (isClearAll) {
      await api.editMessageText(`All threads for this chat are now cleared`, {
        chat_id: message.chat.id,
        message_id: message.message_id
      })
    }

    setTimeout(() => {
      api.deleteMessage(message.chat.id, message.message_id)
    }, 5000)

  }
  return {}
}

