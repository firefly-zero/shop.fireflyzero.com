import { FunctionComponent, VNode } from "preact";

export const Icon: FunctionComponent<{ children: string }> = (props) => (
  <i class={"fa-solid fa-fw fa-" + props.children}></i>
);
