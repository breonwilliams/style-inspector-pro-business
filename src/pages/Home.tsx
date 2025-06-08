import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Zap, Shield, BarChart3, Users, Globe, Sparkles } from 'lucide-react';
import { Button, Card, CardContent, Badge, BrowserMockup, EyebrowHeading } from '../components/ui';

export function Home() {
  const features = [
    {
      icon: Package,
      title: 'Extension Builder',
      description: 'Create Chrome extensions with our intuitive drag-and-drop builder. No coding required.',
    },
    {
      icon: Zap,
      title: 'Instant Publishing',
      description: 'Deploy your extensions to the Chrome Web Store with one click. We handle the technical details.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built with enterprise-grade security. Your extensions and data are always protected.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track downloads, user engagement, and revenue with detailed analytics and insights.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team. Share projects, manage permissions, and collaborate seamlessly.',
    },
    {
      icon: Globe,
      title: 'Global Distribution',
      description: 'Reach millions of users worldwide. Optimize for different markets and languages.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        '3 Extensions',
        'Basic Templates',
        'Community Support',
        'Chrome Web Store Publishing',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: 29,
      description: 'For serious extension creators',
      features: [
        '10 Extensions',
        'Premium Templates',
        'Priority Support',
        'Advanced Analytics',
        'Custom Branding',
      ],
      popular: true,
    },
    {
      name: 'Team',
      price: 99,
      description: 'For teams and agencies',
      features: [
        'Unlimited Extensions',
        'Team Collaboration',
        'White-label Options',
        'API Access',
        'Dedicated Support',
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
              Build Chrome Extensions
              <span className="block text-primary-500">Without Code</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Create, publish, and monetize Chrome extensions with our powerful no-code platform. 
              Join thousands of creators building the future of browser experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                  View Pricing
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
            <EyebrowHeading icon={<Sparkles className="w-4 h-4" />} text="Features" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From idea to Chrome Web Store, we provide all the tools and support you need.
            </p>
          </div>
          
          <div className="space-y-24">
            {/* Feature 1: Visual Builder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-500" />
                  </div>
                  <Badge variant="premium">New</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Visual Extension Builder
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Create Chrome extensions with our intuitive drag-and-drop builder. No coding required.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Drag & drop interface
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Pre-built templates
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Real-time preview
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="mt-4">
                    Try Builder
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div>
                <BrowserMockup url="app.extensionpro.com/builder">
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Visual Builder Interface
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
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary-500" />
                  </div>
                  <Badge variant="success">Growing Daily</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Advanced Analytics
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Track downloads, user engagement, and revenue with detailed analytics and insights.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Real-time metrics
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Revenue tracking
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    User behavior insights
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="mt-4">
                    View Analytics
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="lg:order-1">
                <BrowserMockup url="app.extensionpro.com/analytics">
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Analytics Dashboard
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
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary-500" />
                  </div>
                  <Badge variant="warning">All Platforms</Badge>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  One-Click Publishing
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Deploy your extensions to the Chrome Web Store with one click. We handle the technical details.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Automated deployment
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Store optimization
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    Version management
                  </li>
                </ul>
                <Link to="/auth">
                  <Button className="mt-4">
                    Start Publishing
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div>
                <BrowserMockup url="chrome://extensions/">
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Chrome Web Store
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
                    <Badge variant="info" className="bg-primary-500 text-white">
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
                  <Link to="/auth">
                    <Button 
                      variant={plan.popular ? 'primary' : 'secondary'} 
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
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
            Ready to build your first extension?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already building amazing Chrome extensions with ExtensionPro.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700 text-lg px-8 py-4 font-semibold">
              Start Building Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
