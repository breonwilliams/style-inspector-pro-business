import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CreditCard, Chrome, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui';

export function UserDashboard() {
  const { profile, subscription } = useAuth();

  const isPro = subscription?.plan_name === 'pro';
  const isFree = !subscription || subscription?.plan_name === 'free';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your Style Inspector Pro subscription and extension access.
          </p>
        </div>

        {/* Current Plan Status */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPro ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <Star className={`w-6 h-6 ${isPro ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {isPro ? 'Style Inspector Pro' : 'Style Inspector Free'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isPro 
                      ? `Active until ${new Date(subscription.current_period_end || '').toLocaleDateString()}`
                      : 'Free plan with limited features'
                    }
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                {isFree && (
                  <Link to="/#pricing">
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
                <Link to="/settings">
                  <Button variant="secondary">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isPro ? 'Manage Billing' : 'Billing'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extension Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Chrome className="w-5 h-5" />
              <span>Chrome Extension</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Style Inspector Pro Extension
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connected and ready to use
                  </p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                How to use your extension:
              </h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>1. Navigate to any website</li>
                <li>2. Click the Style Inspector Pro icon in your browser toolbar</li>
                <li>3. {isPro ? 'Enjoy unlimited access to all premium features!' : 'Use free features or upgrade for premium tools'}</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Feature Access */}
        <Card>
          <CardHeader>
            <CardTitle>Your Feature Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free Features */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  ✅ Included in your plan:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Style extraction (unlimited)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Color palette analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Font inspection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Basic exports (CSS, JSON)</span>
                  </li>
                  {isPro && (
                    <>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Unlimited AI analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Advanced color picker</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Premium exports (.aco, PNG)</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Pro Features (if free user) */}
              {isFree && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    🚀 Upgrade to unlock:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <span>Unlimited AI design analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <span>Advanced color picker tool</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <span>Premium exports (.aco, PNG)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <div className="pt-3">
                    <Link to="/#pricing">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        <Zap className="w-4 h-4 mr-2" />
                        Upgrade to Pro - $9/month
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Pro user success message */}
              {isPro && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    🎉 Pro Benefits Active:
                  </h4>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      You have full access to all premium features in your extension. 
                      Enjoy unlimited AI analysis, advanced tools, and premium exports!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
