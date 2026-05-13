"use client"
import { Loader2, ShoppingBag, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { CartRes } from "@/interfaces/CartInterfacrs";
import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import WishlistButton from "../WishlistButton/WishlistButton";

interface AddToCartProps {
  productId: string;
}

export default function AddToCart({ productId }: AddToCartProps) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAddToCart() {
    if (!session?.accessToken) {
      toast.error('Please login first!');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': session.accessToken
        },
        body: JSON.stringify({ productId }),
      });

      const data: CartRes = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Product added to cart!');
        router.refresh();
      } else {
        if (res.status === 401) {
          toast.error('Session expired. Please login again!');
          router.push('/login');
        } else {
          toast.error(data.message || 'Failed to add product to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <Button
        disabled={isLoading}
        onClick={handleAddToCart}
        className="flex-1 h-11 sm:h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {isLoading
          ? <Loader2 className="animate-spin w-4 h-4" />
          : <ShoppingBag className="w-4 h-4" />
        }
        <span>Add To Cart</span>
      </Button>
      <div className="shrink-0 h-11 w-11 sm:h-12 sm:w-12">
         <WishlistButton productId={productId} />
      </div>
    </div>
  );
}
