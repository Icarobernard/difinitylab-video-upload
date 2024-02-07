import { useState, useRef, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';
import Head from 'next/head';

const fetchVideos = async (searchTerm: string, page: number) => {
  const response = await fetch(`/api/video?search=${searchTerm}&page=${page}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar vídeos');
  }
  return response.json();
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['videos', searchTerm], ({ pageParam = 1 }) => fetchVideos(searchTerm, pageParam), {
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
       <Head>
        <title>Difinity Sequence</title>
      </Head>
      <Navbar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      <main className="flex-1 p-8 max-w-2xl mx-auto mt-8">
        {isLoading && <p>Carregando vídeos...</p>}
        {isError && <p>Erro ao carregar vídeos</p>}

        {data && data.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.videos.map((video: any, index: number) => {
              if (data.pages.length === pageIndex + 1 && page.videos.length === index + 1) {
                return (
                  <div key={video.path} ref={lastVideoRef}>
                    <Card {...video} />
                  </div>
                );
              } else {
                return (
                  <div key={video.path}>
                    <Card {...video} />
                  </div>
                );
              }
            })}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
