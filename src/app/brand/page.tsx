'use client';

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

interface Brand {
  id: string;
  code: string;
  tenbrand: string;
  logo: string;
  thutu: number;
  anhien: number;
}

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");

  // Gọi API lấy danh sách thương hiệu
  useEffect(() => {
    fetch("http://localhost:3001/api/thuonghieu")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Lỗi khi tải thương hiệu:", err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa thương hiệu này không?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/thuonghieu/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBrands(brands.filter((b) => b.id !== id));
        alert("Đã xóa thành công!");
      } else alert("Xóa thất bại!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa thương hiệu!");
    }
  };

  const filtered = brands.filter((b) =>
    b.tenbrand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
    {/* Header */}
    <div className="flex justify-between items-center mb-8 border-b pb-4">
      <h2 className="text-3xl font-bold text-[#1E90FF] uppercase tracking-wide">
        Danh sách thương hiệu
      </h2>
      <button className="flex items-center gap-2 bg-[#1E90FF] hover:bg-[#00BFFF] text-white px-5 py-2.5 rounded-xl shadow-md transition-all duration-200">
        <PlusCircle size={20} />
        <span className="font-medium">Tạo thương hiệu</span>
      </button>
    </div>
  
    {/* Thanh tìm kiếm */}
    <div className="mb-6 flex justify-between items-center">
      <input
        type="text"
        placeholder="🔍 Tìm kiếm thương hiệu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-xl px-4 py-2.5 w-1/3 focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all duration-200"
      />
    </div>
  
    {/* Bảng danh sách */}
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <table className="w-full border-collapse">
        <thead className="bg-[#F0F8FF] text-[#1E90FF]">
          <tr>
            <th className="p-3 text-left font-semibold">Mã</th>
            <th className="p-3 text-left font-semibold">Tên thương hiệu</th>
            <th className="p-3 text-left font-semibold">Logo</th>
            <th className="p-3 text-center font-semibold">Thứ tự</th>
            <th className="p-3 text-center font-semibold">Trạng thái</th>
            <th className="p-3 text-center font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((b) => (
              <tr
                key={b.id}
                className="border-t hover:bg-blue-50 transition-all duration-150"
              >
                <td className="p-3 text-gray-700">{b.code}</td>
                <td className="p-3 font-semibold text-[#1E90FF]">{b.tenbrand}</td>
                <td className="p-3">
                  <img
                    src={b.logo}
                    alt={b.tenbrand}
                    className="w-14 h-14 object-contain border rounded-lg shadow-sm"
                  />
                </td>
                <td className="p-3 text-center text-gray-700">{b.thutu}</td>
                <td className="p-3 text-center">
                  {b.anhien === 1 ? (
                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full shadow-sm">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-full shadow-sm">
                      Ẩn
                    </span>
                  )}
                </td> 
                <td className="p-3 text-center flex justify-center gap-3">
                  <button className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow transition-all duration-150">
                    <Pencil size={16} />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-all duration-150"
                  >
                    <Trash2 size={16} />
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                Không có thương hiệu nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  
  );
}
