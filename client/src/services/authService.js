import API from './axios.js';

// 1. Signup / Register Request එක යැවීම
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData); // මෙහි /signup වෙනුවට /register දමන්න
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: 'සර්වර් එකේ දෝෂයක් සිදුවිය.' };
  }
};

// 2. Login Request එක යැවීම
export const loginUser = async (userData) => {
  try {
    const response = await API.post('/auth/login', userData);
    return response.data; // මෙහි token එක සහ user විස්තර අඩංගු වේ
  } catch (error) {
    throw error.response?.data || { message: 'Server Error එකක් සිදුවිය.' };
  }
};