"use client";

import Link from "next/link";
import { useState } from "react";

interface DataEntry {
  id: string;
  formId: string;
  formTitle: string;
  submittedAt: string;
  submittedBy: string;
  data: Record<string, string | number>;
}

// Mock data - in a real app, this would come from an API
const mockDataEntries: DataEntry[] = [
  {
    id: '1',
    formId: '1',
    formTitle: 'Patient Registration Form',
    submittedAt: '2024-01-20T14:30:00Z',
    submittedBy: 'Dr. Smith',
    data: {
      'patient-name': 'John Doe',
      'patient-age': 35,
      'patient-email': 'john.doe@email.com',
      'medical-history': 'No significant history',
    },
  },
  {
    id: '2',
    formId: '1',
    formTitle: 'Patient Registration Form',
    submittedAt: '2024-01-20T15:45:00Z',
    submittedBy: 'Dr. Johnson',
    data: {
      'patient-name': 'Jane Smith',
      'patient-age': 28,
      'patient-email': 'jane.smith@email.com',
      'medical-history': 'Allergic to penicillin',
    },
  },
  {
    id: '3',
    formId: '2',
    formTitle: 'Clinical Trial Screening',
    submittedAt: '2024-01-19T10:15:00Z',
    submittedBy: 'Research Coordinator',
    data: {
      'participant-id': 'CT001',
      'eligible': 'Yes',
      'consent-given': 'Yes',
      'baseline-score': 75,
    },
  },
];

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<DataEntry | null>(null);

  const filteredEntries = mockDataEntries.filter(entry => {
    const matchesSearch = entry.formTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         Object.values(entry.data).some(value => 
                           String(value).toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesForm = formFilter === 'all' || entry.formId === formFilter;
    
    return matchesSearch && matchesForm;
  });

  const uniqueForms = Array.from(new Set(mockDataEntries.map(entry => entry.formId)))
    .map(formId => {
      const entry = mockDataEntries.find(e => e.formId === formId);
      return { id: formId, title: entry?.formTitle || 'Unknown Form' };
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                EDC System
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/forms" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Forms
              </Link>
              <Link href="/builder" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Form Builder
              </Link>
              <Link href="/data" className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Data
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
          <p className="text-gray-600">View and analyze collected form data</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search data entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                aria-label="Search data entries"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Form Filter */}
            <select
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Filter by form"
            >
              <option value="all">All Forms</option>
              {uniqueForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.title}
                </option>
              ))}
            </select>

            {/* Export Button */}
            <button
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.formTitle}</div>
                      <div className="text-sm text-gray-500">ID: {entry.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.submittedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Export
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || formFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No form submissions have been collected yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Submissions</dt>
                  <dd className="text-lg font-medium text-gray-900">{mockDataEntries.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Forms</dt>
                  <dd className="text-lg font-medium text-gray-900">{uniqueForms.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Latest Submission</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mockDataEntries.length > 0 
                      ? new Date(Math.max(...mockDataEntries.map(e => new Date(e.submittedAt).getTime()))).toLocaleDateString()
                      : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Data Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Submission Details
                </h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Form</h4>
                  <p className="text-sm text-gray-900">{selectedEntry.formTitle}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Submitted By</h4>
                  <p className="text-sm text-gray-900">{selectedEntry.submittedBy}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Submitted At</h4>
                  <p className="text-sm text-gray-900">{new Date(selectedEntry.submittedAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Form Data</h4>
                  <div className="bg-gray-50 rounded-md p-3 space-y-2">
                    {Object.entries(selectedEntry.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {key.replace(/-/g, ' ')}:
                        </span>
                        <span className="text-sm text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}