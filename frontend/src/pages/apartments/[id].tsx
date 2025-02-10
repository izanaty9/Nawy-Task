import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Apartment } from '../../types/apartment';

export default function ApartmentDetail() {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchApartment = async () => {
      if (!router.isReady || !id) return;
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        console.log('Fetching apartment with ID:', id);
        console.log('Base URL:', baseUrl);
        
        const response = await fetch(`${baseUrl}/api/apartments/${id}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        console.log('Response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Apartment data:', data);
        setApartment(data);
      } catch (error) {
        console.error('Error fetching apartment:', error);
        setApartment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id, router.isReady]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold">Apartment not found</h1>
      </div>
    );
  }

  const handleDelete = async () => {
      if (!window.confirm('Are you sure you want to delete this apartment?')) {
        return;
      }
  
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/apartments/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete apartment');
        }
  
        router.push('/');
      } catch (error) {
        console.error('Error deleting apartment:', error);
        alert('Failed to delete apartment');
      }
    };
  
    return (
      <Layout>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <h1 className="text-xl font-bold">{apartment.unitName}</h1>
                <div className="space-x-4">
                  <button
                    onClick={() => router.push('/')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Back to Listings
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete Apartment
                  </button>
                </div>
              </div>
            </div>
          </nav>

        <main className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative h-96">
              <img
                src={apartment.images[0] || '/placeholder.jpg'}
                alt={apartment.unitName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">{apartment.unitName}</h2>
                  <p className="text-gray-600 mb-4">{apartment.description}</p>
                  <p className="text-3xl font-bold text-blue-600 mb-4">
                    ${apartment.price.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Unit Number</p>
                      <p className="font-semibold">{apartment.unitNumber}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Project</p>
                      <p className="font-semibold">{apartment.project}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Bedrooms</p>
                      <p className="font-semibold">{apartment.bedrooms}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Bathrooms</p>
                      <p className="font-semibold">{apartment.bathrooms}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Area</p>
                      <p className="font-semibold">{apartment.area} sqft</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
