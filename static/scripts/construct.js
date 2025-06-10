import { FetchWithQuery } from "./fetch.js"
import { ProfileQuery } from "./consts.js"

export async function ConstructUserDetails() {
    const pageArea = document.getElementById("user-details")
    const data = await FetchWithQuery(ProfileQuery)

    console.log("Got data!", data)

    const user = data.user[0]

    console.log("user =", user)

    // Check these later:
    pageArea.innerHTML = `
    <div id="username">Username: ${user.username}</div>
    <div id="email">Email: ${user.email}</div>
    <div id="first-name">First Name: ${user.firstName}</div>
    <div id="last-name">Last Name: ${user.lastName}</div>
    <div id="gender">Gender: ${user.gender}</div>
    <div id="age">Age: ${user.age}</div>
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