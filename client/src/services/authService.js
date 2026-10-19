import API from './axios'; // උඩින් හැදූ axios file එක import කරගැනීම

// 1. Signup Request එක යැවීම
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/signup', userData);
    return response.data; // සාර්ථක වුނොත් ලැබෙන መልශය
  } catch (error) {
    // Backend එකෙන් එන Error පණිවිඩය ලබා ගැනීම
    throw error.response?.data || { message: 'Server Error එකක් සිදුවිය.' };
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