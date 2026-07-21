import { EventInterface } from "@/interface";
import TelegramBot, { BusinessMessagesDeleted, EventMetadata, ForumTopicClosed } from "node-telegram-bot-api";
import core from "./core";

export default function APIProcess(api: TelegramBot) {
  // TODO: Messaging
  api.on("message", (event: EventInterface, metadata: EventMetadata) => {
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
      core(api, event, event.text ?? "")
    }
  })
}

