import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/interfaces/productinterfacr';
import React from 'react';
import { Star } from 'lucide-react';
import Slider from '../../../../components/Slider/Slider';
import AddToCart from '@/components/AddToCart/AddToCart';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

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
        className={`w-4 h-4 sm:w-5 sm:h-5 ${index < Math.floor(rating)
          ? 'text-yellow-400 fill-yellow-400'
          : 'text-gray-300 fill-gray-300'
          }`}
      />
    ));

  return (
    <div className="container mx-auto px-3 py-4 sm:px-6 sm:py-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Product Details</h2>

      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">

            <div className="flex items-center justify-center bg-muted/20 rounded-lg p-4 sm:p-8">
              <Slider
                images={product.images || []}
                title={product.title || 'Product'}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
              <p className="text-sm text-muted-foreground">
                {product.brand?.name || 'No Brand'}
              </p>

              <h1 className="text-xl sm:text-2xl font-bold text-card-foreground leading-relaxed">
                {product.title}
              </h1>

              <p className="text-sm text-muted-foreground">
                {product.category?.name || 'No Category'}
              </p>

              <p className="text-muted-foreground leading-relaxed pt-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <div className="flex">{renderStars(product.ratingsAverage || 0)}</div>
                <span className="text-sm font-medium text-muted-foreground">
                  {product.ratingsAverage || 0}
                </span>
                <span className="text-base font-bold text-card-foreground ml-auto">
                  {product.price} EGP
                </span>
              </div>

              <div className="pt-4">
                <AddToCart productId={product._id} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}