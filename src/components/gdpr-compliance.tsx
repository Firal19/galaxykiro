'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { exportUserData, deleteUserData } from '@/lib/security';

interface GDPRComplianceProps {
  userId: string;
}

export function GDPRCompliance({ userId }: GDPRComplianceProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Handle data export
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const userData = await exportUserData(userId, supabase);
      
      // Create a downloadable JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create download link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Data Export Complete',
        description: 'Your data has been exported successfully.',
      });
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUserData(userId, supabase);
      
      toast({
        title: 'Account Deleted',
        description: 'Your account and all associated data have been permanently deleted.',
      });
      
      // Redirect to home page after successful deletion
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error deleting user data:', error);
      toast({
        title: 'Deletion Failed',
        description: 'There was an error deleting your account. Please try again.',
        variant: 'destructive',
      });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border">
      <div>
        <h3 className="text-lg font-medium">Your Privacy Rights</h3>
        <p className="text-sm text-gray-500 mt-1">
          Under GDPR, you have the right to access, export, and delete your personal data.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Export Your Data</h4>
          <p className="text-sm text-gray-500 mt-1">
            Download a copy of all the data we have stored about you.
          </p>
          <Button 
            onClick={handleExportData} 
            disabled={isExporting}
            className="mt-2"
            variant="outline"
          >
            {isExporting ? 'Exporting...' : 'Export My Data'}
          </Button>
        </div>
        
        <div>
          <h4 className="font-medium">Delete Your Account</h4>
          <p className="text-sm text-gray-500 mt-1">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          
          {!showDeleteConfirm ? (
            <Button 
              onClick={() => setShowDeleteConfirm(true)} 
              variant="destructive"
              className="mt-2"
            >
              Delete My Account
            </Button>
          ) : (
            <div className="mt-2 p-4 border border-red-200 bg-red-50 rounded-md">
              <p className="text-sm font-medium text-red-800 mb-3">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={handleDeleteAccount} 
                  disabled={isDeleting}
                  variant="destructive"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </Button>
                <Button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  variant="outline"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 pt-4 border-t">
        <p>
          For more information about how we handle your data, please see our{' '}
          <a href="/privacy-policy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}