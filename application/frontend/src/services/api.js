// Compute API base dynamically
const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE_URL = isLocalHost ? "http://localhost:3000/api" : "/api";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...(options.body
        ? { body: typeof options.body === "string" ? options.body : JSON.stringify(options.body) }
        : {}),
      credentials: "same-origin",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `API request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Tutor API functions
 */
export const tutorAPI = {
  searchTutors: async (params = {}) => {
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) acc[key] = value;
      return acc;
    }, {});
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/tutors?${queryString}` : "/tutors";
    return fetchAPI(endpoint);
  },
  getTutorById: async (id) => fetchAPI(`/tutors/${id}`),
};

/**
 * Data API functions (for dropdowns)
 */
export const dataAPI = {
  getCourses: async () => fetchAPI("/data/courses"),
  getSubjects: async () => fetchAPI("/data/subjects"),
  getLanguages: async () => fetchAPI("/data/languages"),
};

/**
 * Health check
 */
export const healthCheck = async () => fetchAPI("/health");
