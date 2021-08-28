import axios from "axios";

async function getLinkInfo(title, imdbId) {
  const resp = await axios.get("https://en.wikipedia.org/w/api.php", {
    params: {
      action: "query",
      titles: title,
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
        if (y["*"].includes("https://www.rottentomatoes")) {
          rtExtlinks.push(y["*"]);
        }
      }
      return rtExtlinks;
    }
  }
  return null;
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
    if (rtExtlinks) {
      const page = await axios.get(rtExtlinks[0]);
      const audienceScore = parseInt(
        page.data
          .match(/(?:audienceScore\":)([0-9]{1,3})/g)[0]
          .match(/[0-9]{1,3}/g)[0]
      );
      const tomatometerScore = parseInt(
        page.data
          .match(/(?:tomatometerScore\":)([0-9]{1,3})/g)[0]
          .match(/[0-9]{1,3}/g)[0]
      );
      return { audienceScore, tomatometerScore };
    }
  }
}

export default async function handler(req, res) {
  const { title, imdbId } = req.query;
  const scores = await getRtScores(title, imdbId);
  res.status(200).json(scores);
}
