export function SignIn() {
  return (
    <div class="row justify-content-center">
      <div class="col-md-6" style="border: solid 2px black">
        <h2>Let's create your account</h2>
        <form class="row g-1">
          <label for="email-input" class="col-sm-2 col-form-label">
            email
          </label>
          <div class="col-sm-10">
            <input type="email" id="email-input" class="form-control" />
          </div>

          <label for="password-input" class="col-sm-2 col-form-label">
            password
          </label>
          <div class="col-sm-10 mb-1">
            <input type="password" id="password-input" class="form-control" />
          </div>

          <button type="submit" class="btn btn-primary mb-3">
            sign in / sign up
          </button>
        </form>
      </div>
    </div>
  );
}
