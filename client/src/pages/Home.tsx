import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
    { icon: Wrench, name: t('plumbing'), description: 'Expert plumbing solutions', color: 'bg-blue-500' },
    { icon: Zap, name: t('electrical'), description: 'Safe electrical work', color: 'bg-yellow-500' },
    { icon: Paintbrush, name: t('painting'), description: 'Professional painting', color: 'bg-green-500' },
    { icon: Hammer, name: t('carpentry'), description: 'Quality carpentry work', color: 'bg-orange-500' },
    { icon: Sparkles, name: t('cleaning'), description: 'Thorough cleaning', color: 'bg-purple-500' },
    { icon: HomeIcon, name: t('renovation'), description: 'Complete renovations', color: 'bg-red-500' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All handymen are background-checked and verified'
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Get matched with professionals in minutes'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: '5-star rated service with satisfaction guarantee'
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Join thousands of satisfied customers in Dubai'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Verified Professionals' },
    { number: '50,000+', label: 'Jobs Completed' },
    { number: '4.9/5', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Trusted Handymen in Dubai
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
              Connect with verified professionals for all your home maintenance and repair needs. 
              Quality work, fair prices, guaranteed satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(!user || user.user_type === 'customer') ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-white text-pink-600 hover:bg-gray-100 text-lg px-8 py-4"
                    onClick={() => navigate('/handymen')}
                  >
                    Find a Handyman
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-pink-600 text-lg px-8 py-4"
                    onClick={() => navigate('/post-job')}
                  >
                    Post a Job
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-white text-pink-600 hover:bg-gray-100 text-lg px-8 py-4"
                    onClick={() => navigate('/jobs')}
                  >
                    Browse Jobs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-pink-600 text-lg px-8 py-4"
                    onClick={() => navigate('/my-jobs')}
                  >
                    My Jobs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
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

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From plumbing to painting, we have skilled professionals for every home service need
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
                    className="w-full group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-600"
                    onClick={() => navigate(user?.user_type === 'technician' ? '/jobs' : '/handymen')}
                  >
                    {user?.user_type === 'technician' ? 'Browse Jobs' : 'Book Now'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make home maintenance simple, reliable, and affordable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-600 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-pink-600 group-hover:text-white transition-colors duration-300" />
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

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              Get your home maintenance done in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Describe Your Job</h3>
              <p className="text-pink-100">
                Tell us what you need done and when you need it
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-pink-100">
                We'll connect you with qualified professionals
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get It Done</h3>
              <p className="text-pink-100">
                Review quotes, choose your pro, and get it done
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
            Join thousands of satisfied customers who trust us with their home maintenance needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-pink-600 hover:bg-pink-700 text-lg px-8 py-4"
              onClick={() => navigate('/post-job')}
            >
              Post Your First Job
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-pink-600 text-lg px-8 py-4"
              onClick={() => navigate(user?.user_type === 'technician' ? '/jobs' : '/handymen')}
            >
              {user?.user_type === 'technician' ? 'Browse Jobs' : 'Browse Services'}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;