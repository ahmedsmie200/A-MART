'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Lock, Mail, Phone, Loader2, ShieldCheck, CreditCard, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateUserProfile, changePassword } from '@/lib/actions/profile-actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserData {
  name: string
  email: string
  phone?: string
}

export default function ProfileClient({ userData }: { userData: UserData | null }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    password: '',
    rePassword: '',
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileData.name || !profileData.email) {
      toast.error('Please fill all required fields')
      return
    }

    setIsLoading(true)

    try {
      const result = await updateUserProfile(profileData)

      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordData.currentPassword || !passwordData.password || !passwordData.rePassword) {
      toast.error('Please fill all fields')
      return
    }

    if (passwordData.password !== passwordData.rePassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const result = await changePassword(passwordData)

      if (result.success) {
        toast.success(result.message)
        setPasswordData({
          currentPassword: '',
          password: '',
          rePassword: '',
        })
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
       <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-gray-400 mt-2 text-sm lg:text-base">
                Manage your profile and security settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl uppercase">
                  {userData?.name?.charAt(0) || 'U'}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-gray-900 truncate">{userData?.name || 'User'}</h3>
                  <p className="text-xs text-gray-500 truncate">{userData?.email || ''}</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <User className="h-4 w-4" />
                Profile Information
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'password'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Security & Password
              </button>

              <div className="h-px bg-gray-100 my-2" />

              <Link
                href="/allorders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors"
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              
              {activeTab === 'profile' && (
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold">Personal Information</h2>
                    <p className="text-sm text-gray-500">Update your details to keep your profile up to date.</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-xl">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          required
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          required
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="01234567890"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-11 font-medium transition-all active:scale-[0.98]"
                      >
                        {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold">Change Password</h2>
                    <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
                    <div>
                      <label htmlFor="currentPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="••••••••"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Min. 6 characters"
                          value={passwordData.password}
                          onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                          required
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={passwordData.rePassword}
                          onChange={(e) => setPasswordData({ ...passwordData, rePassword: e.target.value })}
                          required
                          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-11 font-medium transition-all active:scale-[0.98]"
                      >
                        {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
