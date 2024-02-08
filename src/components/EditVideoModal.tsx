import { Toast, checkTokenExpiration } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import ModalUser from './ModalUser';
import { useRouter } from 'next/router';
import VideoUploadModal from './VideoUploadModal';
import { useMutation, UseMutationResult } from 'react-query';

type VideoModalProps = {
  isOpen: boolean;
  videoProps: { id: number, name: string, description: string };
  closeModal: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const EditVideoModal: React.FC<VideoModalProps> = ({ isOpen, closeModal, videoProps }) => {
  const [userModal, setUserModal] = useState(false);
  const [editVideo, setEditVideo] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkAndHandleTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (checkTokenExpiration(token)) {
        console.log('Token expirado');
        localStorage.removeItem('token');
        setUserModal(true);
      }
    };
    checkAndHandleTokenExpiration();
    const interval = setInterval(checkAndHandleTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, []);

  const deleteVideoMutation = async (videoId: number) => {
    const response = await fetch(`/api/video/${videoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let data = await response.json();
    if (response.status == 200) {
      Toast.fire({
        icon: "success",
        title: data.message
      });
    }
    if (!response.ok) {
      throw new Error('Falha ao deletar vídeo');
    }

    return response.json();
  };

  const { mutate: mutateDeleteVideo } = useMutation(deleteVideoMutation) as UseMutationResult<any, unknown, number, unknown>;

  const handleDeleteVideo = async () => {
    try {
      await mutateDeleteVideo(videoProps?.id);
      setTimeout(() => {
        router.reload()
      }, 3000)
    } catch (error) {
      console.error('Erro deletando video:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800 opacity-75" onClick={closeModal}></div>
      {userModal ?
        <ModalUser isOpen={userModal} />
        : <div className="bg-white p-6 rounded-md z-10 dark:bg-gray-900">
          <div className="divide-y divide-slate-200">
            <div><p onClick={() => { setEditVideo(true) }} className="text-lg  mb-4 cursor-pointer">Editar</p></div>
            <div><h2 onClick={handleDeleteVideo} className="text-lg text-rose-500 font-semibold mt-4 mb-4 cursor-pointer">Deletar</h2></div>
            {editVideo && <VideoUploadModal videoProps={videoProps} isOpen={editVideo} setModal={setEditVideo} />}
          </div>
        </div>}
    </div>
  );
};

export default EditVideoModal;
