import { FetchWithQuery } from "./fetch.js"
import { ProfileQuery, ProgressQuery, SkillsQuery, XPQuery } from "./consts.js"
import { LoginState } from "./login.js"

export async function ConstructLogoutButton() {
    const logoutButton = document.getElementById("logout-button")
    logoutButton.addEventListener("click", () => {
        localStorage.clear()
        LoginState("set", false)
        location.reload()
    })
}

export async function ConstructUserDetails() {
    const pageArea = document.getElementById("user-details")
    const userData = await FetchWithQuery(ProfileQuery)
    const XPData = await FetchWithQuery(XPQuery)
    const user = userData.user[0]
    const details = user.details
    const dob = new Date(details.dateOfBirth)
    const currentTime = new Date()
    let age = currentTime.getFullYear() - dob.getFullYear()

    if ((dob.getMonth() > currentTime.getMonth()) || (dob.getMonth() === currentTime.getMonth() && dob.getDate > currentTime.getDate())) {
        age -= 1 // Just to ensure that user isn't 1 year too old when birthday hasn't happened yet in current year
    }

    const exercises = XPData.data.aggregate.count
    const xp = XPData.data.aggregate.sum.amount

    const xpKB = Math.round(xp / 1000)

    pageArea.innerHTML = `
    <div id="username">Username: ${user.username}</div>
    <div id="email">Email: ${user.email}</div>
    <div id="first-name">First Name: ${user.firstName}</div>
    <div id="last-name">Last Name: ${user.lastName}</div>
    <div id="gender">Gender: ${details.gender}</div>
    <div id="age">Age: ${age}</div>
    <div id="xp">XP: ${xpKB}kB</div>
    <div id="total-exercises">Completed Exercises: ${exercises}</div>
    <br><br>
    `
}

export async function ConstructUserProgress() {
    const pageArea = document.getElementById("graph-progress")
    const progressData = await FetchWithQuery(ProgressQuery)

    let accumulatedXP = 0
    progressData.user[0].xps.forEach(obj => {
        console.log("Adding xp based on", obj.path.project[0].object.projectName)
        accumulatedXP += obj.amount
    });

    const sortedData = progressData.user[0].xps
    .filter(obj => obj.path.project[0]?.updatedAt)
    .sort((a, b) => new Date(b.path.project[0].updatedAt) - new Date(a.path.project[0].updatedAt))

    sortedData.forEach(obj => {
        if (obj.path.project[0].isDone === false) return;
        accumulatedXP -= obj.amount
        console.log(obj)
        pageArea.innerHTML += `
    <br><br>
    <div id="project-name">Name: ${obj.path.project[0].object.projectName}</div>
    <div id="xp-gained">XP Gained: ${Math.round(obj.amount/1000)}kB</div>
    <div id="xp-total">Total XP Before: ${Math.round(accumulatedXP/1000)}kB</div>
    <div id="grade">Grade: ${obj.path.project[0].grade.toFixed(2)}</div>
    `
        let index = 0
        obj.path.project[0].group.members.forEach(member => {
            index++
            pageArea.innerHTML += `
    <div id="member">Teammate ${index}: ${member.teamMate}</div>
            `
        });
    });
}

function makeProgressGraph() {

}

export async function ConstructUserSkills() {
    const pageArea = document.getElementById("graph-skills")
    const skillsData = await FetchWithQuery(SkillsQuery)

    skillsData.user[0].skills.forEach(skill => {
        let skillName = skill.type
        skillName = skillName.replace(/_/g, " ") // Replace "_" with " "
        skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1) // Add capitalization
        if (skillName === "Level") {
            pageArea.innerHTML += `
    <br><br>
    <div id="level">Your Current Level: ${skill.amount}</div>
    `
        } else {
            pageArea.innerHTML += `
    <br><br>
    <div id="skill-name">${skillName}: </div>
    <div id="skill-value">${skill.amount}%</div>
    `
        }
    });
}

function makeSkillsGraph() {

}