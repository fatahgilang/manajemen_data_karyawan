import React from 'react';
import { motion } from 'framer-motion';
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <MotionH1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Mitra <span className="text-blue-900">Outsourcing Terpercaya</span> untuk Pertumbuhan Bisnis
            </MotionH1>
            
            <MotionP
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Kami menyediakan solusi tenaga kerja berkualitas tinggi, rekrutmen profesional, dan manajemen SDM yang efisien. 
              Fokus pada bisnis inti Anda, biarkan kami mengelola kebutuhan tenaga kerja Anda.
            </MotionP>

            <MotionDiv
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link
                to="/job-postings"
                className="px-8 py-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all duration-300 font-semibold text-lg flex items-center justify-center group shadow-lg hover:shadow-xl"
              >
                Cari Lowongan
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/attendance-login"
                className="px-8 py-4 border-2 border-blue-900 text-blue-900 rounded-xl hover:bg-blue-900 hover:text-white transition-all duration-300 font-semibold text-lg"
              >
                Login Karyawan
              </Link>
            </MotionDiv>

            {/* Trust indicators */}
            <MotionDiv
              className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">1000+</div>
                <div className="text-sm text-gray-600">Tenaga Kerja</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">50+</div>
                <div className="text-sm text-gray-600">Mitra Perusahaan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">24/7</div>
                <div className="text-sm text-gray-600">Layanan</div>
              </div>
            </MotionDiv>
          </MotionDiv>

          {/* Right Content - Visual */}
          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-900 rounded-full opacity-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-slate-900 rounded-full opacity-5"></div>
              
              <div className="relative z-10">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">Dasbor HR</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-900 font-bold">E</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Manajemen Karyawan</div>
                          <div className="text-sm text-gray-500">1.248 karyawan</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Aktif</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-900 font-bold">P</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Proses Penggajian</div>
                          <div className="text-sm text-gray-500">Siklus bulanan</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Selesai</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-900 font-bold">A</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Pelacakan Absensi</div>
                          <div className="text-sm text-gray-500">Real-time</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-yellow-600">Dalam Proses</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Dipercaya oleh pemimpin industri</div>
                  <div className="flex items-center justify-center space-x-8 opacity-60">
                    <div className="text-lg font-bold text-gray-800">Enterprise</div>
                    <div className="text-lg font-bold text-gray-800">Corp</div>
                    <div className="text-lg font-bold text-gray-800">Global</div>
                  </div>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Hero;
