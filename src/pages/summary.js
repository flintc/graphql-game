import { useUserSubscription } from "../user-subscription";
import LeaveRoomButton from "../components/LeaveRoomButton";
import LogoutBtn from "../components/Auth/Logout";
import Router from "next/router";

export default function Summary() {
  const user = useUserSubscription();

  return (
    <div>
      {!user && (
        <button
          id="qsLoginBtn"
          variant="primary"
          className="btn-margin loginBtn"
          onClick={() => {
            Router.push("/api/login");
          }}
        >
          Log In
        </button>
      )}
      {user && <h1>Summary</h1>}
      {user && <LogoutBtn />}
      {user?.room && <LeaveRoomButton />}
      <div>
        {user?.room?.questions?.map((question) => {
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
