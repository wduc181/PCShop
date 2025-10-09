import { apiRequest } from "./api";

export const getAllBrands = () => apiRequest("/brands");

export const createBrand = (formData) =>
  apiRequest("/brands", {
    method: "POST",
    body: formData,
  });

export const updateBrand = (id, formData) =>
  apiRequest(`/brands/${id}`, {
    method: "PUT",
    body: formData,
  });

export const deleteBrand = (id) =>
  apiRequest(`/brands/${id}`, {
    method: "DELETE",
  });
