import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import { Calendar, Clock, MapPin } from "lucide-react";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/admin/events");
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="px-5 sm:px-10 md:px-20 lg:px-40 xl:px-56 py-8">
        <div className="container">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
            
          </div>

          <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-3 gap-10">
            {events.map((event) => (
              <div key={event._id} className="text-dark group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={`http://localhost:3001${event.image}` || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"}
                    alt={event.title}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <p className="text-base">
                      {formatDate(event.start_date)}
                      {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <p className="text-base">
                      {event.start_time} - {event.end_time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <p className="text-base">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl text-gray-600">No events found</h3>
              <p className="text-gray-500 mt-2">Check back later for upcoming events</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Events;