import { apiRequest } from "./api";

const BASE_URL = "/products";
const unwrap = (res) => (res && typeof res === "object" && "response_object" in res ? res.response_object : res);

const request = async (url, options) => unwrap(await apiRequest(url, options));

export const getAllProducts = async (page = 1, limit = 20, sort, searchKey) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (sort) params.set("sort", sort);
    if (searchKey && String(searchKey).trim()) params.set("searchKey", String(searchKey).trim());
    return await request(`${BASE_URL}?${params.toString()}`);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId, page = 1, limit = 20, sort) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (sort) params.set("sort", sort);
    return await request(`${BASE_URL}/category/${categoryId}?${params.toString()}`);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const getProductsByBrand = async (brandId, page = 1, limit = 20, sort) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (sort) params.set("sort", sort);
    return await request(`${BASE_URL}/brand/${brandId}?${params.toString()}`);
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    return await request(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    return await request(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    return await request(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const discountProduct = async (id, discount) => {
  try {
    return await request(`${BASE_URL}/${id}/discount`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discount }),
    });
  } catch (error) {
    console.error("Error discounting product:", error);
    throw error;
  }
};

export const recommendProduct = async (id, featured) => {
  try {
    // Gửi cả featured và isFeatured để tương thích với DTO boolean có tiền tố 'is'
    const payload = { featured: !!featured, isFeatured: !!featured };
    return await request(`${BASE_URL}/${id}/recommend`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Error recommending product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await request(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
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

    return await request(`${BASE_URL}/uploads/${id}`, {
      method: "POST",
      body: formData,
      isFormData: true, 
    });
  } catch (error) {
    console.error("Error uploading product images:", error);
    throw error;
  }
};

export const getProductImages = async (id) => {
  try {
    return await request(`${BASE_URL}/${id}/images`);
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw error;
  }
};

export const setProductThumbnail = async (id, imageUrl) => {
  try {
    if (!id) throw new Error("Product id is required");
    if (!imageUrl || !String(imageUrl).trim()) throw new Error("imageUrl is required");
    const params = new URLSearchParams({ imageUrl: String(imageUrl).trim() });
    return await request(`${BASE_URL}/${id}/set-thumbnail?${params.toString()}`, {
      method: "PUT",
    });
  } catch (error) {
    console.error("Error setting product thumbnail:", error);
    throw error;
  }
};

export const deleteProductImages = async (id, imageIds) => {
  try {
    if (!id) throw new Error("Product id is required");
    const list = Array.isArray(imageIds) ? imageIds : [];
    if (!list.length) throw new Error("No image ids provided");
    const params = new URLSearchParams();
    list.forEach((value) => {
      const normalized = Number(value);
      if (Number.isFinite(normalized)) {
        params.append("imageUrl", String(normalized));
      }
    });
    if (!params.toString()) throw new Error("No valid image ids provided");
    return await request(`${BASE_URL}/${id}/images?${params.toString()}`, {
      method: "PUT",
    });
  } catch (error) {
    console.error("Error deleting product images:", error);
    throw error;
  }
};

export const searchProduct = async (keyword) => {
  try {
    if (!keyword || !keyword.toString().trim()) {
      throw new Error("Nhập để tìm kiếm");
    }
    const params = new URLSearchParams({ keyword: keyword.toString().trim() });
    return await request(`${BASE_URL}/search?${params.toString()}`);
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
