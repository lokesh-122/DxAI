
'use client';

import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin, ListFilter, Loader2, AlertTriangle, Hospital, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NearbyHospitalsMapProps {
  recommendedSpecialty?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const defaultCenter = { lat: 37.0902, lng: -95.7129 }; // Center of USA

const commonSpecialties = [
  "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", 
  "General Practice", "Hematology", "Infectious Disease", "Nephrology", 
  "Neurology", "Oncology", "Ophthalmology", "Orthopedics", 
  "Otolaryngology (ENT)", "Pediatrics", "Psychiatry", "Pulmonology", 
  "Rheumatology", "Urology"
];

export function NearbyHospitalsMap({ recommendedSpecialty }: NearbyHospitalsMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hospitals, setHospitals] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<google.maps.places.PlaceResult | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(recommendedSpecialty || 'General Practice');
  
  const [searchError, setSearchError] = useState<string | null>(null); 
  const [geolocationLoading, setGeolocationLoading] = useState<boolean>(true);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [loadingHospitals, setLoadingHospitals] = useState<boolean>(false);
  const [openSpecialtyPopover, setOpenSpecialtyPopover] = useState(false);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey || '', 
    libraries: ['places'],
    preventGoogleFontsLoading: true,
  });

  const allSpecialties = Array.from(new Set([...commonSpecialties, ...(recommendedSpecialty ? [recommendedSpecialty] : [])])).sort();

  useEffect(() => {
    if (!googleMapsApiKey) {
      setGeolocationError("Google Maps API key is missing."); 
      setGeolocationLoading(false);
      return;
    }
    if (!isLoaded || loadError) { 
      if (loadError) {
        // The main renderContent function will display a more comprehensive error.
      }
      setGeolocationLoading(false); 
      return;
    }

    setGeolocationLoading(true);
    setGeolocationError(null); 

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeolocationLoading(false);
      },
      (geoError) => {
        console.error('Geolocation error:', geoError);
        setGeolocationError(`Geolocation failed: ${geoError.message}. Using default map location.`);
        setUserLocation(defaultCenter); 
        setGeolocationLoading(false);
      },
      { timeout: 10000 }
    );
  }, [googleMapsApiKey, isLoaded, loadError]);

  const fetchHospitals = useCallback(() => {
    if (!map || !userLocation || !isLoaded) { 
      if (isLoaded && (!map || !userLocation)) {
        setSearchError("Map or user location not available yet. Please wait.");
      }
      return;
    }

    setLoadingHospitals(true);
    setSearchError(null);
    const placesService = new window.google.maps.places.PlacesService(map);
    const request: google.maps.places.PlaceSearchRequest = {
      location: userLocation,
      radius: 20000, 
      type: 'hospital',
      keyword: selectedSpecialty,
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setHospitals(results);
        if (results.length === 0) {
          setSearchError(`No hospitals found for "${selectedSpecialty}" in your area. Try a broader specialty.`);
        }
      } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        setHospitals([]);
        setSearchError(`No hospitals found for "${selectedSpecialty}" in your area. Try a broader specialty.`);
      } else {
        console.error('Places API error:', status);
        if (status === window.google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
          setSearchError(`An unknown error occurred while fetching hospitals (${status}). This may be a temporary issue. Please try again later.`);
        } else {
          setSearchError(`Failed to fetch hospitals: ${status}. Please check your API key configuration, billing status, and ensure the Google Places API is enabled in your Google Cloud project.`);
        }
        setHospitals([]);
      }
      setLoadingHospitals(false);
    });
  }, [map, userLocation, selectedSpecialty, isLoaded]);

  useEffect(() => {
    if (isLoaded && userLocation && map) { 
      fetchHospitals();
    }
  }, [isLoaded, userLocation, selectedSpecialty, map, fetchHospitals]);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMarkerClick = (hospital: google.maps.places.PlaceResult) => {
    setSelectedHospital(hospital);
  };
  
  const renderContent = () => {
    if (!googleMapsApiKey) {
       return (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
            </AlertDescription>
          </Alert>
       );
    }

    if (loadError) {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Map Loading Error</AlertTitle>
          <AlertDescription>
            Failed to load Google Maps. Message: &quot;{loadError.message}&quot;
            <br /><br />
            <strong>Troubleshooting Tips:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>Ensure your <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in <code>.env.local</code> is correct and valid.</li>
              <li>Verify that the &quot;Maps JavaScript API&quot; and &quot;Places API&quot; are enabled in your Google Cloud Console project.</li>
              <li>Check if billing is enabled for your Google Cloud project.</li>
              <li>If you have API key restrictions, ensure they allow your current domain (e.g., <code>localhost</code> for development).</li>
              <li>Check your browser&apos;s console for more specific error messages from Google Maps.</li>
            </ul>
          </AlertDescription>
        </Alert>
      );
    }

    if (!isLoaded) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading map script...</p>
        </div>
      );
    }

    if (geolocationLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Fetching your location...</p>
        </div>
      );
    }

    if (geolocationError && !userLocation) { 
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>{geolocationError}</AlertDescription>
        </Alert>
      );
    }
    
     const showGeoErrorAlert = geolocationError && userLocation === defaultCenter;


    if (userLocation) {
      return (
        <div className="space-y-4">
          {showGeoErrorAlert && (
             <Alert variant="default" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Location Notice</AlertTitle>
                <AlertDescription>{geolocationError}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div>
              <Label htmlFor="specialty-filter" className="mb-1 text-sm font-medium flex items-center gap-1">
                <ListFilter className="h-4 w-4" /> Filter by Specialty
              </Label>
               <Popover open={openSpecialtyPopover} onOpenChange={setOpenSpecialtyPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSpecialtyPopover}
                    className="w-full sm:w-[250px] justify-between"
                    id="specialty-filter"
                  >
                    {selectedSpecialty
                      ? allSpecialties.find((spec) => spec.toLowerCase() === selectedSpecialty.toLowerCase()) || selectedSpecialty
                      : "Select specialty..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[250px] p-0" style={{width: 'var(--radix-popover-trigger-width)'}}>
                  <Command>
                    <CommandInput placeholder="Search specialty..." />
                    <CommandList>
                      <CommandEmpty>No specialty found.</CommandEmpty>
                      <CommandGroup>
                        {allSpecialties.map((spec) => (
                          <CommandItem
                            key={spec}
                            value={spec}
                            onSelect={(currentValue) => {
                              setSelectedSpecialty(currentValue.toLowerCase() === selectedSpecialty.toLowerCase() ? selectedSpecialty : currentValue);
                              setOpenSpecialtyPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSpecialty.toLowerCase() === spec.toLowerCase() ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {spec}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={fetchHospitals} disabled={loadingHospitals || !map || !userLocation} className="w-full sm:w-auto mt-2 sm:mt-5">
              {loadingHospitals ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Hospital className="mr-2 h-4 w-4" />}
              Search Hospitals
            </Button>
          </div>

          {searchError && (
            <Alert variant={hospitals.length > 0 ? "default" : "destructive"} className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{hospitals.length > 0 ? "Notice" : "Search Error"}</AlertTitle>
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={11}
            onLoad={handleMapLoad}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
          >
            <Marker position={userLocation} title="Your Location" />
            {hospitals.map((hospital) => (
              hospital.geometry?.location && (
                <Marker
                  key={hospital.place_id}
                  position={hospital.geometry.location}
                  title={hospital.name}
                  onClick={() => handleMarkerClick(hospital)}
                />
              )
            ))}
            {selectedHospital && selectedHospital.geometry?.location && (
              <InfoWindow
                position={selectedHospital.geometry.location}
                onCloseClick={() => setSelectedHospital(null)}
              >
                <div className="p-1">
                  <h4 className="font-semibold text-md">{selectedHospital.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedHospital.vicinity}</p>
                  {selectedHospital.rating && (
                    <p className="text-sm">Rating: {selectedHospital.rating} ({selectedHospital.user_ratings_total} reviews)</p>
                  )}
                   <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHospital.name || '')}&query_place_id=${selectedHospital.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 block"
                    >
                      View on Google Maps
                    </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          {loadingHospitals && (
             <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">Searching for hospitals...</p>
            </div>
          )}

          {!loadingHospitals && hospitals.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Hospitals Found:</h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {hospitals.map(hospital => (
                  <li key={hospital.place_id} className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        if (hospital.geometry?.location && map) {
                            map.panTo(hospital.geometry.location);
                            map.setZoom(15);
                            setSelectedHospital(hospital);
                        }
                      }}
                  >
                    <p className="font-medium text-foreground">{hospital.name}</p>
                    <p className="text-sm text-muted-foreground">{hospital.vicinity}</p>
                     {hospital.rating && (
                        <p className="text-xs text-muted-foreground">Rating: {hospital.rating} ({hospital.user_ratings_total})</p>
                     )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null; 
  };


  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Nearby Hospitals & Clinics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}

