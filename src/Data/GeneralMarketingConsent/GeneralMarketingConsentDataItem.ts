import {
  ClientError,
  getInstanceId,
  provideDataItem,
  unstable_JrRestApi,
} from 'scrivito'

export const GeneralMarketingConsent = provideDataItem(
  'GeneralMarketingConsent',
  {
    async get() {
      const mySubscribedTopicIds = await fetchMySubscribedTopicIds()

      const GENERAL_TOPIC_ID = 'general'
      /** Can be removed when the API returns `general` */
      const LEGACY_GENERAL_TOPIC_ID = ''

      const isConsentGiven =
        mySubscribedTopicIds.includes(GENERAL_TOPIC_ID) ||
        mySubscribedTopicIds.includes(LEGACY_GENERAL_TOPIC_ID)

      return { isConsentGiven }
    },
    async update(params) {
      const { isConsentGiven } = params

      return unstable_JrRestApi.put(
        `neoletter/instances/${getInstanceId()}/my/consents/general`,
        {
          data: {
            source: 'self-service portal',
            state: isConsentGiven ? 'given' : 'revoked',
          },
        },
      )
    },
  },
)

async function fetchMySubscribedTopicIds() {
  return (
    sanitizeResults(
      await sanitizeProfileNotFound(() =>
        unstable_JrRestApi.fetch(
          `neoletter/instances/${getInstanceId()}/my/subscriptions`,
        ),
      ),
    ) as { results: { topic_id: string }[] }
  ).results.map(({ topic_id }) => topic_id)
}

/** Can be removed when the API responds as documented */
function sanitizeResults(data: unknown): { results: unknown[] } {
  return { results: (data as { results: unknown[] | null }).results || [] }
}

/** Can be removed when the API responds with a proper fallback */
function sanitizeProfileNotFound(callback: () => Promise<unknown>) {
  try {
    return callback()
  } catch (e) {
    if (
      !(e instanceof ClientError) ||
      e.code !== 'precondition_not_met.profile_not_found'
    ) {
      throw e
    }
  }
  return { results: [] }
}