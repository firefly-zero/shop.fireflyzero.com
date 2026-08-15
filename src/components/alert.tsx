import { ComponentChildren, FunctionComponent } from "preact";
import { ApiError } from "../api";
import { formatError } from "../errors";
import { Icon } from "./icon";

interface AlertProps {
  children: Error | ApiError | string;
}

export const Alert: FunctionComponent<AlertProps> = (props) => (
  <div class="alert alert-danger alert-dismissible fade show" role="alert" id="alert">
    <Icon>triangle-exclamation</Icon> {formatError(props.children)}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      onClick={() => document.getElementById("alert")?.remove()}
    ></button>
  </div>
);
