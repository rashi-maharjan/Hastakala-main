import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// CHANGES MADE:
// 1. Made all fields required except frame (without showing asterisks)
// 2. Added validation for medium and paper fields to reject numeric values
// 3. Made orientation field required
// 4. Made height and width accept numeric values only (cm as standard unit)
// 5. Made price accept numeric values only with automatic comma formatting

// Backend URL
const API_URL = 'http://localhost:3001';

const AddArtwork = ({ onArtworkAdded, editingArtwork, onArtworkUpdated }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inStock, setInStock] = useState(true);
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [medium, setMedium] = useState('');
  const [paper, setPaper] = useState('');
  const [orientation, setOrientation] = useState('');
  const [frame, setFrame] = useState('Not Included');
  const fileInputRef = useRef(null);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Load editing artwork data if provided
  useEffect(() => {
    if (editingArtwork) {
      console.log("Loading artwork for editing:", editingArtwork);
      
      setTitle(editingArtwork.title || '');
      
      // Handle price formatting - remove Rs. prefix if present
      let priceValue = editingArtwork.price || '';
      if (typeof priceValue === 'string' && priceValue.includes('Rs.')) {
        priceValue = priceValue.replace('Rs.', '').trim();
      }
      setPrice(priceValue);
      
      setDescription(editingArtwork.description || '');
      setInStock(editingArtwork.inStock !== false);
      setHeight(editingArtwork.height || '');
      setWidth(editingArtwork.width || '');
      setMedium(editingArtwork.medium || '');
      setPaper(editingArtwork.paper || '');
      setOrientation(editingArtwork.orientation || '');
      setFrame(editingArtwork.frame || 'Not Included');
      
      // Set preview for existing image
      if (editingArtwork.imageUrl) {
        const imageUrl = editingArtwork.imageUrl.startsWith('/') 
          ? `${API_URL}${editingArtwork.imageUrl}` 
          : editingArtwork.imageUrl;
        setPreviewUrl(imageUrl);
      }
    }
  }, [editingArtwork]);

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setSelectedImage(null);
    setPreviewUrl('');
    setInStock(true);
    setHeight('');
    setWidth('');
    setMedium('');
    setPaper('');
    setOrientation('');
    setFrame('Not Included');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  // Validate that input does not contain numeric values
  const validateNonNumeric = (value) => {
    // Check if the value contains any digits
    return !/\d/.test(value);
  };

  // Handle medium change with improved validation
  const handleMediumChange = (e) => {
    const value = e.target.value;
    // Always update the field value for better UX
    setMedium(value);
    
    // Only show error if digits are present
    if (value !== '' && !validateNonNumeric(value)) {
      setError('Medium cannot contain numeric values');
    } else {
      // Only clear error if it was related to this field
      if (error === 'Medium cannot contain numeric values') {
        setError('');
      }
    }
  };

  // Handle paper change with improved validation
  const handlePaperChange = (e) => {
    const value = e.target.value;
    // Always update the field value for better UX
    setPaper(value);
    
    // Only show error if digits are present
    if (value !== '' && !validateNonNumeric(value)) {
      setError('Paper cannot contain numeric values');
    } else {
      // Only clear error if it was related to this field
      if (error === 'Paper cannot contain numeric values') {
        setError('');
      }
    }
  };
  
  // Format price with commas (e.g., 1,000,000)
  const formatPrice = (value) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Insert commas for thousands
    if (numericValue === '') return '';
    
    // Format with commas
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Handle price change with numeric validation and formatting
  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    
    // Only update if it's numeric (allowing commas)
    if (/^[0-9,]*$/.test(rawValue)) {
      // Format the price with commas
      const formattedValue = formatPrice(rawValue);
      setPrice(formattedValue);
      
      if (error === 'Price must contain only numbers') {
        setError('');
      }
    } else {
      setError('Price must contain only numbers');
    }
  };
  
  // Handle numeric-only fields (height and width)
  const handleNumericInput = (e, setter) => {
    const value = e.target.value;
    
    // Always update the input value first for better UX
    setter(value);
    
    // Then validate and show error if needed
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      setError('Height and width must contain numbers only');
    } else if (error === 'Height and width must contain numbers only') {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!price.trim()) {
      setError('Price is required');
      return;
    }
    
    if (!editingArtwork && !selectedImage) {
      setError('Please select an image');
      return;
    }
    
    if (!orientation) {
      setError('Orientation is required');
      return;
    }
    
    // Check for required fields
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!height.trim()) {
      setError('Height is required');
      return;
    }
    
    if (!width.trim()) {
      setError('Width is required');
      return;
    }
    
    if (!medium.trim()) {
      setError('Medium is required');
      return;
    }
    
    if (!paper.trim()) {
      setError('Paper is required');
      return;
    }
    
    // Validate that medium and paper don't have numeric values
    if (medium && !validateNonNumeric(medium)) {
      setError('Medium cannot contain numeric values');
      return;
    }
    
    if (paper && !validateNonNumeric(paper)) {
      setError('Paper cannot contain numeric values');
      return;
    }
    
    // Validate height and width are numeric if provided
    if (height && !/^\d*\.?\d*$/.test(height)) {
      setError('Height must contain numbers only');
      return;
    }
    
    if (width && !/^\d*\.?\d*$/.test(width)) {
      setError('Width must contain numbers only');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Remove commas from price for server submission
      const numericPrice = price.replace(/,/g, '');
      
      // Format price with Rs. prefix if not already present
      const formattedPrice = numericPrice.includes('Rs.') ? numericPrice : `Rs. ${numericPrice}`;
      
      if (editingArtwork) {
        // Update existing artwork
        const updatedArtwork = {
          _id: editingArtwork._id,
          title,
          price: formattedPrice,
          description,
          inStock,
          height,
          width,
          medium,
          paper,
          orientation,
          frame
        };
        
        // Add the file to the updated artwork if a new image was selected
        if (selectedImage) {
          updatedArtwork.file = selectedImage;
        }
        
        await onArtworkUpdated(updatedArtwork);
        resetForm();
      } else {
        // Add new artwork
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', formattedPrice);
        formData.append('image', selectedImage);
        formData.append('inStock', inStock);
        formData.append('orientation', orientation);
        formData.append('description', description);
        formData.append('height', height);
        formData.append('width', width);
        formData.append('medium', medium);
        formData.append('paper', paper);
        
        if (frame) formData.append('frame', frame);
        
        const response = await axios.post(`${API_URL}/api/artwork`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token
          }
        });
        
        if (response.data && response.data.artwork) {
          onArtworkAdded(response.data.artwork);
          resetForm();
        } else {
          throw new Error('Invalid response from server');
        }
      }
    } catch (err) {
      console.error('Error saving artwork:', err);
      setError(err.response?.data?.error || 'Failed to save artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Always render the form (regardless of editingArtwork)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Artwork Image
        </label>
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-48 w-full object-cover rounded-md mb-2" 
            />
            <button 
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setPreviewUrl('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
              id="artwork-image"
              ref={fileInputRef}
              required={!editingArtwork}
            />
            <label htmlFor="artwork-image" className="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                Click to upload image
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </label>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Artwork Title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (Rs.)
          </label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="10,000"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <input
            type="text"
            id="height"
            value={height}
            onChange={(e) => handleNumericInput(e, setHeight)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="15"
            required
          />
        </div>
        
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
            Width (cm) 
          </label>
          <input
            type="text"
            id="width"
            value={width}
            onChange={(e) => handleNumericInput(e, setWidth)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="10"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-1">
            Medium 
          </label>
          <input
            type="text"
            id="medium"
            value={medium}
            onChange={handleMediumChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Acrylic"
            required
          />
        </div>
        
        <div>
          <label htmlFor="paper" className="block text-sm font-medium text-gray-700 mb-1">
            Paper
          </label>
          <input
            type="text"
            id="paper"
            value={paper}
            onChange={handlePaperChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Canvas"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="orientation" className="block text-sm font-medium text-gray-700 mb-1">
            Orientation
          </label>
          <select
            id="orientation"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Orientation</option>
            <option value="Portrait">Portrait</option>
            <option value="Landscape">Landscape</option>
            <option value="Square">Square</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="frame" className="block text-sm font-medium text-gray-700 mb-1">
            Frame
          </label>
          <select
            id="frame"
            value={frame}
            onChange={(e) => setFrame(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Not Included">Not Included</option>
            <option value="Wooden Frame">Wooden Frame</option>
            <option value="Metal Frame">Metal Frame</option>
            <option value="Glass Frame">Glass Frame</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your artwork..."
          required
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="inStock"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">
          In Stock
        </label>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : editingArtwork ? 'Update Artwork' : 'Add Artwork'}
        </button>
      </div>
    </form>
  );
};

export default AddArtwork;