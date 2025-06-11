export const LOGINPAGE = `    <div id="login-page-content">
        <span>Sign in:</span>
        <input id="name-email-input" placeholder="Username/Email">
        <input type="password" id="password-input" placeholder="Password">
        <button id="login-button">Login</button>
    </div>`

export const PROFILEPAGE = `    <div id="profile-page-content">
        <button id="logout-button">Log out</button>
        <div id="user-details">Details:</div>
        <div id="graph-progress">Progress:</div>
        <div id="graph-skills">Skills:</div>
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
    projects: progresses(
      order_by: { updatedAt: desc }
    	where: {object: {type: {_eq: "project"}}}) {
      object {
        projectName: name
      }
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
}`

export const SkillsQuery = `{
  user {
    skills: transactions(
      order_by: [{type: asc}, {amount: desc}]
      distinct_on: [type]
      where: {
      _or: [
      {type: {_like: "skill%"}}
      {type: {_eq: "level"}}
      ]}
    ) {
      type
      amount
    }
  }
}`