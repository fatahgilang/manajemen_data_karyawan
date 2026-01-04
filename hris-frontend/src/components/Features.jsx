import React from 'react';
import { motion } from 'framer-motion';
const MotionDiv = motion.div;
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
      title: 'Penyediaan Tenaga Kerja',
      description: 'Rekrutmen dan penempatan tenaga kerja profesional siap kerja untuk berbagai posisi sesuai kebutuhan industri Anda.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Payroll Outsourcing',
      description: 'Manajemen penggajian yang akurat, perhitungan pajak, dan distribusi gaji karyawan yang tepat waktu.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: ClockIcon,
      title: 'Manajemen Kehadiran',
      description: 'Sistem pemantauan absensi real-time untuk memastikan disiplin dan produktivitas tenaga kerja di lapangan.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: DocumentTextIcon,
      title: 'Evaluasi Kinerja Berkala',
      description: 'Penilaian rutin terhadap kinerja tenaga kerja untuk menjamin kualitas layanan yang diberikan kepada klien.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Kepatuhan Hukum',
      description: 'Menjamin seluruh proses ketenagakerjaan sesuai dengan regulasi dan undang-undang yang berlaku di Indonesia.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Laporan & Analisis SDM',
      description: 'Penyediaan laporan komprehensif terkait performa tenaga kerja dan efisiensi operasional secara berkala.',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Layanan <span className="text-blue-900">Outsourcing Terintegrasi</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami menawarkan berbagai layanan outsourcing yang dirancang untuk meningkatkan efisiensi operasional 
            dan mengurangi beban administratif perusahaan Anda.
          </p>
        </MotionDiv>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <MotionDiv
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
            </MotionDiv>
          ))}
        </div>

        {/* Additional Benefits */}
        <MotionDiv
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
        </MotionDiv>
      </div>
    </section>
  );
};

export default Features;
