'use strict'

const got = require('got')

class Jira {

  constructor(base, user) {
    this.BASE = ''
    this.USER = ''
    this.USER_PASS = ''
  }

  getAuth() {
    return this.USER + ':' + this.USER_PASS
  }

  getIssues(jql) {
    let self = this

    if (!jql) jql = 'assignee=' + this.USER + ' AND status!=done'

    return got(this.BASE + '/search?jql=' + jql,
      {
        auth: self.getAuth(),
        json: true
      })
      .then((res) => {
        return res.body.issues
      })
  }

  assignUser(issue, user) {
    let self = this
    return got.put(issue,
      {
        auth: self.getAuth(),
        body: '{ "fields": { "assignee": { "name": "' + user + '" } } }',
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  getAssignable(issueKey) {
    let self = this
    return got(this.BASE + '/user/assignable/search?issueKey=' + issueKey,
      {
        auth: self.getAuth(),
        json: true
      })
      .then((res) => {
        return res.body
      })
  }

}

module.exports = Jira
