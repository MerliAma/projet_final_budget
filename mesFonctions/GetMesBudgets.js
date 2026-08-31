import axios from 'axios';

const GetMesBudgets = async() => {
    try {
        const LesBudgets = await axios.get(`/server/budget/get-all`)

        return LesBudgets.data
    } 
    catch (error) {
        console.error(error);
        return ""
    }
};

export default GetMesBudgets
