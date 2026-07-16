import { EventMetadata, Message } from "node-telegram-bot-api"

export interface aiResponse {
  message: string
  command: string
  parameter: string
  title?: string
}

export interface EventInterface extends Message {
  metadata: EventMetadata
}
