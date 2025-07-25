import React from 'react';
import { Edit } from 'lucide-react';

const profile = {
  businessName: 'Mahesh Foods',
  owner: 'xyz',
  shopLocation: '123 Main Street, Yeola',
  contact: '+91 9876543210',
  email: 'xyz@example.com',
};

const ProfileManagement = () => (
  <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
    <h2 className="text-xl font-bold text-purple-900 mb-6">Profile Management</h2>
    <div className="mb-6 flex justify-between items-center">
      <div>
        <div className="text-gray-600 text-sm">Business Name</div>
        <div className="font-semibold text-gray-900">{profile.businessName}</div>
        <div className="text-gray-600 text-sm mt-1">Owner</div>
        <div className="font-medium text-gray-800">{profile.owner}</div>
      </div>
      <button className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors" title="Edit Business"><Edit className="h-4 w-4" /></button>
    </div>
    <div className="mb-6 flex justify-between items-center">
      <div>
        <div className="text-gray-600 text-sm">Shop Location</div>
        <div className="font-medium text-gray-800">{profile.shopLocation}</div>
      </div>
      <button className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors" title="Edit Location"><Edit className="h-4 w-4" /></button>
    </div>
    <div className="flex justify-between items-center">
      <div>
        <div className="text-gray-600 text-sm">Contact Info</div>
        <div className="font-medium text-gray-800">{profile.contact}</div>
        <div className="text-gray-600 text-sm mt-1">Email</div>
        <div className="font-medium text-gray-800">{profile.email}</div>
      </div>
      <button className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors" title="Edit Contact"><Edit className="h-4 w-4" /></button>
    </div>
  </div>
);

export default ProfileManagement; 