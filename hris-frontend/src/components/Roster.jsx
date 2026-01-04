import React, { useEffect, useState, useCallback } from 'react';
import { listEmployees, listShifts, listSchedules, generateRoster, requestShiftSwap, listShiftSwaps, approveShiftSwap, rejectShiftSwap } from '../api';

const Roster = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState(14);
  const [patternIds, setPatternIds] = useState('');
  const [rotation, setRotation] = useState('daily');
  const [message, setMessage] = useState('');
  const [range, setRange] = useState({ start: '', end: '' });
  const [schedules, setSchedules] = useState([]);
  const [swapForm, setSwapForm] = useState({ requester_employee_id: '', target_employee_id: '', date: '' });
  const [swaps, setSwaps] = useState([]);
  const [swapFilters, setSwapFilters] = useState({ status: '', start: '', end: '', employee_id: '' });
  const [presets, setPresets] = useState([]);
  const [presetName, setPresetName] = useState('');

  const loadSwaps = useCallback(async () => {
    const sw = await listShiftSwaps({
      status: swapFilters.status || undefined,
      start: swapFilters.start || undefined,
      end: swapFilters.end || undefined,
      employee_id: swapFilters.employee_id || undefined,
    });
    setSwaps(sw.data);
  }, [swapFilters.status, swapFilters.start, swapFilters.end, swapFilters.employee_id]);

  useEffect(() => {
    (async () => {
      const emps = await listEmployees();
      const sh = await listShifts();
      setEmployees(emps.data.data ? emps.data.data : emps.data);
      setShifts(sh.data);
      await loadSwaps();
      const saved = JSON.parse(localStorage.getItem('swapFilterPresets') || '[]');
      setPresets(saved);
    })();
  }, [loadSwaps]);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const toggleEmployee = (id) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const resetFilters = async () => {
    setSwapFilters({ status: '', start: '', end: '', employee_id: '' });
    await loadSwaps();
  };

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) {
      setMessage('Nama preset wajib diisi.');
      return;
    }
    const next = [...presets.filter(p => p.name !== name), { name, filters: swapFilters }];
    setPresets(next);
    localStorage.setItem('swapFilterPresets', JSON.stringify(next));
    setMessage('Preset disimpan.');
    setPresetName('');
  };

  const applyPreset = async (name) => {
    const p = presets.find(x => x.name === name);
    if (!p) return;
    setSwapFilters(p.filters);
    await loadSwaps();
    setMessage(`Preset "${name}" diterapkan.`);
  };

  const deletePreset = (name) => {
    const next = presets.filter(p => p.name !== name);
    setPresets(next);
    localStorage.setItem('swapFilterPresets', JSON.stringify(next));
    setMessage(`Preset "${name}" dihapus.`);
  };

  const onGenerate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const pattern = patternIds.split(',').map(v => parseInt(v.trim(), 10)).filter(Boolean);
      await generateRoster({ employee_ids: selectedEmployees, start_date: startDate, days: Number(days), pattern, rotation });
      setMessage('Roster berhasil digenerate.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal generate roster');
    }
  };

  const onLoadSchedules = async (e) => {
    e.preventDefault();
    const res = await listSchedules({ start: range.start, end: range.end });
    setSchedules(res.data);
  };

  const onRequestSwap = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await requestShiftSwap(swapForm);
      setMessage('Permintaan tukar shift dikirim.');
      await loadSwaps();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal mengirim permintaan tukar shift');
    }
  };

  const onApprove = async (id) => {
    setMessage('');
    try {
      await approveShiftSwap(id);
      setMessage('Permintaan tukar disetujui.');
      await loadSwaps();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal menyetujui permintaan tukar');
    }
  };

  const onReject = async (id) => {
    setMessage('');
    try {
      await rejectShiftSwap(id);
      setMessage('Permintaan tukar ditolak.');
      await loadSwaps();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal menolak permintaan tukar');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Roster Scheduling</h1>
      {message && <div className="mb-4 text-sm">{message}</div>}

      <form onSubmit={onGenerate} className="bg-white shadow rounded p-4 mb-8">
        <h2 className="font-semibold mb-3">Generate Roster</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Pilih Karyawan</label>
            <div className="border rounded p-2 max-h-48 overflow-y-auto">
              {employees.map(e => (
                <label key={e.id} className="block">
                  <input type="checkbox" checked={selectedEmployees.includes(e.id)} onChange={() => toggleEmployee(e.id)} /> {e.name || e.id}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Tanggal Mulai</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Jumlah Hari</label>
            <input type="number" value={days} onChange={e => setDays(e.target.value)} className="w-full border rounded p-2" min="1" max="180" />
          </div>
          <div>
            <label className="block text-sm mb-1">Pola Shift (ID dipisah koma)</label>
            <input type="text" value={patternIds} onChange={e => setPatternIds(e.target.value)} className="w-full border rounded p-2" placeholder={shifts.map(s => s.id).join(',')} />
          </div>
          <div>
            <label className="block text-sm mb-1">Rotasi</label>
            <select value={rotation} onChange={e => setRotation(e.target.value)} className="w-full border rounded p-2">
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-blue-900 text-white px-4 py-2 rounded">Generate</button>
        </div>
      </form>

      <form onSubmit={onLoadSchedules} className="bg-white shadow rounded p-4 mb-8">
        <h2 className="font-semibold mb-3">Lihat Jadwal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Mulai</label>
            <input type="date" value={range.start} onChange={e => setRange({ ...range, start: e.target.value })} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Selesai</label>
            <input type="date" value={range.end} onChange={e => setRange({ ...range, end: e.target.value })} className="w-full border rounded p-2" />
          </div>
          <div className="flex items-end">
            <button className="bg-gray-800 text-white px-4 py-2 rounded">Load</button>
          </div>
        </div>
        <div className="mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Tanggal</th>
                <th className="text-left p-2">Karyawan</th>
                <th className="text-left p-2">Shift</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(s => (
                <tr key={`${s.employee_id}-${s.date}`}>
                  <td className="p-2">{s.date}</td>
                  <td className="p-2">{s.employee?.name || s.employee_id}</td>
                  <td className="p-2">{s.shift?.name}</td>
                  <td className="p-2">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>

      <form onSubmit={onRequestSwap} className="bg-white shadow rounded p-4 mb-8">
        <h2 className="font-semibold mb-3">Penggantian Shift</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Pemohon</label>
            <select value={swapForm.requester_employee_id} onChange={e => setSwapForm({ ...swapForm, requester_employee_id: e.target.value })} className="w-full border rounded p-2">
              <option value="">-- Pilih --</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name || e.id}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Rekan Tukar</label>
            <select value={swapForm.target_employee_id} onChange={e => setSwapForm({ ...swapForm, target_employee_id: e.target.value })} className="w-full border rounded p-2">
              <option value="">-- Pilih --</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name || e.id}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Tanggal</label>
            <input type="date" value={swapForm.date} onChange={e => setSwapForm({ ...swapForm, date: e.target.value })} className="w-full border rounded p-2" />
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-blue-900 text-white px-4 py-2 rounded">Ajukan Tukar Shift</button>
        </div>
      </form>

      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-3">Daftar Permintaan Tukar Shift</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select value={swapFilters.status} onChange={e => setSwapFilters({ ...swapFilters, status: e.target.value })} className="w-full border rounded p-2">
              <option value="">Semua</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Mulai</label>
            <input type="date" value={swapFilters.start} onChange={e => setSwapFilters({ ...swapFilters, start: e.target.value })} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Selesai</label>
            <input type="date" value={swapFilters.end} onChange={e => setSwapFilters({ ...swapFilters, end: e.target.value })} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Karyawan</label>
            <select value={swapFilters.employee_id} onChange={e => setSwapFilters({ ...swapFilters, employee_id: e.target.value })} className="w-full border rounded p-2">
              <option value="">Semua</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name || e.id}</option>)}
            </select>
          </div>
          <div className="md:col-span-4 flex items-center gap-2">
            <button onClick={loadSwaps} className="bg-gray-800 text-white px-4 py-2 rounded">Filter</button>
            <button onClick={resetFilters} type="button" className="bg-gray-500 text-white px-4 py-2 rounded">Reset</button>
            <input value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="Nama preset" className="flex-1 border rounded p-2" />
            <button onClick={savePreset} type="button" className="bg-blue-900 text-white px-4 py-2 rounded">Simpan Preset</button>
          </div>
        </div>
        {presets.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Preset Tersimpan</div>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <div key={p.name} className="flex items-center gap-2 border rounded px-2 py-1">
                  <span className="text-sm">{p.name}</span>
                  <button onClick={() => applyPreset(p.name)} className="text-blue-700 hover:underline text-sm">Terapkan</button>
                  <button onClick={() => deletePreset(p.name)} className="text-red-700 hover:underline text-sm">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Tanggal</th>
                <th className="text-left p-2">Pemohon</th>
                <th className="text-left p-2">Rekan</th>
                <th className="text-left p-2">Dari</th>
                <th className="text-left p-2">Ke</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {swaps.map(sw => (
                <tr key={sw.id}>
                  <td className="p-2">{sw.date}</td>
                  <td className="p-2">{sw.requester?.name || sw.requester_employee_id}</td>
                  <td className="p-2">{sw.target?.name || sw.target_employee_id}</td>
                  <td className="p-2">{sw.original_shift?.name || sw.originalShift?.name || sw.original_shift_id}</td>
                  <td className="p-2">{sw.new_shift?.name || sw.newShift?.name || sw.new_shift_id}</td>
                  <td className="p-2 capitalize">{sw.status}</td>
                  <td className="p-2">
                    {sw.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => onApprove(sw.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                        <button onClick={() => onReject(sw.id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Roster;
