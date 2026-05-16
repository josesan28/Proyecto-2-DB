import { useState, useCallback } from 'react'
import ConfirmModal from '../components/ui/ConfirmModal'

export function useConfirm() {
  const [state, setState] = useState(null)

  const confirm = useCallback(({ title, message, danger = true }) => {
    return new Promise((resolve) => {
      setState({ title, message, danger, resolve })
    })
  }, [])

  const handleConfirm = () => {
    state?.resolve(true)
    setState(null)
  }

  const handleCancel = () => {
    state?.resolve(false)
    setState(null)
  }

  const ConfirmUI = state ? (
    <ConfirmModal
      title={state.title}
      message={state.message}
      danger={state.danger}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null

  return [confirm, ConfirmUI]
}