import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          'https://api.webz.io/newsApiLite?token=02238ce0-ecf4-49a6-a64f-e92fa617a73f&q=Research%20Journal'
        );
        const data = await response.json();
        setPosts(data.posts);
        setIsLoadingPosts(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  if (suggestedUsers?.length === 0) return <div className='md:w-48 w-0'></div>;

  return (
    <div className="w-72">
  <div className='hidden lg:block my-4 mx-3'>
    <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
      <p className='font-bold'>Find like-minded researchers</p>
      <div className='flex flex-col gap-4 mt-4'>
        {/* item */}
        {isLoading && (
          <>
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
          </>
        )}
        {!isLoading &&
          suggestedUsers?.map((user) => (
            <Link
              to={`/profile/${user.username}`}
              className='flex items-center justify-between gap-4'
              key={user._id}
            >
              <div className='flex gap-2 items-center'>
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                    <img src={user.profileImg || "/avatar-placeholder.png"} />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <span className='font-semibold tracking-tight truncate w-28'>
                    {user.fullName}
                  </span>
                </div>
              </div>
              <div>
                <button
                  className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full px-2 py-1 text-xs'
                  onClick={(e) => {
                    e.preventDefault();
                    follow(user._id);
                  }}
                >
                  {isPending ? <LoadingSpinner size='sm' /> : "Connect"}
                </button>
              </div>
            </Link>
          ))}
      </div>
    </div>
  </div>
  <div className='hidden lg:block my-4 mx-3'>
    <div className='bg-[#16181C] p-4 rounded-md'>
      <p className='font-bold'>Journals</p>
      <div className='flex flex-col gap-2 overflow-y-auto max-h-96'>
        {isLoadingPosts ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post, index) => (
            <a
              href={post.thread.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="text-white hover:underline p-2 rounded-md bg-[#1E2124] transition duration-200"
            >
              {post.thread.title}
            </a>
          ))
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default RightPanel;