import axios from "axios";

export const API_BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  LOGIN: "/api/dashboard/auth/login",
  REGISTER: "/api/dashboard/auth/register",
  USER_ME: "/api/dashboard/me",
  ALL_USERS: "/api/users",
  UPDATE_USER: (id: string) => `/api/users/${id}`,
  ALL_BANNERS: "/api/banners",
  UPDATE_BANNER: (id: string) => `/api/banners/${id}`,
  DELETE_BANNER: (id: string) => `/api/banners/${id}`,
  ALL_FAVOURITES: "/api/favourites",
  UPDATE_FAVOURITE: (id: string) => `/api/favourites/${id}`,
  DELETE_FAVOURITE: (id: string) => `/api/favourites/${id}`,
  ALL_POPULAR_GAMES: "/api/popular-games/admin",
  UPDATE_POPULAR_GAME: (id: string) => `/api/popular-games/${id}`,
  DELETE_POPULAR_GAME: (id: string) => `/api/popular-games/${id}`,
  FOOTER: "/api/footer",
  APP_VERSION: "/api/app-version",
  SETTINGS: "/api/settings",
  GAME_CATEGORIES: "/api/game-categories",
  GAME_CATEGORY: (id: string) => `/api/game-categories/${id}`,
  GAMES: "/api/games",
  GAME: (id: string) => `/api/games/${id}`,
  DEPOSIT_METHODS: "/api/deposit-methods",
  DEPOSIT_METHOD: (id: string) => `/api/deposit-methods/${id}`,
  PROMOTIONS: "/api/promotions/admin",
  PROMOTION: (id: string) => `/api/promotions/admin/${id}`,
  ACTIVE_DEPOSIT_METHODS: "/api/deposit-methods/active",
  WITHDRAW_METHODS: "/api/withdraw-methods",
  WITHDRAW_METHOD: (id: string) => `/api/withdraw-methods/${id}`,
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API helper function for login/register
export const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>
) => {
  try {
    const response = await apiClient({
      url: endpoint,
      method,
      data: body,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      throw new Error(message);
    }
    throw error;
  }
};

// Get current user info with token
export const getCurrentUser = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.USER_ME}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Unauthorized - clear token
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 404) {
        throw new Error("User not found");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user info";
      throw new Error(message);
    }
    throw error;
  }
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ALL_USERS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch users";
      throw new Error(message);
    }
    throw error;
  }
};

// Update user (Admin only)
export const updateUser = async (
  userId: string,
  data: {
    userName?: string;
    phone?: number;
    callingCode?: string;
    balance?: number;
    friendReferrerCode?: string;
  }
) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.UPDATE_USER(userId)}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      } else if (error.response?.status === 404) {
        throw new Error("User not found");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user";
      throw new Error(message);
    }
    throw error;
  }
};

// Get all banners (Admin only)
export const getAllBanners = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ALL_BANNERS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch banners";
      throw new Error(message);
    }
    throw error;
  }
};

// Delete banner (Admin only)
export const deleteBanner = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.DELETE_BANNER(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete banner";
      throw new Error(message);
    }
    throw error;
  }
};

// Get all favourites (Admin only)
export const getAllFavourites = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ALL_FAVOURITES}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch favourites";
      throw new Error(message);
    }
    throw error;
  }
};

// Delete favourite (Admin only)
export const deleteFavourite = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.DELETE_FAVOURITE(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete favourite";
      throw new Error(message);
    }
    throw error;
  }
};

// Get all popular games (Admin only)
export const getAllPopularGames = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ALL_POPULAR_GAMES}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch popular games";
      throw new Error(message);
    }
    throw error;
  }
};

// Delete popular game (Admin only)
export const deletePopularGame = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.DELETE_POPULAR_GAME(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete popular game";
      throw new Error(message);
    }
    throw error;
  }
};

// Get footer settings (Admin only)
export const getFooterSettings = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.FOOTER}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch footer settings";
      throw new Error(message);
    }
    throw error;
  }
};

// Update footer settings (Admin only)
export const updateFooterSettings = async (formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.FOOTER}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update footer settings";
      throw new Error(message);
    }
    throw error;
  }
};

// Upload footer icon (Admin only)
export const uploadFooterIcon = async (file: File): Promise<string> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const formData = new FormData();
    formData.append("icon", file);

    const response = await axios.post(
      `${API_BASE_URL}/api/footer/upload-icon`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload icon";
      throw new Error(message);
    }
    throw error;
  }
};

// Update user profile
export const updateProfile = async (data: { name: string; email: string }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/dashboard/auth/update-profile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      throw new Error(message);
    }
    throw error;
  }
};

