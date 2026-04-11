import type { CropListing, ProcurementOrder } from '@farmhith/types';

export const mockListings: CropListing[] = [
  {
    id: 'cl-301', farmerId: 'farmer-001', farmerName: 'Ramesh Kumar',
    farmerDistrict: 'Ludhiana', farmerState: 'Punjab',
    residueType: 'Paddy Straw', quantityTons: 8.5,
    location: 'Ludhiana, Punjab', farmhithPricePerTon: 2800,
    availableFrom: '2026-04-25', status: 'ACTIVE',
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'cl-302', farmerId: 'farmer-006', farmerName: 'Amarjeet Sidhu',
    farmerDistrict: 'Bathinda', farmerState: 'Punjab',
    residueType: 'Paddy Straw', quantityTons: 15.0,
    location: 'Bathinda, Punjab', farmhithPricePerTon: 2750,
    availableFrom: '2026-04-28', status: 'ACTIVE',
    createdAt: '2026-04-09T09:00:00Z',
  },
  {
    id: 'cl-303', farmerId: 'farmer-007', farmerName: 'Prem Chand Sharma',
    farmerDistrict: 'Karnal', farmerState: 'Haryana',
    residueType: 'Wheat Straw', quantityTons: 20.0,
    location: 'Karnal, Haryana', farmhithPricePerTon: 2600,
    availableFrom: '2026-05-05', status: 'ACTIVE',
    createdAt: '2026-04-08T11:00:00Z',
  },
  {
    id: 'cl-304', farmerId: 'farmer-008', farmerName: 'Gurmeet Johal',
    farmerDistrict: 'Amritsar', farmerState: 'Punjab',
    residueType: 'Sugarcane Bagasse', quantityTons: 10.0,
    location: 'Amritsar, Punjab', farmhithPricePerTon: 3100,
    availableFrom: '2026-04-20', status: 'MATCHED',
    createdAt: '2026-04-07T08:00:00Z',
  },
];

export const mockOrders: ProcurementOrder[] = [
  {
    id: 'po-301', listingId: 'cl-301', listingResidueType: 'Paddy Straw',
    plantId: 'plant-001', plantName: 'Green Energy Bio-Pellet Plant',
    farmerId: 'farmer-001', farmerName: 'Ramesh Kumar',
    finalQuantityTons: 8.5, totalAmount: 23800,
    status: 'INTERESTED', createdAt: '2026-04-11T10:00:00Z',
  },
  {
    id: 'po-302', listingId: 'cl-303', listingResidueType: 'Wheat Straw',
    plantId: 'plant-001', plantName: 'Green Energy Bio-Pellet Plant',
    farmerId: 'farmer-007', farmerName: 'Prem Chand Sharma',
    finalQuantityTons: 10.0, totalAmount: 26000,
    status: 'CONFIRMED', createdAt: '2026-04-09T14:00:00Z',
  },
];
