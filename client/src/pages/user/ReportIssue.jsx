import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateUserIssueMutation } from "@/features/api/issueApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "", // now holds either typed or auto location
    image: null,
  });

  const [
    createUserIssue,
    {
      data: issueData,
      error: issueError,
      isLoading: issueIsLoading,
      isSuccess: issueIsSuccess,
    },
  ] = useCreateUserIssueMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Use reverse geocoding with Google Maps API (optional enhancement)
        const address = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData((prev) => ({
          ...prev,
          location: address,
        }));
      },
      (err) => {
        alert("Failed to fetch location");
        console.error(err);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("location", formData.location);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

      try {
         const result = await createUserIssue(formDataToSend).unwrap();        
      } catch (error) {
        console.error("Error creating issue:", error);
        return;        
      }
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-950 dark:text-blue-700">
        Report a Civic Issue
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            placeholder="Eg. Overflowing Garbage"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            name="description"
            placeholder="Briefly explain the issue..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <Label>Category</Label>
          <Select
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, category: val }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Road">Road</SelectItem>
              <SelectItem value="Garbage">Garbage</SelectItem>
              <SelectItem value="Streetlight">Streetlight</SelectItem>
              <SelectItem value="Sewer">Sewer</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Field */}
        <div className="space-y-1">
          <Label>Location</Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleUseCurrentLocation}
            >
              Use Current Location
            </Button>
            <span className="text-sm self-center text-gray-500">or</span>
            <Input
              type="text"
              name="location"
              placeholder="Eg. 3W2C+WR Mumbai, Maharashtra"
              value={formData.location}
              onChange={handleChange}
              className="flex-1"
            />
          </div>
          {formData.location && (
            <a
              href={
                formData.location.startsWith("http")
                  ? formData.location
                  : `https://maps.google.com/?q=${formData.location}`
              }
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm underline mt-1 inline-block"
            >
              View on Google Maps
            </a>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-1">
          <Label>Upload Image</Label>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="mx-auto justify-between">
          Submit Issue
        </Button>
      </form>
    </div>
  );
};

export default ReportIssue;
