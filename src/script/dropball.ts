import TelegramBot from "node-telegram-bot-api";
import { aiResponse, EventInterface } from "@/interface"

function addRow(width: number, n: number) {
  let str = "\n"
  for (let j = 0; j < width; j++) {
    if (j === n) {
      str += "• "
    } else {
      str += ": "
    }
  }
  return `${str}\n`
}


export default async function script(body: aiResponse, api?: TelegramBot, event?: EventInterface) {
  const height = 10
  const width = 10
  let n = parseInt(body.parameter)
  n = (n - 1) % width

  let i = 0

  let str = `Rolling...\n${addRow(width, n)}`

  if (api && event) {
    event = await api.sendMessage(event.chat.id, str, {
      message_thread_id: event.message_thread_id
    })
  }

  function _() {
    if (i < height) {
      const random = Math.floor(Math.random() * width)

      // TODO: Decision Process
      if (n >= width - 1) {
        n--
      } else if (n <= 0) {
        n++
      } else {
        if (random % 2 === 0) {
          n++
        } else {
          n--
        }
      }

      // TODO: Printing
      str += addRow(width, n)
      i++

      if (event && api) {
        api.editMessageText(str, {
          chat_id: event.chat.id,
          message_id: event.message_id
        })
      }

      setTimeout(() => {
        _()
      }, 1500);
    }
  }

  if (event && api) {
    _()
    return {}
  } else {
    return {
      text: str
    }
  }
}
