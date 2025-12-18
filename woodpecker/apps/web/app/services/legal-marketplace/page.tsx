'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Input, Label, Textarea } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useToast } from '@/lib/hooks'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@woodpecker/ui'
import { PageIntro } from '@/components/onboarding/PageIntro'

interface Lawyer {
  id: string
  name: string
  firm: string
  specialty: string[]
  rating: number
  reviews: number
  location: string
  price: string
  experience: string
  languages: string[]
  verified: boolean
  responseTime: string
  description: string
  image?: string
  availableNow?: boolean
  nextAvailable?: string
  portfolio?: Array<{ title: string; description: string; year: number }>
  certifications?: string[]
  education?: string[]
  successRate?: number
  casesHandled?: number
  avgResponseTime?: string
}

const lawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    firm: 'Smith & Associates',
    specialty: ['Estate Planning', 'Will Drafting', 'Trust Administration'],
    rating: 4.8,
    reviews: 124,
    location: 'Cape Town, Western Cape',
    price: 'R2,500/hr',
    experience: '15 years',
    languages: ['English', 'Afrikaans'],
    verified: true,
    responseTime: '< 24 hours',
    description: 'Specialized in comprehensive estate planning with a focus on high-net-worth individuals and families.',
    availableNow: true,
    nextAvailable: 'Available now',
    portfolio: [
      { title: 'Multi-generational Trust Structure', description: 'Created complex trust for R50M estate', year: 2023 },
      { title: 'International Estate Planning', description: 'Managed cross-border estate for family', year: 2022 },
    ],
    certifications: ['LLB (UCT)', 'Estate Planning Specialist', 'Trust Law Certified'],
    education: ['University of Cape Town', 'Harvard Estate Planning Program'],
    successRate: 98,
    casesHandled: 450,
    avgResponseTime: '2 hours',
  },
  {
    id: '2',
    name: 'Michael Chen',
    firm: 'Johnson Legal Group',
    specialty: ['Trust Administration', 'Tax Planning', 'Probate'],
    rating: 4.9,
    reviews: 89,
    location: 'Johannesburg, Gauteng',
    price: 'R3,000/hr',
    experience: '20 years',
    languages: ['English', 'Mandarin'],
    verified: true,
    responseTime: '< 12 hours',
    description: 'Expert in trust administration and complex estate structures with international assets.',
    availableNow: false,
    nextAvailable: 'Tomorrow, 9:00 AM',
    portfolio: [
      { title: 'Dynasty Trust Creation', description: 'Established R200M dynasty trust', year: 2023 },
      { title: 'Tax Optimization Strategy', description: 'Saved client R15M in estate taxes', year: 2022 },
    ],
    certifications: ['LLB (Wits)', 'Tax Law Specialist', 'International Estate Planning'],
    education: ['University of the Witwatersrand', 'Yale Tax Law Program'],
    successRate: 99,
    casesHandled: 680,
    avgResponseTime: '1 hour',
  },
  {
    id: '3',
    name: 'Emily Davis',
    firm: 'Davis & Partners',
    specialty: ['Estate Planning', 'Healthcare Directives', 'Power of Attorney'],
    rating: 4.7,
    reviews: 67,
    location: 'Durban, KwaZulu-Natal',
    price: 'R2,200/hr',
    experience: '12 years',
    languages: ['English', 'Zulu'],
    verified: true,
    responseTime: '< 48 hours',
    description: 'Focused on healthcare directives and elder law, helping families plan for medical decisions.',
    availableNow: true,
    nextAvailable: 'Available now',
    portfolio: [
      { title: 'Healthcare Directive System', description: 'Created comprehensive healthcare planning system', year: 2023 },
      { title: 'Elder Law Advocacy', description: 'Protected rights of 200+ elderly clients', year: 2022 },
    ],
    certifications: ['LLB (UKZN)', 'Elder Law Specialist', 'Healthcare Planning Certified'],
    education: ['University of KwaZulu-Natal', 'Elder Law Institute'],
    successRate: 96,
    casesHandled: 320,
    avgResponseTime: '4 hours',
  },
  {
    id: '4',
    name: 'David Williams',
    firm: 'Williams Legal Services',
    specialty: ['Tax Planning', 'Estate Planning', 'Business Succession'],
    rating: 4.6,
    reviews: 45,
    location: 'Pretoria, Gauteng',
    price: 'R2,800/hr',
    experience: '18 years',
    languages: ['English', 'Afrikaans'],
    verified: true,
    responseTime: '< 24 hours',
    description: 'CPA and attorney specializing in tax-efficient estate planning and business succession.',
    availableNow: false,
    nextAvailable: 'Today, 3:00 PM',
    portfolio: [
      { title: 'Business Succession Plan', description: 'Structured R100M business transfer', year: 2023 },
      { title: 'Tax-Efficient Estate', description: 'Optimized estate saving R8M in taxes', year: 2022 },
    ],
    certifications: ['LLB (UP)', 'CPA', 'Business Succession Specialist'],
    education: ['University of Pretoria', 'CPA Program', 'Business Law Institute'],
    successRate: 97,
    casesHandled: 520,
    avgResponseTime: '3 hours',
  },
]

