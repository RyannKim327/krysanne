/*
 * INFO: Imgen.ts
 * This script serves as the image generator, since the AI uses the
 * text generator only, we need to use a 3rd party image generator for
 * this feature.
 */

import * as dotenv from "dotenv"
import { aiResponse, EventInterface } from "@/interface";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { init } from "@heyputer/puter.js/src/init.cjs";

dotenv.config()


export default async function script(body: aiResponse, api?: TelegramBot, event?: EventInterface) {

  return {
    text: "Image generator is still under redevelopment"
  }

  if (api && event) {
    event = await api.sendMessage(event.chat.id, body.message, {
      message_thread_id: event.reply_to_message?.message_thread_id
    })
  }

  const puter = init(process.env.PUTER)

  const data = await puter.ai.txt2img(body.parameter, {
    model: "gpt-image-1-mini",
  }).catch(e => { return e })

  if (api && event && data.error) {
    api.editMessageText(data.error, {
      chat_id: event.chat.id,
      message_id: event.message_id
    })
  } else if (api && event) {
    api.deleteMessage(event.chat.id, event.message_id)
  }

  // const base64 = data.src.replace(/^data:image\/\w+;base64,/, "");
  // const buffer = Buffer.from(base64, "base64");

  return {
    image: data.src
  }
}

