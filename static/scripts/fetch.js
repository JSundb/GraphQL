//Auth link https://01.gritlab.ax/api/auth/signin

export function SignInUsingCredentials(nameOrEmail, password) {
    const credentials = btoa(`${nameOrEmail}:${password}`); //encode string in base-64

    let successAndError = []
    successAndError = fetchToken(credentials)
    if (successAndError[0]) {
        const jwtToken = successAndError[1]
        localStorage.setItem("jwt", jwtToken)  // Store JWT for future requests
    }
    return successAndError[1]
}



/* async function logIn(e) {
    e.preventDefault(); // don't reload at submit form
    const nameOrEmail = e.target.useremail.value;
    const password = e.target.password.value;
    const credentials = btoa(`${nameOrEmail}:${password}`); //encode string in base-64

    const [success, result] = await getJWT(credentials);

    if (success) {
        localStorage.setItem("jwt", result);  // Store JWT for future requests
        localStorage.setItem("username", nameOrEmail); // Store username for display
        loginErrorMessage.textContent = '';
        console.log("Login successful");
        updateUI();
        loadContent();
    } else {
        console.error("Login failed:", result);
        loginErrorMessage.textContent = result;
    }
} */


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

export function GetUserDetails() {

}

export function GetUserProgress() {

}

export function GetUserSkills() {

}