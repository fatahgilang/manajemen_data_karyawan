import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Empowering <span className="text-blue-900">Modern Enterprises</span> with HR Excellence
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Our HRIS platform transforms how organizations manage their most valuable asset - their people. 
              With over a decade of experience in enterprise HR solutions, we understand the complex challenges 
              modern businesses face in talent management.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We combine cutting-edge technology with deep HR expertise to deliver solutions that not only 
              streamline operations but also drive strategic business outcomes and enhance employee experience.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">10+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">500+</div>
                <div className="text-gray-600">Enterprise Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">99.9%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ISO 27001 Certified
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                SOC 2 Type II
              </div>
              <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                GDPR Compliant
              </div>
            </div>
          </motion.div>

          {/* Right Content - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-xl p-8">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-900 rounded-full opacity-10"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-slate-900 rounded-full opacity-5"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our HRIS?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Enterprise-Grade Security</h4>
                      <p className="text-gray-600 text-sm">Military-grade encryption and compliance with international security standards.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Scalable Architecture</h4>
                      <p className="text-gray-600 text-sm">Built to grow with your organization, from 100 to 10,000+ employees.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Intuitive User Experience</h4>
                      <p className="text-gray-600 text-sm">Designed for ease of use with minimal training required for your teams.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Seamless Integration</h4>
                      <p className="text-gray-600 text-sm">Connect with your existing systems through robust APIs and connectors.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;