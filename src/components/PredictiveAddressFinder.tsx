
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

  // Function to fetch address suggestions - Using OpenStreetMap Nominatim for Colorado addresses
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      // Using Nominatim for geocoding (OpenStreetMap service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)},colorado,usa&limit=5&addressdetails=1&countrycodes=us`,
        { headers: { 'Accept-Language': 'en' } }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        // Format the suggestions
        const suggestions = data.map((item: any, index: number): AddressSuggestion => {
          // Get latitude and longitude
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          
          // Format the place name to be more readable
          let formattedAddress = item.display_name;
          // If display_name is too long, try to shorten it
          if (item.address) {
            const parts = [];
            if (item.address.house_number) parts.push(item.address.house_number);
            if (item.address.road) parts.push(item.address.road);
            if (item.address.city || item.address.town || item.address.village) {
              parts.push(item.address.city || item.address.town || item.address.village);
            }
            if (item.address.state) parts.push(item.address.state);
            if (parts.length >= 3) {
              formattedAddress = parts.join(', ');
            }
          }
          
          return {
            id: `suggestion-${index}`,
            place_name: formattedAddress,
            center: lat && lon ? [lat, lon] : undefined
          };
        });

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

  // Function to search for an address - Using OpenStreetMap Nominatim for Colorado addresses
  const searchAddress = async (searchAddress: string) => {
    if (!searchAddress.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)},colorado,usa&limit=1&addressdetails=1&countrycodes=us`,
        { headers: { 'Accept-Language': 'en' } }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const coordinates: [number, number] = [lat, lon];
        
        // Format the place name to be more readable
        let formattedAddress = item.display_name;
        
        // If display_name is too long, try to shorten it
        if (item.address) {
          const parts = [];
          if (item.address.house_number) parts.push(item.address.house_number);
          if (item.address.road) parts.push(item.address.road);
          if (item.address.city || item.address.town || item.address.village) {
            parts.push(item.address.city || item.address.town || item.address.village);
          }
          if (item.address.state) parts.push(item.address.state);
          if (parts.length >= 3) {
            formattedAddress = parts.join(', ');
          }
        }

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
          description: "Please try entering a more specific Colorado address.",
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
