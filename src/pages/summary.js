import { useUserSubscription } from "../user-subscription";
import LeaveRoomButton from "../components/LeaveRoomButton";

export default function Summary() {
  const user = useUserSubscription();
  return (
    <div>
      <h1>Summary</h1>
      {user.room && <LeaveRoomButton />}
      <div>
        {user.room?.questions?.map((question) => {
          return (
            <div key={question.id}>
              <h2>{question.title}</h2>
              <p>{question.description}</p>
              <div> {JSON.stringify(question.answer)} </div>
              <div>
                {
                  question.responses.find(
                    (response) => response.owner.id === user.id
                  )?.value
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
