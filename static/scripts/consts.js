export const LOGINPAGE = `    <div id="login-page-content">
        <span>Sign in:</span>
        <input id="name-email-input" placeholder="Username/Email">
        <input type="password" id="password-input" placeholder="Password">
        <button id="login-button">Login</button>
    </div>`

export const PROFILEPAGE = `    <div id="profile-page-content">
        <div id="user-details">Details:</div>
        <div id="graph-progress">Progress:</div>
        <div id="graph-skills">Skills:</div>
    </div>`

export const ProfileQuery = `{
  user {
    id
    login: username
    email
    firstName
    lastName
    auditRatio
  }
  transaction_aggregate(where: {type: {_eq: "xp"}, event: {id: {_eq: 104}}}) {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
}`