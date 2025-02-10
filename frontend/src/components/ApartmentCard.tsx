import Link from 'next/link';
import { Apartment } from '../types/apartment';

interface ApartmentCardProps {
  apartment: Apartment;
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Link href={`/apartments/${apartment._id}`} passHref>
      <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white cursor-pointer">
        <div className="relative h-48">
          <img
            src={apartment.images[0] || '/placeholder.jpg'}
            alt={apartment.unitName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{apartment.unitName}</h2>
          <p className="text-gray-600 mb-2">{apartment.project}</p>
          <p className="text-gray-800 font-bold">${apartment.price.toLocaleString()}</p>
          <div className="mt-2 flex items-center text-gray-600">
            <span>{apartment.bedrooms} beds</span>
            <span className="mx-2">•</span>
            <span>{apartment.bathrooms} baths</span>
            <span className="mx-2">•</span>
            <span>{apartment.area} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}