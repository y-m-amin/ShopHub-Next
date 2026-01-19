
"use client";

import React, { useState, useEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      {/* 1. Enhanced Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-8 border border-primary-100 dark:border-primary-800/50 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            New Pro Collection 2025 is Live
          </div>
          <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            The Next Generation of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 animate-gradient-x">Digital Commerce.</span>
          </h1>
          <p className={`max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Nexus is the premier marketplace for hardware enthusiasts and digital-first creators. 
            Secure, transparent, and built for performance.
          </p>
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link href="/items" className="group w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 flex items-center justify-center transform hover:scale-105 hover:-translate-y-1">
              Explore Marketplace 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105 hover:-translate-y-1">
              Sign Up Now
            </Link>
          </div>
        </div>
        
        {/* Enhanced Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-to-r from-primary-500/5 to-indigo-500/5 blur-[100px] rounded-full animate-spin-slow"></div>
        </div>
      </section>

      {/* 2. Enhanced Features Grid */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">Engineered for Excellence</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Seamless experiences built for the modern shopper.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="text-yellow-500" />, title: "Ultra Fast Delivery", desc: "Our logistics network ensures items reach your doorstep within 24 hours.", color: "yellow" },
              { icon: <Shield className="text-primary-600" />, title: "Secure Transactions", desc: "Proprietary escrow system with bank-grade encryption.", color: "primary" },
              { icon: <Globe className="text-emerald-500" />, title: "Global Reach", desc: "Source unique hardware from creators across 120+ countries.", color: "emerald" },
              { icon: <Cpu className="text-purple-500" />, title: "Smart Inventory", desc: "Real-time stock tracking and AI-driven alerts.", color: "purple" },
              { icon: <Users className="text-blue-500" />, title: "Vibrant Community", desc: "Join 500k+ tech enthusiasts in our global forums.", color: "blue" },
              { icon: <CheckCircle className="text-emerald-600" />, title: "Certified Sellers", desc: "Rigorous 10-point verification process for all merchants.", color: "emerald" }
            ].map((f, i) => (
              <div key={i} className="group p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-2 hover:border-primary-200 dark:hover:border-primary-800">
                <div className={`w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-${f.color}-50 dark:group-hover:bg-${f.color}-900/20`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold dark:text-white mb-3 transition-colors duration-300 group-hover:text-primary-600">{f.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Enhanced Statistics with Shimmer */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-6">Built for the future of commerce.</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="group">
                <div className="text-4xl font-extrabold text-primary-600 mb-2 transition-all duration-300 group-hover:scale-110 group-hover:text-primary-700">
                  <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">$500M+</span>
                </div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Gross Volume</div>
              </div>
              <div className="group">
                <div className="text-4xl font-extrabold text-primary-600 mb-2 transition-all duration-300 group-hover:scale-110 group-hover:text-primary-700">
                  <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">99.9%</span>
                </div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative group">
            <div className="relative overflow-hidden rounded-3xl">
              <img 
                src="https://picsum.photos/seed/office/800/600" 
                alt="Workspace" 
                className="rounded-3xl shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105" 
              />
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-3xl"></div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </section>

      {/* 4. Enhanced Testimonials with Stagger Animation */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold dark:text-white mb-4">Loved by Professionals Worldwide</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Join thousands of satisfied customers who trust Nexus for their hardware needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i} 
                className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2 hover:border-primary-200 dark:hover:border-primary-800"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star 
                      key={starIndex} 
                      size={16} 
                      className="text-amber-500 fill-current transition-transform duration-300 group-hover:scale-110" 
                      style={{ transitionDelay: `${starIndex * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 italic mb-6 leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4 transition-transform duration-300 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <div className="font-bold dark:text-white transition-colors duration-300 group-hover:text-primary-600">{testimonial.name}</div>
                    <div className="text-sm text-zinc-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Enhanced Professional Membership Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">Choose Your Plan</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">Unlock premium features and exclusive benefits tailored to your needs</p>
            
            {/* Enhanced Billing Toggle */}
            <div className="inline-flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-12 relative overflow-hidden">
              <div 
                className={`absolute top-1 bottom-1 bg-white dark:bg-zinc-700 rounded-lg shadow-sm transition-all duration-300 ${billingCycle === 'monthly' ? 'left-1 right-1/2' : 'left-1/2 right-1'}`}
              ></div>
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${billingCycle === 'monthly' ? 'text-primary-600' : 'text-zinc-600 dark:text-zinc-400'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`relative z-10 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${billingCycle === 'yearly' ? 'text-primary-600' : 'text-zinc-600 dark:text-zinc-400'}`}
              >
                Yearly <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full ml-2 animate-pulse">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Enhanced Membership Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {membershipPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 hover:shadow-primary-500/20' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-primary-500/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center animate-bounce">
                      <Crown size={16} className="mr-1" /> Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold dark:text-white mb-2 group-hover:text-primary-600 transition-colors duration-300">{plan.name}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold dark:text-white group-hover:text-primary-600 transition-colors duration-300">
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
                    <li key={j} className="flex items-start group/item">
                      <Check size={20} className="text-emerald-500 mr-3 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110" />
                      <span className="text-zinc-600 dark:text-zinc-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40' 
                    : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-primary-600 hover:text-white text-zinc-900 dark:text-white hover:shadow-lg'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Enhanced Lifetime Plan */}
          <div className="max-w-4xl mx-auto">
            <div className="group relative p-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-300 animate-gradient-x rounded-3xl text-white overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                <Infinity size={32} className="animate-spin-slow" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Infinity size={24} className="mr-2 animate-pulse" />
                    <h3 className="text-2xl font-bold">{lifetimePlan.name}</h3>
                  </div>
                  <p className="text-purple-100 mb-6">{lifetimePlan.description}</p>
                  <ul className="space-y-2">
                    {lifetimePlan.features.map((feature, i) => (
                      <li key={i} className="flex items-center group/feature">
                        <Check size={16} className="mr-2 text-purple-200 transition-transform duration-300 group-hover/feature:scale-110" />
                        <span className="text-purple-100 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center lg:text-right">
                  <div className="mb-4">
                    <div className="text-sm text-purple-200 line-through">${lifetimePlan.originalPrice}</div>
                    <div className="text-4xl font-extrabold group-hover:scale-110 transition-transform duration-300">${lifetimePlan.price}</div>
                    <div className="text-purple-200 text-sm">One-time payment</div>
                  </div>
                  <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all duration-300 shadow-lg transform hover:scale-105 hover:-translate-y-1">
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
              <div key={i} className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-300"
                >
                  <h4 className="font-bold dark:text-white pr-4 group-hover:text-primary-600 transition-colors duration-300">{faq.question}</h4>
                  <ChevronDown 
                    size={20} 
                    className={`text-zinc-400 transition-all duration-300 flex-shrink-0 group-hover:text-primary-600 ${openFaq === i ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Enhanced Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="group relative p-12 bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-600 bg-size-300 animate-gradient-x rounded-[3rem] text-white text-center shadow-2xl shadow-primary-500/40 overflow-hidden hover:shadow-3xl hover:shadow-primary-500/50 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 group-hover:scale-110 transition-transform duration-700 delay-200"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-6 group-hover:scale-105 transition-transform duration-300">Ready to Transform Your Hardware Sourcing?</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Join thousands of professionals who trust Nexus for their hardware needs</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="group/btn px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all duration-300 inline-block shadow-lg transform hover:scale-105 hover:-translate-y-1">
                  <span className="flex items-center justify-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
                <Link href="/items" className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300 inline-block transform hover:scale-105 hover:-translate-y-1">
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
