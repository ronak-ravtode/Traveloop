import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Trash2, Edit3, MapPin, Search, Clock, StickyNote, Lightbulb, Phone, Building2, Filter, Loader2, AlertCircle } from 'lucide-react';
import { tripService } from '../data/mockTripService';

const TripNotes = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const data = await tripService.getById(tripId);
        setTrip(data);
      } catch (err) {
        setError('Failed to load trip');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  const defaultNotes = [
    {
      id: 'note-1',
      title: 'Hotel Check-in Info',
      content: 'Check-in at 3 PM. Confirmation #HTL-789123. Address: 123 Rue de Rivoli, Paris. Phone: +33 1 40 20 50 00. Ask for late check-out if needed.',
      city: 'Paris',
      date: new Date().toISOString().split('T')[0],
      type: 'info'
    },
    {
      id: 'note-2',
      title: 'Local Contact',
      content: 'Emergency contact: Marie +33 6 12 34 56 78. She can help with translation or local recommendations.',
      city: '',
      date: new Date().toISOString().split('T')[0],
      type: 'contact'
    },
    {
      id: 'note-3',
      title: 'Reminder: Exchange Currency',
      content: "Don't forget to exchange some currency before arriving. Better rates at currency exchange offices than airport.",
      city: '',
      date: new Date().toISOString().split('T')[0],
      type: 'reminder'
    }
  ];

  const [notes, setNotes] = useState(defaultNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (trip?.notes && trip.notes.length > 0) {
      setNotes(trip.notes);
    }
  }, [trip]);

  const noteTypes = [
    { value: 'info', label: 'Info', icon: Building2, color: 'text-blue-500' },
    { value: 'contact', label: 'Contact', icon: Phone, color: 'text-green-500' },
    { value: 'reminder', label: 'Reminder', icon: Lightbulb, color: 'text-amber-500' },
    { value: 'general', label: 'General', icon: StickyNote, color: 'text-purple-500' },
  ];

  const stops = trip?.stops || trip?.cities || [];
  const cities = stops.map(s => s.city || s.name).filter(Boolean);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'all' || note.city === filterCity;
    return matchesSearch && matchesCity;
  });

  const addNote = (noteData) => {
    setNotes(prev => [...prev, {
      id: `note-${Date.now()}`,
      ...noteData,
      timestamp: new Date().toISOString(),
    }]);
    setShowAddModal(false);
  };

  const deleteNote = (id) => {
    if (window.confirm('Delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-4">{error || 'Trip not found'}</p>
        <Link to="/trips" className="btn-primary">Back to Trips</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/trips/${tripId}/itinerary`} className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-dark">Trip Notes</h1>
          <p className="text-dark-lighter/60">{trip.name || trip.title}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="input-field pl-12"
          />
        </div>
        {cities.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-dark-lighter/40" />
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="input-field py-2"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => {
            const typeInfo = noteTypes.find(t => t.value === note.type) || noteTypes[3];
            const TypeIcon = typeInfo.icon;
            return (
              <div key={note.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeInfo.color.replace('text-', 'bg-')}/10`}>
                      <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-dark">{note.title}</h3>
                      <p className="text-sm text-dark-lighter/70 mt-1">{note.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-dark-lighter/50">
                        {note.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(note.date).toLocaleDateString()}
                          </span>
                        )}
                        {note.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {note.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card p-12 text-center">
            <StickyNote className="w-12 h-12 text-dark-lighter/30 mx-auto mb-3" />
            <p className="text-dark-lighter/60">No notes found</p>
          </div>
        )}
      </div>

      {/* Add Button */}
      <button onClick={() => setShowAddModal(true)} className="btn-primary">
        <Plus className="w-5 h-5" />
        Add Note
      </button>

      {/* Add Note Modal */}
      {showAddModal && (
        <NoteModal
          cities={cities}
          onSave={addNote}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

const NoteModal = ({ cities, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    city: '',
    date: new Date().toISOString().split('T')[0],
    type: 'general',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg p-6">
        <h3 className="font-display font-semibold text-dark mb-4">Add Note</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Note title"
            className="input-field"
            required
          />
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Note content"
            className="input-field resize-none"
            rows={4}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="input-field"
            >
              <option value="">No city</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="input-field"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripNotes;