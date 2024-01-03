import { useEffect, useState } from 'react'
import { registerComponent } from 'scrivito'
import { Instructions } from './SubComponents/Instructions'
import { Log } from './SubComponents/Log'
import { restoreContent } from './restoreContent'

registerComponent('RestoreContent', () => {
  const [apiKey, setApiKey] = useState('')
  const [details, setDetails] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState([0, 0])
  const [logText, setLogText] = useState('')

  function log(line: string, count?: number) {
    setLogText((logText) =>
      line === '.' || !logText ? `${logText}${line}` : `${logText}\n${line}`,
    )
    if (count !== undefined) {
      setProgress([0, count])
      setDetails('')
    }
  }

  function logStep(...parts: string[]) {
    setProgress(([current, count]) => [current + 1, count])
    setDetails(parts.join(' '))
  }

  useEffect(() => {
    if (isRunning) restoreContent({ apiKey, log, logStep })
  }, [apiKey, isRunning])

  return (
    <div className="scrivito_detail_content">
      <Instructions />
      <form>
        <input
          autoComplete="off"
          disabled={isRunning}
          onChange={({ target: { value } }) => setApiKey(value)}
          placeholder="SCRIVITO_API_KEY"
          size={32}
          type="password"
          value={apiKey}
        />
        <button
          disabled={!apiKey || isRunning}
          onClick={() => setIsRunning(true)}
          type="submit"
        >
          Restore content
        </button>
      </form>
      <Log
        text={logText}
        progress={progress[1] ? `${progress[0]} of ${progress[1]}` : ''}
        details={details}
      />
    </div>
  )
})
