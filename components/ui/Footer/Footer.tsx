import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-primary flex items-center justify-center mr-3">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-foreground font-bold text-lg">A-Mart</span>
            </div>

            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your one-stop destination for the latest technology, fashion, and lifestyle products.
              Quality guaranteed with fast shipping and excellent customer service.
            </p>

            <div className="space-y-3">
              <div className="flex items-start text-gray-600 text-sm gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>20 Shop Street, DOKI, DC 12345</span>
              </div>

              <div className="flex items-center text-gray-600 text-sm gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>(+20)010131888460</span>
              </div>

              <div className="flex items-center text-gray-600 text-sm gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-all">ahmedsmir200@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-bold text-sm mb-4">SHOP</h3>
            <ul className="space-y-2">
              {[
                { href: "/products", label: "Products" },
                { href: "/categories", label: "Categories" },
                { href: "/brands", label: "Brands" },
                { href: "/profile", label: "Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 text-sm hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-bold text-sm mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/help", label: "Help Center" },
                { href: "/track-order", label: "Track Your Order" },
                { href: "/returns", label: "Returns & Exchanges" },
                { href: "/size-guide", label: "Size Guide" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 text-sm hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-bold text-sm mb-4">ABOUT</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/careers", label: "Careers" },
                { href: "/press", label: "Press & Media" },
                { href: "/investor-relations", label: "Investor Relations" },
                { href: "/sustainability", label: "Sustainability" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 text-sm hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-bold text-sm mb-4">POLICIES</h3>
            <ul className="space-y-2">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
                { href: "/cookie-policy", label: "Cookie Policy" },
                { href: "/shipping-policy", label: "Shipping Policy" },
                { href: "/refund-policy", label: "Refund Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 text-sm hover:text-black transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

       
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} A-Mart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;