import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import { 
  Wrench, 
  Home as HomeIcon, 
  Zap, 
  Paintbrush, 
  Hammer, 
  Sparkles, 
  Shield, 
  Star, 
  Users, 
  Clock, 
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const services = [
    { icon: Wrench, name: 'Construction Materials', description: 'Building supplies and materials', color: 'bg-blue-500' },
    { icon: Zap, name: 'Office Equipment', description: 'Furniture and office supplies', color: 'bg-yellow-500' },
    { icon: Paintbrush, name: 'IT Services', description: 'Technology solutions', color: 'bg-green-500' },
    { icon: Hammer, name: 'Marketing Services', description: 'Advertising and promotion', color: 'bg-orange-500' },
    { icon: Sparkles, name: 'Logistics', description: 'Transportation and delivery', color: 'bg-purple-500' },
    { icon: HomeIcon, name: 'Professional Services', description: 'Consulting and expertise', color: 'bg-red-500' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Vendors',
      description: 'All vendors are background-checked and verified'
    },
    {
      icon: Clock,
      title: 'Quick Quotes',
      description: 'Get competitive quotes from vendors in hours'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: '5-star rated vendors with satisfaction guarantee'
    },
    {
      icon: Users,
      title: 'Trusted Platform',
      description: 'Join thousands of businesses using our platform'
    }
  ];

  const stats = [
    { number: '5,000+', label: 'Active Buyers' },
    { number: '1,200+', label: 'Verified Vendors' },
    { number: '25,000+', label: 'RFQs Posted' },
    { number: '4.8/5', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Souqote
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-yellow-100 max-w-3xl mx-auto">
              Dubai's premier RFQ platform connecting buyers with verified vendors. 
              Get competitive quotes, quality products, guaranteed satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(!user || user.user_type === 'buyer') ? (
                <>
                  <Button 
                    size="lg" 
                    className="!bg-white !text-yellow-600 hover:!bg-gray-100 text-lg px-8 py-4"
                    onClick={() => navigate('/vendors')}
                  >
                    Find Vendors
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="!border-white !text-yellow-600 hover:!bg-white hover:!text-yellow-600 text-lg px-8 py-4"
                    onClick={() => navigate('/post-rfq')}
                  >
                    Post RFQ
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              ) : user.user_type === 'vendor' ? (
                <>
                  <Button 
                    size="lg" 
                    className="!bg-white !text-yellow-600 hover:!bg-gray-100 text-lg px-8 py-4"
                    onClick={() => navigate('/rfqs')}
                  >
                    Browse RFQs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="!border-white !text-white hover:!bg-white hover:!text-yellow-600 text-lg px-8 py-4"
                    onClick={() => navigate('/my-rfqs')}
                  >
                    My Quotes
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="!bg-white !text-yellow-600 hover:!bg-gray-100 text-lg px-8 py-4"
                    onClick={() => navigate('/admin')}
                  >
                    Admin Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Only show for non-authenticated users */}
      {!user && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From construction materials to IT services, Souqote has verified vendors for every business need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-yellow-600 group-hover:text-white group-hover:border-yellow-600"
                    onClick={() => navigate(user?.user_type === 'vendor' ? '/rfqs' : '/vendors')}
                  >
                    {user?.user_type === 'vendor' ? 'Browse RFQs' : 'Find Vendors'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Only show for non-authenticated users */}
      {!user && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Us?
              </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make business procurement simple, reliable, and affordable
            </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-600 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-yellow-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
              Get competitive quotes for your business needs with Souqote in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Your RFQ</h3>
              <p className="text-yellow-100">
                Describe what you need and set your requirements
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Quotes</h3>
              <p className="text-yellow-100">
                Get competitive quotes from verified vendors
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose & Order</h3>
              <p className="text-yellow-100">
                Compare quotes, select the best vendor, and place your order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of businesses who trust Souqote with their procurement needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="!bg-yellow-600 hover:!bg-yellow-700 text-lg px-8 py-4"
              onClick={() => navigate('/post-rfq')}
            >
              Post Your First RFQ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="!border-white !text-white hover:!bg-white hover:!text-yellow-600 text-lg px-8 py-4"
              onClick={() => navigate(user?.user_type === 'vendor' ? '/rfqs' : '/vendors')}
            >
              {user?.user_type === 'vendor' ? 'Browse RFQs' : 'Find Vendors'}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;