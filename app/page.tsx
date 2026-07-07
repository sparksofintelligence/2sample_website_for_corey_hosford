import Storefront from "@/components/Storefront";
import { brandConfig } from "@/data/brand";
import { catalogConfig, products } from "@/data/products.coilovers"; // SWAP THIS IMPORT TO CHANGE THE STORE

export default function Home() {
  return <Storefront brand={{ ...brandConfig, ...catalogConfig }} products={products} />;
}
