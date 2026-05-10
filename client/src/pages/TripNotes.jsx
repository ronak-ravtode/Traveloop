import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Trash2, Edit3, MapPin } from 'lucide-react';
import { mockTrips } from '../data/mockTrips';

const TripNotes = () => {
  const { tripId } = useParams();
  const trip = mockTrips.find(t => t.id === tripId) || mockTrips[0];
  const [notes, setNotes] = useState(trip.notes);

  const addNote = () => {
    setNotes(prev => [...prev, {
      id: `n${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content: '',
      city: trip.cities[0]?.city.name || '',
    }]);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const updateNote = (id, field, value) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/trips/${tripId}`} className="btn-ghost -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Trip Journal</h1>
          <p className="text-dark-lighter/60">{trip.title}</p>
        </div>
      </div>

      <div className="card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-dark">Your Notes & Memories</h2>
          <button onClick={addNote} className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" /> Add Note
          </button>
        </div>

        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={note.id} className="p-4 bg-surface-alt rounded-xl group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-dark-lighter/60">
                    <Calendar className="w-4 h-4" />
                    <input
                      type="date"
                      value={note.date}
                      onChange={(e) => updateNote(note.id, 'date', e.target.value)}
                      className="bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-lighter/60">
                    <MapPin className="w-4 h-4" />
                    <select
                      value={note.city}
                      onChange={(e) => updateNote(note.id, 'city', e.target.value)}
                      className="bg-transparent focus:outline-none"
                    >
                      {trip.cities.map(c => (
                        <option key={c.cityId} value={c.city.name}>{c.city.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="ml-auto p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={note.content}
                  onChange={(e) => updateNote(note.id, 'content', e.target.value)}
                  placeholder="Write your thoughts, tips, or memories..."
                  className="w-full bg-transparent text-dark placeholder:text-dark-lighter/40 focus:outline-none resize-none min-h-[80px]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-dark-lighter/60">
            <p className="mb-2">No notes yet</p>
            <p className="text-sm">Start documenting your journey!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripNotes;
