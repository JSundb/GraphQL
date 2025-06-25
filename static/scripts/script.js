import { LOGINPAGE, PROFILEPAGE } from "./consts.js";
import { LoginState, StartLoginPage } from "./login.js";
import { StartProfilePage } from "./profile.js";
import { SetErrorMessage } from "./error.js";

document.addEventListener("DOMContentLoaded", () => {
    const contentArea = document.getElementById("content-area")
    contentArea.innerHTML = ""
    const pendingError = sessionStorage.getItem("errorMessage")
    sessionStorage.removeItem("errorMessage")
    let loggedIn = LoginState("get")
    if (!loggedIn) {
        contentArea.innerHTML = LOGINPAGE
        StartLoginPage()
    } else {
        contentArea.innerHTML = PROFILEPAGE
        StartProfilePage()
    }
    if (pendingError) {
        SetErrorMessage(pendingError, true)
    }
});