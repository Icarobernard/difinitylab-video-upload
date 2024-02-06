import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { formatRelativeTime } from '@/utils/utils';

import VideoModal from './EditVideoModal';
import { MdEdit } from 'react-icons/md';

type VideoProps = {
  id: number;
  description: string;
  name: string;
  path: string;
  createdAt: string;
};

const TikTokCard: React.FC<VideoProps> = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex mb-6 items-center">
      <div className="ml-4 flex-grow">
        <div className="relative w-full h-100 bg-gray-300 rounded-md overflow-hidden">
          <ReactPlayer
            url={props.path}
            width="100%"
            height="100%"
            controls={true}
            light={false}
            playing={isPlaying}
          />
        </div>
        <div className="mt-4 p-4 bg-white shadow-md rounded-md flex justify-between items-center relative">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-2">{props.name}</h3>
            <p className="text-gray-700">{props.description}</p>
          </div>
          <div className="text-gray-500">
            {formatRelativeTime(new Date(props.createdAt))}
          </div>
          <div title="mais opções" className="absolute top-0 right-0 m-2">
            <button
              className="focus:outline-none"
              onClick={openModal}
              style={{
                background: '#fff',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <MdEdit size={24} color="gray" />
            </button>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        onEdit={() => {
          closeModal();
        }}
        onDelete={() => {
          closeModal();
        }}
        videoProps={{ id: props.id, name: props.name, description: props.description }}
      />
    </div>
  );
};

export default TikTokCard;
