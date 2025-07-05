import { Logo } from "./Logo";
import { NumResults } from "./NumResults";
import { Search } from "./Search";

export function NavBar({ children }) {
    return <nav className="nav-bar">{children}</nav>;
}
