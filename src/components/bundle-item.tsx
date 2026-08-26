import { FunctionComponent } from "preact";
import { Icon } from "./icon";
import { Product } from "../types";

interface Props {
  qty: number;
  children: Product;
}

/** A card showing info about a particular product in the bundle */
export const BundleItem: FunctionComponent<Props> = (props) => {
  const subProduct = props.children;
  const qty = props.qty;
  const price = subProduct.attributes.variants[0].attributes.price;
  var variants = null;
  if (subProduct.attributes.variants.length > 1) {
    variants = (
      <div class="btn-group">
        {subProduct.attributes.variants.map((v) => (
          <button class="btn btn-secondary">{v.attributes.name}</button>
        ))}
      </div>
    );
  }
  return (
    <div class="card mb-1 bundle-item">
      <div class="row g-0">
        {subProduct.attributes.image && (
          <div class="col-md-4">
            <img src={subProduct.attributes.image} class="img-fluid h-100 w-100" />
          </div>
        )}
        <div class="col">
          <div class="card-body">
            <h5 class="card-title">
              {subProduct?.attributes.name}
              {qty > 1 && (
                <span class="text-muted" style="float: right">
                  x{qty} items
                </span>
              )}
            </h5>
            <p class="card-text mb-1">{subProduct.attributes.description}</p>
            <p class="card-text">
              <b>Regular price:</b> €{price / 100}
            </p>
            {variants}
          </div>
        </div>
      </div>
    </div>
  );
};
