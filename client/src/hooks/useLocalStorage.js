import { useState, useEffect } from "react";

const LOCAL_STORAGE_EVENT = "local-storage-update";

export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    });

    const setValue = (value) => {
        const valueToStore =
            value instanceof Function ? value(storedValue) : value;

        localStorage.setItem(key, JSON.stringify(valueToStore));
        setStoredValue(valueToStore);

        // 🔥 Notify other components
        window.dispatchEvent(
            new CustomEvent(LOCAL_STORAGE_EVENT, {
                detail: { key, value: valueToStore },
            }),
        );
    };

    useEffect(() => {
        const handleChange = (event) => {
            if (event.detail.key === key) {
                setStoredValue(event.detail.value);
            }
        };

        window.addEventListener(LOCAL_STORAGE_EVENT, handleChange);

        return () => {
            window.removeEventListener(LOCAL_STORAGE_EVENT, handleChange);
        };
    }, [key]);

    return [storedValue, setValue];
}

// function useLocalStorage(key, initialValue) {
//     // Get initial value from localStorage or fallback to initialValue
//     const [storedValue, setStoredValue] = useState(() => {
//         try {
//             const item = localStorage.getItem(key);
//             return item ? JSON.parse(item) : initialValue;
//         } catch (error) {
//             console.error(error);
//             return initialValue;
//         }
//     });

//     // Update localStorage whenever storedValue changes
//     const setValue = (value) => {
//         try {
//             const valueToStore =
//                 value instanceof Function ? value(storedValue) : value;
//             setStoredValue(valueToStore);
//             localStorage.setItem(key, JSON.stringify(valueToStore));
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     // Sync across tabs/components
//     useEffect(() => {
//         const handleStorageChange = (event) => {
//             if (event.key === key) {
//                 setStoredValue(
//                     event.newValue ? JSON.parse(event.newValue) : null,
//                 );
//             }
//         };

//         window.addEventListener("storage", handleStorageChange);
//         return () => window.removeEventListener("storage", handleStorageChange);
//     }, [key]);

//     return [storedValue, setValue];
// }

// export default useLocalStorage;
