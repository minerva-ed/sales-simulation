'use client'
import { useState } from 'react';

interface CustomerProfile {
  companyName: string;
  description: string;
}

interface CustomerProfilesProps {
  customerProfiles: CustomerProfile[];
  onDelete: (index: number) => void;
  onEdit: (index: number, profile: CustomerProfile) => void;
  onAdd: () => void;
}


const CustomerProfiles: React.FC<CustomerProfilesProps> = ({ customerProfiles, onDelete, onEdit, onAdd }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditChange = (index: number, field: keyof CustomerProfile, value: string) => {
    const updatedProfile = { ...customerProfiles[index], [field]: value };
    onEdit(index, updatedProfile);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {/* Adjust width as needed */}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit/Delete</span>
            </th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="w-full bg-white divide-y divide-gray-200">
        {customerProfiles.map((profile, index) => (
          <tr key={index}>
            {/* Company Name field */}
            <td className="px-6 py-4 whitespace-nowrap">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => handleEditChange(index, 'companyName', e.target.value)}
                  className="w-full text-sm text-gray-900" />
              ) : (
                <span className="text-sm text-gray-900">{profile.companyName}</span>
              )}
            </td>
            {/* Description field */}
            <td className="px-6 py-4 whitespace-normal">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={profile.description}
                  onChange={(e) => handleEditChange(index, 'description', e.target.value)}
                  className="w-full text-sm text-gray-900" />
              ) : (
                <span className="text-sm text-gray-900">{profile.description}</span>
              )}
            </td>
            {/* Edit/Delete buttons */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              {editingIndex === index ? (
                <button
                  onClick={() => setEditingIndex(null)}
                  className="text-blue-600 hover:text-blue-900 mr-2"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingIndex(index)}
                  className="text-blue-600 hover:text-blue-900 mr-2"
                >
                  Edit
                </button>
              )}
              <button onClick={() => onDelete(index)} className="text-red-600 hover:text-red-900">
                X
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
      <div className="mt-4">
        <button onClick={onAdd} className="float-right m-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          Add New Customer
        </button>
      </div>
    </div>
  );
}

export default CustomerProfiles;