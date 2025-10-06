const BASE_URL = "http://localhost:8088/api/ver1"; 

export const apiRequest = async (endpoint, options = {}) => {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6IjAwMDAwMDAwMDIiLCJzdWIiOiIwMDAwMDAwMDAyIiwiZXhwIjoxNzYyMDEzNTk3fQ.vPZfRfIzax_gHIJZ9r_MsbAZqW_KRW26stKs3jQRw1U"
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }

  return response.json();
};
