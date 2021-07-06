//===================================================================================================
// const URL = `http://localhost:3040`;
const URL = `https://mohanad-blog.herokuapp.com`;
export { URL };
//===================================================================================================
// Save user token after logging inside localstorage 
export const saveAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};
//===================================================================================================
// Retrieve user token form localstorage
export const getAuthToken = () => {
   return localStorage.getItem('authToken');
};
//===================================================================================================
// Clear localstorage
export const removeAuthToken = () => {
    localStorage.clear();
};
//===================================================================================================
