import TelegramBot, { EventMetadata } from "node-telegram-bot-api";
import * as dotenv from "dotenv"
import log from "./utils/console";
import express, { Express, Request, Response } from "express"
import core from "./core";
import { EventInterface } from "./interface";

function main() {
  dotenv.config()

  const token = process.env.TELEGRAM_TOKEN
  const url = process.env.WEBHOOK_URL

  if (!token) {
    return log("Index", "Token is missing", "e")
  }

  log(
    "Starter",
    `
        ╭―――――――――――――――――――――――――――――――――――――――――╮
        │                                         │
        │      Welcome to Telegram Music Bot      │
        │     Developed by Ryann Kim Sesgundo     │
        │                                         │
        ╰―――――――――――――――――――――――――――――――――――――――――╯`,
  );

  try {
    let api: TelegramBot | null = null

    if (url) {
      // TODO: Webhook setup
      api = new TelegramBot(token)
      const app: Express = express()
      app.use(express.json())

      app.get("/", (req: Request, res: Response) => {
        res.send("Currently working")
      })

      api.setWebhook(`${url}/bot${token}`)

      app.post(`/bot${token}`, (req: Request, res: Response) => {
        api?.processUpdate(req.body)
        res.sendStatus(200)
      })

      app.listen(process.env.PORT || 3000, () => {
        log("Server Initiator", "Server starter using Webhook")
        log("Server Initiator", "Developed by MPOP Reverse II")
      })

    } else {
      // TODO: Polling Setup
      api = new TelegramBot(token, {
        polling: true
      })
      log("Server Initiator", "Server starter using polling")
      log("Server Initiator", "Developed by MPOP Reverse II")
    }

    log("Welcome", "Server Loaded and Running")

    api.on("message", (message: EventInterface, metadata: EventMetadata) => {
      // TODO: To include the metadata in the event for single fetch
      message['metadata'] = metadata

      // TODO: To filter message with non actions
      const metatypes = [
        "text", "animation", "audio", "document", "photo", "video"
      ]

      if (message.caption) {
        message.text = message.caption
      }

      if (metatypes.includes(metadata.type ?? "")) {
        core(api, message, message.text ?? "")
      }
    })

    // api.onText(/([\w\W]+)/gi, (message: Message, regex: RegExpExecArray | null) => {
    //   core(api, message, regex)
    // })

  } catch (e: any) {
    log("Main Catch", e.toString(), "e")
  }

}

main()
