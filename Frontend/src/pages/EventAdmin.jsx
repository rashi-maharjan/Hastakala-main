import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, MapPin, Upload, Loader2, Trash2 } from "lucide-react";
import AdminNav from "../components/AdminNav";

const EventAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [eventData, setEventData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    location: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [events, setEvents] = useState([]);

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
      setError("Failed to fetch events");
      console.error("Error fetching events:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError("");
    setSuccess("");

    if (name === "image") {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size must be less than 5MB");
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
      setError("End date/time must be after start date/time");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      setSuccess("Event added successfully!");
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
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error("Error adding event:", error);
      setError(error.response?.data?.error || "Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
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
      setSuccess("Event deleted successfully!");
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
    }
  };

  return (
    <div className="flex">
      <AdminNav />
      <div className="flex-1 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ml-64">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Add New Event
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
                {success}
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
                  required
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Adding Event...
                  </>
                ) : (
                  "Add Event"
                )}
              </button>
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

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="mt-6 w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center group-hover:shadow-md"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Event
                    </button>
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