import React, { useEffect, useState } from 'react';
import api from '../api';

const JobPostings = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyModal, setApplyModal] = useState({ open: false, posting: null });
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '', resume_path: '', address: '', skills: '', education: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const res = await api.get('/job-postings');
        setPostings(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPostings();
  }, []);

  const openApply = (posting) => {
    setApplyModal({ open: true, posting });
    setForm({ full_name: '', email: '', phone_number: '', resume_path: '', address: '', skills: '', education: '' });
    setPhotoFile(null);
    setResumeFile(null);
    setSubmitMsg(null);
  };

  const closeApply = () => {
    setApplyModal({ open: false, posting: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!applyModal.posting) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const fd = new FormData();
      fd.append('job_posting_id', applyModal.posting.id);
      fd.append('full_name', form.full_name);
      fd.append('email', form.email);
      if (form.phone_number) fd.append('phone_number', form.phone_number);
      if (form.resume_path) fd.append('resume_path', form.resume_path);
      if (resumeFile) fd.append('resume', resumeFile);
      if (photoFile) fd.append('photo', photoFile);
      if (form.address) fd.append('address', form.address);
      if (form.skills) fd.append('skills', form.skills);
      if (form.education) fd.append('education', form.education);

      await api.post('/applicants', fd);
      setSubmitMsg('Lamaran berhasil dikirim. Terima kasih!');
      setSubmitting(false);
      setForm({ full_name: '', email: '', phone_number: '', resume_path: '', address: '', skills: '', education: '' });
      setPhotoFile(null);
      setResumeFile(null);
    } catch (err) {
      setSubmitMsg('Gagal mengirim lamaran: ' + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Memuat lowongan...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Peluang Karir</h2>
        <p className="text-gray-600">Temukan peluang karir terbaik di berbagai perusahaan mitra kami.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postings.map((p) => (
          <div key={p.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{p.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{p.status === 'Open' ? 'Terbuka' : 'Tutup'}</span>
            </div>
            <p className="text-gray-600 mb-3 line-clamp-3">{p.description}</p>
            <div className="text-sm text-gray-500 mb-4">Diposting: {new Date(p.created_at).toLocaleDateString()}</div>
            <button
              disabled={p.status !== 'Open'}
              onClick={() => openApply(p)}
              className={`w-full px-4 py-2 rounded-lg font-semibold ${p.status === 'Open' ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              Lamar
            </button>
          </div>
        ))}
      </div>

      {applyModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h4 className="text-lg font-bold">Lamar: {applyModal.posting?.title}</h4>
              <button onClick={closeApply} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form id="applyForm" onSubmit={submitApplication} className="space-y-4 px-6 py-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="Budi Setiawan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="budi@perusahaan.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
                <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="081234567890" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea name="address" value={form.address} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="Alamat lengkap" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keahlian</label>
                <textarea name="skills" value={form.skills} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="Misal: JavaScript, React, Laravel" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lulusan</label>
                <input type="text" name="education" value={form.education} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="Misal: S1 Teknik Informatika" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                <input type="file" name="photo" accept="image/*" onChange={handlePhotoChange} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (opsional)</label>
                <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Resume (opsional)</label>
                <input type="text" name="resume_path" value={form.resume_path} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="https://drive.google.com/..." />
              </div>

              {submitMsg && (
                <div className={"text-sm " + (submitMsg.startsWith('Gagal') ? 'text-red-600' : 'text-green-600')}>
                  {submitMsg}
                </div>
              )}
            </form>
            <div className="px-6 py-4 border-t bg-white">
              <button type="submit" form="applyForm" disabled={submitting} className="w-full bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-blue-800 disabled:opacity-60">
                {submitting ? 'Mengirim...' : 'Kirim Lamaran'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostings;