import { ProductsTab } from "@/app/admin/dashboard/components/products-tab";
import type { ComponentProps } from "react";

export function ProductForm(props: ComponentProps<typeof ProductsTab>) {
  return <ProductsTab {...props} />;
}
