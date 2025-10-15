import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetSingleIssueQuery,
  useUpdateUserIssueMutation,
} from "@/features/api/issueApi";

const UpdateUserIssue = () => {
  const { issueId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetSingleIssueQuery(issueId);
  const [updateUserIssue, { isLoading: isUpdating }] =
    useUpdateUserIssueMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    latitude: "",
    longitude: "",
    address: "",
    image: null,
  });

  // Extract issue data from API
  const issue = data?.data;

  useEffect(() => {
    if (issue) {
      const { title, description, category, location } = issue;
      setFormData({
        title: title || "",
        description: description || "",
        category: category || "",
        latitude: location?.coordinates?.[1] || "",
        longitude: location?.coordinates?.[0] || "",
        address: location?.address || "",
        image: null,
      });
    }
  }, [issue]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const address = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData((prev) => ({ ...prev, latitude, longitude, address }));
      },
      (err) => {
        console.error(err);
        alert("Failed to get location");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);

      // Location as GeoJSON
      form.append(
        "location",
        JSON.stringify({
          coordinates: [formData.longitude, formData.latitude],
          address: formData.address,
        })
      );

      if (formData.image) form.append("image", formData.image);

      const res = await updateUserIssue({ issueId, formData: form }).unwrap();

      // console.log("Updated issue response:", res);

      if (res.success) {
        toast.success("✅ Issue updated successfully!");
        navigate("/userIssues");
      } else {
        toast.error("⚠️ Failed to update issue.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Something went wrong while updating issue.");
    }
  };

  if (isLoading) return <p>Loading issue details...</p>;
  if (isError) return <p>Failed to load issue details.</p>;
  if (!issue) return <p>Issue not found</p>;

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-950 dark:text-blue-700">
        ✏️ Update Issue
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Category</Label>
          <Select
            value={formData.category}
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

        <div className="space-y-2">
          <Label>Location</Label>
          <Button type="button" variant="outline" onClick={handleUseCurrentLocation}>
            Use Current Location
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            type="text"
            name="address"
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

        <div className="space-y-1">
          <Label>Upload Image (optional)</Label>
          <Input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>

        <Button type="submit" disabled={isUpdating} className="mx-auto justify-between">
          {isUpdating ? "Updating..." : "Update Issue"}
        </Button>
      </form>
    </div>
  );
};

export default UpdateUserIssue;
