// import React from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { 
//   Ticket, 
//   Users, 
//   Clock, 
//   BarChart3, 
//   CheckCircle, 
//   ArrowRight, 
//   Star,
//   Zap,
//   Shield,
//   MessageSquare
// } from 'lucide-react';

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Navigation */}
//       <nav className="relative z-50 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//               <Ticket className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold text-white">Dash</span>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Link href="/login">
//               <Button variant="ghost" className="text-white hover:text-purple-300 hover:bg-white/10">
//                 Login
//               </Button>
//             </Link>
//             <Link href="/signup">
//               <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
//                 Sign Up
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative px-6 py-20 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"></div>
//         <div className="max-w-7xl mx-auto relative z-10">
//           <div className="text-center max-w-4xl mx-auto">
//             <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8">
//               <Zap className="w-4 h-4 mr-2" />
//               <span className="text-sm">Simplify your customer support dashboards</span>
//             </div>
//             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
//               Simplify Your
//               <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Support Dashboards</span>
//             </h1>
//             <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
//               Create beautiful, intuitive customer support dashboards that make managing tickets effortless and help your team deliver exceptional experiences.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-6 text-lg">
//                 Get Started Free
//                 <ArrowRight className="ml-2 w-5 h-5" />
//               </Button>
//               <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
//                 Watch Demo
//               </Button>
//             </div>
//           </div>
//         </div>
        
//         {/* Floating Cards Animation */}
//         <div className="absolute top-20 left-10 animate-pulse">
//           <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl backdrop-blur-sm border border-white/10"></div>
//         </div>
//         <div className="absolute top-40 right-20 animate-pulse delay-300">
//           <div className="w-12 h-12 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/10"></div>
//         </div>
//         <div className="absolute bottom-20 left-1/4 animate-pulse delay-700">
//           <div className="w-8 h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg backdrop-blur-sm border border-white/10"></div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="px-6 py-20 relative">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-white mb-4">
//               Everything you need for perfect dashboards
//             </h2>
//             <p className="text-gray-400 text-lg max-w-2xl mx-auto">
//               Powerful dashboard features designed to make customer support management simple, clear, and efficient
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: MessageSquare,
//                 title: "Unified Dashboard View",
//                 description: "See all your tickets, metrics, and team performance in one beautiful, customizable dashboard that updates in real-time."
//               },
//               {
//                 icon: Clock,
//                 title: "Quick Response Tools",
//                 description: "Access templated responses, ticket history, and customer context instantly from your streamlined dashboard interface."
//               },
//               {
//                 icon: BarChart3,
//                 title: "Visual Analytics",
//                 description: "Transform complex support data into clear, actionable insights with beautiful charts and interactive reports."
//               },
//               {
//                 icon: Users,
//                 title: "Team Overview",
//                 description: "Monitor team workload, availability, and performance at a glance with intuitive dashboard widgets."
//               },
//               {
//                 icon: Shield,
//                 title: "Secure & Reliable",
//                 description: "Enterprise-grade security with role-based access controls and reliable uptime for your critical support operations."
//               },
//               {
//                 icon: Star,
//                 title: "Customer Insights",
//                 description: "Track satisfaction scores and customer feedback directly in your dashboard to continuously improve service quality."
//               }
//             ].map((feature, index) => (
//               <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
//                 <CardContent className="p-8">
//                   <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
//                     <feature.icon className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
//                   <p className="text-gray-400 leading-relaxed">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="px-6 py-20 relative">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
//             <div className="grid md:grid-cols-4 gap-8 text-center">
//               {[
//                 { number: "50k+", label: "Active Users" },
//                 { number: "2M+", label: "Tickets Resolved" },
//                 { number: "99.9%", label: "Uptime" },
//                 { number: "4.9/5", label: "Customer Rating" }
//               ].map((stat, index) => (
//                 <div key={index}>
//                   <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
//                   <div className="text-gray-400">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="px-6 py-20 relative">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
//             Ready to simplify your support dashboards?
//           </h2>
//           <p className="text-xl text-gray-300 mb-10">
//             Join thousands of support teams already using Dash to create cleaner, more effective customer service workflows.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-10 py-6 text-lg">
//               Start Free Trial
//               <ArrowRight className="ml-2 w-5 h-5" />
//             </Button>
//             <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg">
//               Contact Sales
//             </Button>
//           </div>
//           <p className="text-sm text-gray-500 mt-4">
//             No credit card required • 14-day free trial • Cancel anytime
//           </p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="px-6 py-12 border-t border-white/10">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row items-center justify-between">
//             <div className="flex items-center space-x-2 mb-4 md:mb-0">
//               <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <Ticket className="w-4 h-4 text-white" />
//               </div>
//               <span className="text-lg font-bold text-white">TicketFlow</span>
//             </div>
//             <div className="text-gray-400 text-sm">
//               © 2025 TicketFlow. All rights reserved.
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Github,
  ArrowRight,
  MessageCircle,
  BarChart3,
  Users
} from 'lucide-react';

export default function MinimalLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
              <Image 
                src="/dash_logo.png" 
                alt="Dash Logo" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            <span className="text-xl font-semibold text-gray-900">Dash</span>
          </div>
          <div className="flex items-center space-x-3">
             <Link href="/login">
               <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Login
            </Button>
             </Link>
            <Link href="/signup">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Sign Up
              </Button>
            </Link>
            <Link href="https://github.com/Janindu-n/Dash">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </Link>
            <Link href="https://youtu.be/WXjbm-XvfJ4?si=j8NdSfc8-KKdpaVq">
              <Button className="bg-black text-white hover:bg-gray-800">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Simplify Customer Support
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Smart ticket management for small teams. Connect WhatsApp, Instagram, and Messenger customer complaints and insights in one dashboard.
          </p>
           <Link href="/signup">
             <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg">
               Get started and test the platform
               <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
           </Link>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What we do</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed">
                We minimize workloads for project managers in small teams who handle customer service alongside product development. 
                Our platform provides smart ticket assignment and direct access to WhatsApp, Facebook Messenger, and Instagram Business—no separate chat apps needed.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                Get smart insights on tickets with automatic grouping of similar issues, helping you identify and resolve common problems faster.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Unified Messaging</h3>
                <p className="text-gray-600">WhatsApp, Instagram, and Messenger in one dashboard</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Insights</h3>
                <p className="text-gray-600">Automatic grouping and analysis of similar issues and tickets</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Assignment</h3>
                <p className="text-gray-600">Intelligent ticket routing for small teams</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/dash_logo.png" 
                alt="Dash Logo" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
              <span className="text-lg font-semibold text-gray-900">Dash</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 Dash. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}