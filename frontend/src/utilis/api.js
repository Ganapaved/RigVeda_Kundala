const API_BASE_URL = '';
export const apiCall = async (endpoint , options ={})=>{
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers : {
            'Content-Type' : 'application/json'
        },
        credentials : 'include'
    };

    const finalOptions = {...defaultOptions , ...options};

    try{
        const response = await fetch(url,finalOptions);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch(error){
        console.error('Error during API call:', error);
        throw error;
    }
};
