/* eslint-disable no-undef */
import { UkGovNotify } from '../services/ukGovNotify.js'

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn().mockImplementation((templateId, emailAddress, options) => {
      return new Promise((resolve, reject) => {
        resolve(true)
      })
    })
  }))
}))

describe('UkGovNotify', () => {
  let mockNotifyClientInstance, mockContext, mockEmailData

  beforeEach(() => {
    const NotifyClient = require('notifications-node-client').NotifyClient
    mockNotifyClientInstance = new NotifyClient('testApiKey')

    mockContext = {
      log: jest.fn(),
      error: jest.fn()
    }

    mockEmailData = {
      email: 'test@test.com',
      personalisation: {
        firstName: 'John',
        applicationRef: '123456',
        applicationDate: '2023-07-30'
      }
    }
  })

  it('should send email notification and return true', async () => {
    const ukGovNotify = new UkGovNotify(mockNotifyClientInstance) // passing the mock instance
    const result = await ukGovNotify.emailNotification(mockContext, mockEmailData)

    expect(result).toBe(true)
    expect(mockNotifyClientInstance.sendEmail).toHaveBeenCalled()
    expect(mockContext.log).toHaveBeenCalled()
  })

  it('should fail to send email notification and return false', async () => {
    // Overriding sendEmail to reject
    mockNotifyClientInstance.sendEmail.mockImplementation((templateId, emailAddress, options) => {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(false)
      })
    })

    const ukGovNotify = new UkGovNotify(mockNotifyClientInstance)
    const result = await ukGovNotify.emailNotification(mockContext, mockEmailData)

    expect(result).toBe(false)
    expect(mockNotifyClientInstance.sendEmail).toHaveBeenCalled()
    expect(mockContext.error).toHaveBeenCalled()
  })
})
