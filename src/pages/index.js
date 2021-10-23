import Link from "next/link";
import { useUser } from "../user-context";

const CreateOrJoin = () => {
  return (
    <div className="dark-theme">
      <Link href={{ pathname: "/create" }}>Create</Link>
      <Link href={{ pathname: "/join" }}>Join</Link>

      {/* <button className="button">Join</button> */}
      <button className="bg-blue-1">another button</button>
    </div>
  );
};

const IndexPage = () => {
  const user = useUser();
  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <CreateOrJoin />
      {/* {user?.room ? <Play room={user.room} /> : <CreateOrJoin />} */}
    </div>
  );
};

export default IndexPage;
