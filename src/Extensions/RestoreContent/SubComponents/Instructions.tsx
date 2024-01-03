export function Instructions() {
  return (
    <p className="scrivito_notice_body">
      Restoring the initial content requires REST API write access. Using the
      REST API key in a browser can be a security risk.
      <br />
      If you are aware of the implications, please provide the{' '}
      <a
        target="_blank"
        href={`https://my.scrivito.com/tenants/${
          import.meta.env.SCRIVITO_TENANT
        }/settings`}
        rel="noreferrer"
      >
        API key
      </a>{' '}
      for this website:
    </p>
  )
}
