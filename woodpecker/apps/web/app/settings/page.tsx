'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@woodpecker/ui'
import { 
  User, 
  Shield, 
  Bell, 
  Palette,
  Settings as SettingsIcon,
  Lock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Eye,
  CreditCard,
  Crown,
  LogOut,
  Check,
} from 'lucide-react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { useSubscription } from '@/lib/subscriptions/hooks'
import { SignOutButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
// ACCOUNT_OPTIONS removed - using useAccountOption hook instead
import { useAccountOption } from '@/lib/account/use-account-type'
import { cn } from '@woodpecker/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useUserAccess } from '@/lib/invitations/access-check'
import { ThemePicker } from '@/components/theme/ThemePicker'
import { useTheme } from '@/lib/themes/theme-provider'

export default function SettingsPage() {
  const { user } = useUser()
  const { subscription, plan, isSubscribed } = useSubscription()
  const [activeTab, setActiveTab] = React.useState('profile')
  const router = useRouter()
  const currentAccountOption = useAccountOption()
  const { isViewOnly, canManageSettings } = useUserAccess()
  const [themePickerOpen, setThemePickerOpen] = React.useState(false)
  const { currentPalette, setPalette, palettes } = useTheme()

  // Account switching is handled by AccountSwitcher component in sidebar

  return (
    <div className="flex h-screen bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-1.5">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Subscription Banner */}
          {!isSubscribed && (
            <Card className="border-2 border-primary mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Upgrade to unlock all features
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Get access to advanced features and priority support
                      </p>
                    </div>
                  </div>
                  <Link href="/subscription">
                    <Button size="sm">View Plans</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Subscription */}
          {isSubscribed && plan && (
            <Card className="border border-border mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-foreground capitalize">
                        {plan.name} Plan
                      </p>
                      <Badge variant="default" className="text-[10px]">
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <Link href="/subscription">
                    <Button variant="outline" size="sm">
                      Manage Subscription
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="Avatar" className="h-16 w-16 rounded-full" />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.firstName || ''}
                        className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.lastName || ''}
                        className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.emailAddresses[0]?.emailAddress || ''}
                      disabled
                      className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email is managed by Clerk
                    </p>
                  </div>

                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-sm">
                    <div>
                      <p className="text-sm font-medium text-foreground">Password</p>
                      <p className="text-xs text-muted-foreground">
                        {isViewOnly ? 'View-only access: Password changes are restricted' : 'Last changed 30 days ago'}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={isViewOnly || !canManageSettings}
                      title={isViewOnly ? 'View-only users cannot change password' : ''}
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-sm">
                    <div>
                      <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">
                        {isViewOnly ? 'View-only access: 2FA management is restricted' : 'Add an extra layer of security'}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={isViewOnly || !canManageSettings}
                      title={isViewOnly ? 'View-only users cannot manage 2FA' : ''}
                    >
                      Enable 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive email updates about your account
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Push Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance & Theme</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="h-5 w-5 text-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Color Theme</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        Choose a color theme to customize your app's appearance. Themes are applied across all pages.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setThemePickerOpen(true)}
                      className="w-full sm:w-auto"
                      size="lg"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Choose Theme
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-sm border border-border">
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> Your theme preference is saved per account and will apply to all pages, dialogs, and popups.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>
                    Manage your subscription and payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-sm">
                    <div>
                      <p className="text-sm font-medium text-foreground">Current Plan</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {plan?.name || 'Free'} Plan
                      </p>
                    </div>
                    <Link href="/subscription">
                      <Button variant="outline" size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-sm">
                    <div>
                      <p className="text-sm font-medium text-foreground">Payment Method</p>
                      <p className="text-xs text-muted-foreground">
                        Manage your payment methods
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Account Information */}
          <Card className="border border-border mt-6">
            <CardHeader>
              <CardTitle className="text-base">Account Type</CardTitle>
              <CardDescription className="text-xs">
                Your current account type. This cannot be changed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-sm border border-border">
                {(() => {
                  const Icon = currentAccountOption.icon
                  return <Icon className="h-5 w-5 text-foreground" />
                })()}
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
      </main>
      
      <ThemePicker open={themePickerOpen} onOpenChange={setThemePickerOpen} />
      </div>
  )
}
