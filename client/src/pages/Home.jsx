import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';


export default function Home() {
    SwiperCore.use([Navigation]);
    const [offerListings, setOfferListings] = useState([])
    const [saleListings, setSaleListings] = useState([])
    const [rentListings, setRentListings] = useState([])

    console.log(saleListings)


    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings(); // result is clear the next function won't happen
            } catch (error) {
                console.log(error)
            }
        };

        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4')
                const data = await res.json();
                setRentListings(data);
                fetchSaletListings()
            } catch (error) {
                console.log(error)
            }
        };

        const fetchSaletListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sale&limit=4')
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error)
            }
        };


        fetchOfferListings();
    },[]);
    return (
        <div>
            {/* top */}
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
                <h1 className='text-slate-700 text-3xl font-bold lg:text-6xl'>Find your next <span className='text-slate-500'>perfect</span>
                    <br />
                    place with ease
                </h1>
                <div className='text-gray-400 text-xs sm:text-sm'>
                    RealEsate will help you find home fast , easy and confortable.
                    <br />
                    Our expert support are always available.
                </div>
                <Link to={'/search'} className='text-xs sm:text-sm font-bold text-blue-800 hover:underline'>
                    Let's get start now...
                </Link>
            </div>

            {/* swiper */}
            <Swiper navigation>
                {offerListings && offerListings.length > 0 && 
                offerListings.map((listing) => (
                    <SwiperSlide key={listing} >
                        <div style={{background : `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize : 'cover'}}
                        className='h-[500px]' key={listing._id}
                        >

                        </div>
                    </SwiperSlide>
                ))

                }
            </Swiper>

            {/* listing results for offer, sale and rent */}

            <div className='mx-auto max-w-7xl p-3 flex flex-col my-10 gap-8 '>
                {offerListings && offerListings.length>0 && (
                    <div>
                        <div className='my-3'>
                            <h2 className='text-slate-600 text-2xl font-semibold  '>Recent Offers</h2>
                            <Link to={'/search?offer=true'} 
                            className='text-sm text-blue-800 hover:underline'
                            >
                            Show more...
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {offerListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id}/>
                            ))}
                        </div>
                    </div>
                )}


                {rentListings && rentListings.length>0 && (
                    <div>
                        <div className='my-3'>
                            <h2 className='text-slate-600 text-2xl font-semibold '>Recent places for rent</h2>
                            <Link to={'/search?type=rent'} 
                            className='text-sm text-blue-800 hover:underline'
                            >
                            Show more places for rent...
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {rentListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id}/>
                            ))}
                        </div>
                    </div>
                )}


                {saleListings && saleListings.length>0 && (
                    <div>
                        <div className='my-3'>
                            <h2 className='text-slate-600 text-2xl font-semibold '>Recent places for sale</h2>
                            <Link to={'/search?type=sale'} 
                            className='text-sm text-blue-800 hover:underline'
                            >
                            Show more places for sale...
                            </Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {saleListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
