import { ConstructLogoutButton, ConstructUserDetails, ConstructUserProgress, ConstructUserSkills } from "./construct.js";
import { PROFILEPAGE } from "./consts.js"

export function StartProfilePage() {
    const contentArea = document.getElementById("content-area")
    contentArea.innerHTML = PROFILEPAGE
    ConstructLogoutButton()
    ConstructUserDetails()
    ConstructUserProgress()
    ConstructUserSkills()
}