'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { Avatar, AvatarFallback } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HealthHistoryCard, type HealthProfile } from '@/components/legacy/HealthHistoryCard'
import { formatDate } from '@/lib/utils/date-format'

// Mock legacy data
const mockLegacy = {
  stories: [
    {
      id: '1',
      title: 'Childhood Memories',
      content: 'I remember growing up in a small town where everyone knew each other...',
      date: new Date('2024-01-15'),
      category: 'Childhood',
      duration: '5:32',
    },
    {
      id: '2',
      title: 'Family Traditions',
      content: 'Every Christmas, we would gather at grandmother\'s house...',
      date: new Date('2024-01-20'),
      category: 'Family',
      duration: '8:15',
    },
    {
      id: '3',
      title: 'Life Lessons',
      content: 'The most important lesson I learned was to always be kind...',
      date: new Date('2024-02-01'),
      category: 'Wisdom',
      duration: '12:45',
    },
  ],
  documents: [
    {
      id: '1',
      name: 'Last Will and Testament',
      type: 'Will',
      date: new Date('2024-01-10'),
      status: 'completed',
    },
    {
      id: '2',
      name: 'Family Photo Album',
      type: 'Photos',
      date: new Date('2024-01-25'),
      status: 'in-progress',
    },
    {
      id: '3',
      name: 'Estate Planning Documents',
      type: 'Legal',
      date: new Date('2024-02-05'),
      status: 'completed',
    },
  ],
  people: [
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Daughter',
      role: 'Executor',
      completion: 85,
    },
    {
      id: '2',
      name: 'Michael Chen',
      relationship: 'Son',
      role: 'Beneficiary',
      completion: 60,
    },
    {
      id: '3',
      name: 'Emily Davis',
      relationship: 'Spouse',
      role: 'Beneficiary',
      completion: 100,
    },
  ],
}

