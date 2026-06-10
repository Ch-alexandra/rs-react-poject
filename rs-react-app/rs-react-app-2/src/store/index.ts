import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector)

export { store } from './store'
export type { RootState, AppDispatch } from './store'
export { addSubmission, clearNewFlag } from './submissionsSlice'
export type { FormSubmission } from './submissionsSlice'
