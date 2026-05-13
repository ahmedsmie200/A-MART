"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface BrandsResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: Brand[];
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/brands", {
          cache: "no-store",
        });

        if (res.ok) {
          const data: BrandsResponse = await res.json();
          setBrands(data.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-background">
       {/* Page Header */}
       <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Brands</h1>
              <p className="text-gray-400 mt-2 text-sm lg:text-base">
                {loading ? "Loading..." : `Discover ${brands.length} top brands`}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Tag className="w-4 h-4" />
              <span>All Brands</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-20">
             <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No brands available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6 stagger-children">
            {brands.map((brand) => (
              <Link href={`/brands/${brand._id}`} key={brand._id}>
                <Card className="overflow-hidden border border-gray-100 bg-white rounded-2xl hover:shadow-xl hover:border-primary/10 transition-all duration-500 cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-square flex items-center justify-center p-6">
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      />
                    </div>
                    <div className="px-4 py-3 text-center border-t border-gray-50 bg-gray-50/50 group-hover:bg-primary transition-colors duration-500">
                      <h3 className="font-semibold text-xs lg:text-sm text-gray-600 group-hover:text-primary-foreground transition-colors duration-500 truncate uppercase tracking-wider">{brand.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
