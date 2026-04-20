import { useEffect } from "react";
import { Switch, Route, useLocation, Router, Link } from "wouter";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/Layout";
import Signin from "./views/Signin";
import Landing from "./views/app/Landing";
import NotFoundPage from "./components/NotFoundPage";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Line from "./components/Line";

const AUTH_TOKEN_KEY = "token";
const SIGN_IN_PATH = "/account/sign-in";
const PROTECTED_ROUTES = ["/", "/app", "/app/page1", "/app/page2", "/app/page3"];

function useAuth() {
  const [location, setLocation] = useLocation();
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const isAuthRoute = location === SIGN_IN_PATH;
  const isProtectedRoute = PROTECTED_ROUTES.includes(location);

  useEffect(() => {
    if (!token && isProtectedRoute) {
      setLocation(SIGN_IN_PATH, { replace: true });
      return;
    }

    if (token && isAuthRoute) {
      setLocation("/", { replace: true });
    }
  }, [isAuthRoute, isProtectedRoute, setLocation, token]);

  return !((!token && isProtectedRoute) || (token && isAuthRoute));
}

function AuthVerify({ children }: any) {
  const validate = useAuth();

  if (!validate) return null;
  return children;
}

function RouterMain() {
  return (
    <Router>
      <AuthVerify>
        <Switch>
          <Route path="/account/sign-in">
            <AuthLayout>
              <Signin />
            </AuthLayout>
          </Route>
          <Route path="/">
            <AppLayout>
              <Landing />
            </AppLayout>
          </Route>
          <Route path="/app/page1">
            <AppLayout>
              <Page1 />
            </AppLayout>
          </Route>
          <Route path="/app/page2">
            <AppLayout>
              <Page2 />
            </AppLayout>
          </Route>
          <Route path="/app/page3">
            <AppLayout>
              <Page3 />
            </AppLayout>
          </Route>
          <Link to="https://radarkhonkaen.com/line/" target="_blank">
            <AppLayout>
              <Line />
            </AppLayout>
          </Link>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </AuthVerify>
    </Router>
  );
}

export default RouterMain;