// Change password
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/dashboard/auth/change-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password";
      throw new Error(message);
    }
    throw error;
  }
};

// Get app version
export const getAppVersion = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.APP_VERSION}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch app version";
      throw new Error(message);
    }
    throw error;
  }
};

// Upload app version (Admin only)
export const uploadAppVersion = async (formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.APP_VERSION}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload app version";
      throw new Error(message);
    }
    throw error;
  }
};

// Get settings
export const getSettings = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.SETTINGS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch settings";
      throw new Error(message);
    }
    throw error;
  }
};

// Update settings (Admin only)
export const updateSettings = async (data: {
  telegram: string;
  email: string;
  bannerTextEnglish: string;
  bannerTextBangla: string;
}) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.SETTINGS}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update settings";
      throw new Error(message);
    }
    throw error;
  }
};

// Get game categories
export const getGameCategories = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.GAME_CATEGORIES}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch game categories";
      throw new Error(message);
    }
    throw error;
  }
};

// Create game category (Admin only)
export const createGameCategory = async (formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.GAME_CATEGORIES}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create game category";
      throw new Error(message);
    }
    throw error;
  }
};

// Update game category (Admin only)
export const updateGameCategory = async (id: string, formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.GAME_CATEGORY(id)}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update game category";
      throw new Error(message);
    }
    throw error;
  }
};

// Delete game category (Admin only)
export const deleteGameCategory = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.GAME_CATEGORY(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete game category";
      throw new Error(message);
    }
    throw error;
  }
};

// Get games
export const getGames = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GAMES}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch games";
      throw new Error(message);
    }
    throw error;
  }
};

// Create game (Admin only)
export const createGame = async (formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.GAMES}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create game";
      throw new Error(message);
    }
    throw error;
  }
};

// Update game (Admin only)
export const updateGame = async (id: string, formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.GAME(id)}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update game";
      throw new Error(message);
    }
    throw error;
  }
};

// Delete game (Admin only)
export const deleteGame = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.GAME(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete game";
      throw new Error(message);
    }
    throw error;
  }
};

// Get deposit methods
export const getDepositMethods = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.DEPOSIT_METHODS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch deposit methods";
      throw new Error(message);
    }
    throw error;
  }
};

// Create deposit method (Admin only)
export const createDepositMethod = async (formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.DEPOSIT_METHODS}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create deposit method";
      throw new Error(message);
    }
    throw error;
  }
};

// Update deposit method (Admin only)
export const updateDepositMethod = async (id: string, formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.DEPOSIT_METHOD(id)}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update deposit method";
      throw new Error(message);
    }
    throw error;
  }
};

// Delete deposit method (Admin only)
export const deleteDepositMethod = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.DEPOSIT_METHOD(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete deposit method";
      throw new Error(message);
    }
    throw error;
  }
};

// Get promotions (Admin only)
export const getPromotions = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.PROMOTIONS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch promotions";
      throw new Error(message);
    }
    throw error;
  }
};

// Create promotion (Admin only)
export const createPromotion = async (formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.PROMOTIONS}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create promotion";
      throw new Error(message);
    }
    throw error;
  }
};

// Update promotion (Admin only)
export const updatePromotion = async (id: string, formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.PROMOTION(id)}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update promotion";
      throw new Error(message);
    }
    throw error;
  }
};

// Delete promotion (Admin only)
export const deletePromotion = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.PROMOTION(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete promotion";
      throw new Error(message);
    }
    throw error;
  }
};

// Get active deposit methods
export const getActiveDepositMethods = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ACTIVE_DEPOSIT_METHODS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch active deposit methods";
      throw new Error(message);
    }
    throw error;
  }
};

// Get withdrawal methods
export const getWithdrawalMethods = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.WITHDRAW_METHODS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch withdrawal methods";
      throw new Error(message);
    }
    throw error;
  }
};

// Create withdrawal method (Admin only)
export const createWithdrawalMethod = async (formData: FormData) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.WITHDRAW_METHODS}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create withdrawal method";
      throw new Error(message);
    }
    throw error;
  }
};

// Update withdrawal method (Admin only)
export const updateWithdrawalMethod = async (
  id: string,
  formData: FormData
) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.WITHDRAW_METHOD(id)}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update withdrawal method";
      throw new Error(message);
    }
    throw error;
  }
};

// Delete withdrawal method (Admin only)
export const deleteWithdrawalMethod = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.WITHDRAW_METHOD(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("Not authorized. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin only.");
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete withdrawal method";
      throw new Error(message);
    }
    throw error;
  }
};
