import { FunctionComponent } from "preact";
import { Icon } from "./icon";
import { Order } from "../types";

interface Props {
  children: Order;
}

export const OrderCard: FunctionComponent<Props> = (props) => {
  const order = props.children;
  const attrs = order.attributes;

  return (
    <ul class="list-group col">
      <li class="list-group-item bg-primary">
        <b>
          <Icon>fingerprint</Icon> Order ID:
        </b>{" "}
        {order.id}
      </li>
      <li class="list-group-item">
        <b>
          <Icon>money-bills</Icon> Amount paid:
        </b>{" "}
        {attrs.amount / 100} {attrs.currency.toUpperCase()}
      </li>
      <li class="list-group-item">
        <b>
          <Icon>calendar-days</Icon> Placed on:
        </b>{" "}
        {attrs.created_at.split("T")[0]}
      </li>
      <li class="list-group-item">
        <b>
          <Icon>layer-group</Icon> Items:
        </b>
        <ul>
          {attrs.items.map((item) => (
            <li>
              {item.name} <span class="text-muted">x{item.qty}</span>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};
