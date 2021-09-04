import axios from "axios";
import _ from "lodash";
import cheerio from "cheerio";

const RT_REGEX = /(http\:|https\:)\/\/(w{3}.)?rottentomatoes.com/g;

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
          if (y["*"].match(RT_REGEX)) {
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

async function getRtScores(title, imdbId) {
  const resp = await axios.get("https://en.wikipedia.org/w/api.php", {
    params: {
      action: "opensearch",
      search: title,
      format: "json",
    },
  });
  for (let x of resp.data[1]) {
    let rtExtlinks = await getLinkInfo(x, imdbId);
    if (rtExtlinks?.length) {
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
      const audienceScore = parseInt(
        page.data
          .match(/(?:audienceScore\":)(\"?[0-9]{1,3}\"?)/g)?.[0]
          ?.match(/(?=\"?)[0-9]{1,3}(?=\"?)/g)?.[0]
      );
      const tomatometerScore = parseInt(
        page.data
          .match(/(?:tomatometerScore\":)(\"?[0-9]{1,3}\"?)/g)?.[0]
          ?.match(/(?=\"?)[0-9]{1,3}(?=\"?)/g)?.[0]
      );
      const audienceAll = parseInt(
        page.data
          .match(/(?:audienceAll\":).*?(?:\"score\":)(\"?[0-9]{1,3}\"?)/g)?.[0]
          ?.match(/(?=\"?)[0-9]{1,3}(?=\"?)/g)?.[0]
      );
      const foo = page.data.match(
        /(?:tomatometerAllCritics\":).*?(?:\"score\":)(\"?[0-9]{1,3}\"?)/g
      )?.[0];
      const tomatometerAllCritics = parseInt(
        _.last(
          page.data
            .match(
              /(?:tomatometerAllCritics\":).*?(?:\"score\":)(\"?[0-9]{1,3}\"?)/g
            )?.[0]
            ?.match(/(?=\"?)[0-9]{1,3}(?=\"?)/g)
        )
      );

      return {
        audienceScore,
        tomatometerScore,
        audienceAll,
        tomatometerAllCritics,
      };
    }
  }
}

export default async function handler(req, res) {
  const { title, imdbId } = req.query;

  const scores = await getRtScores(title, imdbId);
  if (!scores) {
    return res.status(404).send("No scores found");
  }
  return res.status(200).json(scores);
}
