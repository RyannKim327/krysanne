/*
 * INFO: Clear-Chat.ts
 * This script is one of the feature of the AI, where it can be
 * automatically execute by asking to create a new thread. It will
 * also automatically execute once the AI recognize the topic is
 * off or by the user changing the topic. This will remain the topic
 * in the line and it prevent the confusion of the AI to do something
 * annoying.
 */

import { TELEGRAM } from "@/contants";
import { aiResponse, EventInterface } from "@/interface";
import gist from "@/utils/gist";
import TelegramBot from "node-telegram-bot-api";

export default async function script(body: aiResponse, api?: TelegramBot, event?: EventInterface) {
  if (api && event) {
    const title = body.title ?? "New Thread";
    const nt = await api.createForumTopic(event.chat.id, title);

    const pastRequestMessage = event.text || body.parameter || "";

    if (pastRequestMessage) {
      await api.sendMessage(event.chat.id, pastRequestMessage, {
        message_thread_id: nt.message_thread_id,
      });
    }

    await api.sendMessage(event.chat.id, body.message, {
      message_thread_id: nt.message_thread_id,
    });

    try {
      const newThreadKey = `${event.chat.id}_${nt.message_thread_id}`;
      const store = await gist(TELEGRAM);
      store[newThreadKey] = [
        ...(pastRequestMessage ? [{ role: "user", content: pastRequestMessage }] : []),
        { role: "assistant", content: body.message }
      ];
      await gist(TELEGRAM, store);
    } catch (e) { }

    return {};
  }
  return {};
}

