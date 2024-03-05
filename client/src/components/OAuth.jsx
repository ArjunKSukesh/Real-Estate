import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice.js'
import {useNavigate} from 'react-router-dom'

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        try {

            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            // console.log(result)

            const res = await fetch('/api/auth/google',{
                method : 'POST',
                headers :{
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    name : result.user.displayName,
                    email : result.user.email,
                    photo : result.user.photoURL

                })
            })

            const data = await res.json()
            // console.log(data)

            dispatch(signInSuccess(data));
            navigate('/')

        } catch (error) {
            console.log('could not sign with google',error)
        }
    }

  return (
    <button 
    onClick={handleGoogleClick}
    type="button"
    className="p-3 rounded-lg bg-red-700 text-white uppercase"
    >
      continue with google
    </button>
  )
}