import React, { useState, useEffect } from 'react';
import ModalUser from './ModalUser';
import { checkTokenExpiration } from '@/utils/utils';
import { useRouter } from 'next/router';
import VideoUploadModal from './VideoUploadModal';

interface NavbarProps {
  searchTerm: string;
  onSearchTermChange: (newSearchTerm: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, onSearchTermChange }) => {
  const [userModal, setUserModal] = useState(false);
  const [auth, setAuth] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const router = useRouter();
  const closeModal = () => setUploadModal(false);
  useEffect(() => {
    let tokenExpiration = checkTokenExpiration(localStorage.getItem('token'))
    setAuth(tokenExpiration)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white p-4 flex justify-between items-center dark:bg-gray-900">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-500 rounded-full hidden md:block"></div>
        <h2 className="ml-2 text-xl font-semibold hidden md:block">Difinity Sequence</h2>
      </div>

      <div className="flex items-center flex-1 justify-center">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="border p-2 rounded mr-2 dark:text-black"
        />
      </div>

      <div className="flex items-center justify-end">
        {!auth && <button onClick={() => { setUploadModal(true) }} className="bg-white-700 px-3 py-2 mr-2 text-black text-sm md:text-base border-2 dark:text-gray-200">+ Upload</button>}
        {!auth && <button onClick={() => { localStorage.removeItem('token'); router.reload() }} className="bg-pink-700 text-white px-3 py-2 md:py-2 text-white border-2 bg-pink-700">Sair</button>}
        {auth && <button onClick={() => { setUserModal(true) }} className="bg-pink-700 text-white px-2 md:px-4 py-2 md:py-2">Login</button>}
      </div>
      {userModal && <ModalUser isOpen={userModal} />}
      {uploadModal && <VideoUploadModal closeModal={closeModal} isOpen={uploadModal} />}
    </nav>
  );
};

export default Navbar;
