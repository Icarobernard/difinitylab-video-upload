import { checkTokenExpiration } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import ModalUser from './ModalUser';
import { useRouter } from 'next/router';
type VideoModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onEdit: () => void;
  onDelete: () => void;
};
//Esse componente Djalma basicamente mostra as opções de edição ou deleção apenas se o usuário tiver logado
const VideoModal: React.FC<VideoModalProps> = ({ isOpen, closeModal, onEdit, onDelete }) => {
  const router = useRouter();
  const [userModal, setUserModal] = useState(false)
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
    // Configurar um intervalo para verificar a expiração periodicamente do token JWT
    const interval = setInterval(checkAndHandleTokenExpiration, 60000); // Verifica a cada hora
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800 opacity-75" onClick={closeModal}></div>
      {userModal ?
        <ModalUser isOpen={userModal} /> : <div className="bg-white p-6 rounded-md z-10">
          <div className="divide-y divide-slate-200">
            <div><p className="text-lg  mb-4 cursor-pointer">Editar</p></div>
            <div><h2 className="text-lg text-rose-500 font-semibold mt-4 mb-4 cursor-pointer">Deletar</h2></div>
          </div>
        </div>}
    </div>
  );
};

export default VideoModal;
