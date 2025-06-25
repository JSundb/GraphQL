export const LOGINPAGE = `    <div id="login-page-content">
        <div id="error-message" hidden></div>
        <span>Sign in:</span>
        <input id="name-email-input" placeholder="Username/Email">
        <input type="password" id="password-input" placeholder="Password">
        <button id="login-button">Login</button>
    </div>`

export const PROFILEPAGE = `    <div id="profile-page-content">
        <div id="error-message" hidden></div>
        <button id="logout-button">Log out</button>
        <div id="user-details">
        <h2>Details:</h2><br><br>
        </div>
        <div id="graph-progress">
        <h2>Progress:</h2><br><br>
        </div>
        <div id="graph-skills">
        <h2>Skills:</h2><br><br>
        </div>
    </div>`

export const ProfileQuery = `{
  user {
    id
    username: login
    email
    firstName
    lastName
    auditRatio
    details: attrs
  }
}`

export const XPQuery = `{
data: transaction_aggregate(where: {type: {_eq: "xp"}, event: {id: {_eq: 104}}}) {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
}`

export const ProgressQuery = `{
  user {
    xps(
      where: {pathByPath: {progresses: {object: {type: {_in: ["project", "piscine"]}}}}}
    ) {
      amount
      path: pathByPath {
        project: progresses(order_by: {updatedAt: desc}) {
          object {
            type
            projectName: name
          }
          isDone
          grade
          createdAt
          updatedAt
          group {
            members {
              teamMate: userLogin
            }
          }
        }
      }
    }
  }
}`

export const SkillsQuery = `{
  user {
    skills: transactions(
      where: { type: { _like: "skill%" } }
      distinct_on: [type]
      order_by: [{ type: asc }, { amount: desc }]
    ) {
      type
      amount
    }
  }
}`