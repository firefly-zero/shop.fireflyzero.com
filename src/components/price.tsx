import { FunctionComponent } from "preact";

interface Props {
  children: number;
}

export const Price: FunctionComponent<Props> = (props) => {
  const eur = props.children / 100;
  const usd = (eur * 1.160971).toFixed(2);
  return <abbr title={"~$" + usd}>€{eur}</abbr>;
};
