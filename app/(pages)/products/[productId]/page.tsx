import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/interfaces/productinterfacr';
import React from 'react';
import { Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import Slider from '../../../../components/Slider/Slider';
import AddToCart from '@/components/AddToCart/AddToCart';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetails({ params }: Props) {
  const { productId } = await params;

  const session = await getServerSession(authOptions);

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products/${productId}`,
    { cache: 'no-store' }
  );

  if (!res.ok) notFound();

  const data: { data: Product } = await res.json();
  if (!data?.data) notFound();
  const product = data.data;

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating)
          ? 'text-amber-400 fill-amber-400'
          : 'text-gray-200 fill-gray-200'
          }`}
      />
    ));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to products
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/20 overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Product Image Gallery */}
            <div className="bg-gray-50 p-6 sm:p-10 lg:p-16 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
               <div className="w-full max-w-md mx-auto aspect-square relative">
                <Slider
                  images={product.images || []}
                  title={product.title || 'Product'}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
               </div>
            </div>

            {/* Product Info */}
            <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-md">
                  {product.brand?.name || 'Brand'}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {product.category?.name || 'Category'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-0.5">{renderStars(product.ratingsAverage || 0)}</div>
                <span className="text-sm font-medium text-gray-600">
                  {product.ratingsAverage || 0} Rating
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                <span className="text-sm text-gray-500">
                   {product.ratingsQuantity || 0} Reviews
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
                {product.price} <span className="text-lg text-gray-500 font-medium">EGP</span>
              </div>

              <div className="prose prose-sm text-gray-500 mb-10 leading-relaxed">
                <p>{product.description}</p>
              </div>

              <div className="pt-6 border-t border-gray-100 mb-8">
                <AddToCart productId={product._id} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-xs text-gray-400">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">2 Year Warranty</p>
                    <p className="text-xs text-gray-400">Full coverage</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}