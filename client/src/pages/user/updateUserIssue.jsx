import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
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
    location: "",
    image: null,
  });

  // ✅ Prefill form when data loads
  useEffect(() => {
    if (data?.issue) {
      const { title, description, category, location } = data.issue;
      setFormData({
        title,
        description,
        category,
        location,
        image: null,
      });
    }
  }, [data]);

  // ✅ Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image input
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // ✅ Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      for (const key in formData) {
        if (formData[key]) form.append(key, formData[key]);
      }

      const res = await updateUserIssue({
        issueId,
        data: form,
      }).unwrap();

      if (res?.success) {
        toast.success("✅ Issue updated successfully!");
        // Navigate back to board — will auto-refetch data
        navigate("/communityBoard");
      } else {
        toast.error("⚠️ Failed to update issue.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("❌ Something went wrong while updating issue.");
    }
  };

  if (isLoading) return <p>Loading issue details...</p>;
  if (isError) return <p>Failed to load issue details.</p>;

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        ✏️ Update Your Issue
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border rounded-lg p-2"
        />

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Issue"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUserIssue;
