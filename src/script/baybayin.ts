/*
 * INFO: Baybayin.ts
 * This file will serve as the transliterator from alphabetical to baybayin characters.
 * This will help to nourish the platform to learn baybayin for Filipinos and others.
 * The baybayin must known by translating from a language to Tagalog before to transliterate
 * to baybayin.
 */

import { aiResponse, EventInterface } from "@/interface";
import TelegramBot from "node-telegram-bot-api";
import baybayin from "baybayin-transliterator"

export default function script(body: aiResponse, api?: TelegramBot, event?: EventInterface) {
  const baybay = baybayin.default(body.parameter)

  return {
    text: `Ang salin ng ${baybay.original} sa baybayin ay ${baybay.baybayin}`
  }
}
