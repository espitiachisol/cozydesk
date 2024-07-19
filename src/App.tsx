import { useEffect } from 'react'
import Body from './layout/Body/Body'
import Header from './layout/Header/Header'
import { subscribeAuthStateChanged } from './services/auth'
import { useAppDispatch } from './app/hook'
import { userSignedIn } from './features/auth/authSlice'
import { User } from './features/auth/type'
import Toaster from './features/toaster/Toaster'
function App(): JSX.Element {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    const unsubscribe = subscribeAuthStateChanged((user:User | null)=>{
      if (user) {
        dispatch(userSignedIn(user))
      }else{
        console.log('Not Sign In')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [dispatch])
  

  return (
    <>
      <Header />
      <Body/>
      <Toaster />
    </>
  )
}

export default App
