import { SetErrorAndReload } from "./error.js";

export async function SignInUsingCredentials(nameOrEmail, password) {
    const credentials = btoa(`${nameOrEmail}:${password}`); //encode string in base-64

    let successAndError = []
    successAndError = await fetchToken(credentials)
    if (successAndError[0]) {
        const jwtToken = successAndError[1]
        localStorage.setItem("jwt", jwtToken)  // Store JWT for future requests
    }
    return successAndError
}

export async function fetchToken(credentials) {
    try {
        const response = await fetch("https://01.gritlab.ax/api/auth/signin", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        if (response.ok) {
            return [true, data];
        } else {
            return [false, data.error];
        }
    } catch (error) {
        return [false, "Login not allowed from this location"];
    }
}

export async function FetchWithQuery(query) {
    const jwt = localStorage.getItem("jwt")
    if (!jwt) {
        SetErrorAndReload("No jwt found, returning to login.")
        return
    }

    try {
        const res = await fetch(`https://01.gritlab.ax/api/graphql-engine/v1/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({ query }),
        });

        if (!res.ok) {
            if (res.status === 401) {
                SetErrorAndReload("Session expired, returning to login.")
            } else {
                SetErrorAndReload("Failed to get data from API.")
            }
            return
        }

        const data = await res.json()
        return data.data
    } catch (error) {
        SetErrorAndReload(`Error when fetching with query: ${error}`)
    }
}