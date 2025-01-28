import { provideDataClass } from 'scrivito'
import { pisaConfig } from '../pisaClient'

export const Order = provideDataClass(
  'Order',
  (async () => {
    const restApi = await pisaConfig('order')
    if (!restApi) {
      return (await import('./orderParamsFallback')).orderParamsFallback()
    }

    return { restApi }
  })(),
)
