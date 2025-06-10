import { FetchWithQuery } from "./fetch.js"
import { ProfileQuery, ProgressQuery, SkillsQuery, XPQuery } from "./consts.js"

export async function ConstructUserDetails() {
    const pageArea = document.getElementById("user-details")
    const userData = await FetchWithQuery(ProfileQuery)
    const XPData = await FetchWithQuery(XPQuery)
    const user = userData.user[0]
    const details = user.details
    const dob = new Date(details.dateOfBirth)
    const currentTime = new Date()
    const age = currentTime.getFullYear() - dob.getFullYear()

    const exercises = XPData.data.aggregate.count
    const xp = XPData.data.aggregate.sum.amount

    const xpKB = Math.round(xp / 1000)


    // Check these later:
    pageArea.innerHTML = `
    <div id="username">Username: ${user.username}</div>
    <div id="email">Email: ${user.email}</div>
    <div id="first-name">First Name: ${user.firstName}</div>
    <div id="last-name">Last Name: ${user.lastName}</div>
    <div id="gender">Gender: ${details.gender}</div>
    <div id="age">Age: ${age}</div>
    <div id="">XP: ${xpKB}kB</div>
    <div id="">Completed Exercises: ${exercises}</div>
    `
}

export async function ConstructUserProgress() {
    const pageArea = document.getElementById("graph-progress")
    const userData = await FetchWithQuery(ProgressQuery)
}

export async function ConstructUserSkills() {
    const pageArea = document.getElementById("graph-skills")
    const userData = await FetchWithQuery(SkillsQuery)
}