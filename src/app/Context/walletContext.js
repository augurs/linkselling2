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

    useEffect(() => {
        if(userData?.id && balance){
        showWalletBalance();
        }
    }, [balance]);

    const showWalletBalance = async () => {
        setLoading(true);
        try {
            const res = await walletBalance(userData?.id);
            if (res.success === true) {
                setBalance(res.data.wallet_amount);
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
        <WalletContext.Provider value={{loading, balance, showWalletBalance}}>
            {children}
        </WalletContext.Provider>
    );
}

export { useWallet, WalletProvider };