export default function LegacyPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState('overview')
  const [healthProfile, setHealthProfile] = React.useState<HealthProfile>({
    age: 65,
    birthday: '1959-03-15',
    weight: '72 kgs',
    height: '165 cm',
    gender: 'Female',
    guardian: 'John Johnson',
    allergies: [
      {
        id: '1',
        name: 'Penicillin',
        severity: 'moderate',
        reaction: 'Hives (Moderate to severe)',
      },
      {
        id: '2',
        name: 'Codeine',
        severity: 'moderate',
        reaction: 'Shortness of Breath (Moderate to severe)',
      },
      {
        id: '3',
        name: 'Bee Stings',
        severity: 'severe',
        reaction: 'Anaphylactic Shock (Moderate to severe)',
      },
    ],
    medicalHistory: [
      {
        id: '1',
        date: new Date('2014-08-26'),
        type: 'checkup',
        title: 'Asthma Check-Up',
        provider: 'Dr. Henry Seven',
        location: 'Community Hospital, 40 Bernard St, London WC1N 1LE, United Kingdom',
      },
      {
        id: '2',
        date: new Date('2014-03-01'),
        type: 'surgery',
        title: 'Gall Bladder Surgery',
        provider: 'Dr. Bala Venktaraman',
        location: 'Ashby Medical Center, 56 Bernard St, London WC1N 1LE, United Kingdom',
      },
      {
        id: '3',
        date: new Date('2014-02-15'),
        type: 'vaccination',
        title: 'Influenza Virus Vaccine',
        provider: 'Dr. Smith',
        location: 'Ashby Medical Center, 56 Bernard St, London WC1N 1LE, United Kingdom',
      },
      {
        id: '4',
        date: new Date('2013-12-17'),
        type: 'surgery',
        title: 'Laparoscopic Cholecystectomy',
        provider: 'Dr. Bala Venktaraman',
        location: 'Ashby Medical Center, 56 Bernard St, London WC1N 1LE, United Kingdom',
      },
    ],
  })

  const totalStories = mockLegacy.stories.length
  const totalDocuments = mockLegacy.documents.length
  const totalPeople = mockLegacy.people.length
  const completionRate = Math.round(
    (mockLegacy.stories.length + mockLegacy.documents.filter(d => d.status === 'completed').length) /
    (mockLegacy.stories.length + mockLegacy.documents.length) * 100
  )

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">My Legacy Journey</h1>
                <p className="text-muted-foreground text-sm lg:text-base">
                  Preserve your stories, memories, and estate planning journey
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Button variant="outline" onClick={() => router.push('/interview')} className="text-sm">
                  <Icon icon="solar:microphone-bold" className="h-4 w-4 mr-2" />
                  Record Story
                </Button>
                <Button onClick={() => router.push('/legacy/create')} className="text-sm">
                  <Icon icon="solar:add-circle-bold" className="h-4 w-4 mr-2" />
                  Add Legacy Item
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Stories Recorded</p>
                      <p className="text-2xl font-bold text-foreground">{totalStories}</p>
                    </div>
                    <motion.div 
                      className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon icon="solar:book-bookmark-bold" className="h-6 w-6 text-foreground" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Documents</p>
                      <p className="text-2xl font-bold text-foreground">{totalDocuments}</p>
                    </div>
                    <motion.div 
                      className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon icon="solar:document-text-bold" className="h-6 w-6 text-foreground" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Family Members</p>
                      <p className="text-2xl font-bold text-foreground">{totalPeople}</p>
                    </div>
                    <motion.div 
                      className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon icon="solar:users-group-two-rounded-bold" className="h-6 w-6 text-foreground" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Completion</p>
                      <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
                    </div>
                    <motion.div 
                      className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon icon="solar:check-circle-bold" className="h-6 w-6 text-foreground" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-1 h-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="stories" className="text-xs sm:text-sm">Stories</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
              <TabsTrigger value="people" className="text-xs sm:text-sm hidden lg:flex">People</TabsTrigger>
              <TabsTrigger value="health" className="text-xs sm:text-sm hidden lg:flex">Health</TabsTrigger>
            </TabsList>
            
            {/* Mobile-only tabs for People and Health */}
            <div className="lg:hidden flex gap-2">
              <Button
                variant={activeTab === 'people' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('people')}
                className="flex-1"
              >
                People
              </Button>
              <Button
                variant={activeTab === 'health' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('health')}
                className="flex-1"
              >
                Health
              </Button>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Stories */}
                <Card className="border border-border/40">
                  <CardHeader>
                    <CardTitle>Recent Stories</CardTitle>
                    <CardDescription>Your latest recorded memories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockLegacy.stories.slice(0, 3).map((story) => (
                        <motion.div
                          key={story.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border border-border/40 hover:border-border/60 cursor-pointer transition-all"
                          onClick={() => router.push(`/legacy/stories/${story.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground">{story.title}</h3>
                            <Badge variant="outline">{story.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {story.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatDate(story.date)}</span>
                            <span>•</span>
                            <span>{story.duration}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('stories')}>
                      View All Stories
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Documents */}
                <Card className="border border-border/40">
                  <CardHeader>
                    <CardTitle>Recent Documents</CardTitle>
                    <CardDescription>Your estate planning documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockLegacy.documents.map((doc) => (
                        <motion.div
                          key={doc.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border border-border/40 hover:border-border/60 cursor-pointer transition-all"
                          onClick={() => router.push(`/documents/${doc.id}`)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                                <Icon icon="solar:document-text-bold" className="h-5 w-5 text-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{doc.name}</h3>
                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                              </div>
                            </div>
                            <Badge variant={doc.status === 'completed' ? 'default' : 'outline'}>
                              {doc.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {doc.date instanceof Date ? formatDate(doc.date) : formatDate(new Date(doc.date))}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('documents')}>
                      View All Documents
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Health Profile Preview */}
              <div className="mt-6">
                <HealthHistoryCard 
                  profile={healthProfile} 
                  onUpdate={setHealthProfile}
                  editable={true}
                />
              </div>
            </TabsContent>

            <TabsContent value="stories" className="space-y-6">
              <Card className="border border-border/40">
                <CardHeader>
                  <CardTitle>All Stories</CardTitle>
                  <CardDescription>Your complete collection of recorded memories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockLegacy.stories.map((story) => (
                      <motion.div
                        key={story.id}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 rounded-lg border border-border/40 hover:border-border/60 cursor-pointer transition-all"
                        onClick={() => router.push(`/legacy/stories/${story.id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-12 w-12 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
                            <Icon icon="solar:microphone-bold" className="h-6 w-6 text-foreground" />
                          </div>
                          <Badge variant="outline">{story.category}</Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{story.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {story.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{story.date instanceof Date ? formatDate(story.date) : formatDate(new Date(story.date))}</span>
                          <span>•</span>
                          <span>{story.duration}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card className="border border-border/40">
                <CardHeader>
                  <CardTitle>All Documents</CardTitle>
                  <CardDescription>Your estate planning and legacy documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLegacy.documents.map((doc) => (
                      <motion.div
                        key={doc.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-4 rounded-lg border border-border/40 hover:border-border/60 cursor-pointer transition-all"
                        onClick={() => router.push(`/documents/${doc.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-foreground/5 flex items-center justify-center">
                              <Icon icon="solar:document-text-bold" className="h-6 w-6 text-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{doc.name}</h3>
                              <p className="text-sm text-muted-foreground">{doc.type} • {doc.date instanceof Date ? formatDate(doc.date) : formatDate(new Date(doc.date))}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={doc.status === 'completed' ? 'default' : 'outline'}>
                              {doc.status}
                            </Badge>
                            <Icon icon="solar:arrow-right-bold" className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="people" className="space-y-6">
              <Card className="border border-border/40">
                <CardHeader>
                  <CardTitle>Family & People</CardTitle>
                  <CardDescription>People included in your legacy planning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockLegacy.people.map((person) => (
                      <motion.div
                        key={person.id}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 rounded-lg border border-border/40 hover:border-border/60 cursor-pointer transition-all"
                        onClick={() => router.push(`/people/${person.id}`)}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-foreground/10 text-foreground">
                              {person.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{person.name}</h3>
                            <p className="text-sm text-muted-foreground">{person.relationship}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Badge variant="outline">{person.role}</Badge>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-foreground transition-all"
                                style={{ width: `${person.completion}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{person.completion}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <HealthHistoryCard 
                profile={healthProfile} 
                onUpdate={setHealthProfile}
                editable={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
