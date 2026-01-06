import React from 'react';
import { listEmployees, generateContractLetter, generateWarningLetter } from '../api';

const HRDocuments = () => {
  const role = (localStorage.getItem('role') || '').toLowerCase();
  const isAllowed = role === 'hrd' || role === 'super_admin';

  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  // Contract form state
  const [contract, setContract] = React.useState({
    employee_id: '',
    start_date: '',
    end_date: '',
    position: '',
  });

  // Warning form state
  const [warning, setWarning] = React.useState({
    employee_id: '',
    level: 'SP1',
    date: '',
    description: '',
  });

  React.useEffect(() => {
    if (!isAllowed) return;
    (async () => {
      try {
        const { data } = await listEmployees();
        setEmployees(data?.data || data || []);
      } catch (e) {
        // ignore
      }
    })();
  }, [isAllowed]);

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleGenerateContract = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const { data } = await generateContractLetter(contract);
      downloadBlob(new Blob([data]), `kontrak_${contract.employee_id}.pdf`);
      setMessage('Surat kontrak berhasil dibuat.');
    } catch (err) {
      setMessage('Gagal membuat surat kontrak.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWarning = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const { data } = await generateWarningLetter(warning);
      downloadBlob(new Blob([data]), `surat_peringatan_${warning.employee_id}.pdf`);
      setMessage('Surat peringatan berhasil dibuat.');
    } catch (err) {
      setMessage('Gagal membuat surat peringatan.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAllowed) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
        <p className="text-gray-600">Halaman ini hanya untuk HRD atau Super Admin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dokumen HR</h1>
        <p className="text-gray-600">Pembuatan Surat Kontrak dan Surat Peringatan/Pelanggaran.</p>
      </div>

      {message && (
        <div className="rounded-md bg-blue-50 text-blue-700 px-4 py-3">{message}</div>
      )}

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Surat Kontrak Karyawan</h2>
        <form onSubmit={handleGenerateContract} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Karyawan</label>
            <select
              className="mt-1 block w-full border rounded-md px-3 py-2"
              value={contract.employee_id}
              onChange={(e) => setContract({ ...contract, employee_id: e.target.value })}
              required
            >
              <option value="">Pilih karyawan</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posisi/Jabatan</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md px-3 py-2"
              value={contract.position}
              onChange={(e) => setContract({ ...contract, position: e.target.value })}
              placeholder="Contoh: Staff Administrasi"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
            <input
              type="date"
              className="mt-1 block w-full border rounded-md px-3 py-2"
              value={contract.start_date}
              onChange={(e) => setContract({ ...contract, start_date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Berakhir</label>
            <input
              type="date"
              className="mt-1 block w-full border rounded-md px-3 py-2"
              value={contract.end_date}
              onChange={(e) => setContract({ ...contract, end_date: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Buat Surat Kontrak'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Surat Peringatan/Pelanggaran</h2>
        <form onSubmit={handleGenerateWarning} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Karyawan</label>
            <select
              className="mt-1 block w-full border rounded-md px-3 py-2"
              value={warning.employee_id}
              onChange={(e) => setWarning({ ...warning, employee_id: e.target.value })}
              required
            >
              <option value="">Pilih karyawan</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <select
              className="mt-1 block w-full border rounded-md px-3 py-2"
              value={warning.level}
              onChange={(e) => setWarning({ ...warning, level: e.target.value })}
            >
              <option>SP1</option>
              <option>SP2</option>
              <option>SP3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
            <input
              type="date"
              className="mt-1 block w-full border rounded-md px-3 py-2"
              value={warning.date}
              onChange={(e) => setWarning({ ...warning, date: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Deskripsi Pelanggaran</label>
            <textarea
              className="mt-1 block w-full border rounded-md px-3 py-2"
              rows={4}
              value={warning.description}
              onChange={(e) => setWarning({ ...warning, description: e.target.value })}
              placeholder="Jelaskan pelanggaran secara singkat"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Buat Surat Peringatan'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default HRDocuments;
