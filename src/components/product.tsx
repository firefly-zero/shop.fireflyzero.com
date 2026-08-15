import { FunctionComponent, VNode } from "preact";
import { Icon } from "./icon";

export const Product: FunctionComponent<{ children: any }> = (props) => {
  const item = props.children;
  const variants: any[] = item.attributes.variants;
  let firstPrice = variants[0].attributes.price;
  let allPricesTheSame = variants.every(
    (variant) => variant.attributes.price === firstPrice,
  );

  let footer;
  let price = undefined;
  if (variants.length == 1) {
    price = <>€{firstPrice / 100}</>;
    footer = (
      <div class="col">
        <a href="#" class="btn btn-primary" style="display: block; float: right">
          <Icon>cart-plus</Icon> add to card
        </a>
      </div>
    );
  } else if (allPricesTheSame) {
    price = <>€{firstPrice / 100}</>;
    footer = variants.map((variant: any) => (
      <div class="row justify-content-between align-items-center mb-1">
        <div class="col fs-3">
          <b>{variant.attributes.name}</b>
        </div>
        <div class="col">
          <a href="#" class="btn btn-primary" style="display: block; float: right">
            <Icon>cart-plus</Icon> add to card
          </a>
        </div>
      </div>
    ));
  } else {
    footer = variants.map((variant: any) => (
      <div class="row justify-content-between align-items-center mb-1">
        <div class="col fs-3">
          <b>{variant.attributes.name}</b> €{variant.attributes.price / 100}
        </div>
        <div class="col">
          <a href="#" class="btn btn-primary" style="display: block; float: right">
            <Icon>cart-plus</Icon> add to card
          </a>
        </div>
      </div>
    ));
  }
  const name: string = item.attributes.name;
  if (name.toLowerCase().indexOf("donation") >= 0) {
    return;
  }
  return (
    <div class="col">
      <article class="card">
        {item.attributes.image && (
          <img
            src={item.attributes.image}
            class="card-img-top"
            style="object-fit: cover; aspect-ratio: 3/2"
          />
        )}
        <div class="card-body">
          <h4 class="card-title">
            {name}
            {price && (
              <span style="float: right" class="text-muted">
                {price}
              </span>
            )}
          </h4>
          <p class="card-text">{item.attributes.description}</p>
        </div>
        <div class="card-footer">{footer}</div>
      </article>
    </div>
  );
};
