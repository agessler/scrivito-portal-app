import { Obj, currentWorkspaceId, load } from 'scrivito'
const json = import.meta.glob('../../../contentDump/objs/*', { as: 'raw' })
const binaries = import.meta.glob('../../../contentDump/binaries/*', {
  as: 'url',
})

type ObjData = { _id: string; _obj_class: string; _permalink?: string }
type ActivateUploadData = { task: UploadTaskData }
type UploadPermissionData = {
  blob: string
  fields: Record<string, string>
  url: string
}
type UploadTaskData = {
  id: string
  error: string
  result: { id: string }
  status: string
}

type Logger = (line: string, count?: number) => void
type StepLogger = (...parts: string[]) => void

const urlForBinaryId = Object.fromEntries(
  Object.entries(binaries).map(([path, url]) => [
    decodeURIComponent(path.split('/').at(-1)!),
    url,
  ]),
)

export async function restoreContent({
  apiKey,
  log,
  logStep,
}: {
  apiKey: string
  log: Logger
  logStep: StepLogger
}) {
  try {
    await clearContent({ log, logStep })

    log(
      '🐣 Creating new content',
      Object.keys(json).length + Object.keys(urlForBinaryId).length,
    )

    for (const objJson of Object.values(json)) {
      const objData = JSON.parse(await objJson()) as ObjData
      const objId = objData._id
      const restoredIdForDumpedId: Record<string, string> = {}

      await forEachBinaryId(objData, async (binaryId: string) => {
        const filename = binaryId.split('/').at(-1) || ''

        logStep('uploading', filename)

        restoredIdForDumpedId[binaryId] = await restoreBinary(
          apiKey,
          binaryId,
          objId,
          filename,
        )
      })

      logStep('creating', objData._obj_class, objData._permalink || objId)

      await fetchJson(
        apiKey,
        `workspaces/${currentWorkspaceId()}/objs/${objId}`,
        JSON.stringify({ obj: objData }, (_, v) =>
          isBinaryData(v)
            ? ['binary', { id: restoredIdForDumpedId[v[1].id] }]
            : v,
        ),
      )
    }

    log('✅ Done', 0)
  } catch (e) {
    log(`❌ Error: ${e}`)
  }
}

async function clearContent({
  log,
  logStep,
}: {
  log: Logger
  logStep: StepLogger
}) {
  log('🔍 Looking for existing content')

  const objs = await load(() => Obj.onAllSites().all().toArray())

  log('🗑️ Deleting existing content', objs.length)

  for (const obj of objs) {
    logStep('deleting', obj.objClass(), obj.permalink() || obj.id())
    obj.delete()
    await obj.finishSaving()
  }
}

async function forEachBinaryId(
  data: unknown,
  handler: (binaryId: string) => Promise<void>,
) {
  if (!data || typeof data !== 'object') return
  if (isBinaryData(data)) await handler(data[1].id)
  else for (const d of Object.values(data)) await forEachBinaryId(d, handler)
}

function isBinaryData(data: unknown): data is ['binary', { id: string }] {
  return (
    Array.isArray(data) &&
    data.length === 2 &&
    data[0] === 'binary' &&
    typeof data[1] === 'object' &&
    data[1].id
  )
}

async function restoreBinary(
  apiKey: string,
  binaryId: string,
  objId: string,
  filename: string,
) {
  const binaryUrl = await urlForBinaryId[binaryId]()
  const binaryData = await fetch(binaryUrl)
  const binaryBlob = await binaryData.blob()

  const { url, fields, blob } = await fetchJson<UploadPermissionData>(
    apiKey,
    'blobs/upload_permission',
  )

  const body = new FormData()
  Object.entries(fields).forEach(([k, v]) => body.append(k, v))
  body.append('file', binaryBlob, filename)
  const { status } = await fetch(url, { method: 'post', body })
  if (status > 204) throw new Error('upload failed')

  let { task } = await fetchJson<ActivateUploadData>(
    apiKey,
    'blobs/activate_upload',
    JSON.stringify({ filename, obj_id: objId, upload: blob }),
  )
  while (task.status === 'open') {
    await new Promise((resolve) => setTimeout(resolve, 300))
    try {
      task = await fetchJson<UploadTaskData>(apiKey, `tasks/${task.id}`)
    } catch {
      /* retry */
    }
  }
  if (task.status !== 'success') throw new Error(task.error)
  return task.result.id
}

async function fetchJson<T>(
  apiKey: string,
  apiPath: string,
  body?: string,
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`api_token:${apiKey}`)}`,
  }
  const response = await fetch(
    `https://api.scrivito.com/tenants/${
      import.meta.env.SCRIVITO_TENANT
    }/${apiPath}`,
    {
      body,
      credentials: 'include',
      headers,
      method: body ? 'put' : 'get',
      mode: 'cors',
    },
  )

  if (response.status > 204) throw new Error(`failed to fetch ${apiPath}`)

  return response.json()
}
