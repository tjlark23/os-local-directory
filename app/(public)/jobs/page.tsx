import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ArrowRight,
  Search,
  Bell
} from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { SAMPLE_JOBS, JOB_CATEGORIES, type Job } from '@/lib/jobs-config'

export const metadata: Metadata = {
  title: `Local Jobs | Find Work in Williamson County | ${siteConfig.name}`,
  description: 'Find local job opportunities at businesses in Leander, Round Rock, Cedar Park, and throughout Williamson County, Texas.',
  openGraph: {
    title: `Local Jobs | ${siteConfig.name}`,
    description: 'Find local job opportunities in Williamson County.',
    type: 'website',
    url: `${siteConfig.url}/jobs`,
  },
  alternates: {
    canonical: `${siteConfig.url}/jobs`,
  },
}

function formatSalary(salary: Job['salary']) {
  if (!salary) return null
  const { min, max, period } = salary

  if (period === 'hourly') {
    if (min && max) return `$${min}-$${max}/hr`
    if (min) return `$${min}+/hr`
    if (max) return `Up to $${max}/hr`
  } else {
    if (min && max) return `$${(min/1000).toFixed(0)}k-$${(max/1000).toFixed(0)}k/yr`
    if (min) return `$${(min/1000).toFixed(0)}k+/yr`
    if (max) return `Up to $${(max/1000).toFixed(0)}k/yr`
  }
  return null
}

function JobCard({ job }: { job: Job }) {
  const salaryDisplay = formatSalary(job.salary)

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all ${job.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {job.featured && (
                <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Building2 className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          {salaryDisplay && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{salaryDisplay}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          {job.businessId ? (
            <Link
              href={`/business/${job.businessId}`}
              className="text-sm text-primary hover:underline"
            >
              View Business Profile
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">Local Business</span>
          )}
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function JobsPage() {
  const featuredJobs = SAMPLE_JOBS.filter(j => j.featured)
  const allJobs = SAMPLE_JOBS

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                Beta
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Local Jobs
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Find job opportunities at local businesses in Leander, Round Rock, Cedar Park,
              and throughout Williamson County. Work where you live.
            </p>

            {/* Search Bar Placeholder */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  disabled
                />
              </div>
              <Button className="px-6 py-3 bg-primary hover:bg-primary/90" disabled>
                Search
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Full search coming soon. Browse available jobs below.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Jobs */}
            {featuredJobs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">Featured Jobs</h2>
                <div className="space-y-4">
                  {featuredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </section>
            )}

            {/* All Jobs */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {featuredJobs.length > 0 ? 'More Jobs' : 'All Jobs'}
              </h2>
              <div className="space-y-4">
                {allJobs.filter(j => !j.featured).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {allJobs.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Check back soon for new job listings.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Alerts */}
            <Card>
              <CardContent className="p-6">
                <Bell className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-foreground mb-2">Get Job Alerts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Be notified when new jobs are posted.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 border rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                  Subscribe
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-4">Browse by Category</h3>
                <div className="space-y-2">
                  {JOB_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className="w-full justify-start text-left text-sm h-auto py-2"
                      disabled
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* For Employers */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-2">Are You Hiring?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Post your job listings to reach local candidates.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/for-businesses">
                    Post a Job
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Browse Directory */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-2">Local Businesses</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover businesses in your area that may be hiring.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/search">
                    Browse Directory
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
