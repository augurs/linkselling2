import { createContext, useContext, useEffect, useState } from "react";
import { walletBalance } from "../../services/walletServices/walletService";

const WalletContext = createContext();

function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}

function WalletProvider({ children }) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState('');
    const [userDetails, setUserDetails] = useState('');


    const showWalletBalance = async (accessToken) => {
        setLoading(true);
        try {
            const res = await walletBalance(accessToken);
            if (res.success === true) {
                setUserDetails(res?.data);
                setBalance(res?.data.wallet_amount);
                setLoading(false);
            } else {
                console.error('API call failed:', res);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

   

    return (
        <WalletContext.Provider value={{loading, balance, showWalletBalance, userDetails}}>
            {children}
        </WalletContext.Provider>
    );
}

export { useWallet, WalletProvider };
