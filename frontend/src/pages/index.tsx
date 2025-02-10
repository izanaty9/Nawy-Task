import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ApartmentCard from '../components/ApartmentCard';
import { Apartment } from '../types/apartment';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
console.log('Environment Variables:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_URL
});

export default function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    console.log('Component mounted, API_URL:', API_URL);

    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construct the full URL using the constant
        const url = search
          ? `${API_URL}/api/apartments?search=${encodeURIComponent(search as string)}`
          : `${API_URL}/api/apartments`;

        console.log('Making request to:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        setApartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch apartments');
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      console.log('Router is ready, fetching apartments...');
      fetchApartments();
    }
  }, [search, router.isReady]);

  const handleSearch = (value: string) => {
    console.log('Search value:', value);
    router.push({
      pathname: '/',
      query: value ? { search: value } : undefined
    }, undefined, { shallow: true });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by unit name, number, or project..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={search as string || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                <p>No apartments found</p>
                <p className="text-sm mt-2">API URL: {API_URL}</p>
              </div>
            ) : (
              apartments.map((apartment) => (
                <ApartmentCard key={apartment._id} apartment={apartment} />
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}