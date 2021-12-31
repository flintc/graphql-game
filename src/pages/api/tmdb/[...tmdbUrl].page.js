import { client } from "../../../lib/queryClient";
import _ from "lodash";

export default async function tmdbApi(req, res) {
  try {
    const resp = await client.get(req.query.tmdbUrl.join("/"), {
      params: _.omit(req.query, ["tmdbUrl"]),
    });
    return res.status(resp.status).json(resp.data);
  } catch (e) {
    console.log("error", e);
    return res.status(e.status).json(e.data);
  }
}
