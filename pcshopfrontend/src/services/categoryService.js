import { apiRequest } from "./api";

const unwrap = (res) => (res && typeof res === "object" && "response_object" in res ? res.response_object : res);

export const getCategories = async () => {
  const res = await apiRequest("/categories", { method: "GET" });
  return unwrap(res);
};

export const createCategory = async (categoryData) => {
  const res = await apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
  return unwrap(res);
};

export const updateCategory = async (id, categoryData) => {
  if (!id) throw new Error("ID của category không hợp lệ");
  const res = await apiRequest(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
  return unwrap(res);
};

export const deleteCategory = async (id) => {
  if (!id) throw new Error("ID của category không hợp lệ");
  const res = await apiRequest(`/categories/${id}`, { method: "DELETE" });
  return unwrap(res);
};
