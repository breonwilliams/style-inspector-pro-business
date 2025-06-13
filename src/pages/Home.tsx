import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Zap, Shield, BarChart3, Users, Globe, Sparkles } from 'lucide-react';
import { Button, Card, CardContent, Badge, BrowserMockup, EyebrowHeading } from '../components/ui';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { redirectToCheckout, STRIPE_PRICE_IDS, getPlanDisplayName, formatPrice } from '../lib/stripe';

export function Home() {
  const { user, subscription, isDemoMode } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planName: string, priceId: string) => {
    if (!user) {
      // Redirect to auth if not logged in
      window.location.href = '/auth';
      return;
    }

    if (isDemoMode) {
      alert('Demo mode: Stripe checkout is not available in demo mode. Please create a real account to subscribe.');
      return;
    }

    setLoading(planName);

    try {
      await redirectToCheckout({
        priceId,
        userId: user.id,
        userEmail: user.email,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/?canceled=true`,
      });
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planName: string) => {
    return subscription?.plan_name === planName;
  };

  const canUpgrade = (planName: string) => {
    if (!subscription) return true;
    
    const planHierarchy = { free: 0, pro: 1, team: 2 };
    const currentLevel = planHierarchy[subscription.plan_name as keyof typeof planHierarchy] || 0;
    const targetLevel = planHierarchy[planName as keyof typeof planHierarchy] || 0;
    
    return targetLevel > currentLevel;
  };

  const features = [
    {
      icon: Package,
      title: 'Advanced CSS Inspector',
      description: 'Deep dive into any element\'s styles with our powerful inspection tools. See computed styles, inheritance chains, and CSS specificity at a glance.',
    },
    {
      icon: BarChart3,
      title: 'Visual Layout Analyzer',
      description: 'Understand complex layouts with visual guides. See flexbox, grid, and positioning properties with interactive overlays and measurements.',
    },
    {
      icon: Zap,
      title: 'Intelligent Style Debugger',
      description: 'Quickly identify CSS conflicts, inheritance issues, and overridden styles. Get suggestions for fixing common layout problems.',
    },
  ];

  const plans = [
    {
      name: 'Developer',
      price: 0,
      description: 'Perfect for learning and basic inspection',
      features: [
        'Basic CSS inspection',
        'Element selector',
        'Community support',
        'Chrome Web Store access',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: 9,
      description: 'For serious frontend developers',
      features: [
        'Advanced style analysis',
        'Layout visualization tools',
        'CSS conflict detection',
        'Priority support',
        'Export capabilities',
      ],
      popular: true,
    },
    {
      name: 'Team',
      price: 29,
      description: 'For development teams and agencies',
      features: [
        'Unlimited team members',
        'Style guides collaboration',
        'Team insights dashboard',
        'API access',
        'White-label options',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Inspect & Analyze CSS Styles
              <span className="block text-primary-500">Like a Pro</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Powerful Chrome extension that gives developers advanced CSS inspection tools. Debug layouts faster, understand styles better, and build amazing websites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-4">
                  Download Extension
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                  View Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <EyebrowHeading icon={<Sparkles className="w-4 h-4" />} text="Features" className="justify-center" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced CSS debugging tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Debug CSS 10x faster with powerful inspection and analysis tools designed for developers.
            </p>
          </div>
          
          <div className="space-y-24">
            {/* Feature 1: Visual Builder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-500" />
                  </div>
                  <Badge variant="premium">New</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Advanced CSS Inspector
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Deep dive into any element's styles with our powerful inspection tools. See computed styles, inheritance chains, and CSS specificity at a glance.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Real-time style analysis
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Computed vs declared styles
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    CSS specificity calculator
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="mt-4">
                    Try Inspector
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div>
                <BrowserMockup url="chrome://extensions/">
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        CSS Inspector Interface
                      </p>
                    </div>
                  </div>
                </BrowserMockup>
              </div>
            </div>

            {/* Feature 2: Analytics (Reversed) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary-500" />
                  </div>
                  <Badge variant="success">Most Popular CSS Tool</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Visual Layout Analyzer
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Understand complex layouts with visual guides. See flexbox, grid, and positioning properties with interactive overlays and measurements.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Flexbox visualization
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Grid layout analysis
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Box model debugging
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="mt-4">
                    Analyze Layouts
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="lg:order-1">
                <BrowserMockup url="styleinspectorpro.com/analyzer">
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Layout Analyzer
                      </p>
                    </div>
                  </div>
                </BrowserMockup>
              </div>
            </div>

            {/* Feature 3: Publishing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary-500" />
                  </div>
                  <Badge variant="warning">Chrome & Firefox</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Intelligent Style Debugger
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Quickly identify CSS conflicts, inheritance issues, and overridden styles. Get suggestions for fixing common layout problems.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Conflict detection
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Inheritance tracking
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Performance suggestions
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="mt-4">
                    Debug Styles
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div>
                <BrowserMockup url="styleinspectorpro.com/debugger">
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Style Debugger
                      </p>
                    </div>
                  </div>
                </BrowserMockup>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="info" className="!bg-primary-500 !text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.name === 'Developer' ? (
                    <Link to="/auth">
                      <Button 
                        variant="secondary" 
                        className="w-full"
                      >
                        Get Started Free
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      variant={plan.popular ? 'primary' : 'secondary'} 
                      className="w-full"
                      loading={loading === plan.name.toLowerCase()}
                      disabled={isCurrentPlan(plan.name.toLowerCase()) || !canUpgrade(plan.name.toLowerCase())}
                      onClick={() => {
                        const priceId = plan.name === 'Pro' ? STRIPE_PRICE_IDS.PRO : STRIPE_PRICE_IDS.TEAM;
                        handleSubscribe(plan.name.toLowerCase(), priceId);
                      }}
                    >
                      {isCurrentPlan(plan.name.toLowerCase()) 
                        ? 'Current Plan' 
                        : canUpgrade(plan.name.toLowerCase()) 
                          ? `Upgrade to ${plan.name}` 
                          : 'Downgrade'
                      }
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to debug CSS like a pro?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who debug CSS 10x faster with Style Inspector Pro's advanced inspection tools.
          </p>
          <Link to="/auth">
            <Button variant="secondary" size="lg" className="!bg-white !text-primary-600 hover:!bg-gray-100 hover:!text-primary-700 !border-0 text-lg px-8 py-4 font-semibold">
              Download Extension
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
