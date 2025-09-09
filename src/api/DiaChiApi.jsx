import axios from 'axios';

const GITHUB_API_URL =
  'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json';

const diaChiApi = {
  // Lấy toàn bộ tỉnh/thành
  getAllProvinces: async () => {
    const response = await axios.get(GITHUB_API_URL);
    return response.data;
  },

  // Lấy quận/huyện theo mã tỉnh
  getDistrictsByProvince: async (provinceCode) => {
    const response = await axios.get(GITHUB_API_URL);
    const data = response.data;

    const province =
      data.find(
        (p) => p.Id == provinceCode || p.code == provinceCode
      ) || null;

    return province?.Districts || province?.districts || [];
  },

  // Lấy xã/phường theo mã quận/huyện
  getWardsByDistrict: async (districtCode) => {
    const response = await axios.get(GITHUB_API_URL);
    const data = response.data;

    for (const province of data) {
      const district =
        province.Districts?.find(
          (d) => d.Id == districtCode || d.code == districtCode
        ) || province.districts?.find((d) => d.code == districtCode);

      if (district) {
        return district.Wards || district.wards || [];
      }
    }
    return [];
  },

  // Lấy chi tiết tỉnh/thành
  getProvinceDetail: async (provinceCode) => {
    const response = await axios.get(GITHUB_API_URL);
    const data = response.data;
    return (
      data.find(
        (p) => p.Id == provinceCode || p.code == provinceCode
      ) || null
    );
  },

  // Lấy chi tiết quận/huyện
  getDistrictDetail: async (districtCode) => {
    const response = await axios.get(GITHUB_API_URL);
    const data = response.data;

    for (const province of data) {
      const district =
        province.Districts?.find(
          (d) => d.Id == districtCode || d.code == districtCode
        ) || province.districts?.find((d) => d.code == districtCode);

      if (district) return district;
    }
    return null;
  },

  // Lấy chi tiết xã/phường
  getWardDetail: async (wardCode) => {
    const response = await axios.get(GITHUB_API_URL);
    const data = response.data;

    for (const province of data) {
      for (const district of province.Districts || province.districts || []) {
        const ward =
          district.Wards?.find(
            (w) => w.Id == wardCode || w.code == wardCode
          ) || district.wards?.find((w) => w.code == wardCode);
        if (ward) return ward;
      }
    }
    return null;
  },
};

export default diaChiApi;