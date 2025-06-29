import React, { useState } from 'react';
import { 
  Map, 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Navigation
} from 'lucide-react';
import { mockMapIncidents, mockCrimeHotspots } from '../../data/mockData';

const CrimeMap: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [mapView, setMapView] = useState<'street' | 'satellite' | 'hybrid'>('street');

  const filteredIncidents = mockMapIncidents.filter(incident => {
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    const matchesType = filterType === 'all' || incident.type === filterType;
    return matchesSeverity && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crime': return AlertTriangle;
      case 'patrol': return Shield;
      case 'emergency': return AlertTriangle;
      case 'traffic': return Navigation;
      default: return MapPin;
    }
  };

  const getHotspotColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'border-red-500 bg-red-100';
      case 'high': return 'border-orange-500 bg-orange-100';
      case 'medium': return 'border-yellow-500 bg-yellow-100';
      case 'low': return 'border-green-500 bg-green-100';
      default: return 'border-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crime Map</h2>
          <p className="text-gray-600 mt-1">Real-time incident tracking and crime hotspot analysis</p>
        </div>
        
        {/* Map Controls */}
        <div className="flex items-center space-x-2">
          <select
            value={mapView}
            onChange={(e) => setMapView(e.target.value as 'street' | 'satellite' | 'hybrid')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="street">Street View</option>
            <option value="satellite">Satellite</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Layer Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Map Layers
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showIncidents}
                  onChange={(e) => setShowIncidents(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Incidents</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showHotspots}
                  onChange={(e) => setShowHotspots(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Crime Hotspots</span>
              </label>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="crime">Crime</option>
                  <option value="patrol">Patrol</option>
                  <option value="emergency">Emergency</option>
                  <option value="traffic">Traffic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Incidents</span>
                <span className="font-medium text-gray-900">{filteredIncidents.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Cases</span>
                <span className="font-medium text-gray-900">
                  {filteredIncidents.filter(i => i.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Crime Hotspots</span>
                <span className="font-medium text-gray-900">{mockCrimeHotspots.length}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-sm text-gray-700">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Map Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Interactive Crime Map</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Map Area */}
            <div className="relative h-96 lg:h-[600px] bg-gray-100">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-gray-100">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-12 grid-rows-8 h-full">
                    {Array.from({ length: 96 }).map((_, i) => (
                      <div key={i} className="border border-gray-300"></div>
                    ))}
                  </div>
                </div>

                {/* Crime Hotspots */}
                {showHotspots && mockCrimeHotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className={`absolute w-20 h-20 rounded-full border-2 opacity-60 ${getHotspotColor(hotspot.riskLevel)}`}
                    style={{
                      left: `${(hotspot.coordinates.lng + 74) * 10}%`,
                      top: `${(40.8 - hotspot.coordinates.lat) * 25}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={`${hotspot.crimeType} hotspot - ${hotspot.riskLevel} risk`}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{hotspot.incidentCount}</span>
                    </div>
                  </div>
                ))}

                {/* Incidents */}
                {showIncidents && filteredIncidents.map((incident) => {
                  const TypeIcon = getTypeIcon(incident.type);
                  return (
                    <div
                      key={incident.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{
                        left: `${(incident.coordinates.lng + 74) * 10}%`,
                        top: `${(40.8 - incident.coordinates.lat) * 25}%`
                      }}
                      onClick={() => setSelectedIncident(incident.id)}
                    >
                      <div className={`w-8 h-8 rounded-full ${getSeverityColor(incident.severity)} flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                        <TypeIcon className="h-4 w-4 text-white" />
                      </div>
                      
                      {/* Incident Details Popup */}
                      {selectedIncident === incident.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getSeverityColor(incident.severity)}`}>
                              {incident.severity.toUpperCase()}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIncident(null);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{incident.description}</h4>
                          <p className="text-sm text-gray-600 mb-2">{incident.address}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(incident.timestamp).toLocaleString()}
                            </span>
                            <span className="capitalize">{incident.status}</span>
                          </div>
                          {incident.caseId && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                                <Eye className="h-3 w-3" />
                                <span>View Case Details</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Map Placeholder Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-500">
                  <Map className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Interactive Crime Map</p>
                  <p className="text-sm">Click on markers to view incident details</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Incidents</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {filteredIncidents.slice(0, 5).map((incident) => {
              const TypeIcon = getTypeIcon(incident.type);
              return (
                <div key={incident.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full ${getSeverityColor(incident.severity)} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{incident.description}</h4>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {incident.address}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(incident.timestamp).toLocaleString()}
                      </span>
                      <span className="capitalize">{incident.status}</span>
                      <span className="capitalize">{incident.type}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;