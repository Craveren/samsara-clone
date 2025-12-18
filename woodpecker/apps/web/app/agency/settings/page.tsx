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
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Building2,
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

export default function AgencySettingsPage() {
  const { user } = useUser()
  const currentAccountOption = useAccountOption()

  return (
    <div className="flex h-screen bg-white">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <PageIntro pageId="agency-settings" pageName="AGENCY SETTINGS">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-1.5">
                Agency Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your agency profile, security, and preferences.
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
                    <CardTitle className="text-base">Agency Profile</CardTitle>
                    <CardDescription className="text-xs">
                      This information will be displayed publicly.
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
                          <Building2 className="h-8 w-8" />
                        </div>
                      )}
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" /> Change Photo
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="agencyName">Agency Name</Label>
                        <Input
                          id="agencyName"
                          defaultValue="Woodpecker Legal Services"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="license">License Number</Label>
                        <Input
                          id="license"
                          defaultValue="BAR-2024-001"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2 mt-1 p-2 border border-input rounded-md bg-background">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user?.emailAddresses[0]?.emailAddress}</span>
                        <Badge variant="secondary" className="ml-auto text-[10px]">Verified</Badge>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center gap-2 mt-1 p-2 border border-input rounded-md bg-background">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          defaultValue={user?.phoneNumbers[0]?.phoneNumber || ''}
                          placeholder="Add phone number"
                          className="border-0 p-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <div className="flex items-center gap-2 mt-1 p-2 border border-input rounded-md bg-background">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          defaultValue="123 Legal Street, Johannesburg, South Africa"
                          className="border-0 p-0 focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-black text-white hover:bg-black/90">
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
                      Manage your account security and privacy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Two-Factor Authentication</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Add an extra layer of security to your account.
                      </p>
                      <Button variant="outline" size="sm">
                        <Lock className="h-4 w-4 mr-2" /> Enable 2FA
                      </Button>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium text-sm mb-2">Password</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Change your password regularly to keep your account secure.
                      </p>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" /> Change Password
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
                      Decide what notifications you want to receive.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Email Notifications</h4>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox" defaultChecked />
                          Client updates
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox" defaultChecked />
                          Team member activities
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox" />
                          Promotional offers
                        </label>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium text-sm mb-2">In-App Notifications</h4>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox" defaultChecked />
                          New client messages
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="form-checkbox" defaultChecked />
                          System alerts
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-black text-white hover:bg-black/90">
                        <Save className="h-4 w-4 mr-2" /> Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Billing & Subscription</CardTitle>
                    <CardDescription className="text-xs">
                      Manage your subscription and view billing history.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Current Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Agency Professional Plan
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Full access to all agency features and team management tools.
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Manage Subscription
                      </Button>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium text-sm mb-2">Payment Method</h4>
                      <p className="text-sm text-muted-foreground">
                        No payment method on file.
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Add Payment Method
                      </Button>
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

