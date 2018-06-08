module.exports = (seperator, message) => {
  return new Promise(function (resolve, reject) {
    let msg = message.text.split(' ')
    let itemsProcessed = 0
    let issues = []
    for (let i = 0; i < msg.length; i++) {
      let text = msg[i]
      if (text.indexOf('/') > -1 && text.indexOf(seperator) > -1) {
        let parts = text.split(seperator)
        let issue = {
          parts: parts,
          namespace: parts[0],
          iid: parts[1]
        }
        issues.push(issue)
      }
      itemsProcessed++
      if (itemsProcessed === msg.length) {
        return resolve(issues)
      }
    }
  })
}
