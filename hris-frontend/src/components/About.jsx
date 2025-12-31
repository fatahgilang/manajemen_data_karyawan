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
              Memberdayakan <span className="text-blue-900">Perusahaan Modern</span> dengan Keunggulan HR
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Platform HRIS kami mengubah cara organisasi mengelola aset paling berharga mereka — manusia. 
              Dengan pengalaman lebih dari satu dekade dalam solusi HR tingkat perusahaan, kami memahami tantangan kompleks 
              yang dihadapi bisnis modern dalam manajemen talenta.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Kami menggabungkan teknologi mutakhir dengan keahlian HR mendalam untuk menghadirkan solusi yang tidak hanya 
              menyederhanakan operasi tetapi juga mendorong hasil bisnis strategis dan meningkatkan pengalaman karyawan.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">10+</div>
                <div className="text-gray-600">Tahun Pengalaman</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">500+</div>
                <div className="text-gray-600">Klien Perusahaan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">99.9%</div>
                <div className="text-gray-600">Kepuasan Pelanggan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">24/7</div>
                <div className="text-gray-600">Dukungan Tersedia</div>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ISO 27001 Tersertifikasi
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                SOC 2 Tipe II
              </div>
              <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                GDPR Patuh
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Mengapa Memilih HRIS Kami?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Keamanan Kelas Perusahaan</h4>
                      <p className="text-gray-600 text-sm">Enkripsi tingkat militer dan kepatuhan terhadap standar keamanan internasional.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Arsitektur Skalabel</h4>
                      <p className="text-gray-600 text-sm">Dibangun untuk tumbuh bersama organisasi Anda, dari 100 hingga 10.000+ karyawan.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Pengalaman Pengguna Intuitif</h4>
                      <p className="text-gray-600 text-sm">Dirancang agar mudah digunakan dengan pelatihan minimal untuk tim Anda.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Integrasi Mulus</h4>
                      <p className="text-gray-600 text-sm">Terhubung dengan sistem yang ada melalui API dan konektor yang andal.</p>
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