interface EstatePlanner {
  id: string
  name: string
  firm: string
  specialty: string[]
  rating: number
  reviews: number
  location: string
  price: string
  experience: string
  languages: string[]
  verified: boolean
  responseTime: string
  description: string
  availableNow?: boolean
  nextAvailable?: string
  portfolio?: Array<{ title: string; description: string; year: number }>
  certifications?: string[]
  education?: string[]
  successRate?: number
  casesHandled?: number
  avgResponseTime?: string
}

interface FinancialAdvisor {
  id: string
  name: string
  firm: string
  specialty: string[]
  rating: number
  reviews: number
  location: string
  price: string
  experience: string
  languages: string[]
  verified: boolean
  responseTime: string
  description: string
  availableNow?: boolean
  nextAvailable?: string
  portfolio?: Array<{ title: string; description: string; year: number }>
  certifications?: string[]
  education?: string[]
  successRate?: number
  clientsHandled?: number
  avgResponseTime?: string
  totalAssetsManaged?: number
}

interface Application {
  id: string
  professionalId: string
  professionalName: string
  professionalType: 'lawyer' | 'estate-planner' | 'financial-advisor'
  status: 'pending' | 'approved' | 'rejected' | 'hired'
  appliedAt: string
  message?: string
}

interface HiringRequest {
  id: string
  professionalId: string
  professionalName: string
  professionalType: 'lawyer' | 'estate-planner' | 'financial-advisor'
  status: 'pending' | 'accepted' | 'rejected' | 'active' | 'terminated'
  requestedAt: string
  message?: string
  hiredAt?: string
  terminatedAt?: string
}

