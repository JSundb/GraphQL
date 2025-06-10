import { FetchWithQuery } from "./fetch.js"
import { ProfileQuery } from "./consts.js"

export async function ConstructUserDetails() {
    const pageArea = document.getElementById("user-details")
    const data = await FetchWithQuery(ProfileQuery)
    const user = data.user[0]
    const details = user.details
    const dob = new Date(details.dateOfBirth)
    const currentTime = new Date()
    const age = currentTime.getFullYear() - dob.getFullYear()

    console.log("age:", age)

    // Check these later:
    pageArea.innerHTML = `
    <div id="username">Username: ${user.username}</div>
    <div id="email">Email: ${user.email}</div>
    <div id="first-name">First Name: ${user.firstName}</div>
    <div id="last-name">Last Name: ${user.lastName}</div>
    <div id="gender">Gender: ${details.gender}</div>
    <div id="age">Age: ${age}</div>
    `
}

/* function addUserProgress() {
    const pageArea = document.getElementById("graph-progress")
    const data = GetUserProgress()
}

function addUserSkills() {
    const pageArea = document.getElementById("graph-skills")
    const data = GetUserSkills()
} */