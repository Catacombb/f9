
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SectionHeader } from './SectionHeader';

const formSchema = z.object({
  preferredMethod: z.string().min(1, { message: 'Please select a preferred contact method' }),
  bestTimes: z.array(z.string()).min(1, { message: 'Please select at least one best time' }),
  availableDays: z.array(z.string()).min(1, { message: 'Please select at least one available day' }),
  frequency: z.string().min(1, { message: 'Please select a communication frequency' }),
  urgentContact: z.string().min(1, { message: 'Please specify urgent contact method' }),
  responseTime: z.string().min(1, { message: 'Please select a preferred response time' }),
  additionalNotes: z.string().optional(),
});

export function CommunicationSection() {
  const { formData, updateFormData } = useDesignBrief();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredMethod: formData.communication?.preferredMethod || '',
      bestTimes: formData.communication?.bestTimes || [],
      availableDays: formData.communication?.availableDays || [],
      frequency: formData.communication?.frequency || '',
      urgentContact: formData.communication?.urgentContact || '',
      responseTime: formData.communication?.responseTime || '',
      additionalNotes: formData.communication?.additionalNotes || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData('communication', values);
  }

  // Handle individual field changes
  const handleFieldChange = () => {
    const values = form.getValues();
    updateFormData('communication', values);
  };

  const bestTimeOptions = [
    { id: 'morning', label: 'Morning (8am-12pm)' },
    { id: 'afternoon', label: 'Afternoon (12pm-5pm)' },
    { id: 'evening', label: 'Evening (5pm-9pm)' },
  ];

  const availableDaysOptions = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="container max-w-3xl py-6">
      <SectionHeader
        title="Communication Preferences"
        description="Specify how you'd prefer to communicate during your project."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="preferredMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Contact Method</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred contact method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="sms">Text Message (SMS)</SelectItem>
                    <SelectItem value="video">Video Call (Zoom, Skype, etc.)</SelectItem>
                    <SelectItem value="in-person">In-Person Meetings</SelectItem>
                    <SelectItem value="pm-software">Project Management Software</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How would you like us to contact you primarily?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bestTimes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Best Times for Contact</FormLabel>
                    <FormDescription>
                      When are you generally available?
                    </FormDescription>
                  </div>
                  {bestTimeOptions.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="bestTimes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, item.id]
                                    : field.value?.filter((value) => value !== item.id);
                                  field.onChange(newValue);
                                  handleFieldChange();
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availableDays"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Available Days</FormLabel>
                    <FormDescription>
                      Which days are you available for communication?
                    </FormDescription>
                  </div>
                  {availableDaysOptions.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="availableDays"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, item.id]
                                    : field.value?.filter((value) => value !== item.id);
                                  field.onChange(newValue);
                                  handleFieldChange();
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency of Communication</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select communication frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly Updates</SelectItem>
                    <SelectItem value="biweekly">Bi-Weekly Updates</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                    <SelectItem value="major-decisions">Only for Major Decisions</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How often would you like to be updated during the project?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgentContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency or Urgent Contact</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgent contact method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="phone-first">Phone Call First, Then Email</SelectItem>
                    <SelectItem value="email-first">Email First, Then Phone</SelectItem>
                    <SelectItem value="phone-only">Phone Call Only</SelectItem>
                    <SelectItem value="sms-only">Text Message Only</SelectItem>
                    <SelectItem value="any">Any Available Method</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How should we contact you for urgent matters?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responseTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Response Time</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred response time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="same-day">Same Day</SelectItem>
                    <SelectItem value="1-2-days">1-2 Business Days</SelectItem>
                    <SelectItem value="flexible">Flexible/No Urgency</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How quickly do you expect responses to your communications?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional communication preferences, time zones, or specific instructions..."
                    className="min-h-[100px]"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Add any other specific communication preferences here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full md:w-auto">Save Communication Preferences</Button>
        </form>
      </Form>
    </div>
  );
}
