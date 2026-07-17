import { aiResponse } from "@/interface";
import axios from "axios";
import TelegramBot, { Message } from "node-telegram-bot-api";

export default async function script(api: TelegramBot, event: Message, body: aiResponse) {

  const msg = await api.sendMessage(event.chat.id, body.message, {
    message_thread_id: event.message_thread_id
  })

  const { data } = await axios.get(`https://wttr.in/${body.parameter}?format=4`)

  api.editMessageText(`The weather in ${data}`, {
    message_id: msg.message_id,
    chat_id: msg.chat.id
  })
}
