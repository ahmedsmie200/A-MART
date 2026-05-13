import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "SHOP",
      links: [
        { href: "/products", label: "Products" },
        { href: "/categories", label: "Categories" },
        { href: "/brands", label: "Brands" },
        { href: "/profile", label: "Profile" },
      ],
    },
    {
      title: "CUSTOMER SERVICE",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/help", label: "Help Center" },
        { href: "/track-order", label: "Track Your Order" },
        { href: "/returns", label: "Returns & Exchanges" },
        { href: "/size-guide", label: "Size Guide" },
      ],
    },
    {
      title: "ABOUT",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/careers", label: "Careers" },
        { href: "/press", label: "Press & Media" },
        { href: "/investor-relations", label: "Investor Relations" },
        { href: "/sustainability", label: "Sustainability" },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-of-service", label: "Terms of Service" },
        { href: "/cookie-policy", label: "Cookie Policy" },
        { href: "/shipping-policy", label: "Shipping Policy" },
        { href: "/refund-policy", label: "Refund Policy" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 text-primary-foreground mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">
                Stay in the loop
              </h3>
              <p className="text-gray-400 mt-2 text-sm lg:text-base max-w-md">
                Subscribe for exclusive deals, new arrivals, and style inspiration delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-primary-foreground placeholder:text-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-200"
              />
              <button className="px-6 py-3 bg-white text-primary font-semibold text-sm rounded-xl hover:bg-gray-100 transition-all duration-200 shrink-0 hover:scale-[1.02] active:scale-[0.98]">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg leading-none">A</span>
              </div>
              <span className="text-xl font-bold tracking-tight">A-Mart</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Your one-stop destination for the latest technology, fashion, and lifestyle products.
              Quality guaranteed with fast shipping and excellent customer service.
            </p>

            <div className="space-y-3">
              <div className="flex items-start text-gray-400 text-sm gap-2.5 group cursor-pointer hover:text-primary-foreground transition-colors">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>20 Shop Street, DOKI, DC 12345</span>
              </div>

              <div className="flex items-center text-gray-400 text-sm gap-2.5 group cursor-pointer hover:text-primary-foreground transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                <span>(+20)010131888460</span>
              </div>

              <div className="flex items-center text-gray-400 text-sm gap-2.5 group cursor-pointer hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-all">ahmedsmir200@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-400 tracking-[0.15em] mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-primary-foreground transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              © {currentYear} A-Mart. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-gray-500 text-xs hover:text-primary-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="text-gray-500 text-xs hover:text-primary-foreground transition-colors">
                Terms
              </Link>
              <Link href="/cookie-policy" className="text-gray-500 text-xs hover:text-primary-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
