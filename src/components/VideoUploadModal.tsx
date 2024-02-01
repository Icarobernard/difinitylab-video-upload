// VideoUploadModal.tsx

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useMutation } from 'react-query';

type VideoUploadModalProps = { isOpen: boolean };

const VideoUploadModal: React.FC<VideoUploadModalProps> = (props: VideoUploadModalProps) => {
    const [isOpen, setIsOpen] = useState(props.isOpen);
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        let jwt = require('jsonwebtoken');
        let token = localStorage.getItem("token")
        const decodedTokenUser: any = jwt.decode(token);
        setName(decodedTokenUser.user.name)

    }, [])
    console.log(`name`, name)
    const { mutate } = useMutation(
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
            },
        }
    );

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        formData.append('name', name);
        formData.append('description', description);

        mutate(formData);
    };

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-8 max-w-md w-full rounded-md">
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
                                Description
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
