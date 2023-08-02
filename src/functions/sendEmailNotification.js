import { app } from '@azure/functions'
import { UkGovNotify } from '../services/ukGovNotify.js'
import notifyClient from 'notifications-node-client'

app.http('sendEmailNotification', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, emailNotificationContext) => {
    emailNotificationContext.log(`Http function processed request for url "${request.url}"`)
    const emailData = await request.json()

    const apiKey = process.env.NotifyApiKey
    const notifyClientInstance = new notifyClient.NotifyClient(apiKey)

    const ukGovNotify = new UkGovNotify(notifyClientInstance)

    const emailNotification = await ukGovNotify.emailNotification(emailNotificationContext, emailData)
    if (emailNotification) {
      return {
        status: 200,
        body: 'Email sent successfully'
      }
    } else {
      return {
        status: 400,
        body: 'Email send fail'
      }
    }
  }
})
