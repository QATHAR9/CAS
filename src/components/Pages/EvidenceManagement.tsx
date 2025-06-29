import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  Trash2,
  Camera,
  FileText,
  Video,
  Archive,
  Shield,
  Clock,
  User,
  MapPin,
  Tag
} from 'lucide-react';
import { mockEvidence } from '../../data/mockData';
import { Evidence } from '../../types';

const EvidenceManagement: React.FC = () => {
  const [evidence, setEvidence] = useState<Evidence[]>(mockEvidence);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCase, setFilterCase] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCase = filterCase === 'all' || item.caseId === filterCase;
    
    return matchesSearch && matchesType && matchesCase;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return Camera;
      case 'video': return Video;
      case 'document': return FileText;
      case 'physical': return Archive;
      case 'digital': return Shield;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photo': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-yellow-100 text-yellow-800';
      case 'physical': return 'bg-purple-100 text-purple-800';
      case 'digital': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      console.log('Uploading file:', file.name);
      // Handle file upload logic here
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const UploadModal: React.FC = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Upload Evidence</h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-gray-600 mb-4">
                Support for photos, videos, documents, and other evidence files
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
            </div>

            {/* Evidence Details Form */}
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter evidence name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="physical">Physical</option>
                    <option value="digital">Digital</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Associated Case</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="1">CASE-2024-001 - Downtown Convenience Store Robbery</option>
                    <option value="2">CASE-2024-002 - Residential Property Dispute</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collection Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Where was this evidence collected?"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of the evidence"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </form>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upload Evidence
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DetailsModal: React.FC = () => {
    if (!showDetailsModal || !selectedEvidence) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{selectedEvidence.name}</h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Evidence Preview */}
            {selectedEvidence.thumbnailUrl && (
              <div className="text-center">
                <img
                  src={selectedEvidence.thumbnailUrl}
                  alt={selectedEvidence.name}
                  className="max-w-full h-64 object-cover rounded-lg mx-auto"
                />
              </div>
            )}

            {/* Evidence Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Evidence Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedEvidence.type)}`}>
                      {selectedEvidence.type.toUpperCase()}
                    </span>
                  </div>
                  <p><span className="font-medium">Case ID:</span> {selectedEvidence.caseId}</p>
                  <p><span className="font-medium">Uploaded by:</span> {selectedEvidence.uploadedBy}</p>
                  <p><span className="font-medium">Upload date:</span> {new Date(selectedEvidence.uploadedAt).toLocaleString()}</p>
                  {selectedEvidence.location && (
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="font-medium">Location:</span> {selectedEvidence.location}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Security & Access</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Shield className={`h-4 w-4 mr-2 ${selectedEvidence.isSecure ? 'text-green-600' : 'text-red-600'}`} />
                    <span>{selectedEvidence.isSecure ? 'Secure Storage' : 'Standard Storage'}</span>
                  </div>
                  <p><span className="font-medium">Tags:</span> {selectedEvidence.tags.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedEvidence.description}</p>
            </div>

            {/* Chain of Custody */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Chain of Custody</h4>
              <div className="space-y-3">
                {selectedEvidence.chainOfCustody.map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{entry.action.toUpperCase()}</span>
                        <span className="text-sm text-gray-600">by {entry.officer}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                      {entry.notes && (
                        <p className="text-sm text-gray-700 mt-2 italic">"{entry.notes}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Evidence Management</h2>
          <p className="text-gray-600 mt-1">Upload, organize, and track evidence with chain of custody</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search evidence by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="photo">Photos</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterCase}
              onChange={(e) => setFilterCase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Cases</option>
              <option value="1">CASE-2024-001</option>
              <option value="2">CASE-2024-002</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        {filteredEvidence.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No evidence found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvidence.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Evidence Preview */}
                  <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <TypeIcon className="h-12 w-12 text-gray-400" />
                    )}
                    {item.isSecure && (
                      <div className="absolute top-2 right-2">
                        <Shield className="h-5 w-5 text-green-600 bg-white rounded-full p-1" />
                      </div>
                    )}
                  </div>
                  
                  {/* Evidence Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">Case #{item.caseId}</span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {item.uploadedBy}
                      </span>
                      <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{item.tags.length - 2} more</span>
                        )}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEvidence(item);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <UploadModal />
      <DetailsModal />
    </div>
  );
};

export default EvidenceManagement;