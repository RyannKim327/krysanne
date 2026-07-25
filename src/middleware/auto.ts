/*
 * INFO: Auto.ts
 * This file serve as the main control for ai decision making pattern.
 * By using a standardized format, the AI can execute scripts created
 * by each developer without using any command based pattern.
 */

import * as dotenv from "dotenv"
import TelegramBot from "node-telegram-bot-api";
import { EventInterface } from "@/interface";
import { TELEGRAM } from "@/contants";
import artificialInteligence from "./ai";
import gist from "@/utils/gist";

dotenv.config()

export default async function auto(api: TelegramBot, event: EventInterface, body: string) {
  let user = event.from?.id.toString() || event.chat.id.toString()

  if (event.reply_to_message?.message_thread_id) {
    user += `_${event.reply_to_message?.message_thread_id}`
  }

  const userGist = await gist(TELEGRAM)

  let extras

  if (event.from?.username) {
    extras = {
      "role": "system",
      "content": `The user's Telegram username is: ${event.from?.username}`
    }
  }

  if (event.quote?.text) {
    body = `I am quoting to: "${event.quote.text}" referering to this message: ${event.reply_to_message?.text}\n\nNow ${body}`
  } else if (event.reply_to_message?.text) {
    body = `I am replying to: ${event.reply_to_message.text}\n\nNow ${body}`
  }

  const { messages, extract, src } = await artificialInteligence(body, event.chat.id, {
    dataset: userGist[user],
    type: "telegram",
    extras: extras,
    event: event,
    api: api
  })

  userGist[user] = messages

  gist(TELEGRAM, userGist)

  try {
    await api.sendChatAction(event.chat.id, "typing", {
      message_thread_id: event.reply_to_message?.message_thread_id
    })
  } catch (e) { }

  // INFO: I let this log for debugging purposes
  // console.log(event)

  // TODO: Auto add script method
  if (src.audio) {
    api.sendAudio(event.chat.id, src.audio, {
      message_thread_id: event.message_thread_id,
      caption: src.text ?? ""
    })
  } else if (src.image) {
    api.sendPhoto(event.chat.id, src.image, {
      message_thread_id: event.message_thread_id,
      caption: src.text ?? ""
    })
  } else if (src.video) {
    api.sendVideo(event.chat.id, src.video, {
      message_thread_id: event.message_thread_id,
      caption: src.text ?? ""
    })
  } else if (src.text) {
    api.sendMessage(event.chat.id, src.text, {
      message_thread_id: event.message_thread_id
    })
  } else {
    // TODO: default callback
    api.sendMessage(event.chat.id, extract.message, {
      message_thread_id: event.reply_to_message?.message_thread_id
    })

    // TODO: Thread Rename
    if (extract.title) {
      api.editForumTopic(event.chat.id, event.reply_to_message?.message_thread_id ?? 0, {
        name: extract.title
      })
    }
  }
}

