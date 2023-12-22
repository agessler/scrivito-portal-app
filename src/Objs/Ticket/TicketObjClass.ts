import { provideObjClass } from 'scrivito'

export const Ticket = provideObjClass('Ticket', {
  attributes: {
    number: 'string',
    type: 'string',
    subject: 'string',
    description: 'string',
    status: 'string',

    createdById: 'string',
    createdAt: 'string', // ISO Date String
    responsibleAgentId: 'string',
    referenceNumber: 'string',

    // attachments: attachment[] // later
  },
})
