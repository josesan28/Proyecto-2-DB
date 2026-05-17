import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmModal from './ConfirmModal'

describe('ConfirmModal', () => {
  const baseProps = {
    title: 'Eliminar categoría',
    message: '¿Eliminar "Electrónica"? Esta acción no se puede deshacer.',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  it('renderiza el título y el mensaje', () => {
    render(<ConfirmModal {...baseProps} />)
    expect(screen.getByText('Eliminar categoría')).toBeInTheDocument()
    expect(screen.getByText(/Eliminar "Electrónica"/)).toBeInTheDocument()
  })

  it('llama a onConfirm al presionar Confirmar', () => {
    const onConfirm = vi.fn()
    render(<ConfirmModal {...baseProps} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Confirmar'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('llama a onCancel al presionar Cancelar', () => {
    const onCancel = vi.fn()
    render(<ConfirmModal {...baseProps} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('aplica btn-danger cuando danger=true (default)', () => {
    render(<ConfirmModal {...baseProps} danger={true} />)
    const btn = screen.getByText('Confirmar')
    expect(btn.className).toContain('btn-danger')
  })

  it('aplica btn-primary cuando danger=false', () => {
    render(<ConfirmModal {...baseProps} danger={false} />)
    const btn = screen.getByText('Confirmar')
    expect(btn.className).toContain('btn-primary')
  })
})