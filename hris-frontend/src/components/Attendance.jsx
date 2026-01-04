import React, { useState, useEffect, useRef } from 'react';
import api, { backendOrigin } from '../api';

export default function Attendance() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kamera
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoBlob, setPhotoBlob] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await api.get('/attendances/status');
      setStatus(res.data.attendance);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Gagal mengambil status');
    } finally {
      setLoading(false);
    }
  };

  // ====== Fungsionalitas Kamera ======
  const startCamera = async () => {
    setMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setPhotoBlob(null);
      }
    } catch {
      setMessage('Tidak bisa mengakses kamera. Beri izin kamera di browser.');
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      video.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          setPhotoBlob(blob);
          resolve(blob);
        } else {
          reject(new Error('Gagal mengambil foto'));
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const checkIn = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (!cameraActive) {
        await startCamera();
      }
      const blob = await capturePhoto();
      const form = new FormData();
      form.append('photo', blob, 'check-in.jpg');
      const res = await api.post('/attendances/check-in', form);
      setStatus(res.data.attendance);
      setMessage('Absen masuk berhasil');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Gagal absen masuk');
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (!cameraActive) {
        await startCamera();
      }
      const blob = await capturePhoto();
      const form = new FormData();
      form.append('photo', blob, 'check-out.jpg');
      const res = await api.post('/attendances/check-out', form);
      setStatus(res.data.attendance);
      setMessage('Absen keluar berhasil');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Gagal absen keluar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Absensi Kamera</h2>

        <div className="bg-white shadow rounded p-6">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={startCamera}
                disabled={!isLoggedIn || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Nyalakan Kamera
              </button>
              <button
                onClick={stopCamera}
                disabled={!cameraActive || loading}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Matikan Kamera
              </button>
              <button
                onClick={async () => { await capturePhoto(); }}
                disabled={!cameraActive || loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                Ambil Foto
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-700 mb-2">Pratinjau Kamera</div>
                <video ref={videoRef} className="w-full rounded bg-black" playsInline />
              </div>
              <div>
                <div className="text-sm text-gray-700 mb-2">Foto Terambil</div>
                {photoBlob ? (
                  <img src={URL.createObjectURL(photoBlob)} alt="Captured" className="w-full rounded border" />
                ) : (
                  <div className="w-full h-40 border rounded flex items-center justify-center text-gray-500">Belum ada foto</div>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={fetchStatus}
              disabled={!isLoggedIn || loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Cek Status
            </button>
            <button
              onClick={checkIn}
              disabled={!isLoggedIn || loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Absen Masuk (Foto)
            </button>
            <button
              onClick={checkOut}
              disabled={!isLoggedIn || loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Absen Keluar (Foto)
            </button>
          </div>

          {message && <div className="mb-4 text-sm text-indigo-700">{message}</div>}

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Status Hari Ini</h3>
            {status ? (
              <ul className="text-gray-700 space-y-1">
                <li><strong>Tanggal:</strong> {status.date}</li>
                <li><strong>Status:</strong> {status.status}</li>
                <li><strong>Masuk:</strong> {status.clock_in || '-'}</li>
                <li><strong>Keluar:</strong> {status.clock_out || '-'}</li>
                <li><strong>Foto Masuk:</strong> {status.check_in_photo_path ? (<a className="text-blue-600 underline" href={`${backendOrigin}/storage/${status.check_in_photo_path}`} target="_blank" rel="noreferrer">Lihat</a>) : ('-')}</li>
                <li><strong>Foto Keluar:</strong> {status.check_out_photo_path ? (<a className="text-blue-600 underline" href={`${backendOrigin}/storage/${status.check_out_photo_path}`} target="_blank" rel="noreferrer">Lihat</a>) : ('-')}</li>
              </ul>
            ) : (
              <p className="text-gray-600">Belum ada data untuk hari ini.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
