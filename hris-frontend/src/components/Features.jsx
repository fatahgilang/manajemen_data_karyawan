import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      icon: UserGroupIcon,
      title: 'Manajemen Karyawan',
      description: 'Manajemen siklus karyawan dari onboarding hingga offboarding dengan penyimpanan dan pengelolaan data terpusat.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Proses Penggajian',
      description: 'Perhitungan gaji otomatis, potongan pajak, dan dukungan multi-mata uang untuk perusahaan global.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: ClockIcon,
      title: 'Pelacakan Absensi',
      description: 'Pemantauan absensi real-time dengan pelacakan lokasi GPS, integrasi biometrik, dan manajemen cuti.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: DocumentTextIcon,
      title: 'Manajemen Kinerja',
      description: 'Penetapan tujuan, penilaian kinerja, dan umpan balik 360 derajat dengan laporan dan analitik otomatis.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Manajemen Kepatuhan',
      description: 'Tetap patuh pada hukum ketenagakerjaan lokal dan standar industri dengan pemeriksaan kepatuhan otomatis.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Analitik & Pelaporan',
      description: 'Dasbor analitik canggih dengan laporan yang dapat disesuaikan, KPI, dan wawasan prediktif untuk pengambilan keputusan strategis.',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Solusi <span className="text-blue-900">HR Komprehensif</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform HRIS perusahaan kami menyediakan manajemen sumber daya manusia end-to-end 
            dengan fitur kuat yang dirancang untuk organisasi modern.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-12 text-white"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Jaminan Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Dukungan Perusahaan</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">ISO 27001</div>
              <div className="text-blue-200">Keamanan Bersertifikat</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;