import { LoginState } from "./login.js";

export function SetErrorAndReload(message) {
    sessionStorage.setItem("errorMessage", `${message}`);
    LoginState("set", false)
}

export function SetErrorMessage(setText, showError) {
    let errElement = document.getElementById("error-message")
    errElement.innerText = setText
    if (showError) {
      errElement.hidden = false
    } else {
      errElement.hidden = true
    }
  }