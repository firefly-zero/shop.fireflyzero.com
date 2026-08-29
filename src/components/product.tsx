import { FunctionComponent, VNode } from "preact";
import { Icon } from "./icon";
import { CartItem, Product, Variant } from "../types";
import { Cart, useCart } from "../cart";
import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { BundleItem } from "./bundle-item";
import { Price } from "./price";

type ProductCardProps = {
  children: Product;
  products: Product[];
};

export const ProductCard: FunctionComponent<ProductCardProps> = (props) => {
  const cart = useCart();
  const [bundleVariants, setBundleVariants] = useState<Variant[]>([]);

  const product = props.children;
  const name: string = product.attributes.name;
  const price = formatPrice(product, props.products);
  const footer = formatFooter(cart, product, bundleVariants);
  const bundle = product.attributes.products.map(({ slug, qty }) => {
    const subProduct = props.products.find((p) => p.attributes.slug === slug);
    if (subProduct) {
      return (
        <BundleItem
          qty={qty}
          product={subProduct}
          bundleVariants={bundleVariants}
          setBundleVariants={setBundleVariants}
        />
      );
    }
  });
  return (
    <div class="col col-12 col-lg-6">
      <article class="card h-100">
        {product.attributes.image && (
          <img src={product.attributes.image} class="card-img-top" />
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
          <p class="card-text mb-1">{product.attributes.description}</p>
          {bundle.length !== 0 && <div class="card-text">{bundle}</div>}
        </div>
        <div class="card-footer">{footer}</div>
      </article>
    </div>
  );
};

function formatPrice(product: Product, products: Product[]) {
  const variants = product.attributes.variants;
  let firstPrice = variants[0].attributes.price;
  let allPricesTheSame = variants.every(
    (variant) => variant.attributes.price === firstPrice,
  );

  // Donations and products with different price for each variant
  // don't show the price.
  if (!allPricesTheSame || product.attributes.slug === "donation") {
    return <></>;
  }

  // Bundles show the crossed out total price of components.
  if (product.attributes.products.length > 0) {
    const prices = product.attributes.products.map(({ slug, qty }) => {
      const p = products.find((p) => p.attributes.slug === slug);
      if (!p) {
        return 0;
      }
      return p.attributes.variants[0].attributes.price * qty;
    });
    const totalPrice = prices.reduce((a, b) => a + b, 0);
    return (
      <>
        <Price>{firstPrice}</Price>{" "}
        <del class="fs-6">
          <Price>{totalPrice}</Price>
        </del>
      </>
    );
  }

  return <Price>{firstPrice}</Price>;
}

function formatFooter(cart: Cart, product: Product, bundleVariants: Variant[] | null) {
  const [qty, setQty] = useState(5);

  const variants = product.attributes.variants;
  let firstPrice = variants[0].attributes.price;
  let allPricesTheSame = variants.every(
    (variant) => variant.attributes.price === firstPrice,
  );

  if (product.attributes.slug === "donation") {
    const variant = product.attributes.variants[0];
    return (
      <div class="row justify-content-between">
        <div class="col">
          <div class="input-group mb-3">
            <span class="input-group-text" id="price-input">
              <b>€</b>
            </span>
            <input
              type="number"
              class="form-control"
              id="price-input"
              value={qty}
              min={1}
              onInput={(e) => setQty(+e.currentTarget.value)}
            />
          </div>
        </div>
        <div class="col">
          <div class="col">
            {formatButton(cart, { product, variant, qty, bundleVariants })}
          </div>
        </div>
      </div>
    );
  }

  if (variants.length == 1) {
    const variant = product.attributes.variants[0];
    const bundleSize = product.attributes.products
      .map(({ qty }) => qty)
      .reduce((a, b) => a + b, 0);
    return (
      <div class="row align-items-center">
        {bundleSize > 1 && (
          <div class="col">
            <b>Items included:</b> {bundleSize}
          </div>
        )}
        <div class="col">
          {formatButton(cart, { product, variant, qty: 1, bundleVariants })}
        </div>
      </div>
    );
  }

  return variants.map((variant: Variant) => (
    <div class="row justify-content-between align-items-center mb-1">
      <div class="col fs-3">
        <b>{variant.attributes.name}</b>{" "}
        {!allPricesTheSame && <Price>{variant.attributes.price}</Price>}
      </div>
      <div class="col">
        {formatButton(cart, { product, variant, qty: 1, bundleVariants })}
      </div>
    </div>
  ));
}

function formatButton(cart: Cart, item: CartItem) {
  const { route } = useLocation();

  const itemInCart = cart.get(item);
  const count = itemInCart?.qty || 0;

  if (count > 0) {
    return (
      <div class="btn-group" role="group" style="display: block; float: right">
        {count <= 1 ? (
          <button class="btn btn-secondary" onClick={() => cart.remove(item)}>
            <Icon>trash</Icon>
          </button>
        ) : (
          <button
            class="btn btn-secondary"
            onClick={() => {
              cart.remove(item);
              item.qty = count - 1;
              cart.add(item);
            }}
          >
            <Icon>minus</Icon>
          </button>
        )}
        <button class="btn btn-secondary" onClick={() => route("/cart")}>
          {count} in cart
        </button>
        <button class="btn btn-secondary" onClick={() => cart.add(item)}>
          <Icon>plus</Icon>
        </button>
      </div>
    );
  }

  return (
    <button
      class="btn btn-primary"
      style="display: block; float: right"
      onClick={() => cart.add(item)}
    >
      <Icon>cart-plus</Icon> add to cart
    </button>
  );
}
