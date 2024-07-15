import { useEffect, useRef } from 'react'
import { connect } from 'scrivito'

export const ModalSpinner = connect(function ModalSpinner() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => dialogRef.current?.showModal(), [])

  return (
    <dialog className="loader-dailog" ref={dialogRef}>
      <div class="fade modal-backdrop show"></div>
      <div className="loader" />
    </dialog>
  )
})
