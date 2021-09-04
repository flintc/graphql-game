import axios from "axios";
import _ from "lodash";
import cheerio from "cheerio";
import { client } from "../../lib/queryClient";

async function getLinkInfo(url, imdbId) {
  const foo = url.split("/");
  try {
    const resp = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        titles: foo[foo.length - 1],
        prop: "extlinks",
        ellimit: 5000,
        format: "json",
      },
    });
    const pages = Object.values(resp.data.query.pages);
    if (!Array.isArray(pages[0].extlinks)) {
      return null;
    }
    let rtExtlinks = [];
    for (let x of pages[0].extlinks) {
      if (x["*"].includes(imdbId)) {
        for (let y of pages[0].extlinks) {
          if (
            y["*"].includes("https://www.rottentomatoes") ||
            y["*"].includes("https://rottentomatoes")
          ) {
            rtExtlinks.push(y["*"]);
          }
        }

        return rtExtlinks;
      }
    }
    return null;
  } catch (err) {
    console.warn("here?");
  }
}

async function getHints(title, imdbId) {
  // const foo = await client.get("/")
  // client
  const resp = await axios.get("https://en.wikipedia.org/w/api.php", {
    params: {
      action: "opensearch",
      search: title,
      format: "json",
    },
  });
  for (let x of resp.data[1]) {
    let rtExtlinks = await getLinkInfo(x, imdbId);

    if (rtExtlinks) {
      const page = await axios.get(rtExtlinks[0].replace(/s[0-9]+\/$/g, ""));
      const $ = cheerio.load(page.data);
      let criticsConsensus = "";
      $(
        ".container #what-to-know *[data-qa='critics-consensus']"
      )?.[0].children.forEach((x) => {
        if (x.type === "tag" && x.name === "em") {
          criticsConsensus += "[Movie Name]";
        }
        if (x.type === "text") {
          criticsConsensus += x.data;
        }
      });
      console.log("criticsConsensus", criticsConsensus);

      return {
        criticsConsensus,
      };
    }
  }
}

export default async function handler(req, res) {
  const { title, imdbId } = req.query;
  const hints = await getHints(title, imdbId);
  if (!hints) {
    return res.status(500).send("Unable to get hints");
  }
  return res.status(200).json(hints);
}
