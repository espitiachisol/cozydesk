import { useEffect } from 'react'
import Body from './layout/Body/Body'
import Header from './layout/Header/Header'
import { subscribeAuthStateChanged } from './services/auth'
import { useAppDispatch } from './app/hook'
import { setUser } from './features/auth/authSlice'
function App(): JSX.Element {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    const unsubscribe = subscribeAuthStateChanged((user)=>{
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email
        }))
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
    </>
  )
}

export default App
