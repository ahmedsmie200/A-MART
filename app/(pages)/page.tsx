"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function Home() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const fetchBrands = async () => {
      try {
        const response = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
        const data = await response.json();
        
        if (data.data) {
          setBrands(data.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over 500 EGP" },
    { icon: Shield, title: "Secure Payment", desc: "100% protected" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: Sparkles, title: "Premium Quality", desc: "Curated selection" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/30 to-indigo-200/20 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/40 to-rose-100/20 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 left-1/3 w-[200px] h-[200px] bg-gradient-to-r from-blue-100/30 to-cyan-100/20 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 lg:py-24">
            {/* Left Content */}
            <div
              className={`space-y-8 lg:space-y-10 relative z-10 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-primary/5 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold tracking-wider uppercase text-gray-700">New Season Collection 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase leading-[1.05] tracking-tight">
                Find Brands<br />
                That Matches<br />
                <span className="relative">
                  Your Style
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 2 100 2 150 6C200 10 250 4 298 2" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-gray-500 text-base lg:text-lg max-w-xl leading-relaxed">
                Browse through our diverse range of meticulously crafted garments,
                designed to bring out your individuality and cater to your sense of style.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 lg:px-14 py-6 lg:py-7 rounded-full text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl shadow-lg group">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    variant="outline"
                    className="px-10 lg:px-14 py-6 lg:py-7 rounded-full text-base lg:text-lg font-semibold border-2 border-gray-200 hover:border-gray-900 hover:bg-transparent transition-all duration-300"
                  >
                    Explore
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-4 lg:pt-8">
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
                    <CountUp end={200} duration={2.5} />+
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">International Brands</p>
                </div>
                
                <div className="space-y-1 border-l border-gray-200 pl-4 lg:pl-8">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
                    <CountUp end={2000} duration={2.5} separator="," />+
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Quality Products</p>
                </div>
                
                <div className="space-y-1 border-l border-gray-200 pl-4 lg:pl-8">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
                    <CountUp end={30000} duration={2.5} separator="," />+
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Happy Customers</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div
              className={`relative h-[450px] lg:h-[650px] xl:h-[700px] transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/Model.png"
                  alt="Fashion model showcasing latest style"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                  priority
                />
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Trending Now</p>
                    <p className="text-sm font-bold">Summer Collection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Marquee */}
      <section className="bg-slate-950 py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <Marquee
              gradient={true}
              gradientColor="#0a0a0a"
              gradientWidth={80}
              speed={35}
              pauseOnHover={true}
            >
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="text-primary-foreground/60 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-widest mx-8 sm:mx-12 lg:mx-16 hover:text-primary-foreground transition-all duration-300 cursor-pointer hover:scale-110"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '0.08em' }}
                >
                  {brand.name.toUpperCase()}
                </div>
              ))}
            </Marquee>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center p-6 lg:p-8 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 group-hover:bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                  <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-sm lg:text-base mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-xs lg:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
