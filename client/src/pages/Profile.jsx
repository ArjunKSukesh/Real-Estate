import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    useRef,
    useState,
    useEffect
} from 'react';

import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
} from 'firebase/storage';

import { app } from '../firebase';

import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure
} from '../redux/user/userSlice.js'


export default function Profile() {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector(state => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    console.log(formData);
    // console.log(filePerc);
    // console.log(fileUploadError);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = () => {
        //create storage
        const storage = getStorage(app);
        // create filename with time, so it will be always unique
        const fileName = new Date().getTime() + file.name;
        //create storage reference showing which place to store the storage
        const storageRef = ref(storage, fileName);
        //uploadTask is used to show the percentage of upload
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is '+ progress+'% done ')
            setFilePerc(Math.round(progress));
        },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => setFormData({ ...formData, avatar: downloadURL }));
            });
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true)

        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());

            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (data === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }

            dispatch(deleteUserSuccess(data));

        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart())
            const res = await fetch('/api/auth/signout');
            const data = await res.json();

            if (data.success === false) {
                dispatch(signOutUserFailure(data.message))
                return;
            }
            dispatch(signOutUserSuccess(data))
        } catch (error) {
            dispatch(signOutUserFailure(error.message))
        }
    }


    const handleShowlistings = async () => {
        try {
                setShowListingsError(false);
                const res = await fetch(`/api/user/listings/${currentUser._id}`);
                const data = await res.json();
                if(data.success === false){
                    setShowListingsError(true);
                    return;
                }
                setUserListings(data);
        } catch (error) {
            setShowListingsError(true)
        }
    }


    const handleListingDelete = async(listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`,{
                method : 'DELETE'
            });
            const data = await res.json();
            if(data.success === false){
                console.log(data.message);
                return;
            }

            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className="text-3xl font-bold text-center my-7">Profile</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    accept='image/*'
                    hidden />
                <img
                    onClick={() => fileRef.current.click()}
                    className='mt-2 self-center rounded-full h-24 w-24 object-cover cursor-pointer'
                    src={formData.avatar || currentUser.avatar}
                    alt="prfile" />
                <p className='text-sm self-center'>
                    {fileUploadError ? (
                        <span className='text-red-700'>Error Image Upload</span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-700'>Image Successfully Uploaded</span>
                    ) : ("")
                    }
                </p>

                <input
                    className='p-3 rounded-lg border'
                    type='text'
                    id='username'
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    placeholder='username' />
                <input
                    className='p-3 rounded-lg border'
                    type='text'
                    id='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    placeholder='email' />
                <input
                    className='p-3 rounded-lg border'
                    type='text'
                    id='password'
                    onChange={handleChange}
                    placeholder='password' />
                <button
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80 uppercase'
                >{loading ? 'loading...' : 'update'}</button>
                <Link
                    to={'/create-listing'}
                    className='bg-green-700 text-white p-3 rounded-lg text-center hover:border-opacity-95 uppercase'
                >create listing</Link>
            </form>
            <div className='flex justify-between mt-5'>

                <span
                    onClick={handleDeleteUser}
                    className='text-red-700 cursor-pointer'
                >Delete Account</span>

                <span
                    onClick={handleSignOut}
                    className='text-red-700 cursor-pointer'
                >Sign out</span>
            </div>
            <p className='text-red-700 mt-5'>{error ? error : " "}</p>
            <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : " "}</p>
            <button onClick={handleShowlistings} className='w-full text-green-700'>Show listings</button>
            <p className='text-red-700 mt-5'>{showListingsError? 'Error showing listings' : ''}</p>


            {
                userListings && userListings.length > 0 && 
               <div className='flex flex-col gap-4'>
                <h1 className='text-2xl my-7 text-center font-semibold'>Your Listings</h1>
                {userListings.map((listing) => (
                <div key={listing._id} className='flex gap-4 justify-between items-center border rounded-lg p-3'>
                    <Link to={`/listings/${listing._id}`}>
                        <img src={listing.imageUrls[0]} alt="listing cover"  className='h-16 w-16 object-contain'/>
                    </Link>
                    <Link className='flex-1 text-slate-700 font-semibold  hover:underline truncate' to={`/listings/${listing._id}`}>
                        <p >{listing.name}</p>
                    </Link>

                    <div className='flex flex-col items-center'>
                        <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                        <button className='text-green-700 uppercase'>Edit</button>
                    </div>
                </div>))}
                </div>
            }
            
        </div>
    )
}


