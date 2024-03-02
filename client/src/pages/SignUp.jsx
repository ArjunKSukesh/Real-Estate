import {Link} from 'react-router-dom'
function SignUp() {
    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-center text-3xl my-7 font-semibold">Sign Up</h1>
            <form className="flex flex-col gap-3">
                <input type="text" className="border p-3 rounded-lg" placeholder="username" id="username"/>
                <input type="text" className="border p-3 rounded-lg" placeholder="email" id="email"/>
                <input type="text" className="border p-3 rounded-lg" placeholder="password" id="password"/>
                <button  className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80 uppercase">sign up</button>
            </form>
            <div className='flex gap-1 mt-4'>
                <p>Have an account? </p>
                <Link to={'/sign-in'}>
                <p className='text-blue-700'>Sign in</p>
                </Link>
            </div>
        </div>
    )
}

export default SignUp
