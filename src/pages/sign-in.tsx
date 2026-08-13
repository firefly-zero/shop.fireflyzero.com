import { TargetedSubmitEvent } from "preact";

export function SignIn() {
  const onSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      return;
    }
    e.currentTarget.reset();
  };

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
              required
              minLength={8}
              maxLength={128}
            />
          </div>

          <button type="submit" class="btn btn-primary">
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
