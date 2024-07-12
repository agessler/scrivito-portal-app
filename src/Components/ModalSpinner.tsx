import { useEffect, useRef } from 'react'
import { connect } from 'scrivito'

export const ModalSpinner = connect(function ModalSpinner() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => dialogRef.current?.showModal(), [])

  return (
    <dialog className="foobar" ref={dialogRef}>
      <div className="loader" />
    </dialog>
  )
})
