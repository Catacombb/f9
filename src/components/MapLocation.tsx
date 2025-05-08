import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Fix Leaflet icon issues in React
// This block fixes the missing icon issue in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface AddressSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

interface MapLocationProps {
  address: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (coordinates: [number, number]) => void;
}

// Component to handle map updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    map.on('click', onMapClick);
    
    return () => {
      map.off('click', onMapClick);
    };
  }, [map, onMapClick]);
  
  return null;
}

export function MapLocation({ address, onAddressChange, onCoordinatesChange }: MapLocationProps) {
  // New Zealand coordinates for initial view
  const defaultCenter: [number, number] = [-41.2924, 174.7787];
  const defaultZoom = 5;

  const [searchInput, setSearchInput] = useState(address);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(defaultCenter);
  const [currentZoom, setCurrentZoom] = useState(defaultZoom);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

  const { toast } = useToast();
  const markerRef = useRef<L.Marker>(null);

  // Function to fetch address suggestions using Nominatim
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    
    try {
      // Using Nominatim for geocoding (with focus on New Zealand)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=nz&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const suggestions = data.map((item: any, index: number) => ({
          id: `suggestion-${index}`,
          place_name: item.display_name,
          center: [parseFloat(item.lat), parseFloat(item.lon)] as [number, number]
        }));
        
        setAddressSuggestions(suggestions);
        
        if (suggestions.length > 0) {
          setIsPopoverOpen(true);
        }
      } else {
        setAddressSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      toast({
        title: "Error fetching suggestions",
        description: "Please try a different search term or click on the map",
        variant: "destructive"
      });
    }
  };

  // Function to search for an address using Nominatim
  const searchAddress = async (searchAddress: string) => {
    if (!searchAddress.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&countrycodes=nz&limit=1&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const coordinates: [number, number] = [lat, lon];
        
        // Update marker and center the map
        setMarkerPosition(coordinates);
        setCurrentPosition(coordinates);
        
        // Determine appropriate zoom level based on the type of location
        let zoomLevel = 15;
        if (data[0].type === 'country' || data[0].type === 'region') zoomLevel = 8;
        if (data[0].type === 'city' || data[0].type === 'town') zoomLevel = 12;
        if (data[0].type === 'suburb' || data[0].type === 'village') zoomLevel = 14;
        if (data[0].type === 'building' || data[0].type === 'house' || data[0].type === 'residential') zoomLevel = 18;
        
        setCurrentZoom(zoomLevel);
        
        // Update coordinates in parent component
        onCoordinatesChange(coordinates);
        
        // Update address with formatted version
        const formattedAddress = data[0].display_name;
        setSearchInput(formattedAddress);
        onAddressChange(formattedAddress);
        
        toast({
          title: "Location found",
          description: "Map has been centered on the selected address.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Address not found",
          description: "Please try a different address or click on the map to set location manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast({
        title: "Error searching for address",
        description: "Please try again or click on the map to set the location manually.",
        variant: "destructive"
      });
    }
  };

  const handleSearch = () => {
    searchAddress(searchInput);
    setIsPopoverOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    fetchAddressSuggestions(value);
  };

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setSearchInput(suggestion.place_name);
    onAddressChange(suggestion.place_name);
    
    // Update marker and map
    setMarkerPosition(suggestion.center);
    setCurrentPosition(suggestion.center);
    setCurrentZoom(17); // Closer zoom for selected addresses
    
    // Update coordinates in parent component
    onCoordinatesChange(suggestion.center);
    
    toast({
      title: "Location selected",
      description: "Map has been centered on your selected address.",
      duration: 3000,
    });
    
    setIsPopoverOpen(false);
  };

  // Handle map click to place marker
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const newPosition: [number, number] = [lat, lng];
    
    setMarkerPosition(newPosition);
    onCoordinatesChange(newPosition);
    
    // Reverse geocode to get address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'en' } }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data && data.display_name) {
        const newAddress = data.display_name;
        setSearchInput(newAddress);
        onAddressChange(newAddress);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      toast({
        title: "Error getting address",
        description: "The marker has been placed, but we couldn't retrieve the address information.",
        variant: "destructive"
      });
    }
  };

  // Handle marker drag end
  const handleMarkerDragEnd = () => {
    if (markerRef.current) {
      const marker = markerRef.current;
      const position = marker.getLatLng();
      const newPosition: [number, number] = [position.lat, position.lng];
      
      setMarkerPosition(newPosition);
      onCoordinatesChange(newPosition);
      
      // Reverse geocode to get address
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`,
        { headers: { 'Accept-Language': 'en' } }
      )
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => {
          if (data && data.display_name) {
            const newAddress = data.display_name;
            setSearchInput(newAddress);
            onAddressChange(newAddress);
          }
        })
        .catch(error => {
          console.error('Error reverse geocoding:', error);
        });
    }
  };

  return (
    <div className="space-y-4">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <div className="flex gap-2">
          <PopoverTrigger asChild className="flex-1">
            <div className="relative w-full">
              <Input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                placeholder="Start typing your address to search"
                onKeyDown={handleKeyDown}
                className="flex-1 pr-8"
                autoComplete="off"
              />
              {searchInput && addressSuggestions.length > 0 && (
                <ArrowDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </PopoverTrigger>
          <Button onClick={handleSearch} type="button">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {addressSuggestions.length > 0 && (
          <PopoverContent className="p-0 w-[320px] lg:w-[400px]" align="start">
            <Command>
              <CommandList>
                <CommandGroup heading="Address suggestions">
                  {addressSuggestions.map((suggestion) => (
                    <CommandItem 
                      key={suggestion.id}
                      onSelect={() => handleAddressSelect(suggestion)}
                      className="cursor-pointer"
                    >
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{suggestion.place_name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
      
      <Card className="overflow-hidden">
        <div className="w-full h-[300px] relative">
          <MapContainer 
            center={defaultCenter} 
            zoom={defaultZoom} 
            style={{ height: '100%', width: '100%' }}
            attributionControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={currentPosition} zoom={currentZoom} />
            <MapClickHandler onMapClick={handleMapClick} />
            
            {markerPosition && (
              <Marker 
                position={markerPosition}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDragEnd
                }}
                ref={markerRef}
              />
            )}
          </MapContainer>
        </div>
      </Card>
      
      <p className="text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 inline-block mr-1" />
        Click on the map to set location or search by address
      </p>
    </div>
  );
}
