'use client';

import BenefitsSection from '@/component/register/benifits';
import ProviderForm from '@/component/register/form';
import HelpSection from '@/component/register/help';
import HeroSection from '@/component/register/herosection';

export default function BecomeProviderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <BenefitsSection />
      <ProviderForm />
      <HelpSection />
    </div>
  );
}
