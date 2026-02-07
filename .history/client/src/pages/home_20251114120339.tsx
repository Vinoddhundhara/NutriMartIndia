import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Leaf, Shield, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@assets/Premium_fox_nuts_hero_f155649d.png";

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

export default function Home({ onAddToCart }: HomeProps) {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const bestSellers = products?.slice(0, 4);

  return (
    <div className="flex flex-col">
      <section
        className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
        }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center z-10">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
            Premium Fox Nuts & Dry Fruits
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Authentic, nutritious, and freshly sourced from the finest farms in India. 
            Elevate your snacking with NutriDelight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button
                size="lg"
                className="text-base px-8 backdrop-blur-sm bg-primary/90 hover:bg-primary"
                data-testid="button-shop-now"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 backdrop-blur-sm bg-white/10 border-white text-white hover:bg-white/20"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">100% Natural</h3>
              <p className="text-muted-foreground">
                No artificial additives or preservatives. Pure and wholesome nutrition.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">
                Rigorously tested and certified for the highest quality standards.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and reliable delivery across India. Fresh products at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Best Sellers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our most popular products loved by health-conscious customers across India.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellers?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" variant="outline" data-testid="button-view-all">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Get 20% Off Your First Order
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to our newsletter and receive exclusive deals and health tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground"
              data-testid="input-email-subscribe"
            />
            <Button
              size="lg"
              variant="secondary"
              className="px-8"
              data-testid="button-subscribe"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
