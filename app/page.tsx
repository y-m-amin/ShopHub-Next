
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Cpu, 
  Globe, 
  CheckCircle, 
  Users, 
  Star,
  ChevronDown,
  Check,
  Crown,
  Infinity
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    { 
      name: "Sarah Chen", 
      role: "Hardware Engineer at TechCorp",
      comment: "Nexus transformed how we source prototyping equipment. Fast and reliable with unmatched quality.",
      avatar: "https://picsum.photos/seed/sarah/100/100",
      rating: 5
    },
    { 
      name: "Marcus Rodriguez", 
      role: "Startup Founder",
      comment: "The escrow system gave me confidence to make large purchases. Customer support is exceptional.",
      avatar: "https://picsum.photos/seed/marcus/100/100",
      rating: 5
    },
    { 
      name: "Dr. Emily Watson", 
      role: "Research Director",
      comment: "Global reach is incredible. We found specialized components from manufacturers we never knew existed.",
      avatar: "https://picsum.photos/seed/emily/100/100",
      rating: 5
    },
    { 
      name: "Alex Thompson", 
      role: "Product Designer",
      comment: "The AI-driven recommendations helped us discover better alternatives that saved us 30% on costs.",
      avatar: "https://picsum.photos/seed/alex/100/100",
      rating: 5
    },
    { 
      name: "Lisa Park", 
      role: "Manufacturing Lead",
      comment: "Inventory tracking is spot-on. Never had issues with stock availability or delivery delays.",
      avatar: "https://picsum.photos/seed/lisa/100/100",
      rating: 5
    },
    { 
      name: "James Mitchell", 
      role: "Tech Consultant",
      comment: "The community forums are gold mines of information. Learned so much from other professionals.",
      avatar: "https://picsum.photos/seed/james/100/100",
      rating: 5
    }
  ];

  const faqData = [
    {
      question: "How does the escrow system work?",
      answer: "Our escrow system holds your payment securely until you confirm receipt and satisfaction with your purchase. The seller only receives payment after you approve the transaction, ensuring complete protection for buyers."
    },
    {
      question: "What's included in the 24-hour delivery promise?",
      answer: "Our 24-hour delivery applies to items marked as 'Express' and available in your region. We partner with premium logistics providers and maintain strategic warehouses globally to ensure rapid fulfillment."
    },
    {
      question: "Can I return items if they don't meet specifications?",
      answer: "Yes! We offer a 14-day return policy for all items. If products don't match the specifications or arrive damaged, we'll arrange free return shipping and provide a full refund or replacement."
    },
    {
      question: "How do you verify seller authenticity?",
      answer: "Every seller undergoes our rigorous 10-point verification process including business registration checks, product quality audits, financial verification, and customer feedback analysis before approval."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and cryptocurrency payments. All transactions are processed through our secure, PCI-compliant payment infrastructure."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile apps for iOS and Android offer full marketplace functionality including browsing, purchasing, order tracking, and community access. Download from the App Store or Google Play."
    },
    {
      question: "How does Nexus Plus membership work?",
      answer: "Nexus Plus provides exclusive benefits including priority customer support, early access to new products, bulk purchase discounts, advanced analytics tools, and access to our premium seller network."
    }
  ];

  const membershipPlans = [
    {
      name: "Standard",
      description: "Perfect for individual buyers and small projects",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Basic marketplace access",
        "Standard customer support",
        "Basic search and filters",
        "Standard shipping rates",
        "Community forum access"
      ],
      popular: false,
      cta: "Get Started"
    },
    {
      name: "Nexus Plus",
      description: "Ideal for professionals and growing businesses",
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        "Everything in Standard",
        "Priority customer support",
        "Advanced search & analytics",
        "15% discount on shipping",
        "Early access to new products",
        "Bulk purchase discounts",
        "Premium seller network access"
      ],
      popular: true,
      cta: "Upgrade Now"
    },
    {
      name: "Enterprise",
      description: "For large organizations and high-volume buyers",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "Everything in Nexus Plus",
        "Dedicated account manager",
        "Custom integration support",
        "Volume pricing negotiations",
        "White-label solutions",
        "Advanced reporting & insights",
        "24/7 phone support",
        "Custom payment terms"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const lifetimePlan = {
    name: "Lifetime Access",
    description: "One-time payment for permanent Nexus Plus benefits",
    price: 499,
    originalPrice: 2280,
    features: [
      "All Nexus Plus features forever",
      "Grandfathered pricing protection",
      "Exclusive lifetime member badge",
      "Annual bonus credits",
      "VIP community access"
    ]
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-8 border border-primary-100 dark:border-primary-800/50">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            New Pro Collection 2025 is Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8">
            The Next Generation of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Digital Commerce.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10">
            Nexus is the premier marketplace for hardware enthusiasts and digital-first creators. 
            Secure, transparent, and built for performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/items" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center group">
              Explore Marketplace <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all flex items-center justify-center">
              Sign Up Now
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">Engineered for Excellence</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Seamless experiences built for the modern shopper.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="text-yellow-500" />, title: "Ultra Fast Delivery", desc: "Our logistics network ensures items reach your doorstep within 24 hours." },
              { icon: <Shield className="text-primary-600" />, title: "Secure Transactions", desc: "Proprietary escrow system with bank-grade encryption." },
              { icon: <Globe className="text-emerald-500" />, title: "Global Reach", desc: "Source unique hardware from creators across 120+ countries." },
              { icon: <Cpu className="text-purple-500" />, title: "Smart Inventory", desc: "Real-time stock tracking and AI-driven alerts." },
              { icon: <Users className="text-blue-500" />, title: "Vibrant Community", desc: "Join 500k+ tech enthusiasts in our global forums." },
              { icon: <CheckCircle className="text-emerald-600" />, title: "Certified Sellers", desc: "Rigorous 10-point verification process for all merchants." }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold dark:text-white mb-3">{f.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Statistics */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-6">Built for the future of commerce.</h2>
            <div className="grid grid-cols-2 gap-8">
              <div><div className="text-4xl font-extrabold text-primary-600 mb-2">$500M+</div><div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Gross Volume</div></div>
              <div><div className="text-4xl font-extrabold text-primary-600 mb-2">99.9%</div><div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Satisfaction</div></div>
            </div>
          </div>
          <div className="flex-1 relative">
            <img src="https://picsum.photos/seed/office/800/600" alt="Workspace" className="rounded-3xl shadow-2xl relative z-10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/20 blur-3xl rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 4. Enhanced Testimonials */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold dark:text-white mb-4">Loved by Professionals Worldwide</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Join thousands of satisfied customers who trust Nexus for their hardware needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-all">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-500 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 italic mb-6 leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="font-bold dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-zinc-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Professional Membership Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">Choose Your Plan</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">Unlock premium features and exclusive benefits tailored to your needs</p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-12">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-zinc-700 text-primary-600 shadow-sm' : 'text-zinc-600 dark:text-zinc-400'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${billingCycle === 'yearly' ? 'bg-white dark:bg-zinc-700 text-primary-600 shadow-sm' : 'text-zinc-600 dark:text-zinc-400'}`}
              >
                Yearly <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full ml-2">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Membership Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {membershipPlans.map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-3xl border-2 transition-all hover:shadow-xl ${plan.popular ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                      <Crown size={16} className="mr-1" /> Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold dark:text-white">
                      ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-zinc-500 ml-2">
                      {plan.monthlyPrice === 0 ? '' : billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                    {billingCycle === 'yearly' && plan.monthlyPrice > 0 && (
                      <div className="text-sm text-zinc-500 mt-2">
                        ${(plan.yearlyPrice / 12).toFixed(0)}/month billed annually
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <Check size={20} className="text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/25' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Lifetime Plan */}
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl text-white overflow-hidden">
              <div className="absolute top-4 right-4">
                <Infinity size={32} className="opacity-20" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Infinity size={24} className="mr-2" />
                    <h3 className="text-2xl font-bold">{lifetimePlan.name}</h3>
                  </div>
                  <p className="text-purple-100 mb-6">{lifetimePlan.description}</p>
                  <ul className="space-y-2">
                    {lifetimePlan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check size={16} className="mr-2 text-purple-200" />
                        <span className="text-purple-100 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center lg:text-right">
                  <div className="mb-4">
                    <div className="text-sm text-purple-200 line-through">${lifetimePlan.originalPrice}</div>
                    <div className="text-4xl font-extrabold">${lifetimePlan.price}</div>
                    <div className="text-purple-200 text-sm">One-time payment</div>
                  </div>
                  <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg">
                    Get Lifetime Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Enhanced FAQ with Working Accordion */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Everything you need to know about Nexus Marketplace</p>
          </div>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <h4 className="font-bold dark:text-white pr-4">{faq.question}</h4>
                  <ChevronDown 
                    size={20} 
                    className={`text-zinc-400 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-12 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[3rem] text-white text-center shadow-2xl shadow-primary-500/40 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-6">Ready to Transform Your Hardware Sourcing?</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Join thousands of professionals who trust Nexus for their hardware needs</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all inline-block shadow-lg">
                  Start Free Trial
                </Link>
                <Link href="/items" className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary-600 transition-all inline-block">
                  Explore Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
