const axios = require('axios');

const payload = {
 email: 'noelg.22.beds@acharya.ac.in',
  name: 'noel george',
  rollNo: '1ay22cd033',
  accessCode: 'xtBSqM',
  clientID: '57af2ea2-5562-4cd2-8547-1bb2e368d059',
  clientSecret: 'wnFZSsNMSBqQDvnF'
};

axios.post('http://20.244.56.144/evaluation-service/auth', payload)
  .then(res => {
    console.log(" Registered Successfully:");
    console.log(res.data);
  })
  .catch(err => {
    console.error(" Registration failed:", err.response?.data || err.message);
  });
