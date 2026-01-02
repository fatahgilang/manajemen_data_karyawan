import React, { useEffect, useState } from 'react';
import {
  listApprovalRules,
  upsertApprovalRule,
  listApprovalRequests,
  createApprovalRequest,
  approveRequest,
  rejectRequest,
  listDepartments,
  listEmployees,
} from '../api';

function Approvals() {
  const [rules, setRules] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [ruleSteps, setRuleSteps] = useState([
    { approver_type: 'role', approver_role: 'manager' },
    { approver_type: 'role', approver_role: 'hr' },
  ]);
  const [isHrOrAdmin, setIsHrOrAdmin] = useState(false);
  const [showAdvancedJSON, setShowAdvancedJSON] = useState(false);

  const [ruleForm, setRuleForm] = useState({ department_id: '', type: 'cuti' });
  const [reqForm, setReqForm] = useState({ type: 'cuti', requester_employee_id: '', department_id: '', start_date: '', end_date: '', date: '', reason: '' });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [r1, r2] = await Promise.all([
        listApprovalRules(),
        listApprovalRequests(),
      ]);
      setRules(r1.data.data || []);
      setRequests(r2.data.data || []);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Gagal memuat data approvals';
      setError(msg);
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
      const deps = depRes.data.data || depRes.data || [];
      const emps = empRes.data.data || empRes.data || [];
      setDepartments(deps);
      setEmployees(emps);
      const currentId = localStorage.getItem('employee_id');
      if (currentId) {
        const me = emps.find((x) => String(x.id) === String(currentId));
        const depName = me?.department?.name?.toLowerCase() || '';
        const posName = me?.position?.name?.toLowerCase() || '';
        setIsHrOrAdmin(depName.includes('hr') || posName.includes('hr'));
      } else {
        setIsHrOrAdmin(false);
      }
    } catch (_) {
      setIsHrOrAdmin(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMasters();
  }, []);

  // Inisialisasi builder langkah dari JSON awal atau default
  useEffect(() => {
    try {
      const parsed = JSON.parse(ruleForm.steps_json_text || '[]');
      setRuleSteps(Array.isArray(parsed) ? parsed : []);
    } catch (_) {
      setRuleSteps([{ approver_type: 'role', approver_role: 'manager' }]);
    }
  }, []);

  // Sinkronisasi builder ke teks JSON agar backend tetap menerima format lama
  useEffect(() => {
    setRuleForm((f) => ({ ...f, steps_json_text: JSON.stringify(ruleSteps) }));
  }, [ruleSteps]);

  const applyTemplate = (type) => {
    const templates = {
      cuti: [
        { approver_type: 'role', approver_role: 'manager' },
        { approver_type: 'role', approver_role: 'hr' },
      ],
      sakit: [
        { approver_type: 'role', approver_role: 'manager' },
        { approver_type: 'role', approver_role: 'hr' },
      ],
      keperluan: [
        { approver_type: 'role', approver_role: 'manager' },
        { approver_type: 'role', approver_role: 'hr' },
      ],
    };
    const steps = templates[type] || templates.cuti;
    setRuleSteps(steps);
  };

  const onRuleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await upsertApprovalRule({ department_id: ruleForm.department_id, type: ruleForm.type, steps_json: ruleSteps });
      await fetchData();
    } catch (e) {
      const msg = e?.response?.data?.message
        || (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join('; ') : '')
        || 'Gagal menyimpan aturan';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let payload = {};
      if (reqForm.type === 'cuti') {
        const { start_date, end_date, reason } = reqForm;
        if (!start_date || !end_date) throw new Error('Tanggal cuti wajib diisi');
        const start = new Date(start_date);
        const end = new Date(end_date);
        const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
        payload = { start_date, end_date, reason: reason || '', days: diffDays };
      } else if (reqForm.type === 'sakit') {
        const { start_date, end_date, reason } = reqForm;
        if (!start_date) throw new Error('Tanggal sakit wajib diisi');
        payload = { start_date, end_date: end_date || start_date, reason: reason || '' };
      } else if (reqForm.type === 'keperluan') {
        const { date, reason } = reqForm;
        if (!date) throw new Error('Tanggal keperluan wajib diisi');
        payload = { date, reason: reason || '' };
      }
      await createApprovalRequest({ type: reqForm.type, requester_employee_id: reqForm.requester_employee_id, department_id: reqForm.department_id, payload });
      await fetchData();
    } catch (e) {
      const msg = e?.response?.data?.message
        || (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat().join('; ') : '')
        || (e?.message || 'Gagal membuat pengajuan');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (id) => {
    setLoading(true);
    setError('');
    try {
      await approveRequest(id);
      await fetchData();
    } catch (e) {
      setError('Gagal approve');
    } finally {
      setLoading(false);
    }
  };

  const onReject = async (id) => {
    setLoading(true);
    setError('');
    try {
      await rejectRequest(id);
      await fetchData();
    } catch (e) {
      setError('Gagal reject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Workflow Persetujuan</h1>
      {error && <div className="bg-red-100 text-red-700 p-2">{error}</div>}

      {isHrOrAdmin && (
        <section className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-medium mb-2">Aturan Persetujuan Per Departemen</h2>
          <form onSubmit={onRuleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Departemen</label>
              <select className="w-full border rounded p-2" value={ruleForm.department_id} onChange={(e) => setRuleForm((f) => ({ ...f, department_id: e.target.value }))}>
                <option value="">-- Pilih Departemen --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name || d.id}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Gunakan dropdown agar ID valid dan tidak memicu 422.</p>
            </div>
            <div>
              <label className="block text-sm mb-1">Tipe</label>
              <select className="w-full border rounded p-2" value={ruleForm.type} onChange={(e) => setRuleForm((f) => ({ ...f, type: e.target.value }))}>
                <option value="cuti">Cuti</option>
                <option value="sakit">Sakit</option>
                <option value="keperluan">Keperluan</option>
              </select>
            </div>
            <div className="md:col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Template langkah cepat:</span>
                <button type="button" className="px-3 py-1 bg-gray-100 rounded" onClick={() => applyTemplate('cuti')}>Cuti</button>
                <button type="button" className="px-3 py-1 bg-gray-100 rounded" onClick={() => applyTemplate('sakit')}>Sakit</button>
                <button type="button" className="px-3 py-1 bg-gray-100 rounded" onClick={() => applyTemplate('keperluan')}>Keperluan</button>
              </div>

              <label className="block text-sm mb-1">Langkah Persetujuan</label>
              <div className="space-y-2">
                {ruleSteps.map((s, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <select className="border rounded p-2" value={s.approver_type} onChange={(e) => {
                      const val = e.target.value;
                      setRuleSteps((arr) => arr.map((x, idx) => idx === i ? { approver_type: val, approver_role: val === 'role' ? (x.approver_role || 'manager') : undefined, approver_employee_id: val === 'employee' ? (x.approver_employee_id || '') : undefined } : x));
                    }}>
                      <option value="role">Peran</option>
                      <option value="employee">Karyawan</option>
                    </select>
                    {s.approver_type === 'role' ? (
                      <select className="border rounded p-2" value={s.approver_role || 'manager'} onChange={(e) => {
                        const val = e.target.value;
                        setRuleSteps((arr) => arr.map((x, idx) => idx === i ? { ...x, approver_role: val, approver_employee_id: undefined } : x));
                      }}>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="finance">Finance</option>
                      </select>
                    ) : (
                      <select className="border rounded p-2" value={s.approver_employee_id || ''} onChange={(e) => {
                        const val = e.target.value;
                        setRuleSteps((arr) => arr.map((x, idx) => idx === i ? { ...x, approver_employee_id: val, approver_role: undefined } : x));
                      }}>
                        <option value="">-- Pilih Karyawan --</option>
                        {employees.map((e) => (
                          <option key={e.id} value={e.id}>{e.name ? `${e.name} (${e.id})` : e.id}</option>
                        ))}
                      </select>
                    )}
                    <button type="button" className="px-3 py-1 bg-red-100 text-red-700 rounded" onClick={() => setRuleSteps((arr) => arr.filter((_, idx) => idx !== i))}>Hapus</button>
                  </div>
                ))}
                <button type="button" className="px-3 py-1 bg-gray-100 rounded" onClick={() => setRuleSteps((arr) => [...arr, { approver_type: 'role', approver_role: 'manager' }])}>Tambah Langkah</button>
              </div>

              <p className="text-xs text-gray-500">Langkah disusun dari atas ke bawah. Setiap langkah harus disetujui sebelum lanjut.</p>
            </div>
            <div className="md:col-span-3">
              <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Simpan Aturan</button>
            </div>
          </form>

          <div className="mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2">Departemen</th>
                  <th className="text-left p-2">Tipe</th>
                  <th className="text-left p-2">Langkah</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.department?.name || r.department_id}</td>
                    <td className="p-2">{r.type}</td>
                    <td className="p-2"><pre className="whitespace-pre-wrap">{JSON.stringify(r.steps_json, null, 2)}</pre></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-medium mb-2">Pengajuan</h2>
        <form onSubmit={onRequestSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Tipe</label>
            <select className="w-full border rounded p-2" value={reqForm.type} onChange={(e) => setReqForm((f) => ({ ...f, type: e.target.value }))}>
-              <option value="leave">Cuti</option>
-              <option value="overtime">Lembur</option>
-              <option value="reimburse">Reimburse</option>
+              <option value="cuti">Cuti</option>
+              <option value="sakit">Sakit</option>
+              <option value="keperluan">Keperluan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Pemohon</label>
            <select className="w-full border rounded p-2" value={reqForm.requester_employee_id} onChange={(e) => {
              const val = e.target.value;
              const emp = employees.find((x) => String(x.id) === String(val));
              const depId = emp?.department_id ?? emp?.department?.id ?? '';
              setReqForm((f) => ({ ...f, requester_employee_id: val, department_id: depId }));
            }}>
              <option value="">-- Pilih Karyawan --</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name ? `${e.name} (${e.id})` : e.id}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">ID karyawan mengikuti NIK (string).</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Departemen</label>
            <select className="w-full border rounded p-2" value={reqForm.department_id} onChange={(e) => setReqForm((f) => ({ ...f, department_id: e.target.value }))}>
              <option value="">-- Pilih Departemen --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name || d.id}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Otomatis terisi saat memilih karyawan, bisa diubah manual jika perlu.</p>
          </div>
          <div className="md:col-span-3">
            {reqForm.type === 'cuti' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Tanggal Mulai</label>
                  <input type="date" className="w-full border rounded p-2" value={reqForm.start_date} onChange={(e) => setReqForm((f) => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Tanggal Selesai</label>
                  <input type="date" className="w-full border rounded p-2" value={reqForm.end_date} onChange={(e) => setReqForm((f) => ({ ...f, end_date: e.target.value }))} />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm mb-1">Alasan</label>
                  <input type="text" className="w-full border rounded p-2" value={reqForm.reason} onChange={(e) => setReqForm((f) => ({ ...f, reason: e.target.value }))} />
                </div>
              </div>
            )}
            {reqForm.type === 'sakit' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Tanggal</label>
                  <input type="date" className="w-full border rounded p-2" value={reqForm.start_date} onChange={(e) => setReqForm((f) => ({ ...f, start_date: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Sampai (opsional)</label>
                  <input type="date" className="w-full border rounded p-2" value={reqForm.end_date} onChange={(e) => setReqForm((f) => ({ ...f, end_date: e.target.value }))} />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm mb-1">Alasan</label>
                  <input type="text" className="w-full border rounded p-2" value={reqForm.reason} onChange={(e) => setReqForm((f) => ({ ...f, reason: e.target.value }))} />
                </div>
              </div>
            )}
            {reqForm.type === 'keperluan' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Tanggal</label>
                  <input type="date" className="w-full border rounded p-2" value={reqForm.date} onChange={(e) => setReqForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Alasan</label>
                  <input type="text" className="w-full border rounded p-2" value={reqForm.reason} onChange={(e) => setReqForm((f) => ({ ...f, reason: e.target.value }))} />
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-3">
            <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Buat Pengajuan</button>
          </div>
        </form>

        {isHrOrAdmin && (
          <div className="mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Tipe</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Langkah</th>
                  <th className="text-left p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((rq) => (
                  <tr key={rq.id} className="border-t">
                    <td className="p-2">{rq.id}</td>
                    <td className="p-2">{rq.type}</td>
                    <td className="p-2">
                      <span className={
                        rq.status === 'approved' ? 'bg-green-100 text-green-700 px-2 py-1 rounded' :
                        rq.status === 'rejected' ? 'bg-red-100 text-red-700 px-2 py-1 rounded' :
                        'bg-yellow-100 text-yellow-700 px-2 py-1 rounded'
                      }>
                        {rq.status === 'approved' ? 'Disetujui' : rq.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="p-2"><pre className="whitespace-pre-wrap">{JSON.stringify(rq.steps, null, 2)}</pre></td>
                    <td className="p-2 space-x-2">
                      <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={() => onApprove(rq.id)} disabled={loading}>Approve</button>
                      <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => onReject(rq.id)} disabled={loading}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Approvals;