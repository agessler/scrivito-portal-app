import { provideEditingConfig } from 'scrivito'
import { TicketMessage } from './TicketMessageObjClass'

provideEditingConfig(TicketMessage, {
  title: 'Ticket Message',
  titleForContent: (content) => content.get('text'),
  hideInSelectionDialogs: true,
  attributes: {
    createdAt: { title: 'Created at' },
    fromId: { title: 'From ID' },
    text: { title: 'Text' },
    ticketId: { title: 'Ticket ID' },
  },
  properties: ['ticketId', 'createdAt', 'text', 'fromId'],
  initialContent: {
    fromId: 'supportUserId',
  },
  initialize(ticket) {
    ticket.update({
      createdAt: new Date().toISOString(),
    })
  },
})
