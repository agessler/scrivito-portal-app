import { provideEditingConfig } from 'scrivito'
import { Ticket } from './TicketObjClass'
import { times } from 'lodash-es'

provideEditingConfig(Ticket, {
  title: 'Ticket',
  titleForContent: (content) =>
    [content.get('number'), content.get('subject')].join(' - '),
  hideInSelectionDialogs: true,
  attributes: {
    number: { title: 'Ticket number' },
    type: { title: 'Type' },
    subject: { title: 'Subject' },
    description: { title: 'Description' },
    status: { title: 'Status' },

    createdById: { title: 'Created by ID' },
    createdAt: { title: 'Created at (ISO date string)' },
    responsibleAgentId: { title: 'Responsible agent ID' },
    referenceNumber: { title: 'Reference number' },
  },
  properties: [
    'number',
    'type',
    'subject',
    'description',
    'status',
    'createdById',
    'createdAt',
    'responsibleAgentId',
    'referenceNumber',
  ],
  initialContent: {
    createdById: '11abd64c7959c40e',
    responsibleAgentId: '38a35ca01cd00eba',
  },
  initialize(ticket) {
    ticket.update({
      number: `${randomNumbers(2)}-${randomNumbers(5)}-${randomNumbers(2)}`,
      createdAt: new Date().toISOString(),
    })
  },
})

function randomNumbers(length: number): string {
  return times(length).map(pseudoRandomNumber).join('')
}

function pseudoRandomNumber() {
  return Math.floor(Math.random() * 10).toString()
}
