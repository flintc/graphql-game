import data from "../movies.json";
import * as L from "partial.lenses";
import * as R from "ramda";
// Heat => heat 1995 film
// Rambo => returns last one made, want first one
// Three (movie about dail ernhardt)
// The Pianist
// Tip Toes
test("a test", () => {
  console.log(data.length);
  //console.log(L.collect([L.whereEq({ title: "Rambo" })], data));
  const results = L.collect(
    [
      L.satisfying(
        R.where({
          title: x => x && x.includes("Toy Story")
          //year: R.equals(2006)
          //cast: x => x && R.contains("Brad Pitt", x)
        })
      )
    ],
    data
  );
  //console.log(results);
  console.log("hhhhere", R.sortBy(x => x.title.length, results));
  expect(1).toBe(1);
});
