'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge, Progress } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { PageIntro } from '@/components/onboarding/PageIntro'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  lessons: number
  progress?: number
  thumbnail?: string
  instructor?: string
  rating?: number
  enrolled?: boolean
  youtubeVideoId?: string
  youtubeUrl?: string
  citations?: Array<{ author: string; work: string; quote?: string }>
  resources?: Array<{ title: string; url: string; type: 'article' | 'video' | 'document' }>
}

interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'reading' | 'quiz'
  completed?: boolean
}

const courses: Course[] = [
  {
    id: '1',
    title: 'The Art of Legacy: Philosophical Foundations of Estate Planning',
    description: 'As Marcus Aurelius once contemplated: "You have power over your mind—not outside events. Realize this, and you will find strength." This course explores estate planning through the lens of Stoic philosophy, teaching you to view your legacy not as mere wealth transfer, but as the continuation of your values, wisdom, and impact on future generations.',
    duration: '3h 45min',
    level: 'Beginner',
    category: 'Philosophy & Ethics',
    lessons: 12,
    instructor: 'Inspired by Marcus Aurelius & Seneca',
    rating: 4.9,
    youtubeVideoId: 'FBhUIJC6ZCc',
    youtubeUrl: 'https://www.youtube.com/watch?v=FBhUIJC6ZCc',
    citations: [
      { author: 'Marcus Aurelius', work: 'Meditations', quote: 'You have power over your mind—not outside events. Realize this, and you will find strength.' },
      { author: 'Seneca', work: 'Letters from a Stoic', quote: 'It is not that we have a short time to live, but that we waste a lot of it.' },
    ],
    resources: [
      { title: 'Understanding Estate Planning in South Africa', url: 'https://www.youtube.com/watch?v=FBhUIJC6ZCc', type: 'video' },
      { title: 'Stoic Philosophy and Legacy Planning', url: '#', type: 'article' },
    ],
  },
  {
    id: '2',
    title: 'The Wealth of Nations: Economic Principles in Estate Planning',
    description: 'Drawing from Adam Smith\'s profound insights on wealth creation and distribution, this course examines how estate planning serves as both personal financial strategy and social responsibility. Learn to structure your estate to maximize generational wealth while contributing to economic stability.',
    duration: '4h 20min',
    level: 'Intermediate',
    category: 'Economics & Strategy',
    lessons: 15,
    instructor: 'Inspired by Adam Smith & John Maynard Keynes',
    rating: 4.8,
    youtubeVideoId: 'FBhUIJC6ZCc',
    youtubeUrl: 'https://www.youtube.com/watch?v=FBhUIJC6ZCc',
    citations: [
      { author: 'Adam Smith', work: 'The Wealth of Nations', quote: 'It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own interest.' },
      { author: 'John Maynard Keynes', work: 'The General Theory', quote: 'The long run is a misleading guide to current affairs. In the long run we are all dead.' },
    ],
    resources: [
      { title: 'Estate Planning and Wealth Management', url: 'https://www.youtube.com/watch?v=FBhUIJC6ZCc', type: 'video' },
      { title: 'Economic Principles in Estate Planning', url: '#', type: 'article' },
    ],
  },
  {
    id: '3',
    title: 'The Social Contract: Legal Frameworks and Family Governance',
    description: 'Jean-Jacques Rousseau\'s concept of the social contract finds modern expression in family governance structures. This advanced course teaches you to create family constitutions, establish governance frameworks, and design trust structures that honor both individual autonomy and collective family values.',
    duration: '5h 30min',
    level: 'Advanced',
    category: 'Legal Philosophy',
    lessons: 18,
    instructor: 'Inspired by Rousseau & John Locke',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'The Meditations on Mortality: Healthcare Directives Through Existential Wisdom',
    description: 'Blaise Pascal wrote: "The last act is bloody, however pleasant all the rest of the play is." This profound course guides you through healthcare directives, living wills, and end-of-life planning with the depth and clarity of existential philosophy, helping you make decisions that honor both life and dignity.',
    duration: '2h 50min',
    level: 'Intermediate',
    category: 'Healthcare & Ethics',
    lessons: 10,
    instructor: 'Inspired by Pascal & Viktor Frankl',
    rating: 4.7,
  },
  {
    id: '5',
    title: 'The Republic of Beneficiaries: Justice in Wealth Distribution',
    description: 'Plato\'s exploration of justice in "The Republic" provides the foundation for understanding fair and equitable beneficiary selection. Learn to balance merit, need, and relationship in your estate distribution, creating a legacy that reflects your deepest values of justice and fairness.',
    duration: '3h 15min',
    level: 'Intermediate',
    category: 'Ethics & Distribution',
    lessons: 11,
    instructor: 'Inspired by Plato & Aristotle',
    rating: 4.8,
  },
  {
    id: '6',
    title: 'The Digital Leviathan: Modern Asset Management in the Information Age',
    description: 'Thomas Hobbes\' "Leviathan" examined how society organizes itself. In our digital age, this course applies these principles to managing digital assets, cryptocurrency, intellectual property, and online presence. Learn to create comprehensive digital estate plans that protect your virtual legacy.',
    duration: '2h 40min',
    level: 'Intermediate',
    category: 'Digital Assets',
    lessons: 9,
    instructor: 'Inspired by Hobbes & Modern Tech Philosophers',
    rating: 4.6,
  },
  {
    id: '7',
    title: 'The Prince\'s Trust: Power, Control, and Strategic Estate Planning',
    description: 'Machiavelli\'s insights on power and strategy, when applied ethically, reveal sophisticated estate planning techniques. This advanced course teaches complex trust structures, dynasty planning, and multi-generational wealth preservation strategies used by the world\'s most successful families.',
    duration: '4h 50min',
    level: 'Advanced',
    category: 'Advanced Strategy',
    lessons: 16,
    instructor: 'Inspired by Machiavelli & Sun Tzu',
    rating: 4.9,
  },
  {
    id: '8',
    title: 'The Wealth of Wisdom: Intergenerational Knowledge Transfer',
    description: 'Benjamin Franklin believed in the power of knowledge over mere wealth. This course teaches you to structure your estate to transfer not just assets, but values, wisdom, family history, and life lessons—creating a true legacy that enriches future generations beyond material wealth.',
    duration: '3h 20min',
    level: 'Beginner',
    category: 'Legacy Building',
    lessons: 10,
    instructor: 'Inspired by Benjamin Franklin & Confucius',
    rating: 4.8,
  },
]

