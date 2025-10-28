'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Brand {
  id: string;
  code: string;
  tenbrand: string;
  logo: string;
  thutu: number;
  anhien: number;
}

interface BrandListProps {
  title: string;
  apiUrl: string;
}

export default function BrandList({ title, apiUrl }: BrandListProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <p className="text-center mt-5">Đang tải thương hiệu...</p>;

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-uppercase fw-bold mb-4 text-center text-primary">
          {title}
        </h2>

        <div className="row g-4">
          {brands.length > 0 ? (
            brands.map((b) => (
              <div key={b.id} className="col-6 col-md-4 col-lg-3">
                <div className="brand-card bg-white p-3 text-center h-100 shadow-sm">
                  <div className="mb-3">
                    {b.logo ? (
                      <Image
                        src={b.logo}
                        alt={b.tenbrand}
                        width={150}
                        height={150}
                        className="img-fluid rounded"
                      />
                    ) : (
                      <div
                        className="bg-secondary d-flex align-items-center justify-content-center rounded"
                        style={{ height: '150px' }}
                      >
                        <span className="text-white">No Image</span>
                      </div>
                    )}
                  </div>
                  <h5 className="brand-title">{b.tenbrand}</h5>
                  <p className="brand-desc">Mã: {b.code}</p>
                  <small className="text-muted">
                    {b.anhien === 1 ? 'Hiển thị' : 'Ẩn'}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Không có thương hiệu nào</p>
          )}
        </div>
      </div>
    </section>
  );
}
