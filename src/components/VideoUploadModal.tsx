import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type VideoUploadModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  videoProps?: { id: number; name: string; description: string };
};

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen: initialIsOpen,
  closeModal,
  videoProps,
}: VideoUploadModalProps) => {
  
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>(videoProps ? videoProps.name : '');
  const [id, setId] = useState<number | undefined>(videoProps? videoProps.id : undefined);
  console.log(id)
  const [description, setDescription] = useState<string>(
    videoProps ? videoProps.description : ''
  );
  const jwt = require('jsonwebtoken');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: videoData } = useQuery(['video', id], async () => {
    if (id) {
      const response = await fetch(`/api/video/${id}`);
      return response.json();
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedTokenUser: any = jwt.decode(token || '');
    if (!videoProps) {
      setName(decodedTokenUser.user.name);
    }
  }, [videoProps]);

  const { mutate: postMutation } = useMutation(
    async (formData: FormData) => {
      const response = await fetch('/api/video', {
        method: 'POST',
        body: formData,
      });
      return response.json();
    },
    {
      onSuccess: () => {
        setIsOpen(false);
        setFile(null);
        setName('');
        setDescription('');
        queryClient.invalidateQueries('videos');
      },
    }
  );

  const { mutate: putMutation } = useMutation(
    async (formData: FormData) => {
      const response = await fetch(`/api/video/${id}/${name}/${description}`, {
        method: 'PUT',
        body: formData,
      });
      return response.json();
    },
    {
      onSuccess: () => {
        setIsOpen(false);
        setFile(null);
        setName('');
        setDescription('');
        router.reload()
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    if (file && !videoProps) {
      formData.append('file', file);
    }
    if (id !== undefined) {
      formData.append('id', id.toString());
    }
    formData.append('name', name);
    formData.append('description', description);

    if (videoProps) {
      putMutation(formData);
    } else {
      postMutation(formData);
    }
  };

  useEffect(() => {
    if (videoData) {
      setName(videoData.name);
      setDescription(videoData.description);
    }
  }, [videoData]);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => {
              router.reload();
            }}
          >
            X
          </button>
          <div className="bg-white p-8 max-w-md w-full rounded-md">
            {!videoProps && (
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full border p-2 mb-4"
                />
              </div>
            )}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 mb-4"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 mb-4"
              />
            </div>
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploadModal;
