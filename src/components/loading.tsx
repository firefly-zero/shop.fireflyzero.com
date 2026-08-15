import { FunctionComponent } from "preact";

export const Loading: FunctionComponent<{}> = (props) => (
  <div class="row justify-content-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
);
