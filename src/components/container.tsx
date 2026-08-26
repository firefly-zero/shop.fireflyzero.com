import { ComponentChildren, FunctionComponent } from "preact";
import { Header } from "./header";

interface Props {
  title: string;
  children: ComponentChildren;
}

export const Container: FunctionComponent<Props> = (props) => {
  return (
    <div class="row justify-content-center">
      <Header>{props.title}</Header>
      <div class="col-12 col-md-6">{props.children}</div>
    </div>
  );
};
