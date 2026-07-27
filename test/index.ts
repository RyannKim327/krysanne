// TODO: For testing purposes
import * as dotenv from "dotenv"
import { init } from "@heyputer/puter.js/src/init.cjs";

dotenv.config()

async function test() {

  const puter = init(process.env.PUTER)

  const data = await puter.ai.txt2img("a picture of young kushina uzumaki", {
    model: "grok-imagine-image-quality",
    quality: "low",
    response_format: "jpg",

  }).catch(e => { return e })

  console.log(data)

}
test()

// import puter from "@heyputer/puter.js";
// async function models() {
//   const a = await puter.ai.listModels("")
//   console.log(a)
// }
// models()
