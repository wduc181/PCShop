import { apiRequest } from "./api";

const BASE_URL = "/products";

export const getAllProducts = async (page = 1, limit = 20, sort) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (sort) params.set("sort", sort);
    const response = await apiRequest(`${BASE_URL}?${params.toString()}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId, page = 1, size = 20, sort) => {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (sort) params.set("sort", sort);
    const response = await apiRequest(`${BASE_URL}/category/${categoryId}?${params.toString()}`, { method: "GET" });
    return response;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiRequest(`${BASE_URL}/${id}`, { method: "GET" });
    return response;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await apiRequest(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const discountProduct = async (id, discount) => {
  try {
    const response = await apiRequest(`${BASE_URL}/${id}/discount`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discount }),
    });
    return response;
  } catch (error) {
    console.error("Error discounting product:", error);
    throw error;
  }
};

export const recommendProduct = async (id, featured) => {
  try {
    // Gửi cả featured và isFeatured để tương thích với DTO boolean có tiền tố 'is'
    const payload = { featured: !!featured, isFeatured: !!featured };
    const response = await apiRequest(`${BASE_URL}/${id}/recommend`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    console.error("Error recommending product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const uploadProductImages = async (id, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    const response = await apiRequest(`${BASE_URL}/uploads/${id}`, {
      method: "POST",
      body: formData,
      isFormData: true, 
    });

    return response;
  } catch (error) {
    console.error("Error uploading product images:", error);
    throw error;
  }
};

export const getProductImages = async (id) => {
  try {
    const response = await apiRequest(`${BASE_URL}/${id}/images`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw error;
  }
};
