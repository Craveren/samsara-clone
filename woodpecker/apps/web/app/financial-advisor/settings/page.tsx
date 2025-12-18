'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { 
  //what we need to import from lucide-react
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Wallet,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Eye,
  Lock,
  LogOut
} from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'
import { useAccountOption } from '@/lib/account/use-account-type'
import { PageIntro } from '@/components/onboarding/PageIntro'

export default function FinancialAdvisorSettingsPage() {
  const { user } = useUser()
  const currentAccountOption = useAccountOption()




  
  return (
    <div className="flex h-screen bg-white">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <PageIntro pageId="financial-advisor-settings" pageName="FINANCIAL ADVISOR SETTINGS">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-1.5">
                Financial Advisor Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your financial advisor profile, security, and preferences.
              </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" /> Profile
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" /> Security
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" /> Notifications
                </TabsTrigger>
                <TabsTrigger value="billing">
                  <CreditCard className="h-4 w-4 mr-2" /> Billing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Financial Advisor Profile</CardTitle>
                    <CardDescription className="text-xs">
                      This information will be displayed to your clients.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt="Profile"
                          className="h-16 w-16 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-semibold">
                          <Wallet className="h-8 w-8" />
                        </div>
                      )}
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" /> Change Photo
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue={user?.firstName || ''}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue={user?.lastName || ''}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user?.emailAddresses[0]?.emailAddress || ''}
                          className="mt-1"
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+27 12 345 6789"
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="firm">Financial Firm</Label>
                        <Input
                          id="firm"
                          placeholder="Your financial firm name"
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          placeholder="E.g., Retirement Planning, Investment Advisory"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Security Settings</CardTitle>
                    <CardDescription className="text-xs">
                      Manage your account security and password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          type="password"
                          className="pr-10"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="newPassword"
                          type="password"
                          className="pr-10"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="pr-10"
                        />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>
                        <Lock className="h-4 w-4 mr-2" /> Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Notification Preferences</CardTitle>
                    <CardDescription className="text-xs">
                      Choose how you want to be notified about important updates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive email updates about your account</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Client Messages</Label>
                        <p className="text-xs text-muted-foreground">Get notified when clients send messages</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Financial Updates</Label>
                        <p className="text-xs text-muted-foreground">Notifications about client financial changes</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>
                        <Save className="h-4 w-4 mr-2" /> Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Billing Information</CardTitle>
                    <CardDescription className="text-xs">
                      Manage your subscription and payment methods.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Current Plan</span>
                        <Badge>Professional</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your subscription is active and will renew automatically.
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline">Manage Subscription</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Account Type Info */}
            <Card className="border border-border mt-6">
              <CardHeader>
                <CardTitle className="text-base">Account Type</CardTitle>
                <CardDescription className="text-xs">
                  Your current account type and associated role.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {currentAccountOption.icon && (
                    <currentAccountOption.icon className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {currentAccountOption.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentAccountOption.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted border border-border rounded-sm">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Account types are separate. To use a different account type,
                    you must sign out and create a new account with a different email address.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sign Out Section */}
            <div className="mt-6 pt-6 border-t border-border">
              <SignOutButton redirectUrl="/onboarding/account-type">
                <Button variant="outline" className="w-full bg-black text-white hover:bg-black/90 border-black">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </PageIntro>
      </main>
    </div>
  )
}

