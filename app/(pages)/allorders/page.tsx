import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/Helpers/formatCurrency'
import { Package, Calendar, MapPin, CreditCard, ChevronRight } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

interface OrderProduct {
  count: number
  _id: string
  product: {
    _id: string
    title: string
    imageCover: string
    category: { _id: string; name: string }
    brand: { _id: string; name: string }
  }
  price: number
}

interface Order {
  shippingAddress: {
    details: string
    phone: string
    city: string
  }
  taxPrice: number
  shippingPrice: number
  totalOrderPrice: number
  paymentMethodType: string
  isPaid: boolean
  isDelivered: boolean
  _id: string
  user: string
  cartItems: OrderProduct[]
  createdAt: string
  id: number
}

async function getOrders(userId: string, token: string) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
      {
        headers: { token },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

async function getUserIdFromCart(token: string) {
  try {
    const response = await fetch(
      'https://ecommerce.routemisr.com/api/v1/cart',
      {
        headers: { token },
        cache: 'no-store',
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    return data.data?.cartOwner || null
  } catch (error) {
    console.error('Error fetching cart:', error)
    return null
  }
}

export default async function AllOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    redirect('/login')
  }

  const cookieStore = await cookies()
  let userId = cookieStore.get('userId')?.value || cookieStore.get('cartOwnerId')?.value

  if (!userId) {
    userId = await getUserIdFromCart(session.accessToken)
  }

  if (!userId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-background">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">No Orders Yet</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">
          You haven't placed any orders yet. Start exploring our products!
        </p>
        <Link href="/products" className="rounded-full px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all hover:scale-[1.02]">
          Start Shopping
        </Link>
      </div>
    )
  }

  const orders: Order[] = await getOrders(userId, session.accessToken)

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-background">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">No Orders Yet</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">
          You haven't placed any orders yet. Start exploring our products!
        </p>
        <Link href="/products" className="rounded-full px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all hover:scale-[1.02]">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Order History</h1>
              <p className="text-gray-400 mt-2 text-sm lg:text-base">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="space-y-6 max-w-5xl mx-auto">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              
              {/* Order Header */}
              <div className="bg-gray-50/80 px-6 sm:px-8 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Order Number</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date Placed</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(order.totalOrderPrice)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Items List */}
                  <div className="lg:col-span-2 space-y-4">
                    {order.cartItems.map((item) => (
                      <div key={item._id} className="flex gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
                          <img
                            src={item.product.imageCover}
                            alt={item.product.title}
                            className="absolute inset-0 w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="flex-1 py-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            {item.product.brand?.name || 'Brand'}
                          </p>
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 leading-snug">
                            {item.product.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Qty: {item.count}</span>
                            <span className="font-bold text-sm text-gray-900">{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="lg:col-span-1 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900">Shipping Address</h4>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 pl-6">
                        <p>{order.shippingAddress.details}</p>
                        <p>{order.shippingAddress.city}</p>
                        <p className="text-gray-500 pt-1">{order.shippingAddress.phone}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900">Payment</h4>
                      </div>
                      <div className="text-sm text-gray-600 space-y-2 pl-6">
                        <p className="capitalize font-medium">{order.paymentMethodType}</p>
                        
                        <div className="pt-2 space-y-1">
                          {order.taxPrice > 0 && (
                            <div className="flex justify-between text-gray-500">
                              <span>Tax</span>
                              <span>{formatCurrency(order.taxPrice)}</span>
                            </div>
                          )}
                          {order.shippingPrice > 0 && (
                            <div className="flex justify-between text-gray-500">
                              <span>Shipping</span>
                              <span>{formatCurrency(order.shippingPrice)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
