import { useEffect, useState } from "react";
import { Switch, Route, useLocation, Router, useRouter, Link } from "wouter";
import { useQuery } from "react-query";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/Layout";
import Signin from "./views/Signin";
import Landing from "./views/app/Landing";
import NotFoundPage from "./components/NotFoundPage";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Line from "./components/Line";

function useAuth() {
  const [location, setLocation] = useLocation();
  const [validate, setValidate] = useState(false);
  const TOKEN = window.localStorage.getItem("token");

  const me = async () => {
    const opt = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    const me = await fetch(import.meta.env.VITE_API_URL + "me", opt).then(
      (res) => res.json()
    );
    return me;
  };

  const { data, isLoading } = useQuery(["me", TOKEN], me, {
    onSuccess(data) {
      if (data.status != "success") {
        setLocation("/account/sign-in")
        localStorage.removeItem("token")
        localStorage.removeItem("auth-name")
      } else {
        setValidate(true);
      }
    }
  });

  useEffect(() => {
    if (!TOKEN) {
      if (
        location !== "/account/sign-in" &&
        location == "/" ||
        location == "/app" ||
        location == "/app/page1" ||
        location == "/app/page2" ||
        location == "/app/page3" ||
        location == "https://radarkhonkaen.com/line/" 
      ) {
        return setLocation("/account/sign-in");
      }

      setValidate(true);
    } else {
      if (location === "/account/sign-in") setLocation("/");
    }
  });

  return validate;
}

function AuthVerify({ children }: any) {
  const validate = useAuth();

  if (!validate) return null;
  return children;
}

function RouterMain() {
  return (
    <>
      {/* <AuthVerify> */}
      <Router>
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
          </Route></Switch>
      </Router>
      {/* </AuthVerify> */}
    </>
  );
}

export default RouterMain;
