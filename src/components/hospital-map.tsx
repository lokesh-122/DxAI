'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Star, Navigation, ExternalLink, Section as Directions, Calendar } from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  rating: number;
  specialties: string[];
  emergency: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface HospitalMapProps {
  department: string;
}

export function HospitalMap({ department }: HospitalMapProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Mock hospital data - in a real app, this would come from Google Places API
  const mockHospitals: Hospital[] = [
    {
      id: '1',
      name: 'City General Hospital',
      address: '123 Medical Center Dr, Downtown',
      phone: '+1 (555) 123-4567',
      distance: '0.8 miles',
      rating: 4.5,
      specialties: ['Cardiology', 'Emergency Medicine', 'Internal Medicine'],
      emergency: true,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: '2',
      name: 'St. Mary\'s Medical Center',
      address: '456 Healthcare Ave, Midtown',
      phone: '+1 (555) 234-5678',
      distance: '1.2 miles',
      rating: 4.3,
      specialties: ['Endocrinology', 'Cardiology', 'Orthopedics'],
      emergency: true,
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: '3',
      name: 'Metropolitan Specialty Clinic',
      address: '789 Wellness Blvd, Uptown',
      phone: '+1 (555) 345-6789',
      distance: '2.1 miles',
      rating: 4.7,
      specialties: ['Gastroenterology', 'Psychiatry', 'Hematology'],
      emergency: false,
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    {
      id: '4',
      name: 'University Medical Center',
      address: '321 Research Park Dr, University District',
      phone: '+1 (555) 456-7890',
      distance: '3.5 miles',
      rating: 4.6,
      specialties: ['Cardiology', 'Endocrinology', 'Internal Medicine'],
      emergency: true,
      coordinates: { lat: 40.7505, lng: -73.9934 }
    }
  ];

  useEffect(() => {
    // Filter hospitals based on department
    const filteredHospitals = mockHospitals.filter(hospital => 
      hospital.specialties.some(specialty => 
        specialty.toLowerCase().includes(department.toLowerCase()) ||
        department.toLowerCase().includes(specialty.toLowerCase())
      )
    );
    
    setHospitals(filteredHospitals.length > 0 ? filteredHospitals : mockHospitals);
    
    // Get user location (mock for demo)
    setUserLocation({ lat: 40.7128, lng: -74.0060 });
  }, [department]);

  const openInMaps = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`;
    window.open(url, '_blank');
  };

  const callHospital = (hospital: Hospital) => {
    if (navigator.userAgent.includes('Mobile')) {
      window.location.href = `tel:${hospital.phone}`;
    } else {
      navigator.clipboard.writeText(hospital.phone);
    }
  };

  const bookAppointment = (hospital: Hospital) => {
    // Feature coming soon
  };

  const getDirections = (hospital: Hospital) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${hospital.coordinates.lat},${hospital.coordinates.lng}`;
          window.open(url, '_blank');
        },
        () => {
          openInMaps(hospital);
        }
      );
    } else {
      openInMaps(hospital);
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <MapPin className="w-5 h-5 text-green-500" />
            Nearby Hospitals - {department}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
            {/* Mock map background */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200" />
              {/* Mock map elements */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-12 right-8 w-6 h-6 bg-green-500 rounded-full" />
              <div className="absolute bottom-8 left-12 w-6 h-6 bg-green-500 rounded-full" />
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-blue-500 rounded-full" />
            </div>
            
            <div className="text-center z-10">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-slate-700 font-semibold font-poppins">
                Interactive Map
              </p>
              <p className="text-sm text-slate-600 font-inter">
                Showing {hospitals.length} nearby hospitals
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hospital List */}
      <div className="grid gap-4">
        {hospitals.map((hospital) => (
          <Card 
            key={hospital.id} 
            className={`medical-card cursor-pointer transition-medical hover:medical-shadow-lg ${
              selectedHospital?.id === hospital.id ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setSelectedHospital(hospital)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-800 font-poppins">
                      {hospital.name}
                    </h3>
                    {hospital.emergency && (
                      <Badge variant="destructive" className="text-xs">
                        Emergency
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-inter">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Navigation className="w-4 h-4" />
                      <span className="text-sm font-inter">{hospital.distance} away</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-slate-700">
                        {hospital.rating}
                      </span>
                      <span className="text-sm text-slate-500 font-inter">
                        ({Math.floor(Math.random() * 500) + 100} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hospital.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      getDirections(hospital);
                    }}
                    className="gap-2 medical-gradient hover:opacity-90"
                  >
                    <Directions className="w-4 h-4" />
                    Directions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      callHospital(hospital);
                    }}
                    className="gap-2 hover:bg-green-50"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      bookAppointment(hospital);
                    }}
                    className="gap-2 hover:bg-blue-50"
                  >
                    <Calendar className="w-4 h-4" />
                    Book
                  </Button>
                </div>
              </div>

              {selectedHospital?.id === hospital.id && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 font-poppins">
                        Contact Information
                      </h4>
                      <div className="space-y-1 text-slate-600 font-inter">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <button 
                            onClick={() => callHospital(hospital)}
                            className="hover:text-green-600 transition-colors"
                          >
                            {hospital.phone}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          Open 24/7 {hospital.emergency ? '(Emergency)' : '(Appointments)'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 font-poppins">
                        Recommended For
                      </h4>
                      <p className="text-slate-600 font-inter">
                        {department} consultations and related medical services
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => openInMaps(hospital)}
                      className="gap-2 medical-gradient hover:opacity-90"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Maps
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => bookAppointment(hospital)}
                      className="gap-2 hover:bg-green-50"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Appointment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}