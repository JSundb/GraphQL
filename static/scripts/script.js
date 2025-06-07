import { LOGINPAGE, PROFILEPAGE } from "./consts.js";
import { LoginState, StartLoginPage } from "./login.js";
import { StartProfilePage } from "./profile.js";

document.addEventListener("DOMContentLoaded", () => {
    const contentArea = document.getElementById("content-area")
    contentArea.innerHTML = ""
    let loggedIn = LoginState("get")
    if (!loggedIn) {
        contentArea.innerHTML = LOGINPAGE
        StartLoginPage()
    } else {
        contentArea.innerHTML = PROFILEPAGE
        StartProfilePage()
    }
});