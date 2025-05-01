
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AddressSuggestion {
  id: string;
  place_name: string;
  center?: [number, number];
}

interface PredictiveAddressFinderProps {
  value: string;
  onChange: (address: string) => void;
  onCoordinatesSelect?: (coordinates: [number, number]) => void;
}

export function PredictiveAddressFinder({ 
  value, 
  onChange, 
  onCoordinatesSelect 
}: PredictiveAddressFinderProps) {
  const [searchInput, setSearchInput] = useState(value);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when prop changes
  useEffect(() => {
    setSearchInput(value);
  }, [value]);

  // Function to fetch address suggestions - Modified to prioritize Colorado addresses
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      // Using Mapbox for geocoding with Colorado bias
      const accessToken = 'pk.eyJ1IjoiZjlwcm9kdWN0aW9ucyIsImEiOiJjbHd2Ymw4Z3cwMW5pMmtucjN3MG4wNXA1In0.FOQTuI3VdQnC-KlD1AJWQg';
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
      const params = new URLSearchParams({
        access_token: accessToken,
        country: 'us',
        types: 'address',
        limit: '5',
        proximity: '-104.9847,39.7392', // Denver, CO coordinates to bias results
        bbox: '-109.060253,36.992426,-102.041524,41.003444', // Colorado bounding box
      });

      const response = await fetch(`${endpoint}?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.features && data.features.length > 0) {
        const suggestions = data.features.map((item: any, index: number): AddressSuggestion => ({
          id: `suggestion-${index}`,
          place_name: item.place_name,
          center: item.center ? [item.center[1], item.center[0]] : undefined // Swap to [lat, lng]
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
      // Silent failure - don't show error toast
      setAddressSuggestions([]);
    }
  };

  // Function to search for an address - Modified to use Mapbox
  const searchAddress = async (searchAddress: string) => {
    if (!searchAddress.trim()) return;

    try {
      const accessToken = 'pk.eyJ1IjoiZjlwcm9kdWN0aW9ucyIsImEiOiJjbHd2Ymw4Z3cwMW5pMmtucjN3MG4wNXA1In0.FOQTuI3VdQnC-KlD1AJWQg';
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchAddress)}.json`;
      const params = new URLSearchParams({
        access_token: accessToken,
        country: 'us',
        types: 'address',
        limit: '1',
        proximity: '-104.9847,39.7392', // Denver, CO
        bbox: '-109.060253,36.992426,-102.041524,41.003444', // Colorado bounding box
      });

      const response = await fetch(`${endpoint}?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.features && data.features.length > 0) {
        const feature = data.features[0];
        const formattedAddress = feature.place_name;
        
        // Swap coordinates to [lat, lng] format
        const coordinates: [number, number] = [feature.center[1], feature.center[0]];

        // Update coordinates in parent component if provided
        if (onCoordinatesSelect) {
          onCoordinatesSelect(coordinates);
        }

        // Update address with formatted version
        setSearchInput(formattedAddress);
        onChange(formattedAddress);
      } else {
        toast({
          title: "Address not found",
          description: "Please try entering a more specific address.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast({
        title: "Error searching for address",
        description: "Please try again with a more specific search term.",
        variant: "destructive"
      });
    }
  };

  const handleSearch = () => {
    searchAddress(searchInput);
    setIsPopoverOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Debounce the API call
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);
  };

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    setSearchInput(suggestion.place_name);
    onChange(suggestion.place_name);
    
    // Update coordinates in parent component if provided
    if (suggestion.center && onCoordinatesSelect) {
      onCoordinatesSelect(suggestion.center);
    }
    
    setIsPopoverOpen(false);
  };

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
                placeholder="Enter your Colorado address"
                onKeyDown={handleKeyDown}
                className="flex-1 text-black"
                autoComplete="off"
              />
            </div>
          </PopoverTrigger>
          <Button 
            onClick={handleSearch} 
            type="button"
            className="bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-300"
          >
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
                      className="cursor-pointer text-black"
                    >
                      <span className="truncate">{suggestion.place_name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
