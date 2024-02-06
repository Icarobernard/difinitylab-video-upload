import { useState } from 'react';
import { useQuery } from 'react-query';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';

const fetchVideos = async (searchTerm: string) => {
  const response = await fetch(`/api/video?search=${searchTerm}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar vídeos');
  }
  return response.json();
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: videos, isLoading, isError } = useQuery(['videos', searchTerm], () => fetchVideos(searchTerm));

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      <main className="flex-1 p-8 max-w-2xl mx-auto mt-8">
        {isLoading && <p>Carregando vídeos...</p>}
        {isError && <p>Erro ao carregar vídeos</p>}

        {videos && videos.map((video: any) => (
          <Card key={video.path} {...video} />
        ))}
      </main>
    </div>
  );
};

export default Home;
