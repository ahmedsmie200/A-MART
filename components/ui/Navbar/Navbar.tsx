"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserIcon, ShoppingCartIcon, Heart, Menu, X } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { useEffect, useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const updateWishlistCount = () => {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setWishlistCount(localWishlist.length)
    }

    updateWishlistCount()
    window.addEventListener("wishlistUpdated", updateWishlistCount)
    return () => window.removeEventListener("wishlistUpdated", updateWishlistCount)
  }, [])

  useEffect(() => {
    if (!session?.accessToken) return

    const fetchCartCount = async () => {
      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
          headers: { token: session.accessToken },
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          setCartCount(data.numOfCartItems || 0)
        }
      } catch (error) {
        console.log("Cart API unavailable")
      }
    }

    fetchCartCount()
  }, [session?.accessToken])

  // Close menu when route changes
  const handleLinkClick = () => setMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <h2 className="text-xl font-bold">
          <Link href="/" onClick={handleLinkClick}>A-Mart</Link>
        </h2>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/products">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/brands">Brands</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/categories">Categories</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Icons + Hamburger */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex items-center p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Heart className="h-6 w-6 text-foreground" />
            {wishlistCount > 0 && (
              <span
                suppressHydrationWarning
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ShoppingCartIcon className="h-6 w-6 text-foreground" />
            {cartCount > 0 && (
              <span
                suppressHydrationWarning
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              suppressHydrationWarning
              className="hover:bg-muted p-2 rounded-lg transition-colors"
            >
              <UserIcon className="h-6 w-6 text-foreground cursor-pointer" />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                {session?.user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/allorders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Signup</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hamburger - Mobile Only */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/products"
            onClick={handleLinkClick}
            className="py-2 px-3 rounded-lg hover:bg-muted transition-colors font-medium"
          >
            Products
          </Link>
          <Link
            href="/brands"
            onClick={handleLinkClick}
            className="py-2 px-3 rounded-lg hover:bg-muted transition-colors font-medium"
          >
            Brands
          </Link>
          <Link
            href="/categories"
            onClick={handleLinkClick}
            className="py-2 px-3 rounded-lg hover:bg-muted transition-colors font-medium"
          >
            Categories
          </Link>
        </div>
      )}
    </nav>
  )
}