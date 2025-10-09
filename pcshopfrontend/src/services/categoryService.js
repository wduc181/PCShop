import { apiRequest } from "./api";

export const getCategories = async () => {
  return apiRequest("/categories", { method: "GET" });
};

export const createCategory = async (categoryData) => {
  return apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

export const updateCategory = async (id, categoryData) => {
  if (!id) throw new Error("ID của category không hợp lệ");
  return apiRequest(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategory = async (id) => {
  if (!id) throw new Error("ID của category không hợp lệ");
  return apiRequest(`/categories/${id}`, { method: "DELETE" });
};
