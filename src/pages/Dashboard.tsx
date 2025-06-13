import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Download, Eye, TrendingUp, Search, Code, Bug } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui';
import type { Extension } from '../types';

export function Dashboard() {
  const { user, profile, subscription, isDemoMode } = useAuth();
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo data for Style Inspector Pro
  const demoExtensions = [
    {
      id: '1',
      user_id: 'demo-user-123',
      name: 'CSS Inspector Pro',
      description: 'Advanced CSS debugging and analysis tools',
      icon_url: null,
      download_url: null,
      downloads_count: 15420,
      status: 'published' as const,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      user_id: 'demo-user-123',
      name: 'Layout Analyzer Beta',
      description: 'Visual layout debugging with flexbox and grid support',
      icon_url: null,
      download_url: null,
      downloads_count: 0,
      status: 'draft' as const,
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z',
    },
    {
      id: '3',
      user_id: 'demo-user-123',
      name: 'Style Conflict Detector',
      description: 'Automatically detect and resolve CSS conflicts',
      icon_url: null,
      download_url: null,
      downloads_count: 8750,
      status: 'published' as const,
      created_at: '2024-01-28T00:00:00Z',
      updated_at: '2024-01-28T00:00:00Z',
    },
  ];

  useEffect(() => {
    if (isDemoMode) {
      setExtensions(demoExtensions);
      setLoading(false);
    } else if (user) {
      fetchUserExtensions();
    }
  }, [user, isDemoMode]);

  const fetchUserExtensions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('extensions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching extensions:', error);
      } else {
        setExtensions(data || []);
      }
    } catch (error) {
      console.error('Error fetching extensions:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Extensions',
      value: extensions.length,
      icon: Package,
      color: 'text-blue-500',
    },
    {
      title: 'Total Downloads',
      value: extensions.reduce((sum, ext) => sum + ext.downloads_count, 0),
      icon: Download,
      color: 'text-green-500',
    },
    {
      title: 'Published',
      value: extensions.filter(ext => ext.status === 'published').length,
      icon: Eye,
      color: 'text-purple-500',
    },
    {
      title: 'This Month',
      value: '+23%',
      icon: TrendingUp,
      color: 'text-orange-500',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'draft':
        return <Badge variant="warning">Draft</Badge>;
      case 'unpublished':
        return <Badge variant="danger">Unpublished</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your CSS debugging tools and track their usage.
          </p>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Current Plan: {subscription.plan_name.charAt(0).toUpperCase() + subscription.plan_name.slice(1)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: {subscription.status}
                  </p>
                </div>
                {subscription.plan_name === 'free' && (
                  <Link to="/pricing">
                    <Button>Upgrade Plan</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col space-y-2">
                <Plus className="w-6 h-6" />
                <span>Create Extension</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col space-y-2">
                <Package className="w-6 h-6" />
                <span>Browse Templates</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col space-y-2">
                <TrendingUp className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Extensions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Extensions</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Extension
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {extensions.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No extensions yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by creating your first Chrome extension.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Extension
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {extensions.map((extension) => (
                  <div
                    key={extension.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {extension.name}
                        </h3>
                        {getStatusBadge(extension.status)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {extension.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{extension.downloads_count} downloads</span>
                        <span>Created {new Date(extension.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
