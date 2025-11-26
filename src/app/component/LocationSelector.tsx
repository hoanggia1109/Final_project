'use client';
import { useState, useEffect } from 'react';
import { vietnamLocations, type District } from '../data/vietnamLocations';

interface LocationSelectorProps {
  selectedCity: string;
  selectedDistrict: string;
  selectedWard: string;
  onCityChange: (city: string) => void;
  onDistrictChange: (district: string) => void;
  onWardChange: (ward: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function LocationSelector({
  selectedCity,
  selectedDistrict,
  selectedWard,
  onCityChange,
  onDistrictChange,
  onWardChange,
  required = false,
  disabled = false,
}: LocationSelectorProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  // Khi chọn thành phố, cập nhật danh sách quận/huyện
  useEffect(() => {
    if (selectedCity) {
      const city = vietnamLocations.find((c) => c.name === selectedCity);
      if (city) {
        setDistricts(city.districts);
        // Reset district và ward khi đổi city
        if (selectedDistrict && !city.districts.find((d) => d.name === selectedDistrict)) {
          onDistrictChange('');
          onWardChange('');
        }
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
      setWards([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  // Khi chọn quận/huyện, cập nhật danh sách phường/xã
  useEffect(() => {
    if (selectedDistrict && districts.length > 0) {
      const district = districts.find((d) => d.name === selectedDistrict);
      if (district) {
        setWards(district.wards.map((w) => w.name));
        // Reset ward khi đổi district
        if (selectedWard && !district.wards.find((w) => w.name === selectedWard)) {
          onWardChange('');
        }
      } else {
        setWards([]);
      }
    } else {
      setWards([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrict, districts]);

  return (
    <>
      {/* Thành phố */}
      <div className="col-md-4">
        <label className="form-label fw-semibold">
          Tỉnh/Thành phố {required && <span className="text-danger">*</span>}
        </label>
        <select
          className="form-select"
          value={selectedCity}
          onChange={(e) => {
            onCityChange(e.target.value);
            onDistrictChange('');
            onWardChange('');
          }}
          required={required}
          disabled={disabled}
          style={{
            borderRadius: '12px',
            padding: '12px',
            border: '2px solid #e9ecef',
          }}
        >
          <option value="">-- Chọn Tỉnh/Thành phố --</option>
          {vietnamLocations.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quận/Huyện */}
      <div className="col-md-4">
        <label className="form-label fw-semibold">
          Quận/Huyện {required && <span className="text-danger">*</span>}
        </label>
        <select
          className="form-select"
          value={selectedDistrict}
          onChange={(e) => {
            onDistrictChange(e.target.value);
            onWardChange('');
          }}
          required={required}
          disabled={disabled || !selectedCity || districts.length === 0}
          style={{
            borderRadius: '12px',
            padding: '12px',
            border: '2px solid #e9ecef',
          }}
        >
          <option value="">-- Chọn Quận/Huyện --</option>
          {districts.map((district) => (
            <option key={district.name} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Phường/Xã */}
      <div className="col-md-4">
        <label className="form-label fw-semibold">
          Phường/Xã {required && <span className="text-danger">*</span>}
        </label>
        <select
          className="form-select"
          value={selectedWard}
          onChange={(e) => onWardChange(e.target.value)}
          required={required}
          disabled={disabled || !selectedDistrict || wards.length === 0}
          style={{
            borderRadius: '12px',
            padding: '12px',
            border: '2px solid #e9ecef',
          }}
        >
          <option value="">-- Chọn Phường/Xã --</option>
          {wards.map((ward) => (
            <option key={ward} value={ward}>
              {ward}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

