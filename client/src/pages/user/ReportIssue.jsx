import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateUserIssueMutation } from "@/features/api/issueApi";
import { useNavigate } from "react-router-dom";
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
    latitude: "",
    longitude: "",
    address: "",
    image: null,
  });

  const [
    createUserIssue,
    { data: issueData, error: issueError, isLoading: issueIsLoading },
  ] = useCreateUserIssueMutation();

  const navigate = useNavigate();

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
      (position) => {
        const { latitude, longitude } = position.coords;
        const address = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          address,
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

    if (!formData.latitude || !formData.longitude) {
      alert("Please add location coordinates.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);

    // 👇 send in GeoJSON format
    formDataToSend.append(
      "location",
      JSON.stringify({
        coordinates: [formData.longitude, formData.latitude],
        address: formData.address,
      })
    );

    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const result = await createUserIssue(formDataToSend).unwrap();
      if (result.success) {
        if(result.isDuplicate){
          alert(`${result.message}`)
        }
        else alert("Issue reported successfully!");
        navigate("/communityBoard");
      }
    } catch (error) {
      console.error("Error creating issue:", error);
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
              <SelectItem value="Building">Building</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Section */}
        <div className="space-y-2">
          <Label>Location</Label>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleUseCurrentLocation}
            >
              Use Current Location
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            type="text"
            name="address"
            placeholder="Address or landmark (optional)"
            value={formData.address}
            onChange={handleChange}
          />

          {formData.latitude && formData.longitude && (
            <a
              href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm underline inline-block mt-1"
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
          {issueIsLoading ? "Submitting..." : "Submit Issue"}
        </Button>
      </form>
    </div>
  );
};

export default ReportIssue;
