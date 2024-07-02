import { API_URL } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async function ({ event, resolve }) {
    console.log("Middleware running");
    if (
        !(
            event.url.pathname.startsWith("/login") ||
            event.url.pathname.startsWith("/register")
        )
    ) {
        console.log("Auth path");
        let token = event.cookies.get("token");
        if (token) {
            try {
                const res = await fetch(`${API_URL}/seller/info`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        cookie: `token=${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    const response = await resolve(event);
                    return response;
                } else {
                    // Handle error
                    throw new Error(
                        `Fetch error: ${res.status} - ${res.statusText}`
                    );
                }
            } catch (err) {
                console.error(err);
                throw redirect(301, "/login");
            }
        } else {
            console.log("No token");
        }
        throw redirect(301, "/login");
    }

    const response = await resolve(event);
    return response;
};
