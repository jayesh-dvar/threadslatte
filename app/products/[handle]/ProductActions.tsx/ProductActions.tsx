"use client";

import { useState } from "react";
import Link from "next/link";

type ProductActionsProps = { handle: string; name: string; variantId?: string };

export default function ProductActions({ handle, name, variantId }: ProductActionsProps) {
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  async function addToBag() {
    setStatus("adding");
    const cartId = window.localStorage.getItem("tl-cart-id") ?? "";
    try {
      if (variantId) {
        const response = await fetch("/api/shopify/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: cartId ? "add" : "create", cartId, lines: [{ merchandiseId: variantId, quantity: 1 }] }),
        });
        const data = await response.json() as { cart?: { id: string; checkoutUrl: string; totalQuantity: number } };
        if (data.cart) {
          window.localStorage.setItem("tl-cart-id", data.cart.id);
          window.localStorage.setItem("tl-cart-url", data.cart.checkoutUrl);
          window.localStorage.setItem("tl-bag-count", String(data.cart.totalQuantity));
        }
      }
    } catch {
      // The local preview remains usable until Shopify credentials are connected.
    }
    window.localStorage.setItem("tl-last-added", JSON.stringify({ handle, name }));
    setStatus("added");
  }

  return (
    <div className="product-actions">
      <button className="button button--dark" type="button" onClick={() => void addToBag()} disabled={status === "adding"}>
        {status === "adding" ? "Adding…" : status === "added" ? "Added to bag ✓" : "Add to bag"} <span>+</span>
      </button>
      {status === "added" ? <Link className="text-link" href="/#bestsellers">Continue shopping <span>→</span></Link> : null}
    </div>
  );
}
