import useGetUserProfile from '@/hooks/useGetUserProfile';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  useGetUserProfile(params.id);

  const [activeTab, setActiveTab] = useState('posts');
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedIn = user?._id === userProfile?._id;
  const isFollowing = true;

  // ✅ Handle loading state
  if (!userProfile) {
    return <div>Loading profile...</div>;
  }

  const displayedPost =
    activeTab === 'posts'
      ? userProfile.posts || []
      : userProfile.bookmarks || [];

  return (
    <div className='max-w-6xl flex justify-center items-center pl-50 mx-auto'>
      <div className='flex flex-col gap-20'>
        <div className='grid grid-cols-2 my-10'>
          <section className='flex items-center justify-center'>
            <Avatar className='w-35 h-35'>
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          <section>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>{userProfile?.username}</span>
              {isLoggedIn ? (
                <>
                  <Link to='/account/edit'>
                    <Button
                      variant='secondary'
                      className='bg-gray-100 cursor-pointer'
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  <Button variant='secondary' className='bg-gray-100'>
                    See Archives
                  </Button>
                  <Button variant='secondary' className='bg-gray-100'>
                    Ad Tools
                  </Button>
                </>
              ) : isFollowing ? (
                <>
                  <Button variant='secondary' className='bg-gray-100'>
                    Unfollow
                  </Button>
                  <Button variant='secondary' className='bg-gray-100'>
                    Message
                  </Button>
                </>
              ) : (
                <Button
                  variant='secondary'
                  className='bg-[#1298eb] cursor-pointer text-white'
                >
                  Follow
                </Button>
              )}
            </div>

            <div className='flex items-center gap-2 my-5'>
              <p>
                <span className='font-semibold'>
                  {userProfile?.posts?.length || 0}
                </span>{' '}
                posts
              </p>
              <p>
                <span className='font-semibold'>
                  {userProfile?.followers?.length || 0}
                </span>{' '}
                followers
              </p>
              <p>
                <span className='font-semibold'>
                  {userProfile?.following?.length || 0}
                </span>{' '}
                following
              </p>
            </div>

            <div>
              <p className='font-semibold'>{userProfile?.bio || 'Bio here...'}</p>
              <p className='my-2'>
                <Badge className='text-[12px]'>
                  <AtSign />
                  {userProfile?.username}
                </Badge>
              </p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </section>
        </div>

        <div
          className='flex items-center justify-center gap-2'
          style={{ borderTop: '1px solid gray' }}
        >
          <span
            className={`cursor-pointer ${
              activeTab === 'posts' ? 'font-bold' : ''
            }`}
            onClick={() => setActiveTab('posts')}
          >
            POSTS
          </span>
          <span
            className={`cursor-pointer ${
              activeTab === 'saved' ? 'font-bold' : ''
            }`}
            onClick={() => setActiveTab('saved')}
          >
            SAVED
          </span>
          <span className='cursor-pointer'>REELS</span>
          <span className='cursor-pointer'>TAGS</span>
        </div>

        <div className='grid grid-cols-3 gap-1'>
          {Array.isArray(displayedPost) &&
            displayedPost.map((post) => (
              <div key={post._id} className='relative group cursor-pointer'>
                <img
                  src={post?.image}
                  alt='postimage'
                  className='rounded w-full object-cover aspect-auto'
                />
                <div className='inset-0 absolute flex items-center justify-center bg-black opacity-0 group-hover:opacity-70 transition-opacity'>
                  <div className='flex items-center text-white space-x-4'>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <Heart />
                      <span>{post?.likes?.length || 0}</span>
                    </button>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <MessageCircle />
                      <span>{post?.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
