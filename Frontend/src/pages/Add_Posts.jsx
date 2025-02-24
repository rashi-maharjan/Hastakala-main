import Header from "../components/Header";
import { useState } from "react";

export default function Add_Products() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <a
          href="/products"
          className="mb-6 inline-flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 12H18"
              stroke="#000D26"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.6 15.6L6 12L9.6 8.40002"
              stroke="#000D26"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </a>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image Upload Section */}
          <div className="flex justify-center items-center rounded-[32px] shadow-[0px_1px_20px_0px_rgba(0,0,0,0.10)] p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-lg font-medium">Add image</p>
              <div className="rounded-lg">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                  >
                    <path
                      d="M36.8333 6.5H15.1667C10.3802 6.5 6.5 10.3802 6.5 15.1667V36.8333C6.5 41.6198 10.3802 45.5 15.1667 45.5H36.8333C41.6198 45.5 45.5 41.6198 45.5 36.8333V15.1667C45.5 10.3802 41.6198 6.5 36.8333 6.5Z"
                      stroke="#000D26"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.5 36.8333L14.2783 29.055C15.0902 28.2479 16.1885 27.7949 17.3333 27.7949C18.4781 27.7949 19.5764 28.2479 20.3883 29.055L25.1117 33.7783C25.9236 34.5854 27.0219 35.0384 28.1667 35.0384C29.3115 35.0384 30.4098 34.5854 31.2217 33.7783L45.5 19.5"
                      stroke="#000D26"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="rounded-full bg-[#204EC5] px-6 py-2 text-white hover:bg-[#204EC5]/90 cursor-pointer"
              >
                Select from Device
              </label>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full max-w-3xl mx-auto p-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="product-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="product-name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex justify-end">
              <button className="rounded-full bg-[#204EC5] px-6 py-2 text-white hover:bg-[#204EC5]/90">
                Add Post
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
