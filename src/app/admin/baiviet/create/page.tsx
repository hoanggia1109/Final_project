'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DanhMuc {
  id: string;
  tendanhmuc: string;
}

interface User {
  id: string;
  ho_ten: string;
}

export default function CreateBaiVietPage() {
  const router = useRouter();

  const [tieude, setTieude] = useState('');
  const [noidung, setNoidung] = useState('');
  const [anhien, setAnhien] = useState(1);
  const [selectedDanhMuc, setSelectedDanhMuc] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [hinhAnhFile, setHinhAnhFile] = useState<File | null>(null);

  const [danhmucs, setDanhmucs] = useState<DanhMuc[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch danh mục
  useEffect(() => {
    fetch('http://localhost:5000/api/baiviet/danhmuc/all')
      .then(res => res.json())
      .then(data => setDanhmucs(data))
      .catch(err => console.error('Lỗi lấy danh mục:', err));
  }, []);

  // Fetch user
  useEffect(() => {
    fetch('http://localhost:5000/api/baiviet/users/all')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Lỗi lấy users:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieude || !noidung || !selectedDanhMuc || !selectedUser) {
      alert('Vui lòng nhập đủ thông tin!');
      return;
    }

    const formData = new FormData();
    formData.append('tieude', tieude);
    formData.append('noidung', noidung);
    formData.append('anhien', String(anhien));
    formData.append('danhmuc_baiviet_id', selectedDanhMuc);
    formData.append('user_id', selectedUser);
    if (hinhAnhFile) formData.append('hinh_anh', hinhAnhFile);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/baiviet', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        alert('✅ Thêm bài viết thành công!');
        router.push('/admin/baiviet');
      } else {
        alert('❌ Thêm thất bại: ' + data.message);
      }
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      alert('❌ Thêm thất bại: ' + err.message);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-primary fw-bold text-uppercase mb-4">Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            value={tieude}
            onChange={e => setTieude(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nội dung</label>
          <textarea
            className="form-control"
            rows={5}
            value={noidung}
            onChange={e => setNoidung(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            className="form-select"
            value={selectedDanhMuc}
            onChange={e => setSelectedDanhMuc(e.target.value)}
          >
            <option value="">-- Chọn danh mục --</option>
            {danhmucs.map(dm => (
              <option key={dm.id} value={dm.id}>
                {dm.tendanhmuc}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tác giả</label>
          <select
            className="form-select"
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
          >
            <option value="">-- Chọn tác giả --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.ho_ten}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh đại diện</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={e => setHinhAnhFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Trạng thái</label>
          <select
            className="form-select"
            value={anhien}
            onChange={e => setAnhien(Number(e.target.value))}
          >
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm bài viết'}
        </button>
      </form>
    </div>
  );
}
