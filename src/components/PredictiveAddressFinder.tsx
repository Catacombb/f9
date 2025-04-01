
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
  address: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange?: (coordinates: [number, number]) => void;
}

export function PredictiveAddressFinder({ 
  address, 
  onAddressChange, 
  onCoordinatesChange 
}: PredictiveAddressFinderProps) {
  const [searchInput, setSearchInput] = useState(address);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        const suggestions = data.map((item: any, index: number): AddressSuggestion => ({
          id: `suggestion-${index}`,
          place_name: item.display_name,
          center: [parseFloat(item.lat), parseFloat(item.lon)]
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
        description: "Please try a different search term",
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

        // Update coordinates in parent component if provided
        if (onCoordinatesChange) {
          onCoordinatesChange(coordinates);
        }

        // Update address with formatted version
        const formattedAddress = data[0].display_name;
        setSearchInput(formattedAddress);
        onAddressChange(formattedAddress);

        toast({
          title: "Address found",
          description: "The address has been selected successfully.",
          duration: 3000
        });
      } else {
        toast({
          title: "Address not found",
          description: "Please try a different address.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast({
        title: "Error searching for address",
        description: "Please try again with a different search term.",
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
    onAddressChange(suggestion.place_name);
    
    // Update coordinates in parent component if provided
    if (suggestion.center && onCoordinatesChange) {
      onCoordinatesChange(suggestion.center);
    }
    
    toast({
      title: "Address selected",
      description: "The address has been selected successfully.",
      duration: 3000
    });
    
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
                placeholder="Start typing your address to search"
                onKeyDown={handleKeyDown}
                className="flex-1"
                autoComplete="off"
              />
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
                      <span className="truncate">{suggestion.place_name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
      
      <p className="text-sm text-muted-foreground">
        Start typing to search for your address
      </p>
    </div>
  );
}
