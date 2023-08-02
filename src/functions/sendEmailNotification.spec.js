/* eslint-disable no-undef */
import { app } from '@azure/functions'
import { UkGovNotify } from '../services/ukGovNotify.js'
import './sendEmailNotification.js'

jest.mock('@azure/functions', () => ({
  app: {
    http: jest.fn()
  }
}))

jest.mock('../services/ukGovNotify.js')

describe('sendEmailNotification function', () => {
  let mockContext, mockRequest

  beforeEach(() => {
    process.env.NotifyApiKey = 'yourApiKey'
    mockContext = {
      log: jest.fn()
    }
    mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'email@test.com',
        personalisation: {
          firstName: 'John',
          applicationRef: 'Ref123',
          applicationDate: '2022-01-01'
        }
      })
    }
    UkGovNotify.mockClear()
    UkGovNotify.prototype.emailNotification.mockResolvedValue(true)
  })

  it('should return status 200 and successful message when email is sent', async () => {
    const handler = app.http.mock.calls[0][1].handler
    const result = await handler(mockRequest, mockContext)

    expect(result).toEqual({
      status: 200,
      body: 'Email sent successfully'
    })
    expect(UkGovNotify.prototype.emailNotification).toHaveBeenCalled()
  })

  it('should return status 400 and failure message when email is not sent', async () => {
    UkGovNotify.prototype.emailNotification.mockResolvedValue(false)

    const handler = app.http.mock.calls[0][1].handler
    const result = await handler(mockRequest, mockContext)

    expect(result).toEqual({
      status: 400,
      body: 'Email send fail'
    })
    expect(UkGovNotify.prototype.emailNotification).toHaveBeenCalled()
  })
})
