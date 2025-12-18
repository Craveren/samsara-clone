'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { 
  Briefcase, 
  Search, 
  Mail, 
  Phone,
  UserPlus,
  Users,
  FileText,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { formatDate } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@woodpecker/ui'

interface Lawyer {
  id: string
  name: string
  email: string
  phone?: string
  licenseNumber?: string
  clientsCount: number
  legaciesCount: number
  status: 'active' | 'inactive' | 'pending'
  joinedAt: string
  lastActive?: string
  specialization?: string[]
}

export default function AgencyLawyersPage() {
  const [lawyers, setLawyers] = useLocalStorage<Lawyer[]>('agency-lawyers', [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@lawfirm.com',
      phone: '+27 82 123 4567',
      licenseNumber: 'L12345',
      clientsCount: 12,
      legaciesCount: 18,
      status: 'active',
      joinedAt: '2024-01-01',
      lastActive: '2024-01-20',
      specialization: ['Estate Planning', 'Trust Law'],
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@lawfirm.com',
      licenseNumber: 'L12346',
      clientsCount: 8,
      legaciesCount: 10,
      status: 'active',
      joinedAt: '2024-01-05',
      lastActive: '2024-01-19',
      specialization: ['Tax Law', 'Estate Planning'],
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  const filteredLawyers = React.useMemo(() => {
    if (!searchQuery) return lawyers
    return lawyers.filter(lawyer =>
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [lawyers, searchQuery])

  const stats = React.useMemo(() => {
    return {
      total: lawyers.length,
      active: lawyers.filter(l => l.status === 'active').length,
      totalClients: lawyers.reduce((sum, l) => sum + l.clientsCount, 0),
      totalLegacies: lawyers.reduce((sum, l) => sum + l.legaciesCount, 0),
    }
  }, [lawyers])

  return (
    <div className="flex h-screen bg-white">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1.5">
                Lawyers
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage lawyers in your agency
              </p>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lawyer
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Lawyers</p>
                    <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Active</p>
                    <p className="text-2xl font-semibold text-foreground">{stats.active}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Clients</p>
                    <p className="text-2xl font-semibold text-foreground">{stats.totalClients}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Legacies</p>
                    <p className="text-2xl font-semibold text-foreground">{stats.totalLegacies}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and View Toggle */}
          <div className="flex gap-4 mb-6">
            <Card className="border border-border flex-1">
              <CardContent className="p-4">
                <div className="relative">
                  <Icon icon="solar:magnifer-bold" className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search lawyers by name, email, or license number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-foreground text-background' : ''}
              >
                <Icon icon="solar:widget-4-bold-duotone" className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-foreground text-background' : ''}
              >
                <Icon icon="solar:list-bold-duotone" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lawyers Grid/List with Drag & Drop */}
          {filteredLawyers.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Lawyers Found
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search' : 'No lawyers in your agency yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLawyers.map((lawyer, index) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-base">{lawyer.name}</CardTitle>
                                <Badge
                                  variant={lawyer.status === 'active' ? 'default' : 'secondary'}
                                  className="text-[10px]"
                                >
                                  {lawyer.status}
                                </Badge>
                              </div>
                              {lawyer.licenseNumber && (
                                <p className="text-xs text-muted-foreground">License: {lawyer.licenseNumber}</p>
                              )}
                            </div>
                            <div className="h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                              <Icon icon="solar:menu-dots-bold" className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Icon icon="solar:letter-bold-duotone" className="h-3 w-3" />
                              <span className="truncate">{lawyer.email}</span>
                            </div>
                            {lawyer.phone && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Icon icon="solar:phone-bold-duotone" className="h-3 w-3" />
                                <span>{lawyer.phone}</span>
                              </div>
                            )}
                            {lawyer.specialization && lawyer.specialization.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {lawyer.specialization.slice(0, 2).map((spec, idx) => (
                                  <Badge key={idx} variant="outline" className="text-[10px]">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                              <div>
                                <p className="text-xs text-muted-foreground">Clients</p>
                                <p className="text-sm font-semibold text-foreground">{lawyer.clientsCount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Legacies</p>
                                <p className="text-sm font-semibold text-foreground">{lawyer.legaciesCount}</p>
                              </div>
                            </div>
                            {lawyer.lastActive && (
                              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
                                <span className="text-muted-foreground">Last Active</span>
                                <span className="font-medium text-foreground">
                                  {formatDate(lawyer.lastActive, 'MMM d')}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-border/40">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Icon icon="solar:document-text-bold-duotone" className="h-3.5 w-3.5 mr-1.5" />
                              View Details
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Icon icon="solar:letter-bold-duotone" className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLawyers.map((lawyer, index) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <Card className="border border-border/60 hover:border-border hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="h-12 w-12 border-2 border-border/60">
                                <AvatarFallback className="bg-foreground/5 text-foreground font-semibold">
                                  {lawyer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground">{lawyer.name}</h3>
                                  <Badge
                                    variant={lawyer.status === 'active' ? 'default' : 'secondary'}
                                    className="text-[10px]"
                                  >
                                    {lawyer.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{lawyer.email}</p>
                                {lawyer.specialization && lawyer.specialization.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {lawyer.specialization.map((spec, idx) => (
                                      <Badge key={idx} variant="outline" className="text-[10px]">
                                        {spec}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <p className="text-xs text-muted-foreground">Clients</p>
                                  <p className="text-lg font-bold text-foreground">{lawyer.clientsCount}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Legacies</p>
                                  <p className="text-lg font-bold text-foreground">{lawyer.legaciesCount}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Icon icon="solar:document-text-bold-duotone" className="h-3.5 w-3.5 mr-1.5" />
                                  Details
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <Icon icon="solar:letter-bold-duotone" className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

