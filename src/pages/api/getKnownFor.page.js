import axios from "axios";
import _ from "lodash";
import { client } from "../../lib/queryClient";
import cheerio from "cheerio";

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

export default async function handler(req, res) {
  const { imdbId } = req.query;

  if (!imdbId.startsWith("nm")) {
    return res.status(400).send("invalid imdbId");
  }
  const page = await axios.get(`https://www.imdb.com/name/${imdbId}`);
  const $ = cheerio.load(page.data);
  const links = $(".knownfor-title a");
  const tmdbResponses = [];
  $(links).each(function (i, link) {
    const title = $(link).text().trim().replace("\n", "");
    const imdbId = $(link).attr("href").split("/")[2];
    if (title.length) {
      const resp = client.get(`/find/${imdbId}`, {
        params: {
          external_source: "imdb_id",
        },
      });
      tmdbResponses.push(resp);
    }
  });
  const resolvedTmdbResponses = await Promise.all(tmdbResponses);
  const knownFor = resolvedTmdbResponses.map((resp) => {
    if (resp.data.movie_results.length) {
      return {
        media_type: "movie",
        imdb_id: imdbId,
        ...resp.data.movie_results[0],
      };
    } else if (resp.data.tv_results.length) {
      return {
        media_type: "tv",
        imdb_id: imdbId,
        ...resp.data.tv_results[0],
      };
    }
  });

  return res.status(200).json(_.filter(knownFor, (x) => !_.isNil(x)));
}
