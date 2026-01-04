import React from 'react';
import { motion } from 'framer-motion';
const MotionDiv = motion.div;

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Menghubungkan <span className="text-blue-900">Talenta Terbaik</span> dengan Perusahaan Terkemuka
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Sebagai mitra outsourcing strategis, kami menjembatani kesenjangan antara tenaga kerja profesional 
              dan kebutuhan industri. Kami mengelola rekrutmen, pelatihan, dan administrasi SDM sehingga 
              Anda dapat fokus pada pertumbuhan bisnis inti Anda.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Kami menggabungkan jaringan talenta yang luas dengan proses manajemen SDM yang efisien untuk 
              memberikan solusi tenaga kerja yang fleksibel, produktif, dan patuh terhadap regulasi.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">10+</div>
                <div className="text-gray-600">Tahun Pengalaman</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">1000+</div>
                <div className="text-gray-600">Tenaga Kerja Aktif</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">50+</div>
                <div className="text-gray-600">Klien Perusahaan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900 mb-2">24/7</div>
                <div className="text-gray-600">Dukungan Layanan</div>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Legalitas Resmi
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Tenaga Terlatih
              </div>
              <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Sesuai Regulasi
              </div>
            </div>
          </MotionDiv>

          {/* Right Content - Image/Visual */}
          <MotionDiv
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Mengapa Bermitra dengan Kami?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Efisiensi Biaya</h4>
                      <p className="text-gray-600 text-sm">Kurangi biaya operasional rekrutmen dan administrasi SDM secara signifikan.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Fleksibilitas Tenaga Kerja</h4>
                      <p className="text-gray-600 text-sm">Sesuaikan jumlah tenaga kerja dengan kebutuhan bisnis Anda dengan cepat.</p>
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
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default About;
