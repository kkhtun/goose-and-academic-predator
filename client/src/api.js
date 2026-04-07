import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_HOST + "/api";

export async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
}

export async function apiPost(path, body) {
    const res = await fetch(API_BASE + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? {}),
    });

    let data;

    try {
        data = await res.json(); // try parse response
    } catch {
        data = null;
    }

    if (!res.ok) {
        const message = data?.message || "Something went wrong";
        throw new Error(message);
    }

    // success
    return data;
}
