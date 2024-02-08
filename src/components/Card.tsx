import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { formatRelativeTime } from '@/utils/utils';

import VideoModal from './EditVideoModal';
import { MdEdit } from 'react-icons/md';
import { useMutation } from 'react-query';

type VideoProps = {
  id: number;
  description: string;
  name: string;
  path: string;
  createdAt: string;
  userId: number;
  views: number;
};

const TikTokCard: React.FC<VideoProps> = (props) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  const [countView, setCountView] = useState<number>(props.views);
  const playerRef = useRef<HTMLDivElement>(null);
  const jwt = require('jsonwebtoken');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedTokenUser: any = jwt.decode(token || '');
      setUserId(decodedTokenUser.user.id);
    }
  }, []);

  const mutation = useMutation(() => fetch(`/api/video/${props.id}/view`, { method: 'PUT' }));

  const handleViewIncrement = async () => {
    await mutation.mutate();
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      const viewedVideos = sessionStorage.getItem('viewedVideos');
      const viewedVideosArray = viewedVideos ? JSON.parse(viewedVideos) : [];
      if (!viewedVideosArray.includes(props.id) && userId !== props.userId) {
        handleViewIncrement();
        setCountView((prevCount) => prevCount + 1);
        viewedVideosArray.push(props.id);
        sessionStorage.setItem('viewedVideos', JSON.stringify(viewedVideosArray));
      }
    }, 8000);
  };

  return (
    <div className="flex mb-6 items-center ">
      <div className="ml-4 flex-grow">
        <div className="relative w-full bg-gray-100 rounded-md overflow-hidden">
          <div
            onMouseEnter={() => setIsPlaying(true)}
            onClick={() => setIsPlaying(!isPlaying)}
            onMouseLeave={() => setIsPlaying(false)}
            ref={playerRef}
          >
            <ReactPlayer
              url={props.path}
              width="100%"
              height="80vh"

              controls={true}
              light={false}
              playing={isPlaying}
              onPlay={handleVideoPlay}
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-white shadow-md rounded-md flex justify-between items-center relative dark:bg-gray-800">
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{props.name}</h3>
            </div>
            <p className="font-mono text-gray-800 dark:text-gray-100">{props.description}</p>
            <div className="mt-1 text-sm text-gray-500">
              <p>{countView} {countView <= 1 ? 'visualização' : 'visualizações'}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-100">
            {formatRelativeTime(new Date(props.createdAt))}
          </div>
          {userId === props.userId && (
            <div title="mais opções" className="absolute top-0 right-0 m-2">
              <button
                className="focus:outline-none bg-slate-300 rounded-lg"
                onClick={() => setIsModalOpen(true)}
              >
                <MdEdit size={24} color="black" />
              </button>
            </div>
          )}
        </div>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onEdit={() => {
          setIsModalOpen(false);
        }}
        onDelete={() => {
          setIsModalOpen(false);
        }}
        videoProps={{ id: props.id, name: props.name, description: props.description }}
      />
    </div>
  );
};

export default TikTokCard;
