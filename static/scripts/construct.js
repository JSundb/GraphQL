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

    if ((dob.getMonth() > currentTime.getMonth()) || (dob.getMonth() === currentTime.getMonth() && dob.getDate() > currentTime.getDate())) {
        age -= 1 // Just to ensure that user isn't 1 year too old when birthday hasn't happened yet in current year
    }

    const exercises = XPData.data.aggregate.count
    const xp = XPData.data.aggregate.sum.amount

    const xpKB = Math.round(xp / 1000)

    pageArea.innerHTML += `
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
        accumulatedXP += obj.amount
    });

    let totalXP = accumulatedXP

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
    });
    makeProgressGraph(pageArea, graphData, totalXP)
}

function makeProgressGraph(container, dataPoints, totalXP) {
    const margin = { top: 10, right: 10, bottom: 60, left: 60 };
    const svgWidth = 1200, svgHeight = 800;
    const w = svgWidth - margin.left - margin.right;
    const h = svgHeight - margin.top - margin.bottom;

    const times = dataPoints.map(p => p.date.getTime());
    const values = dataPoints.map(p => p.xpAcc);

    const rawMin = new Date(Math.min(...times));
    const flooredMin = new Date(rawMin.getFullYear(), rawMin.getMonth(), 1);

    const now = new Date();
    const ceiledMax = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const minX = flooredMin.getTime();
    const maxX = ceiledMax.getTime();

    const minY = 0;
    const maxY = Math.max(...values);

    let gridAndLabels = '';
    for (let pct = 0; pct <= 100; pct += 10) {
        const y = margin.top + h - (pct / 100) * h;
        const xpVal = Math.round((pct / 100) * totalXP / 1000);
        gridAndLabels += `
        <line x1="${margin.left}" y1="${y}" x2="${margin.left + w}" y2="${y}"
              stroke="#e0e0e0" stroke-width="1" stroke-dasharray="4 2"/>
        <text x="${margin.left - 8}" y="${y - 4}" text-anchor="end" font-size="12" fill="#333">
          ${xpVal} kB
        </text>
        <text x="${margin.left - 8}" y="${y + 14}" text-anchor="end" font-size="12" fill="#666">
          ${pct}%
        </text>
      `;
    }

    const points = dataPoints.map(p => {
        const x = margin.left + ((p.date.getTime() - minX) / (maxX - minX)) * w;
        const y = margin.top + h - ((p.xpAcc - minY) / (maxY - minY)) * h;
        return { x, y, d: p };
    });

    const polyline = `
      <polyline fill="none" stroke="#0074d9" stroke-width="2"
                points="${points.map(pt => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')}"/>
    `;

    const circles = points.map(pt => `
      <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="5" fill="#0074d9" style="cursor:pointer">
        <title>
          ${pt.d.projName}\n
          Date: ${pt.d.date.toLocaleDateString()}\n
          Gained: ${pt.d.xpGain} kB\n
          Grade: ${pt.d.grade}\n
          Team: ${pt.d.team || "Solo"}
        </title>
      </circle>
    `).join('');

    let monthSVG = '';
    let cursor = new Date(flooredMin);
    const end = new Date(ceiledMax);

    while (cursor <= end) {
        const x = margin.left + ((cursor.getTime() - minX) / (maxX - minX)) * w;
        const label = cursor.toLocaleString('default', { month: 'short', year: '2-digit' });

        monthSVG += `
        <line x1="${x.toFixed(1)}" y1="${margin.top + h}"
              x2="${x.toFixed(1)}" y2="${margin.top + h + 4}"
              stroke="#333" stroke-width="1"/>
        <text x="${x.toFixed(1)}" y="${margin.top + h + 20}"
              text-anchor="middle" font-size="12" fill="#333">
          ${label}
        </text>
      `;

        cursor.setMonth(cursor.getMonth() + 1);
    }

    container.innerHTML += `
      <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        ${gridAndLabels}
  
        <!-- axes -->
        <line x1="${margin.left}" y1="${margin.top}"       x2="${margin.left}"       y2="${margin.top + h}" stroke="#333"/>
        <line x1="${margin.left}" y1="${margin.top + h}" x2="${margin.left + w}" y2="${margin.top + h}" stroke="#333"/>
  
        ${polyline}
        ${circles}
        ${monthSVG}
      </svg>
    `;
}


export async function ConstructUserSkills() {
    const pageArea = document.getElementById("graph-skills")
    const skillsData = await FetchWithQuery(SkillsQuery)
    const maxRadius = 100

    skillsData.user[0].skills.forEach(skill => {
        let skillName = skill.type
        skillName = skillName.replace(/_/g, " ") // Replace "_" with " "
        skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1) // Add capitalization
        pageArea.innerHTML += makeSkillCircle(skill, maxRadius, skillName)
    });
}

function makeSkillCircle(skill, maxRadius, skillName) {
    const radius = (skill.amount / 100) * maxRadius;

    //  ticks at 10%, 20%, … 90%
    let tickCircles = '';
    for (let pct = 10; pct < 100; pct += 10) {
        const rTick = (pct / 100) * maxRadius;
        tickCircles += `
        <circle
          cx="${maxRadius}" cy="${maxRadius}"
          r="${rTick}"
          fill="none"
          stroke="#b5b5b5"
          stroke-width="1"
        />`;
    }

    return `
      <div class="skill-widget">
        <div class="skill-label">${skillName} (${skill.amount}%)</div>
        <svg
          width="${2 * maxRadius}"
          height="${2 * maxRadius}"
          viewBox="0 0 ${2 * maxRadius} ${2 * maxRadius}"
        >
          <!-- background ring -->
          <circle
            cx="${maxRadius}" cy="${maxRadius}"
            r="${maxRadius}"
            fill="lightgray"
          />
          <!-- 10% steps -->
          ${tickCircles}
          <!-- filled skill level -->
          <circle
            cx="${maxRadius}" cy="${maxRadius}"
            r="${radius}"
            fill="#0074d9"
          />
        </svg>
      </div>
    `;
}