export default function LegalMarketplacePage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterSpecialty, setFilterSpecialty] = React.useState<string>('all')
  const [selectedLawyer, setSelectedLawyer] = React.useState<Lawyer | null>(null)
  const [isContactOpen, setIsContactOpen] = React.useState(false)
  const [isApplyOpen, setIsApplyOpen] = React.useState(false)
  const [isHireOpen, setIsHireOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'browse' | 'applications' | 'hiring' | 'active'>('browse')
  const [activeCategory, setActiveCategory] = React.useState<'lawyers' | 'estate-planners' | 'financial-advisors'>('lawyers')
  const [applications, setApplications] = useLocalStorage<Application[]>('professional-applications', [])
  const [hiringRequests, setHiringRequests] = useLocalStorage<HiringRequest[]>('hiring-requests', [])
  const [realLawyers, setRealLawyers] = React.useState<Lawyer[]>([])
  const [isLoadingLawyers, setIsLoadingLawyers] = React.useState(false)

  // Fetch real lawyers from API
  React.useEffect(() => {
    if (activeCategory === 'lawyers') {
      setIsLoadingLawyers(true)
      fetch('/api/lawyers')
        .then(res => res.json())
        .then(data => {
          if (data.data && Array.isArray(data.data)) {
            setRealLawyers(data.data as Lawyer[])
          }
        })
        .catch(err => {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching lawyers:', err)
          }
          // Silently fallback to static data
        })
        .finally(() => {
          setIsLoadingLawyers(false)
        })
    } else {
      setRealLawyers([])
    }
  }, [activeCategory])
  const [estatePlanners] = useLocalStorage<EstatePlanner[]>('estate-planners', [
    {
      id: 'ep1',
      name: 'Jennifer Martinez',
      firm: 'Legacy Planning Group',
      specialty: ['Estate Planning', 'Will Drafting', 'Trust Administration'],
      rating: 4.9,
      reviews: 156,
      location: 'Cape Town, Western Cape',
      price: 'R2,800/hr',
      experience: '18 years',
      languages: ['English', 'Spanish'],
      verified: true,
      responseTime: '< 12 hours',
      description: 'Comprehensive estate planning with focus on family wealth preservation and multi-generational planning.',
      availableNow: true,
      nextAvailable: 'Available now',
      successRate: 99,
      casesHandled: 520,
      avgResponseTime: '2 hours',
    },
  ])
  const [financialAdvisors] = useLocalStorage<FinancialAdvisor[]>('financial-advisors', [
    {
      id: 'fa1',
      name: 'Robert Thompson',
      firm: 'Wealth Management Partners',
      specialty: ['Investment Planning', 'Retirement Planning', 'Tax Optimization'],
      rating: 4.8,
      reviews: 203,
      location: 'Johannesburg, Gauteng',
      price: 'R3,200/hr',
      experience: '22 years',
      languages: ['English', 'Afrikaans'],
      verified: true,
      responseTime: '< 6 hours',
      description: 'Expert in comprehensive financial planning, investment strategies, and retirement planning for high-net-worth individuals.',
      availableNow: false,
      nextAvailable: 'Tomorrow, 10:00 AM',
      successRate: 97,
      clientsHandled: 890,
      avgResponseTime: '1 hour',
      totalAssetsManaged: 250000000,
    },
  ])
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [applicationForm, setApplicationForm] = React.useState({
    message: '',
  })
  const [hiringForm, setHiringForm] = React.useState({
    message: '',
  })

  const allProfessionals = React.useMemo(() => {
    if (activeCategory === 'lawyers') {
      // Use real lawyers if available, otherwise fallback to static data
      return realLawyers.length > 0 ? realLawyers as any[] : lawyers as any[]
    }
    if (activeCategory === 'estate-planners') return estatePlanners as any[]
    return financialAdvisors as any[]
  }, [activeCategory, estatePlanners, financialAdvisors, realLawyers])

  const specialties = React.useMemo(() => {
    const all = allProfessionals.flatMap(p => p.specialty)
    return Array.from(new Set(all))
  }, [allProfessionals])

  const activeHires = hiringRequests.filter(h => h.status === 'active')
  const terminatedHires = hiringRequests.filter(h => h.status === 'terminated')

  const filteredProfessionals = React.useMemo(() => {
    return allProfessionals.filter(professional => {
      const matchesSearch = !searchQuery ||
        professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSpecialty = filterSpecialty === 'all' || professional.specialty.includes(filterSpecialty)
      return matchesSearch && matchesSpecialty
    })
  }, [searchQuery, filterSpecialty, allProfessionals])

  const handleContact = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
    setIsContactOpen(true)
  }

  const handleSubmitContact = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Required fields', 'Please fill in all required fields')
      return
    }
    toast.success('Message sent', `Your message has been sent to ${selectedLawyer?.name}`)
    setContactForm({ name: '', email: '', phone: '', message: '' })
    setIsContactOpen(false)
  }

  const handleApplyAsProfessional = () => {
    if (!selectedLawyer) return
    const professionalType = activeCategory === 'lawyers' ? 'lawyer' : activeCategory === 'estate-planners' ? 'estate-planner' : 'financial-advisor'
    const newApplication: Application = {
      id: Math.random().toString(36).substring(7),
      professionalId: selectedLawyer.id,
      professionalName: selectedLawyer.name,
      professionalType: professionalType as any,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      message: applicationForm.message || undefined,
    }
    setApplications([...applications, newApplication])
    toast.success('Application Submitted', `Your application to join ${selectedLawyer.firm} has been submitted`)
    setApplicationForm({ message: '' })
    setIsApplyOpen(false)
  }

  const handleHireProfessional = () => {
    if (!selectedLawyer) return
    const professionalType = activeCategory === 'lawyers' ? 'lawyer' : activeCategory === 'estate-planners' ? 'estate-planner' : 'financial-advisor'
    const newRequest: HiringRequest = {
      id: Math.random().toString(36).substring(7),
      professionalId: selectedLawyer.id,
      professionalName: selectedLawyer.name,
      professionalType: professionalType as any,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      message: hiringForm.message || undefined,
    }
    setHiringRequests([...hiringRequests, newRequest])
    toast.success('Hiring Request Sent', `Your request to hire ${selectedLawyer.name} has been sent`)
    setHiringForm({ message: '' })
    setIsHireOpen(false)
  }

  const handleTerminateProfessional = (requestId: string) => {
    setHiringRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'terminated' as const, terminatedAt: new Date().toISOString() }
        : req
    ))
    toast.success('Professional Terminated', 'The professional relationship has been terminated')
  }

  const handleReactivateProfessional = (requestId: string) => {
    setHiringRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'active' as const, hiredAt: req.hiredAt || new Date().toISOString() }
        : req
    ))
    toast.success('Professional Reactivated', 'The professional relationship has been reactivated')
  }

  const handleAcceptHire = (requestId: string) => {
    setHiringRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'active' as const, hiredAt: new Date().toISOString() }
        : req
    ))
    toast.success('Professional Hired', 'The professional has been added to your active team')
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Professional Marketplace
                </h1>
                <p className="text-muted-foreground">
                  Find and hire qualified lawyers, estate planners, and financial advisors
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveTab('browse')}
              >
                <Icon icon="solar:scale-bold-duotone" className="h-4 w-4 mr-2" />
                Browse Lawyers
              </Button>
            </div>
            
            {/* Category Selection */}
            <div className="flex gap-2 mb-4">
              {(['lawyers', 'estate-planners', 'financial-advisors'] as const).map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? 'bg-foreground text-background' : ''}
                >
                  {category === 'lawyers' ? 'Lawyers' : category === 'estate-planners' ? 'Estate Planners' : 'Financial Advisors'}
                </Button>
              ))}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList>
                <TabsTrigger value="browse">
                  Browse {activeCategory === 'lawyers' ? 'Lawyers' : activeCategory === 'estate-planners' ? 'Estate Planners' : 'Financial Advisors'}
                </TabsTrigger>
                <TabsTrigger value="applications">
                  My Applications
                  {applications.filter(a => a.status === 'pending').length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {applications.filter(a => a.status === 'pending').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="hiring">
                  Hiring Requests
                  {hiringRequests.filter(h => h.status === 'pending').length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {hiringRequests.filter(h => h.status === 'pending').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active Hires
                  {activeHires.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {activeHires.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Browse Lawyers Tab */}
          <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Icon icon="solar:magnifer-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, firm, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/60"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterSpecialty === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSpecialty('all')}
              >
                All Specialties
              </Button>
              {specialties.map(specialty => (
                <Button
                  key={specialty}
                  variant={filterSpecialty === specialty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterSpecialty(specialty)}
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </div>

          {/* Professionals Grid */}
          {isLoadingLawyers && activeCategory === 'lawyers' ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Icon icon="solar:refresh-bold" className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading lawyers...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProfessionals.map((lawyer) => (
                  <motion.div
                    key={lawyer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                <Card className="border border-border/60 hover:shadow-xl transition-all h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-border/60">
                        <AvatarFallback className="bg-foreground/5 text-foreground font-semibold text-lg">
                          {lawyer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {lawyer.name}
                              {lawyer.verified && (
                                <Icon icon="solar:verified-check-bold-duotone" className="h-4 w-4 text-foreground" />
                              )}
                            </CardTitle>
                            <CardDescription className="text-sm">{lawyer.firm}</CardDescription>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon icon="solar:star-bold" className="h-4 w-4 text-foreground" />
                            <span className="font-semibold">{lawyer.rating}</span>
                            <span className="text-xs text-muted-foreground">({lawyer.reviews})</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {lawyer.specialty.slice(0, 2).map((spec, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {lawyer.specialty.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lawyer.specialty.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lawyer.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:map-point-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{lawyer.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:clock-circle-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{lawyer.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:case-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{lawyer.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:card-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{lawyer.price}</span>
                      </div>
                    </div>
                    {lawyer.languages.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon icon="solar:global-bold-duotone" className="h-3.5 w-3.5" />
                        <span>Languages: {lawyer.languages.join(', ')}</span>
                      </div>
                    )}
                    {/* Availability & Stats */}
                    {lawyer.availableNow !== undefined && (
                      <div className="pt-2 border-t border-border/40 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Availability</span>
                          <Badge 
                            variant={lawyer.availableNow ? "default" : "outline"}
                            className={lawyer.availableNow ? "bg-foreground text-background" : ""}
                          >
                            {lawyer.availableNow ? (
                              <>
                                <Icon icon="solar:check-circle-bold" className="h-3 w-3 mr-1" />
                                Available Now
                              </>
                            ) : (
                              lawyer.nextAvailable || 'Not Available'
                            )}
                          </Badge>
                        </div>
                        {lawyer.successRate && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span className="font-semibold text-foreground">{lawyer.successRate}%</span>
                          </div>
                        )}
                        {lawyer.casesHandled && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Cases Handled</span>
                            <span className="font-semibold text-foreground">{lawyer.casesHandled}+</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-2 border-t border-border/40 space-y-2">
                      <Button
                        onClick={() => handleContact(lawyer)}
                        className="w-full"
                        variant="outline"
                      >
                        <Icon icon="solar:phone-calling-bold-duotone" className="h-4 w-4 mr-2" />
                        Contact Lawyer
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => {
                            setSelectedLawyer(lawyer)
                            setIsApplyOpen(true)
                          }}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Icon icon="solar:user-plus-bold-duotone" className="h-3.5 w-3.5 mr-1" />
                          Apply
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedLawyer(lawyer)
                            setIsHireOpen(true)
                          }}
                          size="sm"
                          className="text-xs bg-foreground text-background hover:bg-foreground/90"
                        >
                          <Icon icon="solar:hand-stars-bold-duotone" className="h-3.5 w-3.5 mr-1" />
                          Hire Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  </motion.div>
                ))}
              </div>

              {filteredProfessionals.length === 0 && !isLoadingLawyers && (
                <Card className="border border-dashed border-border/60">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Icon icon="solar:scale-bold-duotone" className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No {activeCategory === 'lawyers' ? 'lawyers' : activeCategory === 'estate-planners' ? 'estate planners' : 'financial advisors'} found
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Try adjusting your search or filter criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card className="border border-dashed border-border/60">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Icon icon="solar:document-text-bold-duotone" className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Applications</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                    You haven't applied to join any law firms yet.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab('browse')}>
                    Browse Lawyers
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <Card key={app.id} className="border border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{app.professionalName}</h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {app.professionalType.replace('-', ' ')}
                            </Badge>
                            <Badge 
                              variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'outline'}
                            >
                              {app.status}
                            </Badge>
                          </div>
                          {app.message && (
                            <p className="text-sm text-muted-foreground mb-2">{app.message}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Hiring Requests Tab */}
          <TabsContent value="hiring" className="space-y-4">
            {hiringRequests.length === 0 ? (
              <Card className="border border-dashed border-border/60">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Icon icon="solar:hand-stars-bold-duotone" className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Hiring Requests</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                    You haven't sent any hiring requests yet.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab('browse')}>
                    Browse Professionals
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {hiringRequests.map((request) => (
                  <Card key={request.id} className="border border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{request.professionalName}</h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {request.professionalType.replace('-', ' ')}
                            </Badge>
                            <Badge 
                              variant={request.status === 'accepted' || request.status === 'active' ? 'default' : request.status === 'rejected' ? 'destructive' : 'outline'}
                            >
                              {request.status}
                            </Badge>
                          </div>
                          {request.message && (
                            <p className="text-sm text-muted-foreground mb-2">{request.message}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Requested {new Date(request.requestedAt).toLocaleDateString()}</span>
                            {request.hiredAt && (
                              <span>Hired {new Date(request.hiredAt).toLocaleDateString()}</span>
                            )}
                            {request.terminatedAt && (
                              <span>Terminated {new Date(request.terminatedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        {request.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTerminateProfessional(request.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Icon icon="solar:close-circle-bold-duotone" className="h-4 w-4 mr-1" />
                            Terminate
                          </Button>
                        )}
                        {request.status === 'terminated' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReactivateProfessional(request.id)}
                          >
                            <Icon icon="solar:refresh-bold-duotone" className="h-4 w-4 mr-1" />
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Hires Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeHires.length === 0 ? (
              <Card className="border border-dashed border-border/60">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Icon icon="solar:check-circle-bold-duotone" className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Active Hires</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                    You don't have any active professional relationships yet.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab('browse')}>
                    Browse Professionals
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeHires.map((request) => (
                  <Card key={request.id} className="border border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{request.professionalName}</h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {request.professionalType.replace('-', ' ')}
                            </Badge>
                            <Badge variant="default" className="bg-foreground text-background">
                              Active
                            </Badge>
                          </div>
                          {request.hiredAt && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Hired on {new Date(request.hiredAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLawyer(allProfessionals.find(p => p.id === request.professionalId) || null)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <Icon icon="solar:eye-bold-duotone" className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTerminateProfessional(request.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Icon icon="solar:close-circle-bold-duotone" className="h-4 w-4 mr-1" />
                            Terminate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </div>

        {/* Estate Planning Support Section */}
        <div className="mt-12 pt-12 border-t border-border/60">
          <Card className="border border-border/60 bg-gradient-to-br from-foreground/5 to-foreground/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-foreground/10 flex items-center justify-center">
                  <Icon icon="solar:question-circle-bold-duotone" className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <CardTitle>Estate Planning Support</CardTitle>
                  <CardDescription>
                    Get help with your estate planning questions and find resources
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border border-border/60 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:book-bold-duotone" className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Estate Planning Guide</h4>
                        <p className="text-xs text-muted-foreground">
                          Comprehensive guides and resources to help you understand estate planning
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-border/60 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:chat-round-line-bold-duotone" className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Expert Consultation</h4>
                        <p className="text-xs text-muted-foreground">
                          Schedule a consultation with estate planning experts
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-border/60 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:document-text-bold-duotone" className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Document Templates</h4>
                        <p className="text-xs text-muted-foreground">
                          Access templates and checklists for estate planning documents
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-6 pt-6 border-t border-border/60">
                <Button variant="outline" className="w-full">
                  <Icon icon="solar:question-circle-bold-duotone" className="h-4 w-4 mr-2" />
                  Get Estate Planning Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Contact Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedLawyer?.name}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedLawyer?.firm}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="contact-name">Your Name *</Label>
              <Input
                id="contact-name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email *</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="+27 12 345 6789"
              />
            </div>
            <div>
              <Label htmlFor="contact-message">Message *</Label>
              <Textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Tell the lawyer about your estate planning needs..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitContact}>
              <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply as Lawyer Dialog */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply to Join {selectedLawyer?.firm}</DialogTitle>
            <DialogDescription>
              Submit your application to join this law firm as an estate planning lawyer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="application-message">Message (Optional)</Label>
              <Textarea
                id="application-message"
                value={applicationForm.message}
                onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
                placeholder="Tell them why you'd like to join their firm..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyAsProfessional}>
              <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hire Lawyer Dialog */}
      <Dialog open={isHireOpen} onOpenChange={setIsHireOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hire {selectedLawyer?.name}</DialogTitle>
            <DialogDescription>
              Send a hiring request to {selectedLawyer?.name} from {selectedLawyer?.firm}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="hiring-message">Message (Optional)</Label>
              <Textarea
                id="hiring-message"
                value={hiringForm.message}
                onChange={(e) => setHiringForm({ ...hiringForm, message: e.target.value })}
                placeholder="Tell them about your estate planning needs..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHireOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleHireProfessional}>
              <Icon icon="solar:hand-stars-bold-duotone" className="h-4 w-4 mr-2" />
              Send Hiring Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
