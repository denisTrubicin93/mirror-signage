const axios = require('axios');

const saveUserSurvey = (params: any) => {
  try {
    return axios.post('/survey', JSON.stringify(params), {
      baseURL: process.env.MIRROR_API_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 50000,
    });
  } catch(err) {
    throw new Error(err)
  }
};

export { saveUserSurvey };
