import { useState } from 'react';
import axios from 'axios';

// Backend API URL
const API_URL = 'http://localhost:3001'; 
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const AddArtwork = ({ onArtworkAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [inStock, setInStock] = useState(true);
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [medium, setMedium] = useState('');
  const [paper, setPaper] = useState('');
  const [orientation, setOrientation] = useState('Portrait');
  const [frame, setFrame] = useState('Not Included');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size before processing
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      e.target.value = ''; // Reset the input
      return;
    }
    
    setError(''); // Clear any previous errors
    setImage(file);
    
    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !price || !image) {
      setError('Title, price, and image are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', `Rs. ${price}`); // Format price consistently
      formData.append('image', image);
      formData.append('inStock', inStock);
      formData.append('height', height ? `${height} cm` : '');
      formData.append('width', width ? `${width} cm` : '');
      formData.append('medium', medium);
      formData.append('paper', paper);
      formData.append('orientation', orientation);
      formData.append('frame', frame);
      formData.append('description', description);

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError('You must be logged in');
        setLoading(false);
        return;
      }

      console.log('Sending artwork data to server...');

      // Send request to add artwork
      const response = await axios.post(`${API_URL}/api/artwork`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
      });

      console.log('Artwork added successfully:', response.data);

      // Reset form
      setTitle('');
      setPrice('');
      setImage(null);
      setPreviewUrl('');
      setInStock(true);
      setHeight('');
      setWidth('');
      setMedium('');
      setPaper('');
      setOrientation('Portrait');
      setFrame('Not Included');
      setDescription('');
      setShowModal(false);
      setCurrentStep(1);
      
      // Add new artwork to the feed
      if (onArtworkAdded) {
        onArtworkAdded(response.data.artwork);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error adding artwork:', err);
      
      // Provide more detailed error message
      if (err.response) {
        setError(err.response.data.error || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please check if the server is running.');
      } else {
        setError(`Error: ${err.message}`);
      }
      
      setLoading(false);
    }
  };

  const nextStep = () => {
    console.log('Current step before increment:', currentStep);
    
    if (currentStep === 1 && (!title || !price || !image)) {
      setError('Please fill all required fields in this step');
      return;
    }
    
    // Ensure we don't go beyond step 3
    if (currentStep < 3) {
      setError('');
      const newStep = currentStep + 1;
      console.log('Moving to step:', newStep);
      setCurrentStep(newStep);
    }
  };

  const prevStep = () => {
    console.log('Current step before decrement:', currentStep);
    
    if (currentStep > 1) {
      setError('');
      const newStep = currentStep - 1;
      console.log('Moving back to step:', newStep);
      setCurrentStep(newStep);
    }
  };

  // Modal header
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Add New Artwork</h2>
      <button
        type="button"
        onClick={() => setShowModal(false)}
        className="text-gray-500 hover:text-gray-700"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  // Step indicator
  const renderSteps = () => (
    <div className="flex items-center mb-6 justify-center">
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
      <div className={`h-1 w-12 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-blue-600 text-white' : currentStep > 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
      <div className={`h-1 w-12 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
    </div>
  );

  // Step 1: Basic info
  const renderStep1 = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
            Rs.
          </span>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="80,000"
            className="w-full p-2 border border-gray-300 rounded-r"
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Artwork Image <span className="text-red-500">*</span>
        </label>
        <div className="text-xs text-gray-500 mb-1">
          Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        
        {previewUrl && (
          <div className="mt-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-40 object-contain"
            />
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Availability
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
            In Stock
          </label>
        </div>
      </div>
    </>
  );

  // Step 2: Dimensions and materials
  const renderStep2 = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="15"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (cm)
          </label>
          <input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="10"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medium
        </label>
        <input
          type="text"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          placeholder="Acrylic"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paper
        </label>
        <input
          type="text"
          value={paper}
          onChange={(e) => setPaper(e.target.value)}
          placeholder="Water pad"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Orientation
        </label>
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Portrait">Portrait</option>
          <option value="Landscape">Landscape</option>
          <option value="Square">Square</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Frame
        </label>
        <select
          value={frame}
          onChange={(e) => setFrame(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Not Included">Not Included</option>
          <option value="Included">Included</option>
          <option value="Optional">Optional</option>
        </select>
      </div>
    </>
  );

  // Step 3: Description
  const renderStep3 = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your artwork's story, techniques used, or any other details you'd like to share."
          className="w-full p-2 border border-gray-300 rounded"
          rows="6"
        ></textarea>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium text-lg mb-2">Artwork Summary</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <span className="text-gray-600 text-sm">Title:</span>
            <p className="font-medium">{title || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Price:</span>
            <p className="font-medium">{price ? `Rs. ${price}` : 'Not provided'}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Dimensions:</span>
            <p className="font-medium">
              {height && width ? `${height} × ${width} cm` : 'Not provided'}
            </p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Medium:</span>
            <p className="font-medium">{medium || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Paper:</span>
            <p className="font-medium">{paper || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Orientation:</span>
            <p className="font-medium">{orientation}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Frame:</span>
            <p className="font-medium">{frame}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Availability:</span>
            <p className="font-medium">{inStock ? 'In Stock' : 'Out of Stock'}</p>
          </div>
        </div>
      </div>
    </>
  );

  // Render navigation buttons
  const renderNavigation = () => (
    <div className="flex justify-end space-x-2 mt-6">
      <button
        type="button"
        onClick={() => setShowModal(false)}
        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
        disabled={loading}
      >
        Cancel
      </button>
      
      {currentStep > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          disabled={loading}
        >
          Back
        </button>
      )}
      
      {currentStep < 3 && (
        <button
          type="button"
          onClick={nextStep}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          Next
        </button>
      )}
      
      {currentStep === 3 && (
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Artwork'}
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={() => setShowModal(true)}
      >
        Add Artwork
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <div className="p-6">
              {renderHeader()}
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              {renderSteps()}
              
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                
                {renderNavigation()}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddArtwork;