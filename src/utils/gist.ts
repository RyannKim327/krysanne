import * as dotenv from "dotenv"
import axios from "axios";
import { jsonInterface } from "@/interface";

dotenv.config()

export default async function gist(filename: string, processData?: jsonInterface | jsonInterface[]) {
  const URL = `https://api.github.com/gists/${process.env.GIST_ID}`
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  }

  try {
    if (processData) {
      // TODO: Update Data
      const { data } = await axios.patch(URL, {
        files: {
          [filename]: {
            content: JSON.stringify(processData, null, 2)
          }
        }
      },
        {
          headers
        }
      )
      if (data.status >= 300 || data.status < 200) {
        throw new Error(data.message)
      }
      return JSON.parse(data.files[filename].content)

    } else {
      // TODO: Fetch Data
      const { data } = await axios.get(URL, {
        headers
      })
      if (!data.files[filename]) {
        throw new Error(`The file ${filename} is not existed in the gist data`)
      }
      return JSON.parse(data.files[filename].content)
    }
  } catch (e) {
    return {
      error: e?.toString()
    }
  }
}
