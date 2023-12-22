import { provideObjClass } from 'scrivito'

export const TicketMessage = provideObjClass('TicketMessage', {
  attributes: {
    createdAt: 'string',
    fromId: 'string',
    text: 'string',
    ticketId: 'string',
  },
})
