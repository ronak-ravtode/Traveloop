import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Trash2, Edit3, MapPin, Search, Clock, StickyNote, Lightbulb, Phone, Building2, Filter } from 'lucide-react';
import { tripService } from '../data/mockTripService';

const TripNotes = () => {
  const { tripId } = useParams();
  const trip = tripService.getById(tripId);

  // Default notes if none exist
  const defaultNotes = [
    {
      id: 'note-1',
      title: 'Hotel Check-in Info',
      content: 'Check-in at 3 PM. Confirmation #HTL-789123. Address: 123 Rue de Rivoli, Paris. Phone: +33 1 40 20 50 00. Ask for late check-out if needed.',
      city: trip?.cities?.[0]?.city?.name || 'Paris',
      date: '2024-06-25',
      timestamp: '2024-06-25T14:30:00Z',
      type: 'info'
    },
    {
      id: 'note-2',
      title: 'Local Contact',
      content: 'Emergency contact: Marie +33 6 12 34 56 78. She can help with translation or local recommendations. Also have the US Embassy number: +33 1 43 12 22 22.',
      city: trip?.cities?.[0]?.city?.name || 'Paris',
      date: '2024-06-28',
      timestamp: '2024-06-28T10:15:00Z',
      type: 'contact'
    },
    {
      id: 'note-3',
      title: 'Reminder: Exchange Currency',
      content: 'Don\'t forget to exchange some EUR before arriving. Better rates at currency exchange offices than airport. Aim for ~500 EUR for incidental expenses.',
      city: '',
      date: '2024-06-30',
      timestamp: '2024-06-30T09:00:00Z',
      type: 'reminder'
    }
  ];

  // Initialize notes from trip or use defaults
  const initialNotes = trip?.notes && trip.notes.length > 0 ? trip.notes : defaultNotes;

  const [notes, setNotes] = useState(initialNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Note types with icons
  const noteTypes = [
    { value: 'info', label: 'Info', icon: Building2, color: 'text-blue-500' },
    { value: 'contact', label: 'Contact', icon: Phone, color: 'text-green-500' },
    { value: 'reminder', label: 'Reminder', icon: Lightbulb, color: 'text-amber-500' },
    { value: 'general', label: 'General', icon: StickyNote, color: 'text-purple-500' },
  ];

  // Get unique cities from trip
  const cities = useMemo(() => {
    if (!trip?.cities) return [];
    return ['all', ...new Set(trip.cities.map(c => c.city.name))];
  }, [trip]);

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by city
    if (filterCity !== 'all') {
      result = result.filter(n => n.city === filterCity);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
      );
    }

    // Sort by latest first (by date, then timestamp)
    return result.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + (a.timestamp || '00:00:00'));
      const dateB = new Date(b.date + 'T' + (b.timestamp || '00:00:00'));
      return dateB - dateA;
    });
  }, [notes, filterCity, searchQuery]);

  const addNote = (noteData) => {
    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...noteData,
    };
    setNotes(prev => [newNote, ...prev]);
    setShowAddModal(false);
  };

  const updateNote = (id, updates) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, timestamp: new Date().toISOString() } : n));
  };

  const deleteNote = (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const getNoteTypeIcon = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.icon : StickyNote;
  };

  const getNoteTypeColor = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.color : 'text-purple-500';
  };

  // Add Note Modal Form
  const AddNoteModal = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [city, setCity] = useState(trip?.cities?.[0]?.city?.name || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState('general');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim() || !content.trim()) return;
      addNote({ title, content, city, date, type });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-display font-bold text-dark mb-4">Add New Note</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Note title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input-field"
                >
                  {noteTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Related City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-field"
              >
                <option value="">No specific city</option>
                {trip?.cities?.map(c => (
                  <option key={c.cityId} value={c.city.name}>{c.city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Content *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder="Write your note..."
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 btn-primary">
                <Plus className="w-4 h-4" /> Add Note
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Note Card Component
  const NoteCard = ({ note }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);
    const [editCity, setEditCity] = useState(note.city);
    const [editDate, setEditDate] = useState(note.date);
    const [editType, setEditType] = useState(note.type || 'general');

    const TypeIcon = getNoteTypeIcon(note.type);

    const handleSave = () => {
      updateNote(note.id, {
        title: editTitle,
        content: editContent,
        city: editCity,
        date: editDate,
        type: editType
      });
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditCity(note.city);
      setEditDate(note.date);
      setEditType(note.type || 'general');
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <div className="p-5 bg-surface-alt rounded-xl border-2 border-primary/30">
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input-field"
              placeholder="Note title"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="input-field"
              />
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="input-field"
              >
                {noteTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <select
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
              className="input-field"
            >
              <option value="">No specific city</option>
              {trip?.cities?.map(c => (
                <option key={c.cityId} value={c.city.name}>{c.city.name}</option>
              ))}
            </select>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input-field min-h-[100px] resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary text-sm py-1.5">
                Save
              </button>
              <button onClick={handleCancel} className="btn-ghost text-sm py-1.5">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-5 bg-white rounded-xl border border-dark-lighter/10 hover:border-primary/30 transition-all group">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg bg-surface-alt ${getNoteTypeColor(note.type)}`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-display font-semibold text-dark truncate">{note.title}</h3>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg hover:bg-surface-alt text-dark-lighter/60 hover:text-primary"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-dark-lighter/60 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-dark-lighter/70 text-sm mb-3 whitespace-pre-wrap">{note.content}</p>

            <div className="flex items-center gap-4 text-xs text-dark-lighter/50">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {note.date}
              </span>
              {note.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {note.city}
                </span>
              )}
              {note.timestamp && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-lighter/60">Trip not found</p>
        <Link to="/trips" className="text-primary hover:underline mt-2 inline-block">
          Back to My Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/trips/${tripId}`} className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Trip Notes</h1>
          <p className="text-dark-lighter/60">{trip.title}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-lighter/40" />
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="input-field pl-10 min-w-[160px]"
            >
              {cities.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Cities' : c}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary whitespace-nowrap">
            <Plus className="w-5 h-5" /> Add Note
          </button>
        </div>
      </div>

      {/* Notes Count */}
      <div className="flex items-center justify-between text-sm text-dark-lighter/60">
        <span>{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}</span>
        {filterCity !== 'all' && <span className="text-primary">Filtered by {filterCity}</span>}
        {searchQuery && <span className="text-primary">Searching "{searchQuery}"</span>}
      </div>

      {/* Notes List */}
      {filteredNotes.length > 0 ? (
        <div className="space-y-4">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <StickyNote className="w-16 h-16 mx-auto mb-4 text-dark-lighter/30" />
          <h3 className="font-display font-semibold text-dark mb-2">
            {searchQuery || filterCity !== 'all' ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-dark-lighter/60 mb-4">
            {searchQuery || filterCity !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Start documenting your trip with notes, reminders, and important info'}
          </p>
          {!searchQuery && filterCity === 'all' && (
            <button onClick={() => setShowAddModal(true)} className="btn-primary inline-flex">
              <Plus className="w-5 h-5" /> Add Your First Note
            </button>
          )}
        </div>
      )}

      {/* Add Note Modal */}
      {showAddModal && <AddNoteModal />}
    </div>
  );
};

export default TripNotes;