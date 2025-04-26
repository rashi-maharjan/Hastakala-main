import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, MapPin, Upload, Loader2, Trash2, Edit } from "lucide-react";
import AdminNav from "../components/AdminNav";

const EventAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Event form data
  const [eventData, setEventData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    location: "",
    image: null,
  });

  // Modal popup state - similar to Community.jsx
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "info", // info, success, error, warning
    onConfirm: null,
    confirmText: "OK",
    showCancel: false
  });

  // Function to show popup
  const showPopup = (message, type = "info", onConfirm = null, confirmText = "OK", showCancel = false) => {
    setPopup({
      show: true,
      message,
      type,
      onConfirm,
      confirmText,
      showCancel
    });
  };

  // Function to hide popup
  const hidePopup = () => {
    setPopup({
      ...popup,
      show: false
    });
  };

  // Function to handle confirmation with popup
  const confirmAction = (message, onConfirm) => {
    showPopup(message, "warning", onConfirm, "Yes, I'm sure", true);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        "http://localhost:3001/api/admin/events",
        {
          headers: {
            "Authorization": token
          }
        }
      );
      setEvents(response.data);
    } catch (error) {
      showPopup("Failed to fetch events", "error");
      console.error("Error fetching events:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showPopup("Image size must be less than 5MB", "error");
          return;
        }
        setEventData({ ...eventData, image: file });
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const validateDates = () => {
    const startDateTime = new Date(
      `${eventData.start_date}T${eventData.start_time}`
    );
    const endDateTime = new Date(`${eventData.end_date}T${eventData.end_time}`);

    if (endDateTime <= startDateTime) {
      showPopup("End date/time must be after start date/time", "error");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setEventData({
      title: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      location: "",
      image: null,
    });
    setImagePreview(null);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.keys(eventData).forEach((key) => {
      if (eventData[key] !== null) {
        formData.append(key, eventData[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      
      if (editingEvent) {
        // Update existing event
        const response = await axios.put(
          `http://localhost:3001/api/admin/events/${editingEvent._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": token
            },
          }
        );
        showPopup("Event updated successfully!", "success");
      } else {
        // Create new event
        const response = await axios.post(
          "http://localhost:3001/api/admin/events",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": token
            },
          }
        );
        showPopup("Event added successfully!", "success");
      }
      
      resetForm();
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error("Error with event:", error);
      showPopup(error.response?.data?.error || "Failed to process event", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    
    // Format dates for the input fields (YYYY-MM-DD)
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    setEventData({
      title: event.title,
      start_date: formatDate(event.start_date),
      end_date: formatDate(event.end_date),
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      image: null, // Can't prefill the file input
    });
    
    // Set image preview if available
    if (event.image) {
      setImagePreview(`http://localhost:3001${event.image}`);
    }
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open delete confirmation modal
  const openDeleteModal = (event) => {
    confirmAction(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`, () => {
      handleDeleteEvent(event._id);
    });
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    if (!eventId) return;
    
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(
        `http://localhost:3001/api/admin/events/${eventId}`,
        {
          headers: {
            "Authorization": token
          }
        }
      );
      
      showPopup("Event deleted successfully!", "success");
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error("Error deleting event:", error);
      showPopup("Failed to delete event", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Popup icon based on type
  const getPopupIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "warning":
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default: // info
        return (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="flex">
      <AdminNav />
      <div className="flex-1 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>

            {/* Modal Popup - similar to Community.jsx */}
            {popup.show && (
              <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  {/* Background overlay */}
                  <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                    aria-hidden="true"
                    onClick={() => !popup.onConfirm && hidePopup()}
                  ></div>

                  {/* Modal panel */}
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        {/* Icon */}
                        {getPopupIcon(popup.type)}

                        {/* Content */}
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {popup.type === 'success' ? 'Success!' : 
                            popup.type === 'error' ? 'Error' : 
                            popup.type === 'warning' ? 'Warning' : 'Information'}
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              {popup.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                          popup.type === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 
                          popup.type === 'error' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 
                          popup.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' : 
                          'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        }`}
                        onClick={() => {
                          if (popup.onConfirm) {
                            popup.onConfirm();
                          }
                          hidePopup();
                        }}
                      >
                        {popup.confirmText}
                      </button>
                      {popup.showCancel && (
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={hidePopup}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter event title"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={eventData.start_date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="start_time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={eventData.start_time}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={eventData.end_date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end_time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={eventData.end_time}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  <Upload className="inline-block w-4 h-4 mr-1" />
                  Event Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                  // Only required for new events
                  required={!editingEvent}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-auto object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                {editingEvent && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`${editingEvent ? 'flex-1' : 'w-full'} flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      {editingEvent ? 'Updating Event...' : 'Adding Event...'}
                    </>
                  ) : (
                    editingEvent ? 'Update Event' : 'Add Event'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Existing Events
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 lg:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-1 group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={`http://localhost:3001${event.image}`}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        <div className="ml-3 text-sm">
                          <span className="font-medium">
                            {new Date(event.start_date).toLocaleDateString()}
                          </span>
                          <span className="mx-2 text-gray-400">-</span>
                          <span className="font-medium">
                            {new Date(event.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        <div className="ml-3 text-sm font-medium">
                          {event.start_time} - {event.end_time}
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        <div className="ml-3 text-sm font-medium truncate">
                          {event.location}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center group-hover:shadow-md"
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Edit Event
                      </button>
                      
                      <button
                        onClick={() => openDeleteModal(event)}
                        className="py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center group-hover:shadow-md"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAdmin;