import { CheckCircle2, Users, TrendingUp, Shield, Zap, BarChart3, Bell, Award } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: CheckCircle2,
    title: "Easy Issue Reporting",
    description: "Report civic issues in seconds with our intuitive interface"
  },
  {
    icon: Users,
    title: "Geo-tagged Complaints",
    description: "Automatic location tagging for precise issue identification"
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    description: "Get instant notifications on your complaint status"
  },
  {
    icon: BarChart3,
    title: "Admin Dashboard",
    description: "Comprehensive analytics and management tools"
  },
  {
    icon: TrendingUp,
    title: "History & Tracking",
    description: "Complete timeline of all your reported issues"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and protected"
  }
];

const stats = [
  { number: "50K+", label: "Active Users" },
  { number: "95%", label: "Resolution Rate" },
  { number: "24/7", label: "Support Available" },
  { number: "4.8★", label: "User Rating" }
];

const Testimonial = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Empowering Communities
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskLoading
            </span>
            ?
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A powerful civic engagement platform that bridges the gap between citizens and local governments,
            making community management seamless and transparent.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white transform transition-transform duration-300 ${hoveredIndex === idx ? 'scale-110 rotate-6' : ''}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Get Started Free
              <Award className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-300">
              View Demo
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;