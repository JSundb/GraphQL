import { SignInUsingCredentials } from "./fetch.js"
import { StartProfilePage } from "./profile.js"
import { SetErrorAndReload } from "./error.js"

let loggedIn = false

export function StartLoginPage() {
    const usernameEmailField = document.getElementById("name-email-input")
    const passwordField = document.getElementById("password-input")
    const loginButton = document.getElementById("login-button")

    loginButton.addEventListener("click", async () => {
        await sendCredentials(usernameEmailField, passwordField)
    })

    usernameEmailField.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            await sendCredentials(usernameEmailField, passwordField)
        }
    })

    passwordField.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            await sendCredentials(usernameEmailField, passwordField)
        }
    })
}

async function sendCredentials(usernameEmailField, passwordField) {
    console.log("Logging in...")
    let values
    values = getAndResetInput(usernameEmailField, passwordField)
    let successAndError = await SignInUsingCredentials(values[0], values[1])
    if (successAndError[0]) {
        loggedIn = true
        console.log("Login successful")
        StartProfilePage()
    } else {
        loggedIn = false
        console.log("Login failed")
        SetErrorAndReload(`${successAndError[1]}`)
    }
}

function getAndResetInput(usernameEmailField, passwordField) {
    const usernameOrEmail = usernameEmailField.value
    const password = passwordField.value

    usernameEmailField.value = ""
    passwordField.value = ""

    return [usernameOrEmail, password]
}

export function LoginState(getOrSet, newState) {
    if (getOrSet === "get") {
        return loggedIn
    } else if (getOrSet === "set") {
        loggedIn = newState
        window.location.reload()
    }
}