'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trash2, Search, User, Package, Calendar, Image as ImageIcon, Eye } from 'lucide-react';

interface ReviewImage {
  id: string;
  url: string;
}

interface Review {
  id: string;
  user_id: string;
  sanpham_id: string;
  chitiet_donhang_id?: string;
  diem: number;
  noidung?: string;
  binhluan?: string;
  created_at: string;
  user?: {
    ho_ten: string;
    email: string;
  };
  sanpham?: {
    tensp: string;
    thumbnail: string;
  };
  images?: ReviewImage[];
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filterRating, setFilterRating] = useState<string>('all');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      router.push('/');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/review', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    
    setDeleteLoading(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/review/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
        alert('Xóa đánh giá thành công!');
        if (selectedReview?.id === id) {
          setSelectedReview(null);
        }
      } else {
        alert('Không thể xóa đánh giá!');
      }
    } catch (err) {
      console.error('Lỗi xóa:', err);
      alert('Có lỗi xảy ra!');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredData = reviews.filter((review) => {
    const reviewContent = review.noidung || review.binhluan || '';
    const matchesSearch =
      reviewContent.toLowerCase().includes(search.toLowerCase()) ||
      (review.user?.ho_ten?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (review.sanpham?.tensp?.toLowerCase() || '').includes(search.toLowerCase());
    
    const matchesRating = filterRating === 'all' || review.diem.toString() === filterRating;
    
    return matchesSearch && matchesRating;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={star <= rating ? 'text-warning fill' : 'text-muted'}
            style={{
              fill: star <= rating ? '#ffc107' : 'none',
            }}
          />
        ))}
        <span className="ms-2 fw-bold">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>
            <Star className="me-2" size={28} />
            Quản lý đánh giá
          </h2>
          <p className="text-muted mb-0">Xem và quản lý các đánh giá từ khách hàng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo nội dung, tên khách hàng hoặc sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">Tất cả đánh giá</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Table */}
        <div className={selectedReview ? 'col-md-7' : 'col-12'}>
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {filteredData.length === 0 ? (
                <div className="text-center py-5">
                  <Star size={48} className="text-muted mb-3" />
                  <p className="text-muted">Chưa có đánh giá nào</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Đánh giá</th>
                        <th>Nội dung</th>
                        <th>Ngày đánh giá</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((review) => (
                        <tr
                          key={review.id}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: selectedReview?.id === review.id ? '#f8f9fa' : 'white',
                          }}
                          onClick={() => setSelectedReview(review)}
                        >
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <User size={18} className="text-primary" />
                              <div>
                                <strong>{review.user?.ho_ten || 'N/A'}</strong>
                                {review.user?.email && (
                                  <small className="text-muted d-block">{review.user.email}</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {review.sanpham?.thumbnail && (
                                <img
                                  src={review.sanpham.thumbnail}
                                  alt={review.sanpham.tensp}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                              )}
                              <div>
                                <Package size={16} className="text-muted" />
                                <small className="d-block text-truncate" style={{ maxWidth: '150px' }}>
                                  {review.sanpham?.tensp || 'N/A'}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{renderStars(review.diem)}</td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {review.noidung || review.binhluan || 'Không có nội dung'}
                            </div>
                            {review.images && review.images.length > 0 && (
                              <small className="text-muted d-block">
                                <ImageIcon size={12} className="me-1" />
                                {review.images.length} ảnh
                              </small>
                            )}
                          </td>
                          <td>
                            <small className="text-muted">
                              <Calendar size={14} className="me-1" />
                              {formatDate(review.created_at)}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedReview(review);
                                }}
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(review.id);
                                }}
                                disabled={deleteLoading === review.id}
                                title="Xóa"
                              >
                                {deleteLoading === review.id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedReview && (
          <div className="col-md-5">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <Star className="me-2" size={20} />
                  Chi tiết đánh giá
                </h5>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setSelectedReview(null)}
                >
                  ×
                </button>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Khách hàng</label>
                  <div className="d-flex align-items-center gap-2">
                    <User size={18} className="text-primary" />
                    <div>
                      <strong>{selectedReview.user?.ho_ten || 'N/A'}</strong>
                      {selectedReview.user?.email && (
                        <small className="text-muted d-block">{selectedReview.user.email}</small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Sản phẩm</label>
                  <div className="d-flex align-items-center gap-2">
                    {selectedReview.sanpham?.thumbnail && (
                      <img
                        src={selectedReview.sanpham.thumbnail}
                        alt={selectedReview.sanpham.tensp}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                    <div>
                      <Package size={16} className="text-muted" />
                      <strong className="d-block">{selectedReview.sanpham?.tensp || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Đánh giá</label>
                  {renderStars(selectedReview.diem)}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Nội dung</label>
                  <div
                    className="p-3 bg-light rounded"
                    style={{ whiteSpace: 'pre-wrap', minHeight: '100px' }}
                  >
                    {selectedReview.noidung || selectedReview.binhluan || 'Không có nội dung'}
                  </div>
                </div>

                {selectedReview.images && selectedReview.images.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">
                      Hình ảnh ({selectedReview.images.length})
                    </label>
                    <div className="row g-2">
                      {selectedReview.images.map((img) => (
                        <div key={img.id} className="col-6">
                          <img
                            src={img.url}
                            alt="Review"
                            className="img-thumbnail"
                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Ngày đánh giá</label>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <span>{formatDate(selectedReview.created_at)}</span>
                  </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(selectedReview.id)}
                    disabled={deleteLoading === selectedReview.id}
                  >
                    {deleteLoading === selectedReview.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <Trash2 className="me-2" size={18} />
                        Xóa đánh giá
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
