const usernameEmailField = document.getElementById("name-email-input")
usernameEmailField.style.backgroundColor = "lightblue"

const passwordField = document.getElementById("password-input")
passwordField.style.backgroundColor = "lightblue"

const loginButton = document.getElementById("login-button")

loginButton.addEventListener("click", () => {
    console.log("Logging in...")
    let values
    values = getAndResetInput()
    console.log(values[0])
    console.log(values[1])
})

function getAndResetInput() {
    const usernameOrEmail = usernameEmailField.value
    const password = passwordField.value

    usernameEmailField.value = ""
    passwordField.value = ""

    console.log(`Got username/email: ${usernameOrEmail} and password: ${password}`)

    return [usernameOrEmail, password]
}