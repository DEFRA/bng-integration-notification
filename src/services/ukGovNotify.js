export class UkGovNotify {
  constructor (notifyClientInstance) {
    this.notifyClientInstance = notifyClientInstance
  }

  emailNotification (mailNotificationContext, emailData) {
    return new Promise((resolve, reject) => {
      const templateId = process.env.EmailTemplateId
      const emailAddress = emailData.email
      const personalisation = {
        first_name: emailData.personalisation.firstName,
        applicationRef: emailData.personalisation.applicationRef,
        application_date: emailData.personalisation.applicationDate
      }
      this.notifyClientInstance
        .sendEmail(templateId, emailAddress, {
          personalisation,
          reference: 'your_reference_here'
        })
        .then(response => {
          mailNotificationContext.log(response)
          resolve(true)
        })
        .catch(err => {
          mailNotificationContext.error(err.response?.data)
          resolve(false)
        })
    })
  }
}
