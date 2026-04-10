'use client'

import { useId } from 'react'
import SubmitButton from './SubmitButton'
import styles from './ConfirmDialog.module.css'

interface Props {
  entity: string
  action: (formData: FormData) => Promise<void> | void
  triggerLabel?: string
  triggerPendingLabel?: string
  triggerClassName?: string
}

export default function ConfirmDialog({
  entity,
  action,
  triggerLabel,
  triggerPendingLabel = 'Deleting…',
  triggerClassName = 'btn-danger',
}: Props) {
  const id = useId()

  return (
    <>
      {/* Invoker Command API — opens the dialog declaratively, no JS handler needed */}
      <button type="button" className={triggerClassName} commandfor={id} command="show-modal">
        {triggerLabel ?? `Delete ${entity}`}
      </button>

      <dialog id={id} className={styles.dialog}>
        <h2 className={styles.title}>Delete {entity}?</h2>
        <p className={styles.description}>
          Are you sure you want to delete this {entity}? This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <button type="button" className="btn-secondary" commandfor={id} command="close">
            Cancel
          </button>
          {/* The form lives inside the dialog so the submit button is clearly scoped to this action */}
          <form action={action}>
            <SubmitButton
              label={`Delete ${entity}`}
              pendingLabel={triggerPendingLabel}
              className="btn-danger"
            />
          </form>
        </div>
      </dialog>
    </>
  )
}
