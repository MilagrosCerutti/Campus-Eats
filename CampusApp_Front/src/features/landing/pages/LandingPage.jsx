import LandingNavbar from '../components/LandingNavbar'
import HeroSection from '../components/HeroSection'
import HowItWorksSection from '../components/HowItWorksSection'
import MenuPreviewSection from '../components/MenuPreviewSection'
import ProgressSection from '../components/ProgressSection'
import SedesSection from '../components/SedesSection'
import PhotoBannerSection from '../components/PhotoBannerSection'
import FeaturesSection from '../components/FeaturesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import LandingCTA from '../components/LandingCTA'
import LandingFooter from '../components/LandingFooter'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <HowItWorksSection />
      <MenuPreviewSection />
      <ProgressSection />
      <SedesSection />
      <PhotoBannerSection />
      <FeaturesSection />
      <TestimonialsSection />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
