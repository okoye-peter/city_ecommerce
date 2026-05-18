import { Redirect } from 'expo-router'
import { useAppSelector } from '@/store/hooks'
import { selectAuthStatus } from '@/store/slices/authSlice'

export default function Index() {
  const status = useAppSelector(selectAuthStatus)

  if (status === 'idle' || status === 'loading') return null

  return <Redirect href={status === 'authenticated' ? '/(auth)/(tabs)/ExploreScreen' : '/(guest)/HomeScreen'} />
}
