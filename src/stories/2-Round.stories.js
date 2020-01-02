import React, { useState, useRef } from "react";
import RoundSummary from "../components/RoundSummary";
import RoundCard from "../components/RoundCard";
import Round from "../components/Round";
import { StateProvider } from "../app-state";
import { collectResults } from "../utils";

export default { title: "Round" };

const user = {
  name: "Carol",
  id: "carol-id"
};

const responses = [
  { owner: { name: "Carol", id: "carol-id" }, value: 66 },
  { owner: { name: "Bob", id: "bob-id" }, value: 50 },
  { owner: { name: "Jack", id: "jack-id" }, value: 70 }
];

export const summary = () => {
  return (
    <RoundSummary
      name={"Dummy Movie 23"}
      response={10}
      answer={68}
      responses={[
        { user: "foo", value: 50 },
        { user: "bar", value: 70 }
      ]}
    />
  );
};

const imgSrc =
  "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg";

const imgSrc2 =
  "https://upload.wikimedia.org/wikipedia/en/8/86/Movie_poster_the_terminal.jpg";
export const exp = () => {
  const description =
    'The Matrix is a 1999 science fiction action film[3][4] written and directed by the Wachowskis.[a] It stars Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano and is the first installment in the Matrix franchise. It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, created by intelligent machines to distract humans while using their bodies as an energy source.[5] When computer programmer Thomas Anderson, under the hacker alias "Neo", uncovers the truth, he "is drawn into a rebellion against the machines"[5] along with other people who have been freed from the Matrix.';

  const name = "The Matrix";
  return (
    <div className="container mx-auto max-w-xs w-full">
      <div className="shadow rounded-lg border shadow-2xl bg-white mx-20">
        <img className="top-0 object-cover rounded-lg w-full" src={imgSrc} />
      </div>
      <div className="relative shadow rounded-lg border shadow-2xl bg-gray-200 -mt-10 mx-4 ">
        <div className="rounded-lg p-4">
          <h1 className="text-gray-700">{name}</h1>
          <p className="text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
};
const name = "The Matrix";
const category = "Films about rebellions";
const year = 1999;
const description =
  'The Matrix is a 1999 science fiction action film[3][4] written and directed by the Wachowskis.[a] It stars Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano and is the first installment in the Matrix franchise. It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, created by intelligent machines to distract humans while using their bodies as an energy source.[5] When computer programmer Thomas Anderson, under the hacker alias "Neo", uncovers the truth, he "is drawn into a rebellion against the machines"[5] along with other people who have been freed from the Matrix.';
const reception =
  'The Matrix was praised by many critics, as well as filmmakers, and authors of science fiction,[9] especially for its "spectacular action" scenes and its "groundbreaking special effects". Some have described The Matrix as one of the greatest science fiction films of all time,[10][11] Entertainment Weekly called The Matrix "the most influential action movie of the generation".[23] There have also been those, including philosopher William Irwin, who have suggested that the film explores significant philosophical and spiritual themes. Review aggregator Rotten Tomatoes reported an 88% of positive reviews, with a weighted average score of 7.6/10 based upon a sample of 147 reviews. The site\'s critical consensus reads, "Thanks to the Wachowskis\' imaginative vision, The Matrix is a smartly crafted combination of spectacular action and groundbreaking special effects".[8] At Metacritic, which assigns a rating out of 100 to reviews from mainstream critics, the film received a score of 73 based on 35 reviews, indicating "generally favorable reviews."[9] Audiences polled by CinemaScore gave the film an average grade of "A-" on an A+ to F scale.[71] It ranked 323rd among critics, and 546th among directors, in the 2012 Sight & Sound polls of the greatest films ever made.[72]';
const users = [
  "aaaaaa",
  "bbbbbb",
  "ccccc",
  "aaaaaa",
  "bbbbbb",
  "ccccc",
  "aaaaaa",
  "bbbbbb",
  "ccccc"
];

const usersAtBottom = () => (
  <div className="flex py-2 flex-row flex-no-wrap justify-between overflow-x-scroll absolute rounded-b-lg w-full bottom-0 bg-indigo-100">
    {users.slice(0, 10).map(user => {
      return (
        <span className="text-gray-600  mr-4 px-2 rounded-full bg-gray-400">
          {user}
        </span>
      );
    })}
  </div>
);

const RoundContainer = () => {
  const [state, setState] = useState("answering");
  const [value, setValue] = useState();
  const onSubmit = value => {
    setState("answered");
    setValue(value);
    setTimeout(() => {
      setState("ending");
      setTimeout(() => {
        setState("ended");
      }, [18000]);
    }, [5000]);
  };
  return (
    <RoundCard imgSrc={imgSrc}>
      {state === "answering" && (
        <>
          <RoundCard.Header>
            <RoundCard.Title name={name} year={year} />
            <RoundCard.Input onSubmit={onSubmit} />
          </RoundCard.Header>
          <RoundCard.Content>{description}</RoundCard.Content>
        </>
      )}
      {state === "answered" && (
        <>
          <RoundCard.Header>
            <RoundCard.Title name={name} year={year} />
            <RoundCard.Result yourScore={value} criticsScore="?" />
          </RoundCard.Header>
          <RoundCard.Content>
            {description}
            {description}
          </RoundCard.Content>
        </>
      )}
      {state === "ending" && (
        <>
          <RoundCard.Header>
            <RoundCard.Title name={name} year={year} />
            <RoundCard.AnimatedResult yourScore={value} criticsScore={88} />
          </RoundCard.Header>
          <RoundCard.Content>
            <div className="flex flex-col">
              <div className="flex-1"></div>
            </div>
          </RoundCard.Content>
        </>
      )}
      {state === "ended" && (
        <>
          <RoundCard.Header>
            <RoundCard.Title name={name} year={year} />
            <RoundCard.Result yourScore={value} criticsScore={88} />
          </RoundCard.Header>
          <RoundCard.Content>{reception}</RoundCard.Content>
        </>
      )}
    </RoundCard>
  );
};

export const cardV2Dark = () => {
  return (
    <div>
      <RoundContainer />
    </div>
  );
};

export const cardV2Light = () => {
  return (
    <RoundCard
      imgSrc={
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Movie_poster_the_terminal.jpg/220px-Movie_poster_the_terminal.jpg"
      }
      year={2004}
      name={"The Terminal"}
      description={
        "The Terminal is a 2004 American comedy-drama film co-produced and directed by Steven Spielberg and starring Tom Hanks, Catherine Zeta-Jones, and Stanley Tucci. The film is about an Eastern European man who becomes stuck in New York's John F. Kennedy Airport terminal when he is denied entry into the United States and at the same time is unable to return to his native country because of a military coup."
      }
    />
  );
};
