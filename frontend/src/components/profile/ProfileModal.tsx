import React from 'react';
import { X, User as UserIcon, Mail, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

export const ProfileModal = ({ onClose }: { onClose: () => void }) => {
  const { user, logout } = useAuth();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-surface border border-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-32 bg-gradient-to-r from-primary to-primaryHover">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="px-6 pb-6 pt-0 relative">
          <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-surface bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shadow-premium">
            <img src="/profile-avatar.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-text">{user?.name}</h2>
            <p className="text-textMuted text-sm font-medium">Software Engineer</p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-textMuted bg-background/50 p-3 rounded-lg border border-border/50">
                <Mail size={18} className="text-primary" />
                <span className="text-sm truncate">{user?.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-textMuted bg-background/50 p-3 rounded-lg border border-border/50">
                <Calendar size={18} className="text-primary" />
                <span className="text-sm">
                  Joined {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'recently'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full mt-8 flex items-center justify-center gap-2 py-2.5 px-4 bg-danger/10 hover:bg-danger text-danger hover:text-white rounded-xl transition-colors font-medium"
            >
              <LogOut size={18} />
              Logout from TaskFlow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
