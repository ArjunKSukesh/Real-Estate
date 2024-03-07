import { useSelector, useDispatch } from 'react-redux';
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
    updateUserFailure
} from '../redux/user/userSlice.js'


export default function Profile() {
    const dispatch = useDispatch();
    const { currentUser,loading, error } = useSelector(state => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false)
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
            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Sign out</span>
            </div>
            <p className='text-red-700 mt-5'>{error ? error :" "}</p>
            <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' :" "}</p>
        </div>
    )
}


