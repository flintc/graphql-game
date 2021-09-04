import Link from "next/link";
import { withRouter } from "next/router";
import { Navbar } from "react-bootstrap";
import LogoutBtn from "./Auth/Logout";

const Header = ({ router: { pathname } }) => (
  <Navbar className="justify-content-between navBar">
    <div>
      <Link href="/">Play</Link>
      <Link href="/movies" scroll={true}>
        Movies
      </Link>
      <Link href="/summary" scroll={true}>
        Summary
      </Link>
    </div>

    <Navbar.Collapse className="justify-content-end navContainer navButton">
      <LogoutBtn />
    </Navbar.Collapse>
  </Navbar>
);

export default withRouter(Header);
