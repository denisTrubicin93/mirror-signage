const axios = require('axios');

const fetchAgingAsync = (params: any) => {
  return axios.post('/', JSON.stringify(params), {
    baseURL: process.env.AGING_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 50000,
  });
};

export { fetchAgingAsync };
