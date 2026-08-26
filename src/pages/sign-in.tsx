import { useState } from "preact/hooks";
import { supabase } from "../supabase";
import { useLocation } from "preact-iso";
import { Alert } from "../components/alert";
import { Icon } from "../components/icon";
import { useAuth } from "../components/auth";
import { Loading } from "../components/loading";
import { useMutation } from "@tanstack/preact-query";
import { Header } from "../components/header";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { route } = useLocation();
  const auth = useAuth();

  const signIn = useMutation({
    mutationKey: ["supabase", "signInWithPassword"],
    mutationFn: async () => {
      const resp = await supabase.auth.signInWithPassword({ email, password });
      if (resp.error) {
        throw resp.error;
      }
      return resp.data;
    },
  });

  const signUp = useMutation({
    mutationKey: ["supabase", "signInWithPassword"],
    mutationFn: async () => {
      const resp = await supabase.auth.signUp({ email, password });
      if (resp.error) {
        throw resp.error;
      }
      return resp.data;
    },
  });

  if (auth.loading) {
    return <Loading />;
  }
  if (auth.email) {
    route("/cart");
  }
  const buttonsActive =
    !signIn.isPending &&
    !signUp.isPending &&
    email.length >= 6 &&
    email.search("@") >= 1 &&
    password.length >= 8;

  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    signIn.mutate();
  };

  if (signUp.data) {
    return (
      <div class="alert alert-success" role="alert">
        The confirmation email is sent to {email}. Check your inbox!
      </div>
    );
  }

  return (
    <div class="row justify-content-center">
      <Header>Sign in</Header>
      <div class="col-md-6">
        <Alert>{signIn.error}</Alert>
        <Alert>{signUp.error}</Alert>
        <form class="row g-1" onSubmit={submit}>
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
              disabled={!buttonsActive}
              onClick={() => signUp.mutate()}
            >
              <Icon>person-circle-plus</Icon> sign up
            </button>
          </div>
          <div class="col-sm-6">
            <button type="submit" class="btn btn-primary w-100" disabled={!buttonsActive}>
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
