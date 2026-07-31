import { aiResponse, EventInterface } from "@/interface";
import TelegramBot from "node-telegram-bot-api";

function rps(input: string) {
  const choices = ["rock", "paper", "scissors"];
  const player = input.toLowerCase();

  if (!choices.includes(player)) {
    return {
      success: false,
      message: "Invalid choice. Use 'rock', 'paper', or 'scissors'.",
    };
  }

  const bot = choices[Math.floor(Math.random() * choices.length)];

  let result: "win" | "lose" | "draw";

  if (player === bot) {
    result = "draw";
  } else if (
    (player === "rock" && bot === "scissors") ||
    (player === "paper" && bot === "rock") ||
    (player === "scissors" && bot === "paper")
  ) {
    result = "win";
  } else {
    result = "lose";
  }

  return {
    success: true,
    player,
    bot,
    result,
    message:
      result === "draw"
        ? `🤝 Draw! You both chose ${player}.`
        : result === "win"
          ? `🎉 You win! ${player} beats ${bot}.`
          : `😢 You lose! ${bot} beats ${player}.`,
  };
}

const deleteTimers = new Map<string, NodeJs.Timeout>()

export default async function script(body: aiResponse, api?: TelegramBot, event?: EventInterface) {
  if (api && event) {
    const inline = [
      [
        {
          text: "Rock",
          callback_data: "rps-rock"
        },
        {
          text: "Paper",
          callback_data: "rps-paper"
        },
        {
          text: "Scissor",
          callback_data: "rps-scissors"
        }
      ]
    ]

    event = await api.sendMessage(event.chat.id, body.message, {
      message_thread_id: event.message_thread_id,
      reply_markup: {
        inline_keyboard: inline
      }
    })

    api.on("callback_query", async (query) => {
      const exists = deleteTimers.get(event?.message_id)
      if (exists) {
        clearTimeout(exists)
      }

      if (query.data?.startsWith("rps-")) {
        const regex = /rps\-(rock|paper|scissors)/i
        setTimeout(() => {
          api.editMessageText("Rock", {
            chat_id: event?.chat.id,
            message_id: event?.message_id
          })
        }, 500)

        setTimeout(() => {
          api.editMessageText("Paper", {
            chat_id: event?.chat.id,
            message_id: event?.message_id
          })
        }, 1000)

        setTimeout(() => {
          api.editMessageText("Scissors", {
            chat_id: event?.chat.id,
            message_id: event?.message_id
          })
        }, 1500)

        setTimeout(() => {
          const rps_ = rps(query?.data?.match(regex)[1] ?? "")

          api.editMessageText(rps_.message ?? "Result", {
            chat_id: event?.chat.id,
            message_id: event?.message_id,
            reply_markup: {
              inline_keyboard: inline
            }
          })

          const timer = setTimeout(() => {
            api.deleteMessage(event?.chat.id, event?.message_id)
            deleteTimers.delete(event?.message_id.toString())
          }, 5 * 60 * 1000)

          deleteTimers.set(event?.message_id, timer)

        }, 2000)

      }
    })
  } else {
    const rps_ = rps(body.parameter)
    return {
      text: rps_.message
    }
  }
}