export default function EstateEducationPage() {
  const [enrolledCourses, setEnrolledCourses] = useLocalStorage<string[]>('enrolled-courses', [])
  const [courseProgress, setCourseProgress] = useLocalStorage<Record<string, number>>('course-progress', {})
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null)
  const [isCourseOpen, setIsCourseOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'all' | 'enrolled' | 'completed'>('all')

  const enrolledCoursesList = courses.filter(c => enrolledCourses.includes(c.id))
  const completedCourses = enrolledCoursesList.filter(c => (courseProgress[c.id] || 0) >= 100)

  const filteredCourses = React.useMemo(() => {
    if (activeTab === 'all') return courses
    if (activeTab === 'enrolled') return enrolledCoursesList
    if (activeTab === 'completed') return completedCourses
    return courses
  }, [activeTab, enrolledCoursesList, completedCourses])

  const handleEnroll = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId])
      setCourseProgress({ ...courseProgress, [courseId]: 0 })
    }
    setSelectedCourse(courses.find(c => c.id === courseId) || null)
    setIsCourseOpen(true)
  }

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course)
    setIsCourseOpen(true)
  }

  const stats = React.useMemo(() => ({
    total: courses.length,
    enrolled: enrolledCourses.length,
    completed: completedCourses.length,
    inProgress: enrolledCoursesList.filter(c => (courseProgress[c.id] || 0) > 0 && (courseProgress[c.id] || 0) < 100).length,
  }), [courses.length, enrolledCourses.length, completedCourses.length, enrolledCoursesList, courseProgress])

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <PageIntro 
          pageId="education" 
          pageName="ESTATE EDUCATION"
          description="Learn estate planning fundamentals through comprehensive courses and resources."
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">


          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Courses ({courses.length})</TabsTrigger>
              <TabsTrigger value="enrolled">My Courses ({stats.enrolled})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const isEnrolled = enrolledCourses.includes(course.id)
                  const progress = courseProgress[course.id] || 0
                  const isCompleted = progress >= 100

                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className={cn(
                        "border border-border/60 hover:shadow-xl transition-all h-full flex flex-col",
                        isEnrolled && "ring-2 ring-foreground/20"
                      )}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {course.category}
                            </Badge>
                            {course.rating && (
                              <div className="flex items-center gap-1 text-xs">
                                <Icon icon="solar:star-bold" className="h-3 w-3 text-foreground" />
                                <span className="font-medium">{course.rating}</span>
                              </div>
                            )}
                          </div>
                          <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {course.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon icon="solar:clock-circle-bold" className="h-3.5 w-3.5" />
                                {course.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon icon="solar:document-text-bold" className="h-3.5 w-3.5" />
                                {course.lessons} lessons
                              </span>
                            </div>
                            {course.instructor && (
                              <p className="text-xs text-muted-foreground">
                                Instructor: <span className="font-medium">{course.instructor}</span>
                              </p>
                            )}
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs w-fit",
                                course.level === 'Beginner' && "border-border/60",
                                course.level === 'Intermediate' && "border-border/60",
                                course.level === 'Advanced' && "border-border/60"
                              )}
                            >
                              {course.level}
                            </Badge>
                            {isEnrolled && (
                              <div className="space-y-1 pt-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-1.5" />
                              </div>
                            )}
                          </div>
                          <div className="pt-4 mt-auto">
                            {isEnrolled ? (
                              <Button
                                onClick={() => handleViewCourse(course)}
                                className="w-full"
                                variant={isCompleted ? "outline" : "default"}
                              >
                                {isCompleted ? (
                                  <>
                                    <Icon icon="solar:check-circle-bold-duotone" className="h-4 w-4 mr-2" />
                                    Review Course
                                  </>
                                ) : (
                                  <>
                                    <Icon icon="solar:play-bold-duotone" className="h-4 w-4 mr-2" />
                                    {progress > 0 ? 'Continue Learning' : 'Start Course'}
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleEnroll(course.id)}
                                className="w-full"
                                variant="outline"
                              >
                                <Icon icon="solar:book-bookmark-bold-duotone" className="h-4 w-4 mr-2" />
                                Enroll Now
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          {filteredCourses.length === 0 && (
            <Card className="border border-dashed border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Icon icon="solar:academic-cap-bold-duotone" className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {activeTab === 'enrolled' ? 'No enrolled courses' : activeTab === 'completed' ? 'No completed courses' : 'No courses found'}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {activeTab === 'enrolled' 
                    ? 'Enroll in courses to start learning about estate planning.'
                    : activeTab === 'completed'
                    ? 'Complete courses to see them here.'
                    : 'Try adjusting your filters.'}
                </p>
              </CardContent>
            </Card>
          )}
          </div>
        </PageIntro>
      </main>

      {/* Course Detail Dialog */}
      <Dialog open={isCourseOpen} onOpenChange={setIsCourseOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{selectedCourse.category}</Badge>
                  {selectedCourse.rating && (
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:star-bold" className="h-4 w-4 text-foreground" />
                      <span className="font-medium">{selectedCourse.rating}</span>
                    </div>
                  )}
                </div>
                <DialogTitle className="text-2xl">{selectedCourse.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedCourse.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="font-semibold">{selectedCourse.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Lessons</p>
                    <p className="font-semibold">{selectedCourse.lessons}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Level</p>
                    <Badge variant="outline" className="text-xs">
                      {selectedCourse.level}
                    </Badge>
                  </div>
                </div>
                {selectedCourse.instructor && (
                  <div className="p-4 border border-border/60 rounded-lg bg-gradient-to-br from-background to-foreground/5">
                    <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                    <p className="font-semibold text-foreground">{selectedCourse.instructor}</p>
                  </div>
                )}
                
                {/* YouTube Video Embed */}
                {selectedCourse.youtubeVideoId && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Icon icon="solar:play-circle-bold-duotone" className="h-5 w-5" />
                      Course Video
                    </h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border/60 bg-black shadow-lg">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedCourse.youtubeVideoId}?rel=0&modestbranding=1`}
                        title={selectedCourse.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    {selectedCourse.youtubeUrl && (
                      <a
                        href={selectedCourse.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <Icon icon="solar:external-link-bold-duotone" className="h-3.5 w-3.5" />
                        Watch on YouTube
                      </a>
                    )}
                  </div>
                )}
                
                {/* Citations */}
                {selectedCourse.citations && selectedCourse.citations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Icon icon="solar:document-text-bold-duotone" className="h-5 w-5" />
                      Philosophical Foundations
                    </h3>
                    <div className="space-y-3">
                      {selectedCourse.citations.map((citation, idx) => (
                        <Card key={idx} className="border border-border/60 bg-gradient-to-br from-background to-foreground/5">
                          <CardContent className="p-4">
                            {citation.quote && (
                              <blockquote className="text-sm italic text-foreground mb-3 border-l-2 border-foreground/20 pl-3">
                                "{citation.quote}"
                              </blockquote>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Icon icon="solar:user-bold-duotone" className="h-3.5 w-3.5" />
                              <span className="font-medium">{citation.author}</span>
                              <span>•</span>
                              <span>{citation.work}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Additional Resources */}
                {selectedCourse.resources && selectedCourse.resources.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Icon icon="solar:book-bookmark-bold-duotone" className="h-5 w-5" />
                      Additional Resources
                    </h3>
                    <div className="space-y-2">
                      {selectedCourse.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-border/60 rounded-lg hover:border-foreground/40 hover:bg-foreground/5 transition-all group"
                        >
                          <div className="h-10 w-10 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                            <Icon 
                              icon={resource.type === 'video' ? 'solar:play-circle-bold-duotone' : resource.type === 'article' ? 'solar:document-text-bold-duotone' : 'solar:file-text-bold-duotone'} 
                              className="h-5 w-5 text-foreground" 
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-foreground">{resource.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                          </div>
                          <Icon icon="solar:external-link-bold-duotone" className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {enrolledCourses.includes(selectedCourse.id) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Progress</span>
                      <span className="font-semibold">{Math.round(courseProgress[selectedCourse.id] || 0)}%</span>
                    </div>
                    <Progress value={courseProgress[selectedCourse.id] || 0} className="h-2" />
                  </div>
                )}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-3">What you'll learn</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                      <span>Fundamental concepts and best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                      <span>Step-by-step guidance for implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                      <span>Real-world examples and case studies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                      <span>Interactive quizzes and assessments</span>
                    </li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCourseOpen(false)}>
                  Close
                </Button>
                {enrolledCourses.includes(selectedCourse.id) ? (
                  <Button onClick={() => {
                    // Navigate to course content
                    setIsCourseOpen(false)
                  }}>
                    <Icon icon="solar:play-bold-duotone" className="h-4 w-4 mr-2" />
                    {selectedCourse && (courseProgress[selectedCourse.id] || 0) > 0 ? 'Continue Learning' : 'Start Course'}
                  </Button>
                ) : (
                  <Button onClick={() => {
                    handleEnroll(selectedCourse.id)
                  }}>
                    <Icon icon="solar:book-bookmark-bold-duotone" className="h-4 w-4 mr-2" />
                    Enroll in Course
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
