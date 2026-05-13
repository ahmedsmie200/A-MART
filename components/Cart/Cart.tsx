"use client";

import { formatCurrency } from "@/Helpers/formatCurrency";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartRes } from "@/interfaces/CartInterfacrs";
import toast from "react-hot-toast";
import { Loader2, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import CheckOutSession from "../CheckOutSession/CheckOutSession";

interface CartProps {
  cartData: CartRes | null;
  token: string;
  userId?: string | null;
}

export default function Cart({ cartData, token, userId }: CartProps) {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  if (!cartData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-background">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">
          Looks like you haven't added anything to your cart yet. Discover our latest collections!
        </p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const cart = cartData.data;
  const itemCount = cartData.numOfCartItems;

  const updateQuantity = async (productId: string, newCount: number) => {
    if (newCount < 1) return;

    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          body: JSON.stringify({ count: newCount }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        router.refresh();
      } else {
        toast.error(data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Something went wrong!');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          method: 'DELETE',
          headers: {
            token,
          },
        }
      );

      if (response.ok) {
        toast.success('Item removed');
        router.refresh();
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Something went wrong!');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    setIsClearing(true);
    try {
      const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
        method: 'DELETE',
        headers: {
          token,
        }
      });

      if (response.ok) {
        toast.success('Cart cleared!');
        router.refresh();
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error('Failed to clear cart');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Shopping Cart</h1>
              <p className="text-gray-400 mt-2 text-sm lg:text-base">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.products?.map((item) => {
              const product = typeof item.product === 'string' ? null : item.product;
              const isUpdating = updatingItems.has(product?._id as string);

              if (!product) {
                return (
                  <div key={item._id} className="flex gap-4 rounded-2xl border border-gray-100 p-4 shadow-sm bg-white animate-pulse">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl" />
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item._id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm bg-white relative transition-all hover:shadow-md">
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}

                  <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0 bg-gray-50 rounded-xl overflow-hidden relative">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                          {product.brand?.name}
                        </p>
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-snug">
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {product.category?.name}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-base sm:text-lg">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(product._id, item.count - 1)}
                          disabled={isUpdating || item.count <= 1}
                          aria-label="decrease"
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.count}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, item.count + 1)}
                          disabled={isUpdating}
                          aria-label="increase"
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(product._id)}
                        disabled={isUpdating}
                        className="text-xs text-gray-400 hover:text-red-500 font-medium flex items-center gap-1.5 transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-between items-center pt-4">
               <Link href="/products" className="text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all">
                  <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
               </Link>
               <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
                >
                  {isClearing ? "Clearing..." : "Clear Cart"}
                </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-100 p-6 shadow-xl shadow-gray-200/20 bg-white">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(cart.totalCartPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Shipping Estimate</span>
                  <span className="text-green-600 font-medium tracking-wide">FREE</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-semibold">{formatCurrency(0)}</span>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-gray-200" />

              <div className="flex items-center justify-between mb-8">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl lg:text-2xl font-black">
                  {formatCurrency(cart.totalCartPrice)}
                </span>
              </div>

              <div className="space-y-3">
                 <CheckOutSession cartId={cartData.cartId || ''} />
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
