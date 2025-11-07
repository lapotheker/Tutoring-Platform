const API_BASE_URL = "http://localhost:3000/api";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
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
  /**
   * Search tutors with optional filters
   * @param {Object} params - { course, search, subject, language, minRate, maxRate, days, times }
   */
  searchTutors: async (params = {}) => {
    // Filter out empty/falsy values before creating query string
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/tutors?${queryString}` : "/tutors";

    return fetchAPI(endpoint);
  },

  /**
   * Get single tutor by ID
   */
  getTutorById: async (id) => {
    return fetchAPI(`/tutors/${id}`);
  },
};

/**
 * Data API functions (for dropdowns)
 */
export const dataAPI = {
  getCourses: async () => {
    return fetchAPI("/data/courses");
  },

  getSubjects: async () => {
    return fetchAPI("/data/subjects");
  },

  getLanguages: async () => {
    return fetchAPI("/data/languages");
  },
};

/**
 * Health check
 */
export const healthCheck = async () => {
  return fetchAPI("/health");
};
