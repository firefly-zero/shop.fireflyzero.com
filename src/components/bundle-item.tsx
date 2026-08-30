import { FunctionComponent } from "preact";
import { Product, Variant } from "../types";
import { Price } from "./price";

interface Props {
  qty: number;
  product: Product;
  bundleVariants: Variant[];
  setBundleVariants: (v: Variant[]) => void;
}

/** A card showing info about a particular product in the bundle */
export const BundleItem: FunctionComponent<Props> = ({
  product,
  qty,
  bundleVariants,
  setBundleVariants,
}) => {
  const price = product.attributes.variants[0].attributes.price;
  var variants = null;
  if (product.attributes.variants.length > 1) {
    variants = (
      <div class="btn-group">
        {product.attributes.variants.map((v) => (
          <button
            class={
              "btn " +
              (bundleVariants.find((bv) => v.id == bv.id)
                ? "active btn-primary"
                : "btn-secondary")
            }
            onClick={() => setBundleVariants([v])}
          >
            {v.attributes.name}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div class="card mb-1 bundle-item">
      <div class="row g-0">
        {product.attributes.image && (
          <div class="col-md-4">
            <img src={product.attributes.image} class="img-fluid h-100 w-100" />
          </div>
        )}
        <div class="col">
          <div class="card-body">
            <h5 class="card-title">
              {product?.attributes.name}
              {qty > 1 && (
                <span class="text-muted" style="float: right">
                  x{qty} items
                </span>
              )}
            </h5>
            <p class="card-text mb-1">{product.attributes.description}</p>
            <p class="card-text">
              <b>Regular price:</b> <Price>{price}</Price>
            </p>
            {variants}
            {variants && bundleVariants.length === 0 && (
              <span class="text-danger"> (select one)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
