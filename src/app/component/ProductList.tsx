'use client';

import Link from 'next/link';

interface Product {
  id: number;
  tensp: string;
  thumbnail: string;
  gia?: number;
}

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="container pb-5">
      <div className="row g-4">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="col-6 col-md-3">
              <div className="product-card p-2 h-100 d-flex flex-column">
                <img
                  src={p.thumbnail || '/no-image.png'}
                  alt={p.tensp}
                  className="product-img"
                />
                <div className="flex-grow-1 d-flex flex-column justify-content-between text-center">
                  <h5 className="product-title">{p.tensp}</h5>
                  <p className="product-price">
                    {p.gia ? p.gia.toLocaleString('vi-VN') + '₫' : 'Liên hệ'}
                  </p>
                  <Link
                    href={`/products/${p.id}`}
                    className="btn btn-outline-primary btn-sm rounded-pill"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Không có sản phẩm nào</p>
        )}
      </div>

      {/* --- CSS --- */}
      <style jsx global>{`
        .product-card {
          transition: all 0.3s ease;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #eee;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }
        .product-title {
          font-weight: 600;
          color: #1e90ff;
          font-size: 1rem;
          margin: 8px 0 4px;
        }
        .product-price {
          color: #00bfff;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .product-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-bottom: 1px solid #eee;
        }
      `}</style>
    </div>
  );
}
