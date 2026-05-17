import { describe, it, expect } from 'vitest'
import { ventaReducer, initialForm } from './ventaFormReducer'

describe('ventaReducer', () => {
  it('SET_FIELD actualiza un campo del formulario', () => {
    const state = ventaReducer(initialForm, {
      type: 'SET_FIELD',
      field: 'id_empleado',
      value: '5',
    })
    expect(state.id_empleado).toBe('5')
    expect(state.items).toEqual(initialForm.items)
  })

  it('ADD_ITEM agrega un item vacío a la lista', () => {
    const state = ventaReducer(initialForm, { type: 'ADD_ITEM' })
    expect(state.items).toHaveLength(2)
    expect(state.items[1]).toEqual({ id_producto: '', cantidad: 1 })
  })

  it('REMOVE_ITEM elimina el item en el índice indicado', () => {
    const withTwo = ventaReducer(initialForm, { type: 'ADD_ITEM' })
    const withTwoAndProduct = ventaReducer(withTwo, {
      type: 'SET_ITEM',
      index: 0,
      field: 'id_producto',
      value: '10',
    })
    const state = ventaReducer(withTwoAndProduct, { type: 'REMOVE_ITEM', index: 0 })
    expect(state.items).toHaveLength(1)
    expect(state.items[0].id_producto).toBe('')
  })

  it('SET_ITEM actualiza el campo correcto del item', () => {
    const state = ventaReducer(initialForm, {
      type: 'SET_ITEM',
      index: 0,
      field: 'cantidad',
      value: '3',
    })
    expect(state.items[0].cantidad).toBe('3')
  })

  it('RESET vuelve al estado inicial', () => {
    const modified = ventaReducer(initialForm, {
      type: 'SET_FIELD',
      field: 'id_empleado',
      value: '99',
    })
    const state = ventaReducer(modified, { type: 'RESET' })
    expect(state).toEqual(initialForm)
  })
})