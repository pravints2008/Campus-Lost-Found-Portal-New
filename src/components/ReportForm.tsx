import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ItemCategory, LocationType, ReportType } from '../types';
import { uploadItemPhoto } from '../lib/supabase';
import { 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Tag, 
  Calendar, 
  Palette, 
  FileText, 
  Sparkles,
  ShieldCheck,
  LogIn
} from 'lucide-react';

interface ReportFormProps {
  type: ReportType;
}

const CATEGORIES: ItemCategory[] = [
  'ID Card',
  'Water Bottle',
  'Books',
  'Wallet',
  'Earphones',
  'Keys',
  'Others',
];

const LOCATIONS: LocationType[] = [
  'Classroom',
  'Library',
  'Canteen',
  'Laboratory',
  'Hostel',
  'Other',
];

export const ReportForm: React.FC<ReportFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { addItem, showToast } = useApp();
  const { user, profile } = useAuth();

  const isLost = type === 'lost';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Water Bottle');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState<LocationType>('Library');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest reporter details (if not logged in)
  const [guestName, setGuestName] = useState('');
  const [guestStudentId, setGuestStudentId] = useState('');

  // Handle Photo Selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.image;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(undefined);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Item name is required';
    if (!color.trim()) newErrors.color = 'Item colour is required';
    if (!date) newErrors.date = 'Date is required';
    if (!description.trim()) newErrors.description = 'Please provide an item description';
    if (!user && !guestName.trim()) newErrors.guestName = 'Please enter your name or sign in';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let uploadedUrl = imagePreview;

      // Upload to Supabase Storage if a real file was selected
      if (imageFile) {
        uploadedUrl = await uploadItemPhoto(imageFile);
      }

      const newItem = await addItem({
        type,
        title: title.trim(),
        category,
        color: color.trim(),
        location,
        date,
        description: description.trim(),
        imageUrl: uploadedUrl,
      });

      setIsSubmitting(false);

      if (newItem) {
        navigate(isLost ? '/lost-items' : '/found-items', {
          state: { highlightId: newItem.id },
        });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(`Error submitting report: ${err.message}`, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
      {/* Form Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isLost ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
            }`}
          >
            {isLost ? 'Lost Item Registration' : 'Found Item Registration'}
          </span>
          <span className="text-xs text-slate-400">Database Entry</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isLost
            ? 'Provide accurate details so our system and fellow campus students can match your lost possession.'
            : 'Help return this item to its rightful student owner by recording where and when you found it.'}
        </p>
      </div>

      {/* User Status Bar */}
      {user ? (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span>Publishing as {profile?.full_name || user.email}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <span className="text-slate-500">{profile?.student_id || 'Student'} • {profile?.department || 'Campus'}</span>
            </div>
          </div>
          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            Authenticated
          </span>
        </div>
      ) : (
        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <LogIn className="w-4 h-4 text-amber-600" />
              Not Signed In
            </span>
            <Link to="/auth" className="text-teal-700 font-bold underline">
              Sign In with College ID
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Your Full Name *</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Alex Sharma"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
              {errors.guestName && <p className="text-rose-600 text-[11px] mt-0.5">{errors.guestName}</p>}
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Student / Roll ID</label>
              <input
                type="text"
                value={guestStudentId}
                onChange={(e) => setGuestStudentId(e.target.value)}
                placeholder="23CS108"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Field: Item Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-teal-600" />
          Item Name *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          placeholder={isLost ? 'e.g., Blue Milton Stainless Steel Bottle' : 'e.g., Milton Blue Water Bottle'}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
            errors.title
              ? 'border-rose-400 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20'
          }`}
        />
        {errors.title && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.title}
          </p>
        )}
      </div>

      {/* Grid: Category & Colour */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Item Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-navy-600" />
            Item Colour *
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              if (errors.color) setErrors((prev) => ({ ...prev, color: '' }));
            }}
            placeholder="e.g., Blue, Black, Silver, Red"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
              errors.color
                ? 'border-rose-400 focus:ring-rose-500/20'
                : 'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20'
            }`}
          />
          {errors.color && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.color}
            </p>
          )}
        </div>
      </div>

      {/* Grid: Location & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            {isLost ? 'Last Seen Location *' : 'Found Location *'}
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as LocationType)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-colors"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {isLost ? 'Date Lost *' : 'Date Found *'}
          </label>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
            }}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${
              errors.date
                ? 'border-rose-400 focus:ring-rose-500/20'
                : 'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20'
            }`}
          />
          {errors.date && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.date}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          Additional Description *
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          placeholder="Mention brand, markings, scratches, stickers, accessories, exact table or room number..."
          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
            errors.description
              ? 'border-rose-400 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-teal-500 focus:ring-teal-500/20'
          }`}
        />
        {errors.description && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.description}
          </p>
        )}
      </div>

      {/* Photo Upload with Supabase Storage */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Upload Item Photo (Supabase Storage)
        </label>
        
        {imagePreview ? (
          <div className="relative w-full max-w-xs h-44 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-sm group">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-black transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1.5 text-center text-[11px] text-white">
              Photo attached
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-teal-50/30 transition-colors">
            <div className="p-3 bg-white rounded-xl shadow-xs text-teal-600 mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Click to upload photo to Supabase storage</span>
            <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG or WebP (Max 5MB)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        )}
        {errors.image && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.image}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-white text-sm sm:text-base transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
            isLost
              ? 'bg-navy-800 hover:bg-navy-900 active:scale-[0.99]'
              : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.99]'
          }`}
        >
          {isSubmitting ? (
            <span>Saving to Supabase Database...</span>
          ) : (
            <>
              {isLost ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              <span>{isLost ? 'Submit Lost Report' : 'Submit Found Report'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
