"use client";

import Link from "next/link";
// Removed next-intl import
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Target, 
  Eye, 
  TrendingUp, 
  DoorOpen, 
  Library, 
  Video, 
  FileText, 
  UserPlus, 
  User, 
  MapPin, 
  Star, 
  Smartphone,
  Sparkles,
  Award,
  Lightbulb,
  Zap,
  Heart
} from "lucide-react";

interface QuickLinksProps {
  className?: string;
  variant?: "default" | "compact" | "grid";
}

export function QuickLinks({ className = "", variant = "default" }: QuickLinksProps) {
  // Hardcoded locale
  const locale = 'en';

  const quickLinks = [
    {
      title: "Success Gap",
      description: "Discover the hidden potential you're missing",
      href: `/${locale}/success-gap`,
      icon: Target,
      color: "bg-red-500",
      badge: "Popular"
    },
    {
      title: "Change Paradox",
      description: "Understand why change feels impossible",
      href: `/${locale}/change-paradox`,
      icon: TrendingUp,
      color: "bg-blue-500",
      badge: "New"
    },
    {
      title: "Vision Void",
      description: "Fill the gap between dreams and reality",
      href: `/${locale}/vision-void`,
      icon: Eye,
      color: "bg-purple-500"
    },
    {
      title: "Leadership Lever",
      description: "Unlock your leadership potential",
      href: `/${locale}/leadership-lever`,
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Decision Door",
      description: "Make better life-changing decisions",
      href: `/${locale}/decision-door`,
      icon: DoorOpen,
      color: "bg-orange-500"
    },
    {
      title: "Content Library",
      description: "Access exclusive resources and tools",
      href: `/${locale}/content-library`,
      icon: Library,
      color: "bg-indigo-500"
    },
    {
      title: "Webinars",
      description: "Join live training sessions",
      href: `/${locale}/webinars`,
      icon: Video,
      color: "bg-pink-500"
    },
    {
      title: "Resources",
      description: "Download guides and templates",
      href: `/${locale}/resources`,
      icon: FileText,
      color: "bg-teal-500"
    },
    {
      title: "Join Free",
      description: "Start your transformation journey",
      href: "/membership/register",
      icon: UserPlus,
      color: "bg-emerald-500",
      badge: "Free"
    },
    {
      title: "Member Dashboard",
      description: "Access your personalized dashboard",
      href: "/membership/dashboard",
      icon: User,
      color: "bg-cyan-500"
    },
    {
      title: "Book Office Visit",
      description: "Schedule in-person consultation",
      href: "/office-visit",
      icon: MapPin,
      color: "bg-yellow-500"
    },
    {
      title: "Success Stories",
      description: "Read inspiring transformation stories",
      href: `/${locale}/success-stories`,
      icon: Star,
      color: "bg-amber-500"
    },
    {
      title: "Mobile App",
      description: "Download our mobile application",
      href: "/mobile-app",
      icon: Smartphone,
      color: "bg-violet-500",
      badge: "New"
    }
  ];

  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 ${className}`}>
        {quickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer group">
              <div className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${link.color} text-white`}>
                <link.icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 group-hover:text-blue-600">
                {link.title}
              </h3>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {quickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.color} text-white`}>
                  <link.icon className="w-6 h-6" />
                </div>
                {link.badge && (
                  <Badge 
                    variant={link.badge === "Free" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {link.badge}
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {link.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  // Default variant - organized sections
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Main Navigation */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
          Quick Navigation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.slice(0, 6).map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group border hover:border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color} text-white`}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {link.title}
                      </h3>
                      {link.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {link.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Resources & Tools */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Library className="w-5 h-5 mr-2 text-green-600" />
          Resources & Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.slice(6, 9).map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group border hover:border-green-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color} text-white`}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
                        {link.title}
                      </h3>
                      {link.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {link.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Membership & Services */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-purple-600" />
          Membership & Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.slice(9).map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group border hover:border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color} text-white`}>
                    <link.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
                        {link.title}
                      </h3>
                      {link.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {link.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="text-center">
          <Award className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ready to Transform Your Life?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of people who have already discovered their hidden potential and achieved remarkable transformations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership/register">
              <Button size="lg" className="w-full sm:w-auto">
                <UserPlus className="w-5 h-5 mr-2" />
                Join Free Now
              </Button>
            </Link>
            <Link href="/office-visit">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <MapPin className="w-5 h-5 mr-2" />
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 