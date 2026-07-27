declare namespace NodeJS {
  interface ProcessEnv {
    TELEGRAM_TOKEN: string
    AI_TOKEN: string
    BOT_CODE: string
    IMAGE_API: string
    PUTER: string
    GIST_ID: string
    GITHUB_TOKEN: string,
    WEBHOOK_URL?: string
  }
}
