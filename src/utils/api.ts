export const API_BASE_URL = 'https://api.codingboss.in';
export const NGROK_BASE_URL = 'https://api.codingboss.in';

export const API_ENDPOINTS = {
    services: `${API_BASE_URL}/gobi360/services/`,
    experts: `${NGROK_BASE_URL}/gobi360/experts/`,
    expertCategories: `${NGROK_BASE_URL}/gobi360/expert-categories/`,
    categoryExperts: (categoryId: number | string) => `${NGROK_BASE_URL}/gobi360/expert-categories/${categoryId}/experts/`,
};
