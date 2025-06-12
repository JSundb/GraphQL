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
    const minX = Math.min(...times), maxX = Math.max(...times);
    const minY = 0, maxY = Math.max(...values);

    const coords = dataPoints.map(p => {
        const x = margin.left + ((p.date.getTime() - minX) / (maxX - minX)) * w;
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
        return `<circle
      cx="${point.split(',')[0]}" cy="${point.split(',')[1]}"
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

function makeSkillsGraph(container, skills) {
    // skills: [{ name: String, pct: Number }, …]
    const svgWidth = 600;
    const barHeight = 20;
    const gap = 10;
    const margin = { left: 100, top: 10 };

    // find max for scaling (should be 100)
    const maxPct = 100;

    const height = margin.top + skills.length * (barHeight + gap);

    // build rects
    const rects = skills.map((s, i) => {
        const y = margin.top + i * (barHeight + gap);
        const barW = (s.pct / maxPct) * (svgWidth - margin.left - 20);
        return `
        <!-- ${s.name}: ${s.pct}% -->
        <text x="0" y="${y + barHeight * .75}" font-size="12">${s.name}</text>
        <rect x="${margin.left}" y="${y}" width="${barW}" height="${barHeight}" fill="#28a745" />
        <text x="${margin.left + barW + 5}" y="${y + barHeight * .75}" font-size="12">${s.pct}%</text>
      `;
    }).join("");

    // render SVG
    container.innerHTML = `
      <svg width="${svgWidth}" height="${height}">
        ${rects}
      </svg>`;
}