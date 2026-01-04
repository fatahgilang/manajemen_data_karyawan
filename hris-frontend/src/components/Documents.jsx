import React, { useEffect, useState } from 'react';
import {
  listDocuments,
  createDocument,
  addDocumentVersion,
  downloadDocumentVersionUrl,
  listDepartments,
  listEmployees,
} from '../api';

function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: '',
    category: 'policy',
    department_id: '',
    employee_id: '',
    effective_date: '',
    expiry_date: '',
    file: null,
    notes: '',
  });

  const fetchDocs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listDocuments();
      setDocs(res.data.data || []);
    } catch {
      setError('Gagal memuat dokumen');
    } finally {
      setLoading(false);
    }
  };

  const fetchMasters = async () => {
    try {
      const [depRes, empRes] = await Promise.all([
        listDepartments({ per_page: 100 }),
        listEmployees({ per_page: 100 }),
      ]);
      setDepartments(depRes.data.data || depRes.data || []);
      setEmployees(empRes.data.data || empRes.data || []);
    } catch {
      // Biarkan kosong jika gagal, pengguna tetap bisa input manual
    }
  };

  useEffect(() => {
    fetchDocs();
    fetchMasters();
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          fd.append(k, v);
        }
      });
      await createDocument(fd);
      setForm({ title: '', category: 'policy', department_id: '', employee_id: '', effective_date: '', expiry_date: '', file: null, notes: '' });
      await fetchDocs();
    } catch (e) {
      const msg = e?.response?.data?.message
        || (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join('; ') : '')
        || 'Gagal menyimpan dokumen';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onAddVersion = async (docId, file) => {
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      await addDocumentVersion(docId, fd);
      await fetchDocs();
    } catch (e) {
      const msg = e?.response?.data?.message
        || (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join('; ') : '')
        || 'Gagal menambah versi';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Dokumen HR</h1>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}

      <form onSubmit={onSubmit} className="bg-white shadow p-4 rounded mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Judul</label>
          <input name="title" value={form.title} onChange={onChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Kategori</label>
          <select name="category" value={form.category} onChange={onChange} className="w-full border rounded p-2">
            <option value="contract">Kontrak</option>
            <option value="warning">Surat Peringatan</option>
            <option value="policy">Kebijakan</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Departemen (opsional)</label>
          <select name="department_id" value={form.department_id} onChange={onChange} className="w-full border rounded p-2">
            <option value="">-- Pilih Departemen --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name || d.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Karyawan (opsional)</label>
          <select name="employee_id" value={form.employee_id} onChange={onChange} className="w-full border rounded p-2">
            <option value="">-- Pilih Karyawan --</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>{e.name ? `${e.name} (${e.id})` : e.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Tanggal Berlaku</label>
          <input type="date" name="effective_date" value={form.effective_date} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Tanggal Kedaluwarsa</label>
          <input type="date" name="expiry_date" value={form.expiry_date} onChange={onChange} className="w-full border rounded p-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">File</label>
          <input type="file" name="file" onChange={onChange} className="w-full border rounded p-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Catatan (opsional)</label>
          <textarea name="notes" value={form.notes} onChange={onChange} className="w-full border rounded p-2" rows={2} />
        </div>
        <div className="md:col-span-2">
          <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Simpan Dokumen</button>
        </div>
      </form>

      <div className="bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Judul</th>
              <th className="text-left p-2">Kategori</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Versi Terbaru</th>
              <th className="text-left p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.title}</td>
                <td className="p-2">{d.category}</td>
                <td className="p-2">{d.status}</td>
                <td className="p-2">{d.latest_version ? d.latest_version.version_number : (d.latestVersion?.version_number || '-')}</td>
                <td className="p-2 space-x-2">
                  {d.latestVersion && (
                    <a
                      className="text-blue-600"
                      href={downloadDocumentVersionUrl(d.id, d.latestVersion.id)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Unduh
                    </a>
                  )}
                  <label className="inline-flex items-center space-x-2">
                    <span className="text-gray-600">Tambah Versi</span>
                    <input type="file" onChange={(e) => e.target.files[0] && onAddVersion(d.id, e.target.files[0])} />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Documents;
