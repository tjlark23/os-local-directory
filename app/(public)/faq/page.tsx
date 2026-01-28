import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `FAQ | Frequently Asked Questions | ${siteConfig.name}`,
  description: `Find answers to common questions about ${siteConfig.name}, business listings, reviews, and how to use our local business guide.`,
  keywords: [
    'wilco guide faq',
    'local business directory help',
    'how to list business',
    'business directory questions',
  ],
  openGraph: {
    title: `FAQ | ${siteConfig.name}`,
    description: 'Find answers to common questions about our local business directory.',
    type: 'website',
    url: `${siteConfig.url}/faq`,
  },
  alternates: {
    canonical: `${siteConfig.url}/faq`,
  },
}

const GENERAL_FAQS = [
  {
    question: 'What is WilCo Guide?',
    answer: 'WilCo Guide is a comprehensive local business guide for Leander, Cedar Park, Liberty Hill, and surrounding Texas communities. We help residents and visitors discover, compare, and connect with local businesses across various categories including restaurants, health services, beauty salons, fitness centers, and more.',
  },
  {
    question: 'What areas do you cover?',
    answer: 'We currently have active listings for Leander, Cedar Park, and Liberty Hill, TX. We are actively expanding to cover Hutto, Pflugerville, Round Rock, Taylor, Georgetown, and parts of Austin. New cities are added regularly as we grow.',
  },
  {
    question: 'Is it free to search and browse businesses?',
    answer: 'Yes! Searching and browsing the directory is completely free for all users. You can view business details, read reviews, see photos, and get contact information without creating an account.',
  },
  {
    question: 'How do I find a specific type of business?',
    answer: 'You can use our search feature to find businesses by name, category, or location. You can also browse by category (like Restaurants, Health, Beauty, etc.) or by neighborhood/city. Our guides also highlight the best businesses in specific categories.',
  },
  {
    question: 'Are the reviews real?',
    answer: 'Yes, we display authentic reviews from verified sources. We work to ensure reviews are from real customers who have actually visited or used the business services.',
  },
]

const BUSINESS_FAQS = [
  {
    question: 'How do I add my business to the directory?',
    answer: 'You can submit your business through our Business Inquiry form. Provide your business details including name, address, category, hours, and contact information. Our team will verify and add your listing within 2-3 business days.',
  },
  {
    question: 'Is it free to list my business?',
    answer: 'Basic business listings are free and include your business name, address, phone, hours, and category. Premium listings with enhanced features, photos, and priority placement are available for businesses that want to stand out.',
  },
  {
    question: 'How can I update my business information?',
    answer: 'If you need to update your business information, please contact us through the Contact page or submit a new inquiry with the updated details. We\'ll update your listing as quickly as possible.',
  },
  {
    question: 'What are featured listings?',
    answer: 'Featured listings appear at the top of search results and category pages, giving your business maximum visibility. Featured businesses also get enhanced profiles with more photos, detailed descriptions, and special badges.',
  },
  {
    question: 'Can I respond to reviews?',
    answer: 'Yes! Business owners can respond to reviews by claiming their listing. Contact us to verify your ownership and get access to respond to customer feedback.',
  },
]

const TECHNICAL_FAQS = [
  {
    question: 'Do I need an account to use the directory?',
    answer: 'No account is required to search and browse businesses. However, creating an account allows you to save favorite businesses, get personalized recommendations, and leave reviews.',
  },
  {
    question: 'Is the directory available on mobile?',
    answer: 'Yes! Our directory is fully responsive and works on all devices including phones, tablets, and computers. You can access all features from any device with a web browser.',
  },
  {
    question: 'How often is the information updated?',
    answer: 'We update business information regularly. Business hours, contact details, and other critical information are verified periodically. If you notice any outdated information, please let us know through the Contact page.',
  },
  {
    question: 'Can I share a business listing?',
    answer: 'Yes! Each business has a unique URL that you can share via email, text, or social media. The business details page includes share buttons for easy sharing.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">FAQ</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Help Center
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about WilCo Guide, how to list your business,
              and how to get the most out of our local business guide.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* General Questions */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">General Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {GENERAL_FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`general-${index}`} className="bg-background border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* For Business Owners */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">For Business Owners</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {BUSINESS_FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`business-${index}`} className="bg-background border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Technical Questions */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Technical Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {TECHNICAL_FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`technical-${index}`} className="bg-background border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Still Have Questions */}
          <section className="bg-primary/5 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? We're here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/for-businesses">Business Resources</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
