import RegisterForm from "@/components/RegisterForm/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col-reverse md:flex-row border border-gray-100">
        
        {/* Left Side - Image/Graphic */}
        <div className="hidden md:flex w-1/2 relative bg-slate-950 items-center justify-center p-12 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-primary/40 z-10 opacity-90 transition-opacity duration-700 group-hover:opacity-80" />
          <Image 
            src="/Model.png" 
            alt="Fashion Model" 
            fill 
            className="object-cover z-0 grayscale mix-blend-overlay scale-105 transition-transform duration-1000 group-hover:scale-110" 
            sizes="50vw"
          />
          
          <div className="relative z-20 text-white flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
              <span className="text-white font-black text-4xl leading-none">A</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Join A-Mart</h2>
            <p className="text-white/80 text-base max-w-sm mx-auto leading-relaxed font-medium">
              Create an account to unlock exclusive member perks, faster checkout, and more.
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-10 w-40 h-40 bg-primary/30 rounded-full blur-[60px] z-10" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 mb-2">Create an account</h2>
              <p className="text-sm text-slate-500 font-medium">Enter your details below to get started.</p>
            </div>
            
            <RegisterForm />
          </div>
        </div>

      </div>
    </div>
  )
}
