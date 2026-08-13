import { TargetedSubmitEvent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { supabase } from "../supabase";
import { useLocation } from "preact-iso";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { route } = useLocation();

  useEffect(() => {
    const task = async () => {
      const user = await supabase.auth.getUser();
      if (user.data) {
        route("/cart");
      }
    };
    task();
  });

  const onSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
    // ...
    e.currentTarget.reset();
  };
  const valid = email.length >= 6 && email.search("@") >= 1 && password.length >= 8;

  return (
    <div class="row justify-content-center">
      <div class="col-md-6" style="border: solid 2px black">
        <h2>Let's create your account</h2>
        <form class="row g-1" onSubmit={onSubmit}>
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

          <button type="submit" class="btn btn-primary" disabled={!valid}>
            sign in / sign up
          </button>
          <p class="text-center">
            <a href="#">reset password</a>
          </p>
        </form>
      </div>
    </div>
  );
}
