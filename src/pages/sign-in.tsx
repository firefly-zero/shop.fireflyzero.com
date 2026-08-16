import { useEffect, useState } from "preact/hooks";
import { supabase } from "../supabase";
import { useLocation } from "preact-iso";
import { Alert } from "../components/alert";
import { Icon } from "../components/icon";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<any>(null);
  const { route } = useLocation();

  useEffect(() => {
    const task = async () => {
      const user = await supabase.auth.getSession();
      if (user.data?.session) {
        route("/cart");
      }
    };
    task();
  });

  const signIn = () => {
    const task = async () => {
      const resp = await supabase.auth.signInWithPassword({ email, password });
      if (resp.error) {
        setAlert(resp.error);
        return;
      }
      if (resp.data) {
        route("/cart");
      }
    };
    task();
  };

  const signUp = () => {
    const task = async () => {
      const resp = await supabase.auth.signUp({ email, password });
      if (resp.error) {
        setAlert(resp.error);
        return;
      }
      if (resp.data) {
        route("/cart");
      }
    };
    task();
  };

  const valid = email.length >= 6 && email.search("@") >= 1 && password.length >= 8;

  return (
    <div class="row justify-content-center">
      <div class="col-md-6" style="border: solid 2px black">
        <h2>Let's create your account</h2>
        {alert && <Alert>{alert}</Alert>}
        <form class="row g-1">
          <label for="email-input" class="col-sm-2 col-form-label">
            email
          </label>
          <div class="col-sm-10">
            <input
              type="email"
              id="email-input"
              class="form-control"
              onInput={(e) => setEmail(e.currentTarget.value)}
              required
              minLength={6}
              maxLength={128}
              pattern=".+@.+\..+"
            />
          </div>

          <label for="password-input" class="col-sm-2 col-form-label">
            password
          </label>
          <div class="col-sm-10 mb-1">
            <input
              type="password"
              id="password-input"
              class="form-control"
              onInput={(e) => setPassword(e.currentTarget.value)}
              required
              minLength={8}
              maxLength={128}
            />
          </div>

          <div class="col-sm-6">
            <button
              type="button"
              class="btn btn-primary w-100"
              disabled={!valid}
              onClick={signUp}
            >
              <Icon>person-circle-plus</Icon> sign up
            </button>
          </div>
          <div class="col-sm-6">
            <button
              type="button"
              class="btn btn-primary w-100"
              disabled={!valid}
              onClick={signIn}
            >
              <Icon>right-to-bracket</Icon> sign in
            </button>
          </div>
          <p class="text-center">
            <a href="#">reset password</a>
          </p>
        </form>
      </div>
    </div>
  );
}
