'use client'

import * as React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import '@/lib/themes/clear-themes'
import {
  Button,
  Card,
  CardContent,
  Badge,
  Separator,
  Avatar,
  AvatarFallback,
} from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useUser } from '@clerk/nextjs'
import { cn } from '@woodpecker/utils'
import { BackgroundPaths } from '@/components/ui/shadcn-io/background-paths'

/**
 * Woodpecker Landing Page
 * Premium estate planning platform with animated paths background
 */
export default function HomePage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Only redirect if user explicitly came from login/sign-in flow
  // Check sessionStorage for explicit login intent
  React.useEffect(() => {
    if (isLoaded && user) {
      // Check if user explicitly started login/sign-in process
      const explicitLogin = sessionStorage.getItem('explicit-login-intent') === 'true'
      
      if (explicitLogin) {
        // Clear the flag
        sessionStorage.removeItem('explicit-login-intent')
        
        // Check for activeRole first (new system), then role (old system)
        const activeRole = (user.publicMetadata?.activeRole || user.publicMetadata?.role) as string | undefined
        
        if (activeRole && ['client', 'lawyer', 'agency', 'financial-advisor', 'family'].includes(activeRole)) {
          const { getDashboardPath } = require('@/lib/routing/role-routes')
          const dashboardPath = getDashboardPath(activeRole)
          router.push(dashboardPath)
        } else if (user) {
          // User exists but no valid role - redirect to account type selection
          router.push('/onboarding/account-type?mode=signin')
        }
      }
      // If no explicit login intent, stay on landing page (user can browse)
    }
  }, [isLoaded, user, router])

  const features = [
    {
      icon: 'solar:shield-check-bold-duotone',
      title: 'Bank-Grade Security',
      description: 'Your legacy data is protected with enterprise encryption, SOC 2 compliance, and strict role isolation.',
      highlight: '256-bit AES',
    },
    {
      icon: 'solar:document-text-bold-duotone',
      title: 'Smart Documents',
      description: 'Version-controlled wills, trusts, and directives with complete audit trails and automated backups.',
      highlight: 'Auto-versioned',
    },
    {
      icon: 'solar:users-group-two-rounded-bold-duotone',
      title: 'Team Collaboration',
      description: 'Seamlessly collaborate with lawyers, agencies, and executors through invitation-based access.',
      highlight: 'Role-based',
    },
    {
      icon: 'solar:chart-2-bold-duotone',
      title: 'Financial Clarity',
      description: 'Real-time asset tracking, beautiful visualizations, and comprehensive estate analytics.',
      highlight: 'Live sync',
    },
    {
      icon: 'solar:checklist-minimalistic-bold-duotone',
      title: 'Task Workflows',
      description: 'Kanban boards and automated task tracking keep your estate planning on schedule.',
      highlight: 'Automated',
    },
    {
      icon: 'solar:book-bookmark-bold-duotone',
      title: 'Legacy Stories',
      description: 'Preserve memories, values, and messages for future generations with rich media support.',
      highlight: 'Multimedia',
    },
  ]

  const stats = [
    { value: '50,000+', label: 'Legacies Secured', icon: 'solar:safe-2-bold-duotone' },
    { value: '$12B+', label: 'Assets Protected', icon: 'solar:wallet-bold-duotone' },
    { value: '99.99%', label: 'Uptime SLA', icon: 'solar:server-bold-duotone' },
    { value: '15,000+', label: 'Professionals', icon: 'solar:briefcase-bold-duotone' },
  ]

  const testimonials = [
    {
      quote: "Woodpecker transformed how I manage client estates. The role isolation means I never worry about data leakage between clients.",
      name: 'Victoria Chen',
      role: 'Estate Attorney',
      company: 'Chen & Partners LLP',
      avatar: 'VC',
    },
    {
      quote: "Finally, a platform that understands estate planning isn't just documents—it's preserving family legacies. Beautiful and functional.",
      name: 'Marcus Thompson',
      role: 'Wealth Advisor',
      company: 'Thompson Wealth',
      avatar: 'MT',
    },
    {
      quote: "The security and compliance features alone justified the switch. My agency handles 200+ clients seamlessly now.",
      name: 'Sarah Okonkwo',
      role: 'Agency Director',
      company: 'Legacy First Planning',
      avatar: 'SO',
    },
  ]

  const workflowSteps = [
    { step: '01', title: 'Create Your Account', description: 'Choose your role and set up your secure workspace in under 2 minutes.', icon: 'solar:user-plus-bold-duotone' },
    { step: '02', title: 'Add Your Assets', description: 'Import financial data, upload documents, and organize your estate inventory.', icon: 'solar:wallet-money-bold-duotone' },
    { step: '03', title: 'Invite Your Team', description: 'Add lawyers, executors, and family members with granular access controls.', icon: 'solar:users-group-two-rounded-bold-duotone' },
    { step: '04', title: 'Plan & Preserve', description: 'Use workflows, templates, and AI assistance to complete your estate plan.', icon: 'solar:shield-check-bold-duotone' },
  ]

  const handleContactSales = () => {
    window.location.href = 'mailto:sales@woodpecker.co.za?subject=Woodpecker%20Agency%20Plan%20Inquiry&body=Hi%20Woodpecker%20Team,%0A%0AI%20am%20interested%20in%20learning%20more%20about%20the%20Agency%20plan.%0A%0APlease%20contact%20me%20to%20discuss%20further.%0A%0AThank%20you!'
  }

  const handleScheduleDemo = () => {
    window.location.href = 'mailto:demo@woodpecker.co.za?subject=Schedule%20a%20Demo&body=Hi%20Woodpecker%20Team,%0A%0AI%20would%20like%20to%20schedule%20a%20demo%20of%20the%20Woodpecker%20platform.%0A%0APlease%20contact%20me%20to%20arrange%20a%20convenient%20time.%0A%0AThank%20you!'
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section with Animated Paths */}
      <section className="relative min-h-screen flex flex-col">
        {/* Animated Background Paths */}
        <BackgroundPaths backgroundOnly={true} />

        {/* Navigation */}
        <nav className="relative z-20 max-w-7xl mx-auto w-full px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon="solar:bird-bold" className="h-10 w-10 text-foreground drop-shadow-sm" />
              <div>
                <span className="text-xl font-bold text-foreground tracking-tight">Woodpecker</span>
                <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Legacy Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-foreground/5 px-3 py-2 rounded-full shadow-sm border border-border/60">
              <a href="#features" className="text-sm px-3 py-1 rounded-full text-foreground/80 hover:text-foreground hover:bg-background transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-sm px-3 py-1 rounded-full text-foreground/80 hover:text-foreground hover:bg-background transition-colors font-medium">How it works</a>
              <a href="#testimonials" className="text-sm px-3 py-1 rounded-full text-foreground/80 hover:text-foreground hover:bg-background transition-colors font-medium">Testimonials</a>
              <a href="#pricing" className="text-sm px-3 py-1 rounded-full text-foreground/80 hover:text-foreground hover:bg-background transition-colors font-medium">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-foreground hover:bg-foreground/10 font-medium"
                onClick={() => {
                  // Mark explicit login intent
                  sessionStorage.setItem('explicit-login-intent', 'true')
                  router.push('/login')
                }}
              >
                Log in
              </Button>
              <Button 
                className="bg-foreground text-background hover:bg-foreground/90 shadow-lg font-medium"
                onClick={() => router.push('/onboarding/account-type?mode=signup')}
              >
                <Icon icon="mdi:bird" className="h-4 w-4 mr-2" />
                Get started
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex-1 flex items-center"
        >
          <div className="max-w-7xl mx-auto w-full px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                <Badge variant="outline" className="mb-6 border-foreground/20 bg-background/50 backdrop-blur-sm px-4 py-1.5">
                  <Icon icon="solar:verified-check-bold" className="h-3.5 w-3.5 mr-2 text-foreground" />
                  <span className="text-xs font-medium">Trusted by 15,000+ estate professionals</span>
                </Badge>
                
                {/* Animated Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                  {['Own', 'your', 'legacy.'].map((word, wordIndex) => (
                    <span key={wordIndex} className="inline-block mr-3 last:mr-0">
                      {word.split('').map((letter, letterIndex) => (
                        <motion.span
                          key={`${wordIndex}-${letterIndex}`}
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            delay: wordIndex * 0.15 + letterIndex * 0.03,
                            type: 'spring',
                            stiffness: 150,
                            damping: 25,
                          }}
                          className={cn(
                            "inline-block",
                            wordIndex === 0 ? "italic font-serif text-foreground" : "text-foreground"
                          )}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                  <br />
                  <span className="text-muted-foreground">Secure your future.</span>
                </h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                  The modern platform for estate planning. Organize documents, track assets, 
                  collaborate with professionals, and preserve what matters most.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                >
                  <Button 
                    size="lg" 
                    className="bg-foreground text-background hover:bg-foreground/90 h-14 px-8 text-base shadow-xl font-semibold group"
                    onClick={() => router.push('/onboarding/account-type?mode=signup')}
                  >
                    <Icon icon="mdi:bird" className="h-5 w-5 mr-2" />
                    Start your free trial
                    <Icon icon="mdi:arrow-right" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-14 px-8 text-base border-foreground/20 hover:bg-foreground/5 text-foreground"
                    onClick={handleScheduleDemo}
                  >
                    <Icon icon="mdi:email-outline" className="h-5 w-5 mr-2" />
                    Contact us
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:shield-check-bold" className="h-4 w-4 text-foreground" />
                    <span>SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:lock-bold" className="h-4 w-4 text-foreground" />
                    <span>256-bit encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-green-600" />
                    <span>No credit card required</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs font-medium">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon icon="solar:alt-arrow-down-bold" className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Logos Section */}
      <section className="py-16 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by leading estate planning firms</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Legacy Partners', 'Estate Pro', 'Trust & Will Co', 'Heritage Law', 'Family First'].map((name) => (
              <Card key={name} className="border border-border/60 bg-background/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                <CardContent className="py-4 px-3 flex items-center justify-center gap-2">
                  <Icon icon="solar:bird-bold" className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-semibold text-foreground tracking-tight">{name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon icon={stat.icon} className="h-6 w-6 text-background" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-background/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Video Section - Estate Planning in South Africa */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon icon="solar:document-text-bold-duotone" className="h-5 w-5 text-foreground" />
              <Badge variant="outline" className="border-border/60">
                Educational Content
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Understanding Estate Planning in South Africa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about the realities of estate planning in South Africa and the importance of proper preparation.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/60 bg-black"
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/FBhUIJC6ZCc?si=Qndv--KRjKTEkRZg"
              title="Estate Planning in South Africa"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon icon="solar:bird-bold" className="h-5 w-5 text-foreground" />
              <Badge variant="outline" className="border-border/60">
                Powerful Features
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need to<br />manage your legacy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed for individuals, families, and professionals 
              who take estate planning seriously.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Icon icon={feature.icon} className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {feature.highlight}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon icon="solar:bird-bold" className="h-5 w-5 text-foreground" />
              <Badge variant="outline" className="border-border/60">
                Simple Process
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Get started in minutes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our streamlined onboarding gets you planning your legacy quickly and securely.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-border/60" />
                )}
                <div className="h-24 w-24 rounded-2xl bg-background flex items-center justify-center mx-auto mb-6 relative shadow-sm border border-border/60">
                  <Icon icon={item.icon} className="h-10 w-10 text-foreground" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon icon="solar:bird-bold" className="h-5 w-5 text-foreground" />
              <Badge variant="outline" className="border-border/60">
                Testimonials
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Trusted by professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what estate planning professionals and families say about Woodpecker.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/60 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} icon="solar:star-bold" className="h-4 w-4 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                    <Separator className="mb-4" />
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-foreground text-background text-sm font-medium">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon icon="solar:bird-bold" className="h-5 w-5 text-foreground" />
              <Badge variant="outline" className="border-border/60">
                Simple Pricing
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Start free, scale as you grow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No surprises. Just transparent pricing for every stage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Personal',
                price: 'Free',
                period: 'forever',
                description: 'For individuals managing their estate',
                features: [
                  '1 Legacy',
                  '10 Documents',
                  '5 Beneficiaries',
                  'Basic support',
                  'Email notifications',
                ],
                cta: 'Start free',
                ctaAction: 'signup',
                popular: false,
              },
              {
                name: 'Professional',
                price: 'R799',
                period: '/month',
                description: 'For lawyers and estate planners',
                features: [
                  'Unlimited Legacies',
                  'Unlimited Documents',
                  'Unlimited Collaborators',
                  'Document templates',
                  'Priority support',
                  'Advanced analytics',
                  'Video calls & whiteboard',
                ],
                cta: 'Start trial',
                ctaAction: 'signup',
                popular: true,
              },
              {
                name: 'Agency',
                price: 'Custom',
                period: '',
                description: 'For estate planning agencies',
                features: [
                  'Everything in Professional',
                  'Multi-team management',
                  'Custom integrations',
                  'Dedicated success manager',
                  'SLA guarantee',
                  'White-label options',
                  'API access',
                ],
                cta: 'Contact sales',
                ctaAction: 'contact',
                popular: false,
              },
            ].map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "h-full border-border/60 relative",
                  tier.popular && "border-foreground shadow-xl scale-105"
                )}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-foreground text-background shadow-lg">
                        <Icon icon="solar:star-bold" className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-foreground mb-1">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {tier.ctaAction === 'signup' ? (
                      <Button 
                        className={cn(
                          "w-full",
                          tier.popular 
                            ? "bg-foreground text-background hover:bg-foreground/90" 
                            : "bg-muted text-foreground hover:bg-muted/80"
                        )}
                        onClick={() => router.push('/onboarding/account-type?mode=signup')}
                      >
                        <Icon icon="mdi:bird" className="h-4 w-4 mr-2" />
                        {tier.cta}
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleContactSales}
                        className="w-full bg-muted text-foreground hover:bg-muted/80"
                      >
                        <Icon icon="mdi:email-outline" className="h-4 w-4 mr-2" />
                        {tier.cta}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Icon icon="solar:bird-bold" className="h-14 w-14 text-background mx-auto mb-8 drop-shadow-lg" />
            <h2 className="text-3xl md:text-5xl font-bold text-background mb-4">
              Ready to secure your legacy?
            </h2>
            <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
              Join thousands of families and professionals who trust Woodpecker 
              to protect what matters most.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 h-14 px-8 shadow-xl"
                onClick={() => router.push('/onboarding/account-type?mode=signup')}
              >
                <Icon icon="mdi:bird" className="h-5 w-5 mr-2" />
                Start your free trial
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 bg-background/10 text-background hover:bg-background/20 border-background/30"
                onClick={handleScheduleDemo}
              >
                <Icon icon="mdi:email-outline" className="h-5 w-5 mr-2" />
                Contact us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Icon icon="solar:bird-bold" className="h-6 w-6 text-foreground" />
              <span className="font-semibold text-foreground">Woodpecker</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Woodpecker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
