'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { deleteAccount } from '@/services/api'
import { useAccount } from '@/hooks/useAccount'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function AccountSettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { account, isAuthenticated } = useAccount()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [formChanged, setFormChanged] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const [formData, setFormData] = useState({
    name: account?.name || '',
    email: account?.email || '',
    customUrl: account?.website || '',
    githubUrl: account?.github ? `https://github.com/${account.github}` : '',
    location: account?.location || '',
    bio: account?.bio || '',
  })

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        email: account.email || '',
        customUrl: account.website || '',
        githubUrl: account.github ? `https://github.com/${account.github}` : '',
        location: account.location || '',
        bio: account.bio || '',
      })
    }
  }, [account])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      setFormChanged(JSON.stringify(newData) !== JSON.stringify(formData))
      return newData
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordChanged(true)
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        await deleteAccount(account?.id || '')
        toast({
          title: 'Account Deleted',
          description: 'Your account has been successfully deleted.',
          variant: 'destructive',
        })
        // Here you would typically log the user out and redirect to the home page
      } catch (error) {
        console.error('Error deleting account:', error)
        toast({
          title: 'Error',
          description: 'There was an error deleting your account. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleSaveChanges = () => {
    // Implement the logic to save changes
    console.log('Saving changes:', formData)
    toast({
      title: 'Changes Saved',
      description: 'Your account settings have been updated successfully.',
    })
    setFormChanged(false)
  }

  const handleSavePassword = () => {
    // Implement password change logic here
    console.log('Saving password changes')
    toast({
      title: 'Password Updated',
      description: 'Your password has been successfully updated.',
    })
    setPasswordChanged(false)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Account Settings</h1>

        <div className="space-y-6">
          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-gray-400">Update your account's profile information and public details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={account?.avatar} />
                  <AvatarFallback>{account?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="text-[#4cc38a] border-[#4cc38a] hover:bg-[#2d3c54]">
                  Change Avatar
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customUrl" className="text-white">Custom URL</Label>
                  <Input
                    id="customUrl"
                    name="customUrl"
                    value={formData.customUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl" className="text-white">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveChanges}
                className="bg-[#4cc38a] hover:bg-[#3da671] text-white mt-4"
                disabled={!formChanged}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Password</CardTitle>
              <CardDescription className="text-gray-400">Ensure your account is using a long, random password to stay secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="current_password" className="text-white">Current Password</Label>
                <Input
                  id="current_password"
                  type="password"
                  className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <Label htmlFor="new_password" className="text-white">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <Label htmlFor="confirm_password" className="text-white">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  className="bg-gray-800 border-gray-600 text-white focus:border-[#4cc38a] focus:ring-[#4cc38a]"
                  onChange={handlePasswordChange}
                />
              </div>
              <Button
                onClick={handleSavePassword}
                className="bg-[#4cc38a] hover:bg-[#3da671] text-white mt-4"
                disabled={!passwordChanged}
              >
                Save Password Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Notifications</CardTitle>
              <CardDescription className="text-gray-400">Manage your email notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="email_notifications" className="text-white">Email Notifications</Label>
                <Switch
                  id="email_notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Privacy</CardTitle>
              <CardDescription className="text-gray-400">Manage your privacy settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile_visibility" className="text-white">Public Profile</Label>
                <Switch
                  id="profile_visibility"
                  checked={profileVisibility}
                  onCheckedChange={setProfileVisibility}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-red-500">Danger Zone</CardTitle>
              <CardDescription className="text-gray-400">Permanently delete your account and all of its contents from the Shalo platform. This action is not reversible, so please continue with caution.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

