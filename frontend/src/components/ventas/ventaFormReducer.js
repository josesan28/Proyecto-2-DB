export const initialForm = {
  id_empleado: '',
  id_cliente: '',
  items: [{ id_producto: '', cantidad: 1 }],
}

export function ventaReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_ITEM':
      return {
        ...state,
        items: state.items.map((it, i) =>
          i === action.index ? { ...it, [action.field]: action.value } : it
        ),
      }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, { id_producto: '', cantidad: 1 }] }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, i) => i !== action.index) }
    case 'RESET':
      return initialForm
    default:
      return state
  }
}