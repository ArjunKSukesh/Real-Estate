import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
export default function SignIn() {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
    console.log(formData)


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log(data)

            if (data.success === false) {   //susccess is from the backend middleware(index.js)
                setLoading(false)
                setError(data.message);
                return;
            }
            setLoading(false)
            setError(null)
            navigate('/')
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-center text-3xl my-7 font-semibold">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">


                <input
                    type="text"
                    className="border p-3 rounded-lg"
                    placeholder="email"
                    id="email"
                    onChange={handleChange} />

                <input
                    type="text"
                    className="border p-3 rounded-lg"
                    placeholder="password"
                    id="password"
                    onChange={handleChange} />

                <button
                    disabled={loading}
                    type='submit'
                    className="bg-slate-700 text-white p-3 rounded-lg 
                    hover:opacity-95 disabled:opacity-80 uppercase"
                >
                    {loading ? 'Loading...' : 'sign in'}
                </button>

            </form>
            <div className='flex gap-1 mt-4'>
                <p>Dont have an account? </p>
                <Link to={'/sign-up'}>
                    <p className='text-blue-700'>Sign up</p>
                </Link>
            </div>
            {error && <p className='text-red-700'>{error}</p>}
        </div>
    )
}




