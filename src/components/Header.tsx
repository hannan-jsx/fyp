import { ROUTES } from "@/lib/routes";
import tokenManager from "@/lib/tokenManager";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Header() {
  const token = tokenManager.getToken();
  return (
    <header className="flex justify-between">
      <div className="logo">AskUoK </div>
      <Link
        to={token ? ROUTES.HOME : ROUTES.LOGIN}
        onClick={() => token && tokenManager.logout()}
      >
        <Button variant="primary">{token ? "Logout" : "Login"}</Button>
      </Link>
    </header>
  );
}
