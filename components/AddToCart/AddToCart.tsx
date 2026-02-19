"use client"
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
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
        toast.success(data.message || 'Product added to cart successfully!');
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
    <CardFooter className="gap-1.5 sm:gap-2 p-0">
      <Button
        disabled={isLoading}
        onClick={handleAddToCart}
        className="flex-1 text-xs sm:text-sm px-2 sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading
          ? <Loader2 className="animate-spin mr-1.5 sm:mr-2 w-4 h-4" />
          : <ShoppingCart className="mr-1.5 sm:mr-2 w-4 h-4" />
        }
        <span className="hidden sm:inline">Add To Cart</span>
        <span className="sm:hidden">Add</span>
      </Button>
      <WishlistButton productId={productId} />
    </CardFooter>
  );
}