import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./lib/routes";
import AdminPanel from "./pages/AdminPanel";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route
        path={ROUTES.CHAT}
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
