import { createContext, useContext, useEffect, useState } from "react";
import { getLanguages } from "../../services/CommonServices/commonService";
import { getCart } from "../../services/invoicesServices/invoicesServices";

const cartContext = createContext();

function useCart() {
    const value = useContext(cartContext);
    return value;
}

function CustomCartContext({ children }) {

    const userData = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        if(userData?.id){
        cartListServices()
        }
    }, [])

    const [cartContextData, setCartContextData] = useState([])


    const cartListServices = async () => {
        const res = await getCart(userData?.id)
        if (res.success === true) {
            setCartContextData(res?.product)
        }
    }


    return (
        <cartContext.Provider value={{ cartListServices, cartContextData }}>
            {children}
        </cartContext.Provider>
    )
}

export { useCart };
export default CustomCartContext;