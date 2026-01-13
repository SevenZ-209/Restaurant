import axios from "axios";

const HOST = "https://lekhoa.pythonanywhere.com/";

export const endpoints = {
    'categories': '/categories/',
    'tags': '/tags/',
    'dishes': '/dishes/',
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'register': '/users/',
    'dish-details': (dishId) => `/dishes/${dishId}/`,
    'dish-reviews': (dishId) => `/dishes/${dishId}/reviews/`, 

    'delete-review': (reviewId) => `/reviews/${reviewId}/`,

};

export const authApi = (accessToken) => axios.create({
    baseURL: HOST,
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
});

export default axios.create({
    baseURL: HOST
});