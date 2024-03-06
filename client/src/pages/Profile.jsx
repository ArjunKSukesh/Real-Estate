import { useSelector } from 'react-redux'

export default function Profile() {
    const { currentUser } = useSelector(state => state.user)
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className="text-3xl text-center my-7">Profile</h1>

            <form className='flex flex-col gap-3'>
                <img
                    className='mt-2 self-center rounded-full h-24 w-24 object-cover cursor-pointer'
                    src={currentUser.avatar}
                    alt="prfile" />

                <input
                    className='p-3 rounded-lg border'
                    type='text'
                    id='username'
                    placeholder='username' />
                <input
                    className='p-3 rounded-lg border'
                    type='text'
                    id='email'
                    placeholder='email' />
                <input
                    className='p-3 rounded-lg border'
                    type='text'
                    id='password'
                    placeholder='password' />
                    <button 
                    className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80 uppercase' 
                    >update</button>
            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Sign out</span>
            </div>
        </div>
    )
}


