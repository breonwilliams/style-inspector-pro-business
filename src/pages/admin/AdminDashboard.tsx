import React from 'react';
import { Card, CardContent, Badge } from '../../components/ui';
import { 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp,
  UserPlus,
  CreditCard,
  Download,
  AlertCircle
} from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'this month'
    },
    {
      title: 'Active Subscriptions',
      value: '342',
      change: '+8%',
      changeType: 'positive' as const,
      icon: CreditCard,
      description: 'paid users'
    },
    {
      title: 'Monthly Revenue',
      value: '$9,918',
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'this month'
    },
    {
      title: 'Extensions Created',
      value: '2,156',
      change: '+23%',
      changeType: 'positive' as const,
      icon: Package,
      description: 'total'
    }
  ];

  const recentActivity = [
    {
      type: 'user_signup',
      message: 'New user Sarah Wilson signed up',
      time: '2 minutes ago',
      icon: UserPlus,
      color: 'text-green-500'
    },
    {
      type: 'subscription',
      message: 'John Doe upgraded to Pro plan',
      time: '15 minutes ago',
      icon: TrendingUp,
      color: 'text-blue-500'
    },
    {
      type: 'extension',
      message: 'Extension "Tab Manager Pro" published',
      time: '1 hour ago',
      icon: Package,
      color: 'text-purple-500'
    },
    {
      type: 'payment',
      message: 'Payment failed for user mike@example.com',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'text-red-500'
    },
    {
      type: 'download',
      message: '50+ downloads for "Password Helper"',
      time: '3 hours ago',
      icon: Download,
      color: 'text-indigo-500'
    }
  ];

  const topExtensions = [
    { name: 'Password Helper', downloads: 12450, creator: 'John Doe' },
    { name: 'Tab Manager Pro', downloads: 8920, creator: 'Sarah Wilson' },
    { name: 'Dark Mode Toggle', downloads: 7650, creator: 'Mike Chen' },
    { name: 'Screenshot Tool', downloads: 6340, creator: 'Lisa Park' },
    { name: 'Ad Blocker Plus', downloads: 5890, creator: 'Tom Smith' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your platform's performance and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Extensions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Extensions
            </h3>
            <div className="space-y-4">
              {topExtensions.map((extension, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {extension.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by {extension.creator}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {extension.downloads.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      downloads
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h3>
          <div className="h-64 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                Revenue chart visualization would go here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Last 6 months: $7,420 → $9,918 (+34%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Manage Users
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage user accounts
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Revenue Reports
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View detailed revenue analytics
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Package className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Review Extensions
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Moderate and approve content
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
