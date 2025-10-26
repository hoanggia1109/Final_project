'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PromoModal from './PromoModal';
interface Product {
  id: number;
  tensp: string;
  mota: string;
  thumbnail: string;
  slug: string;
  danhmuc?: { tendm: string };
  thuonghieu?: { tenbrand: string };
  discount?: number;
  price?: number;
  originalPrice?: number;
}

interface ProductListProps {
  title?: string; // cho phép truyền tiêu đề, ví dụ “Sản phẩm mới”
  apiUrl?: string; // custom API nếu cần (vd: /api/discount-products)
}

export default function ProductList({
  title = 'Tất cả sản phẩm',
  apiUrl = 'http://localhost:3001/api/sanpham', // 👉 đổi theo backend thật của bạn
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info"></div>
      </div>
    );

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-uppercase fw-bold mb-4 text-center text-primary">
          {title}
        </h2>
        <div className="row g-4">
          {products.length > 0 ? (
            products.map((p) => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <Link href={`/products/${p.id}`} className="text-decoration-none">
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                      transition: 'all 0.3s ease',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'translateY(-8px)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'translateY(0)')
                    }
                  >
                    <div
                      className="position-relative"
                      style={{ height: '240px', background: '#f8f9fa' }}
                    >
                      <Image
                        src={p.thumbnail}
                        alt={p.tensp}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      {p.discount && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                          -{p.discount}%
                        </span>
                      )}
                    </div>
                    <div className="card-body text-center">
                      <h6 className="fw-bold text-dark mb-2">{p.tensp}</h6>
                      {p.price && p.originalPrice ? (
                        <p className="mb-0">
                          <span className="text-primary fw-bold me-2">
                            {p.price.toLocaleString()}₫
                          </span>
                          <span className="text-muted text-decoration-line-through small">
                            {p.originalPrice.toLocaleString()}₫
                          </span>
                        </p>
                      ) : (
                        <p className="text-muted small">{p.mota?.slice(0, 40)}...</p>
                      )}
                      <p className="text-muted small mt-1">
                        {p.danhmuc?.tendm || 'Danh mục khác'} |{' '}
                        {p.thuonghieu?.tenbrand || 'Thương hiệu'}
                        
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Không có sản phẩm nào</p>
          )}
        </div>
      </div>
    </section>
  );
}
