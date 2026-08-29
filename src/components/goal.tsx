import { ComponentChildren, FunctionComponent } from "preact";
import { api, ApiError } from "../api";
import { formatError } from "../errors";
import { Icon } from "./icon";
import { Loading } from "./loading";

export const Goal: FunctionComponent<{}> = ({}) => {
  const goal = api.get("/goal");
  if (goal.error) {
    return;
  }
  if (!goal.data) {
    return <Loading />;
  }
  const { reached, total } = goal.data.attributes;
  if (reached < 1000_00) {
    return;
  }
  const format = (x: number) => Math.floor(x / 100).toLocaleString("us");
  return (
    <div class="alert">
      <p class="lead">
        <b>€{format(reached)} pledged </b>
        <span class="fs-6">out of €{format(total)} goal.</span>
      </p>
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped"
          role="progressbar"
          style={"width: " + Math.floor((reached / total) * 100) + "%;"}
          aria-valuenow={reached}
          aria-valuemin={0}
          aria-valuemax={total}
        ></div>
      </div>
    </div>
  );
};
