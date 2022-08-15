import axiosClient from './axiosClient';
const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },
  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = '/posts';
    return axiosClient.post(url, data);
  },
  update(id) {
    const url = `/posts/${id}`;
    return axiosClient.patch(url, data);
  },

  updateFromData(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data, {
      headers: { 'Content-Type': 'multipart/from-data' },
    });
  },

  remove() {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
