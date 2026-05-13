"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserIcon, ShoppingCartIcon, Heart, Menu, X, LogOut, Package, User, LogIn, UserPlus } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session } = useSession()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
  ]

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/")

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-100/50"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">
          
          {/* Logo */}
          <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <span className="text-primary-foreground font-bold text-lg leading-none">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">A-Mart</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isActive(link.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-gray-600 hover:text-primary hover:bg-gray-100"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Icons + Hamburger */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                isActive("/wishlist") ? "bg-red-50" : "hover:bg-gray-100"
              }`}
            >
              <Heart className={`h-[18px] w-[18px] transition-colors ${
                isActive("/wishlist") ? "text-red-500" : "text-gray-600"
              }`} />
              {wishlistCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-0.5 -right-0.5 bg-red-500 text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ring-2 ring-white"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                isActive("/cart") ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              <ShoppingCartIcon className="h-[18px] w-[18px] text-gray-600" />
              {cartCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ring-2 ring-white"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                suppressHydrationWarning
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <UserIcon className="h-3.5 w-3.5 text-gray-600" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl shadow-lg border border-gray-100">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-sm font-semibold">My Account</p>
                  {session?.user && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{session.user.email || ''}</p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {session?.user ? (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/allorders" className="flex items-center gap-2.5 px-3 py-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <div className="flex items-center gap-2.5 px-3 py-2">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/login" className="flex items-center gap-2.5 px-3 py-2">
                          <LogIn className="h-4 w-4 text-gray-500" />
                          <span>Login</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/register" className="flex items-center gap-2.5 px-3 py-2">
                          <UserPlus className="h-4 w-4 text-gray-500" />
                          <span>Create Account</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburger - Mobile Only */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
