import { provideObjClass } from 'scrivito'

export const User = provideObjClass('User', {
  attributes: {
    composedName: 'string',
    firstName: 'string',
    lastName: 'string',
  },
})
