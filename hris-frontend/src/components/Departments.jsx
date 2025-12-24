import React, { useState, useEffect } from 'react';
import api from '../api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments');
        setDepartments(response.data.data || response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) return <div className="text-center py-10">Loading departments...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Departments</h1>
        <p className="text-lg text-gray-600">Manage and view all departments in the organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div key={department.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{department.name}</h3>
            <div className="flex items-center text-gray-600">
              <span className="mr-2">Employees:</span>
              <span className="font-medium">{department.employees_count || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;