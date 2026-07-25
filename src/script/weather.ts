/*
 * INFO: Weather.ts
 * This script serve as the weather update especially that
 * we, the head developer, is in a tropical country.
 * This will help us to update the current temperature
 * whether it is hot or not.
 */

import { aiResponse, EventInterface } from "@/interface";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

export default async function script(body: aiResponse, api?: TelegramBot, event?: EventInterface) {
  let msg
  if (api && event) {
    msg = await api.sendMessage(event.chat.id, body.message, {
      message_thread_id: event.message_thread_id
    })
  }
  const { data } = await axios.get(`https://wttr.in/${body.parameter}?format=4`)

  if (api && event && msg) {
    api.deleteMessage(msg?.chat.id, msg?.message_id)
  }

  return {
    text: `The weather in ${data}`
  }
}
