"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProductsResponse } from "@/interfaces/productinterfacr";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Star, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductSkeleton from "@/components/Skeletons/ProductSkeleton";
import AddToCart from "@/components/AddToCart/AddToCart";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<ProductsResponse["data"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/products",
          { cache: "no-store" }
        );

        if (!res.ok) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const data: ProductsResponse = await res.json();
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating: number = 0) =>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Products</h1>
              <p className="text-gray-400 mt-2 text-sm lg:text-base">
                {loading ? "Loading..." : `${products.length} items available`}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <SlidersHorizontal className="w-4 h-4" />
              <span>All Products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 lg:py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No products available</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for new arrivals</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 stagger-children">
            {products.map((product) => (
              <Card
                key={product._id}
                className="group overflow-hidden border-0 shadow-none hover:shadow-xl transition-all duration-500 flex flex-col bg-white rounded-2xl"
              >
                <Link href={`/products/${product._id}`}>
                  <div
                    className="relative w-full bg-gray-50 cursor-pointer overflow-hidden"
                    style={{ paddingBottom: "100%" }}
                  >
                    <Image
                      src={product.imageCover}
                      alt={product.title || "Product"}
                      fill
                      className="object-contain p-4 sm:p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 300px"
                    />
                  </div>
                </Link>

                <CardContent className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
                  <CardDescription className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {product.brand?.name || "No Brand"}
                  </CardDescription>

                  <Link href={`/products/${product._id}`}>
                    <CardTitle className="text-xs sm:text-sm font-semibold line-clamp-2 hover:text-gray-500 transition-colors cursor-pointer min-h-8 sm:min-h-10 leading-snug">
                      {product.title}
                    </CardTitle>
                  </Link>

                  <CardDescription className="text-[10px] sm:text-xs text-gray-400">
                    {product.category?.name || "No Category"}
                  </CardDescription>

                  <div className="flex items-center gap-1 pt-1">
                    <div className="flex">{renderStars(product.ratingsAverage)}</div>
                    <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5">
                      ({product.ratingsQuantity || 0})
                    </span>
                  </div>

                  <div className="text-base sm:text-lg font-bold text-card-foreground mt-auto pt-1 sm:pt-2">
                    <span className="text-[10px] sm:text-xs text-gray-400 font-normal">EGP </span>
                    {product.price.toFixed(2)}
                  </div>
                </CardContent>

                <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                  {session?.accessToken ? (
                    <AddToCart productId={product._id} />
                  ) : (
                    <Link href="/login">
                      <button className="w-full bg-primary text-primary-foreground py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98]">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="hidden xs:inline">Add To Cart</span>
                        <span className="xs:hidden">Add</span>
                      </button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
