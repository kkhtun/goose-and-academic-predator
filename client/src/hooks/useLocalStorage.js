import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
    // Get initial value from localStorage or fallback to initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Update localStorage whenever storedValue changes
    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    // Sync across tabs/components
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key) {
                setStoredValue(
                    event.newValue ? JSON.parse(event.newValue) : null,
                );
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;
