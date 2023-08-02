const notifyClient = require('notifications-node-client')
const UkGovNotify = require('../bng-integration-notification-business-logic/ukGovNotify.js')
const sendResponse = (context, status, body) => {
  context.res = {
    status,
    body
  }
}
module.exports = async function (context, req) {
  context.log(`Http function processed request for url "${req.url}"`)
  const emailData = req.body
  const apiKey = process.env.NotifyApiKey

  const notifyClientInstance = new notifyClient.NotifyClient(apiKey)
  const ukGovNotifyInstance = new UkGovNotify(notifyClientInstance)
  const emailNotification = await ukGovNotifyInstance.emailNotification(context, emailData)

  if (emailNotification) {
    return sendResponse(context, 200, 'Email sent successfully.')
  } else {
    return sendResponse(context, 400, 'Email send fail.')
  }
}
