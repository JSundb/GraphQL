//Auth link https://01.gritlab.ax/api/auth/signin

export async function SignInUsingCredentials(nameOrEmail, password) {
    const credentials = btoa(`${nameOrEmail}:${password}`); //encode string in base-64

    let successAndError = []
    successAndError = await fetchToken(credentials)
    console.log("Just tried to fetch token, got:")
    console.log(successAndError[0], "and", successAndError[1])
    if (successAndError[0]) {
        const jwtToken = successAndError[1]
        localStorage.setItem("jwt", jwtToken)  // Store JWT for future requests
    }
    return successAndError[0]
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
        console.log("Login failed part 2")
        return [false, "Login not allowed from this location"];
    }
}

export async function checkToken(token) {
    try {
        const response = await fetch("https://01.gritlab.ax/api/auth/signin", { // Change link
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return [false, "Login not allowed from this location"];
    }
}

export async function FetchWithQuery(query) {
    const jwt = localStorage.getItem("jwt")
    if (!jwt) {
        console.log("No jwt found, returning to login...")
        // Should probably return to login screen here
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
                console.log("Session expired, logging out...")
                // Log out and return to login screen here
            } else {
                console.log("Failed to get data from API.")
            }
            return
        }

        const data = await res.json()
        return data.data
    } catch (error) {
        console.error("Error when fetching with query:", error)
    }
}