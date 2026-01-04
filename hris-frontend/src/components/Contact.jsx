import React, { useState } from 'react';
import { motion } from 'framer-motion';
const MotionH2 = motion.h2;
const MotionP = motion.p;
const MotionDiv = motion.div;
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9:00 AM - 6:00 PM EST'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      value: 'ccc@outsourcingpro.com',
      description: 'Support and general inquiries'
    },
    {
      icon: MapPinIcon,
      title: 'Office',
      value: '123 Business Ave, Suite 100',
      description: 'New York, NY 10001'
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Support',
      value: 'help@ccc.com',
      description: '24/7 technical support'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <MotionH2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Siap Memenuhi <span className="text-blue-900">Kebutuhan Tenaga Kerja Anda?</span>
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Hubungi tim kami untuk mendiskusikan kebutuhan outsourcing atau karir Anda. Kami siap memberikan solusi terbaik.
          </MotionP>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Hubungi Kami</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Budi Setiawan"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Perusahaan
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Perusahaan Anda"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="ccc@gmail.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Ceritakan kebutuhan HR Anda..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Kirim Pesan
              </button>
            </form>
          </MotionDiv>

          {/* Contact Information */}
          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Informasi Kontak</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-blue-100">{item.value}</div>
                      <div className="text-sm text-blue-200">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Section */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Kepercayaan Perusahaan</h4>
              <p className="text-gray-600 mb-6">
                Kami dipercaya oleh perusahaan terkemuka di seluruh dunia untuk solusi manajemen HR yang aman dan andal.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-blue-900">99.9%</div>
                  <div className="text-sm text-gray-600">Waktu Aktif</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-blue-900">24/7</div>
                  <div className="text-sm text-gray-600">Dukungan</div>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Contact;
