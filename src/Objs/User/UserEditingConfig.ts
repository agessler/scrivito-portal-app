import { provideEditingConfig } from 'scrivito'
import { User } from './UserObjClass'

provideEditingConfig(User, {
  title: 'User',
  hideInSelectionDialogs: true,
  titleForContent: (content) => content.get('composedName'),
  attributes: {
    composedName: { title: 'Composed name' },
    firstName: { title: 'First name' },
    lastName: { title: 'Last name' },
  },
  properties: ['composedName', 'firstName', 'lastName'],
})
