export function Log({ text, progress, details }: Record<string, string>) {
  return (
    <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
      {text}
      {progress && (
        <span>
          {' '}
          <strong>({progress})</strong> {details}
        </span>
      )}
    </pre>
  )
}
