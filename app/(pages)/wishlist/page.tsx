"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  brand?: { name: string };
  category?: { name: string };
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setIsLoading(true);

      const localWishlist: string[] = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      if (localWishlist.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      const results = await Promise.allSettled(
        localWishlist.map((id) =>
          fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
            cache: "no-store",
          }).then((res) => (res.ok ? res.json() : null))
        )
      );

      const fetched: Product[] = results
        .filter(
          (r): r is PromiseFulfilledResult<{ data: Product }> =>
            r.status === "fulfilled" && r.value?.data
        )
        .map((r) => r.value.data);

      setProducts(fetched);
      setIsLoading(false);
    };

    fetchWishlistProducts();
  }, []);

  const removeFromWishlist = (productId: string) => {
    const localWishlist: string[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    const updated = localWishlist.filter((id) => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.success("Removed from wishlist");

    if (session?.accessToken) {
      fetch(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: { token: session.accessToken as string },
        }
      ).catch(() => {});
    }
  };

  const addToCart = async (productId: string) => {
    if (!session?.accessToken) {
      toast.error("Please login first");
      return;
    }

    setAddingToCart(productId);
    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: session.accessToken as string,
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (res.ok) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAddingToCart(null);
    }
  };

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(rating)
            ? "text-amber-400 fill-amber-400"
            : "text-gray-200 fill-gray-200"
        }`}
      />
    ));

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center py-20 bg-background">
         <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-background">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-red-300 fill-red-300" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">
          Save items you love by clicking the heart icon. Start building your dream collection.
        </p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all">
            Discover Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Saved Items</h1>
              <p className="text-gray-400 mt-2 text-sm lg:text-base">
                {products.length} {products.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>
             <button
              onClick={() => {
                localStorage.setItem("wishlist", "[]");
                setProducts([]);
                window.dispatchEvent(new Event("wishlistUpdated"));
                toast.success("Wishlist cleared");
              }}
              className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Link href={`/products/${product._id}`}>
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </Link>

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors z-10"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                  {product.brand?.name || product.category?.name || "Brand"}
                </p>

                <Link href={`/products/${product._id}`}>
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-gray-500 transition-colors min-h-10">
                    {product.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mt-2 mb-4">
                  {renderStars(product.ratingsAverage)}
                  <span className="text-xs text-gray-400 ml-1 font-medium">
                    {product.ratingsAverage?.toFixed(1)}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="font-bold text-lg">
{product.price.toLocaleString('en-EG')} EGP                  </span>
                </div>

                <Button
                  onClick={() => addToCart(product._id)}
                  disabled={addingToCart === product._id}
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 text-sm transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {addingToCart === product._id ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
