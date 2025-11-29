import { apiRequest } from "./api";

const unwrap = (res) => (res && typeof res === "object" && "response_object" in res ? res.response_object : res);

export const getAllBrands = async () => {
  const res = await apiRequest("/brands");
  return unwrap(res);
};

export const createBrand = async (formData) => {
  const res = await apiRequest("/brands", {
    method: "POST",
    body: formData,
  });
  return unwrap(res);
};

export const updateBrand = async (id, formData) => {
  const res = await apiRequest(`/brands/${id}`, {
    method: "PUT",
    body: formData,
  });
  return unwrap(res);
};

export const deleteBrand = async (id) => {
  const res = await apiRequest(`/brands/${id}`, {
    method: "DELETE",
  });
  return unwrap(res);
};
