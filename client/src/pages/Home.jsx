import { Button } from "@/components/ui/button";
import React from "react";
import { Camera, MapPin, Users, CheckCircle, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  // Remove these comments in your actual implementation and use your Redux/Router hooks
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  
  // const isAuthenticated = false; // Replace with actual Redux selector

  const handleGetStarted = () => {
    // Replace with your actual navigation logic
    if (isAuthenticated) {
      navigate("/reportIssue");
    } else {
      navigate("/login");
    }
    console.log("Navigate to:", isAuthenticated ? "/reportIssue" : "/login");
  };

  const features = [
    {
      icon: Camera,
      title: "Snap & Report",
      description: "Capture issues instantly with your phone camera"
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Precise GPS mapping for accurate issue reporting"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands making a real difference"
    },
    {
      icon: CheckCircle,
      title: "Track Progress",
      description: "Monitor resolution status in real-time"
    }
  ];

  const stats = [
    { number: "10K+", label: "Issues Reported" },
    { number: "7.5K+", label: "Issues Resolved" },
    { number: "5K+", label: "Active Users" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Empowering Communities Since 2024</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">See, Click,</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Make a Difference
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              Welcome to{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                Taskloading
              </span>{" "}
              — where your voice creates change. Report civic issues like potholes,
              garbage, and broken infrastructure. Together, we build better communities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="group text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image Grid */}
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">

                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl p-8 text-white shadow-xl">
                  <Users className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Join the Movement</h3>
                  <p className="text-blue-100">
                    Be part of a growing community creating positive change
                  </p>
                </div>
              </div>
              <div className="space-y-6 ">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl p-8 text-white shadow-xl">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2  dark:text-white">
                    75% Resolved Issues
                  </h3>
                  <p className=" dark:text-gray-300">
                    High success rate in addressing community issues driven by Goverment of India.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Simple, fast, and effective civic reporting
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of citizens creating positive change in their communities
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
            onClick={handleGetStarted}
          >
            Start Reporting Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;