import { FetchWithQuery } from "./fetch.js"
import { ProfileQuery, ProgressQuery, SkillsQuery, XPQuery } from "./consts.js"
import { LoginState } from "./login.js"
import { DetailsData, XPData, ProgressData, SkillsData } from "./mockData.js"

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
    const userData = DetailsData // REMOVE THIS
    /*     const userData = await FetchWithQuery(ProfileQuery)
        const XPData = await FetchWithQuery(XPQuery) */
    const user = userData.user[0]
    const details = user.details
    const dob = new Date(details.dateOfBirth)
    const currentTime = new Date()
    let age = currentTime.getFullYear() - dob.getFullYear()

    if ((dob.getMonth() > currentTime.getMonth()) || (dob.getMonth() === currentTime.getMonth() && dob.getDate() > currentTime.getDate())) {
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
    const progressData = ProgressData // REMOVE THIS
    /* const progressData = await FetchWithQuery(ProgressQuery) */

    let accumulatedXP = 0
    progressData.user[0].xps.forEach(obj => {
        console.log("Adding xp based on", obj.path.project[0].object.projectName)
        accumulatedXP += obj.amount
    });

    const sortedData = progressData.user[0].xps
        .filter(obj => obj.path.project[0]?.updatedAt)
        .sort((a, b) => new Date(b.path.project[0].updatedAt) - new Date(a.path.project[0].updatedAt))

    let graphData = []

    sortedData.forEach(obj => {
        const project = obj.path.project[0]
        if (project.isDone === false) return;
        accumulatedXP -= obj.amount

        let teamMates = []

        if (project.group !== null && project.group !== undefined) {
            const members = project.group.members
            console.log(`In project: ${project.object.projectName}`, members)
            members.forEach((member, index) => {
                teamMates += `${member.teamMate}`
                if (index < members.length - 1) {
                    teamMates += ", "
                }
            });
        }
        let dataPoint = {
            date: new Date(project.updatedAt),
            xpAcc: Math.round(accumulatedXP / 1000),
            xpGain: Math.round(obj.amount / 1000),
            projName: project.object.projectName,
            grade: project.grade.toFixed(2),
            team: teamMates
        }
        graphData.push(dataPoint)
        /*         pageArea.innerHTML += `
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
         */
    });
    makeProgressGraph(pageArea, graphData)
}

function makeProgressGraph(container, dataPoints) {
    const svgWidth = 600;
    const svgHeight = 300;
    const margin = { top: 10, right: 10, bottom: 30, left: 50 };
    const w = svgWidth - margin.left - margin.right;
    const h = svgHeight - margin.top - margin.bottom;

    const times = dataPoints.map(p => p.date.getTime());
    const values = dataPoints.map(p => p.xpAcc);
    const minX = Math.min(...times), maxX = Math.max(...times); // x axis = time
    const minY = 0, maxY = Math.max(...values); // y axis = xp

    const coords = dataPoints.map(p => {
        const x = margin.left + ((p.date.getTime() - minX) / (maxX - minX)) * w; // 0-1 float multiplied by width, similar below...
        const y = margin.top + h - ((p.xpAcc - minY) / (maxY - minY)) * h;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const polyline = `<polyline fill="none" stroke="#0074d9" stroke-width="2" points="${coords.join(" ")}" />`

    const circles = coords.map((point, index) => {
        const data = dataPoints[index]
        const tooltip =
            `Project Name: ${data.projName}\n` +
            `Updated At: ${data.date}\n` +
            `Gained XP: ${data.xpGain}kB\n` +
            `Grade: ${data.grade}\n` +
            `Team: ${data.team}\n`
        const circleX = point.split(',')[0];
        const circleY = point.split(',')[1];
        return `<circle
      cx="${circleX}" cy="${circleY}"
      r="4" fill="#0074d9" style="cursor: pointer;">
      <title>${tooltip}</title>
    </circle>`
    }).join("")

    // Render SVG
    container.innerHTML = `
      <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        <!-- axes -->
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + h}" stroke="#333" />
        <line x1="${margin.left}" y1="${margin.top + h}" x2="${margin.left + w}" y2="${margin.top + h}" stroke="#333" />
        <!-- line -->
        ${polyline}
        <!-- data circles -->
        ${circles}
      </svg>`;
}

export async function ConstructUserSkills() {
    const pageArea = document.getElementById("graph-skills")
    const skillsData = SkillsData // REMOVE THIS
    /* const skillsData = await FetchWithQuery(SkillsQuery) */
    const maxRadius = 100

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
            pageArea.innerHTML += makeSkillCircle(skill, maxRadius, skillName)
        }
    });
}

function makeSkillCircle(skill, maxRadius, skillName) {
    const radius = (skill.amount/100) * maxRadius
    return `
    <div class="skill-widget">
      <div class="skill-label">${skillName} (${skill.amount}%)</div>
      <br><br>
      <svg width="${2*maxRadius}" height="${2*maxRadius}" viewBox="0 0 ${2*maxRadius} ${2*maxRadius}">
        <!-- max circle (gray) -->
        <circle
          cx="${maxRadius}" cy="${maxRadius}"
          r="${maxRadius}"
          fill="lightgray" />

        <!-- skill circle (blue) -->
        <circle
          cx="${maxRadius}" cy="${maxRadius}"
          r="${radius}"
          fill="#0074d9" />
      </svg>
    </div>
    <br><br><br>
  `;
}