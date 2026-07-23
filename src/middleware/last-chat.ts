import { LASTCHAT } from "@/contants";
import { EventInterface } from "@/interface";
import gist from "@/utils/gist";

export default async function lastChat(event: EventInterface) {
  let lastchats = await gist(LASTCHAT)

  if (!lastchats[event.chat.id]) {
    lastchats = {
      ...lastchats,
      [event.chat.id]: 0
    }
  }

  lastchats = {
    ...lastchats,
    [event.chat.id]: Date.now()
  }
  setTimeout(async () => {
    await gist(LASTCHAT, lastchats ?? {})
  }, 500)
}
