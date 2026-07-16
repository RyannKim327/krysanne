import TelegramBot from "node-telegram-bot-api";
import auto from "@/middleware/auto";
import { EventInterface } from "./interface";

export default function core(api: TelegramBot, event: EventInterface, body: string) {
  if (body.startsWith("/start")) {
    api.sendMessage(event.chat.id, "Hello")
  } else {
    auto(api, event, body)
  }
}
