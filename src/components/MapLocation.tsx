
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Temporary public token - in production, this should be stored securely
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHdlamYwYTIwMHY0MmxtcmQzc3FicXc1In0.Ek9YFqHXnjpj2m1vJI8UcA';

interface MapLocationProps {
  address: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (coordinates: [number, number]) => void;
}

export function MapLocation({ address, onAddressChange, onCoordinatesChange }: MapLocationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchInput, setSearchInput] = useState(address);
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter address to search"
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleSearch} type="button">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
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
