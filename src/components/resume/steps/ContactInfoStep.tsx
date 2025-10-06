import React from 'react';
import { useCvStore } from '../../../hooks/useCvStore';

interface Props { onNext: () => void; onBack: () => void; }

const ContactInfoStep: React.FC<Props> = ({ onNext, onBack }) => {
  const profile = useCvStore(s => s.profile);
  const update = useCvStore(s => s.updateProfile);
  if (!profile) return null;
  const address = profile.address || {};
  const socials = profile.socials || {};
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" value={profile.email || ''} onChange={e => update({ email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input className="w-full border rounded px-3 py-2" value={profile.phone || ''} onChange={e => update({ phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ville</label>
          <input className="w-full border rounded px-3 py-2" value={address.city || ''} onChange={e => update({ address: { ...address, city: e.target.value } })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pays</label>
          <input className="w-full border rounded px-3 py-2" value={address.country || ''} onChange={e => update({ address: { ...address, country: e.target.value } })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn</label>
          <input className="w-full border rounded px-3 py-2" value={socials.linkedin || ''} onChange={e => update({ socials: { ...socials, linkedin: e.target.value } })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GitHub</label>
          <input className="w-full border rounded px-3 py-2" value={socials.github || ''} onChange={e => update({ socials: { ...socials, github: e.target.value } })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Portfolio</label>
          <input className="w-full border rounded px-3 py-2" value={socials.portfolio || ''} onChange={e => update({ socials: { ...socials, portfolio: e.target.value } })} />
        </div>
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 border rounded">Retour</button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Suivant</button>
      </div>
    </div>
  );
};

export default ContactInfoStep;
