declare namespace NodeJS {
  interface ProcessEnv {
    TELEGRAM_TOKEN: string
    AI_TOKEN: string
    BOT_CODE: string
    LUMENFALL_API: string
    GIST_ID: string
    GITHUB_TOKEN: string,
    WEBHOOK_URL?: string
  }
}
