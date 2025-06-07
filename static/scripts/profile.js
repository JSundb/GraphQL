import { GetUserDetails, GetUserProgress, GetUserSkills } from "./fetch.js";

export function StartProfilePage() {
    addUserDetails();
    addUserProgress();
    addUserSkills();
}

function addUserDetails() {
    const pageArea = document.getElementById("user-details")
    const data = GetUserDetails()

    // Check these later:
    pageArea.innerHTML = `
    <div id="username">${data.username}</div>
    <div id="email">${data.email}</div>
    <div id="first-name">${data.firstName}</div>
    <div id="last-name">${data.lastName}</div>
    <div id="gender">${data.gender}</div>
    <div id="age">${data.age}</div>
    `
}

function addUserProgress() {
    const pageArea = document.getElementById("graph-progress")
    const data = GetUserProgress()
}

function addUserSkills() {
    const pageArea = document.getElementById("graph-skills")
    const data = GetUserSkills()
}