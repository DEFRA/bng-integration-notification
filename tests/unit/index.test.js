/* eslint-disable no-undef */

const httpTrigger = require('../../bng-integration-notification-api')
const UkGovNotify = require('../../bng-integration-notification-business-logic/ukGovNotify.js')

jest.mock('../../bng-integration-notification-business-logic/ukGovNotify.js')

describe('sendEmailNotification function', () => {
  let mockContext, mockRequest, mockUkGovNotifyInstance

  beforeEach(() => {
    process.env.NotifyApiKey = 'yourApiKey'
    mockContext = {
      res: {},
      log: jest.fn(),
      error: jest.fn()
    }

    mockRequest = {
      body: {
        email: 'email@test.com',
        personalisation: {
          firstName: 'John',
          applicationRef: 'Ref123',
          applicationDate: '2022-01-01'
        }
      }
    }
    mockUkGovNotifyInstance = {
      emailNotification: jest.fn()
    }
    UkGovNotify.mockImplementation(() => mockUkGovNotifyInstance)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return status 200 and successful message when email is sent', async () => {
    mockUkGovNotifyInstance.emailNotification.mockResolvedValue(true)

    await httpTrigger(mockContext, mockRequest)
    expect(mockContext.res.status).toEqual(200)
    expect(mockContext.res.body).toEqual('Email sent successfully.')

    expect(mockUkGovNotifyInstance.emailNotification).toHaveBeenCalled()
  })

  it('should return status 400 and failure message when email is not sent', async () => {
    mockUkGovNotifyInstance.emailNotification.mockResolvedValue(false)

    await httpTrigger(mockContext, mockRequest)
    expect(mockContext.res.status).toEqual(400)
    expect(mockContext.res.body).toEqual('Email send fail.')

    expect(mockUkGovNotifyInstance.emailNotification).toHaveBeenCalled()
  })
})
