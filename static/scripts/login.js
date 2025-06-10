import { SignInUsingCredentials } from "./fetch.js"
import { StartProfilePage } from "./profile.js"

let loggedIn = false

export function StartLoginPage() {
    const usernameEmailField = document.getElementById("name-email-input")
    usernameEmailField.style.backgroundColor = "lightblue"

    const passwordField = document.getElementById("password-input")
    passwordField.style.backgroundColor = "lightblue"

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
    console.log(values[0]) // Username/Email
    console.log(values[1]) // Password
    let success = await SignInUsingCredentials(values[0], values[1])
    if (success) {
        loggedIn = true
        console.log("Login successful")
        StartProfilePage()
    } else {
        loggedIn = false
        console.log("Login failed")
    }
}

function getAndResetInput(usernameEmailField, passwordField) {
    const usernameOrEmail = usernameEmailField.value
    const password = passwordField.value

    usernameEmailField.value = ""
    passwordField.value = ""

    console.log(`Got username/email: ${usernameOrEmail} and password: ${password}`)

    return [usernameOrEmail, password]
}

export function LoginState(getOrSet, newState) {
    if (getOrSet === "get") {
        return loggedIn
    } else if (getOrSet === "set") {
        loggedIn = newState
    }
}