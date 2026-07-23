/*
 * INFO: API-Process.ts
 * This file serves the main API architecture, a connection to create
 * and call the AI responses through the EDITING message or through
 * SENDING message form the users. This will help the AI to know what might do next
 * This file also includes the call for CRON activities
 */

import { EventInterface } from "@/interface";
import TelegramBot, { EventMetadata } from "node-telegram-bot-api";
import core from "./core";
import mainCron from "@/cron";
import lastChat from "./last-chat";

export default async function APIProcess(api: TelegramBot) {
  mainCron(api)

  // TODO: Edit messages and caption
  api.on("edited_message", async (event: EventInterface) => {
    if (event.caption) {
      event.text = event.caption
    }
    await core(api, event, event.text ?? "")
    await lastChat(event)
  })

  // TODO: Messaging and uploading files
  api.on("message", async (event: EventInterface, metadata: EventMetadata) => {
    // TODO: To include the metadata in the event for single fetch
    event['metadata'] = metadata

    // TODO: To filter message with non actions
    const metatypes = [
      "text", "animation", "audio", "document", "photo", "video"
    ]

    if (event.forum_topic_closed) {
      console.log("Topic Closed Event Detected:", event);
    }
    if ((event as any).forum_topic_deleted) {
      console.log("Topic Deleted Event Detected:", event);
    }

    if (event.caption) {
      event.text = event.caption
    }

    if (metatypes.includes(metadata.type ?? "")) {
      await core(api, event, event.text ?? "")
      await lastChat(event)
    }
  })
}

