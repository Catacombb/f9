
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Temporary public token - in production, this should be stored securely
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHdlamYwYTIwMHY0MmxtcmQzc3FicXc1In0.Ek9YFqHXnjpj2m1vJI8UcA';

interface MapLocationProps {
  address: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (coordinates: [number, number]) => void;
}

interface AddressSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

export function MapLocation({ address, onAddressChange, onCoordinatesChange }: MapLocationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchInput, setSearchInput] = useState(address);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [174.7787, -41.2924], // Default to New Zealand
      zoom: 5
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Create a marker but don't add it to the map yet
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: '#9b87f5'
    });

    // When marker is dragged, update the address
    marker.current.on('dragend', async () => {
      if (!marker.current) return;
      
      const lngLat = marker.current.getLngLat();
      onCoordinatesChange([lngLat.lng, lngLat.lat]);
      
      try {
        // Reverse geocode to get address
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const newAddress = data.features[0].place_name;
          setSearchInput(newAddress);
          onAddressChange(newAddress);
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
      }
    });

    // Add click event to map to place marker
    map.current.on('click', (e) => {
      if (!marker.current || !map.current) return;
      
      // Place marker at click location
      marker.current.setLngLat(e.lngLat).addTo(map.current);
      onCoordinatesChange([e.lngLat.lng, e.lngLat.lat]);
      
      // Reverse geocode to get address
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
      )
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const newAddress = data.features[0].place_name;
            setSearchInput(newAddress);
            onAddressChange(newAddress);
          }
        })
        .catch(error => {
          console.error('Error reverse geocoding:', error);
        });
    });

    // If we already have an address, try to geocode it
    if (address) {
      searchAddress(address);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Function to fetch address suggestions
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=nz&types=address,place,locality,neighborhood,postcode`
      );
      const data = await response.json();
      
      if (data.features) {
        setAddressSuggestions(data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center
        })));
        
        if (data.features.length > 0) {
          setIsPopoverOpen(true);
        }
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  // Function to search for an address
  const searchAddress = async (searchAddress: string) => {
    if (!map.current || !marker.current) return;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchAddress)}.json?access_token=${mapboxgl.accessToken}&country=nz`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        // Update marker and map
        marker.current.setLngLat([lng, lat]).addTo(map.current);
        map.current.flyTo({
          center: [lng, lat],
          zoom: 15
        });
        
        // Update coordinates
        onCoordinatesChange([lng, lat]);
        
        // Update address with formatted version
        const formattedAddress = data.features[0].place_name;
        setSearchInput(formattedAddress);
        onAddressChange(formattedAddress);
      } else {
        toast({
          title: "Address not found",
          description: "Please try a different address or click on the map to set the location manually.",
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
    
    if (map.current && marker.current) {
      // Update marker and map
      marker.current.setLngLat(suggestion.center).addTo(map.current);
      map.current.flyTo({
        center: suggestion.center,
        zoom: 15
      });
      
      // Update coordinates
      onCoordinatesChange(suggestion.center);
    }
    
    setIsPopoverOpen(false);
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
                placeholder="Enter address to search"
                onKeyDown={handleKeyDown}
                className="flex-1 pr-8"
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
                <CommandGroup>
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
        <div
          ref={mapContainer}
          className="w-full h-[300px] relative"
        />
      </Card>
      
      <p className="text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 inline-block mr-1" />
        Click on the map to set location or search by address
      </p>
    </div>
  );
}
