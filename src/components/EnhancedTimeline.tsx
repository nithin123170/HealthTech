import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Shield, TrendingUp, Droplets, Thermometer, Eye, MapPin, Users, CheckCircle, AlertCircle, Activity, Cloud } from 'lucide-react';
import { useState } from 'react';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'alert' | 'resolved' | 'prediction' | 'weather' | 'deployment';
  severity: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  location?: string;
  team?: string;
  duration?: string;
  timestamp?: Date;
  coordinates?: { lat: number; lng: number };
  impact?: string;
  affectedPeople?: number;
  responseTime?: string;
}

interface EnhancedTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const eventConfig = {
  alert: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-50 border-red-200',
    dotColor: 'bg-red-500',
    label: '🚨 ALERT',
    description: 'High risk detected',
    iconBg: 'bg-red-100',
    pathColor: 'stroke-red-500'
  },
  resolved: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50 border-green-200',
    dotColor: 'bg-green-500',
    label: '✅ RESOLVED',
    description: 'Issue resolved successfully',
    iconBg: 'bg-green-100',
    pathColor: 'stroke-green-500'
  },
  prediction: {
    icon: TrendingUp,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 border-yellow-200',
    dotColor: 'bg-yellow-500',
    label: '📊 PREDICTION',
    description: 'Risk prediction updated',
    iconBg: 'bg-yellow-100',
    pathColor: 'stroke-yellow-500'
  },
  weather: {
    icon: Cloud,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 border-blue-200',
    dotColor: 'bg-blue-500',
    label: '🌤️ WEATHER',
    description: 'Weather pattern change',
    iconBg: 'bg-blue-100',
    pathColor: 'stroke-blue-500'
  },
  deployment: {
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 border-purple-200',
    dotColor: 'bg-purple-500',
    label: '👥 DEPLOYMENT',
    description: 'Team dispatched',
    iconBg: 'bg-purple-100',
    pathColor: 'stroke-purple-500'
  }
};

const severityConfig = {
  high: {
    label: 'HIGH',
    color: 'text-red-600 font-bold',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300'
  },
  medium: {
    label: 'MEDIUM',
    color: 'text-yellow-600 font-semibold',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300'
  },
  low: {
    label: 'LOW',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300'
  }
};

export default function EnhancedTimeline({ events, className = '' }: EnhancedTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getEventDetails = (event: TimelineEvent) => {
    const config = eventConfig[event.type];
    const severity = severityConfig[event.severity];
    
    return {
      ...config,
      ...severity,
      Icon: config.icon
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Header */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-gray-800">Event Timeline</h3>
              <p className="text-sm text-gray-600">Real-time risk monitoring and response tracking</p>
            </div>
          </div>
          <div className="flex gap-2">
            {Object.entries(eventConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1 text-xs">
                <div className={`w-3 h-3 rounded-full ${config.dotColor}`}></div>
                <span className="text-gray-600">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300"></div>

        {events.map((event, index) => {
          const details = getEventDetails(event);
          const isHovered = hoveredEvent === event.id;
          const isSelected = selectedEvent?.id === event.id;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative flex items-start mb-8 ${isHovered || isSelected ? 'scale-105' : ''}`}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              onClick={() => setSelectedEvent(isSelected ? null : event)}
            >
              {/* Timeline Dot */}
              <motion.div
                className={`relative z-10 w-4 h-4 rounded-full border-2 border-white shadow-lg ${details.dotColor} cursor-pointer`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Pulse Animation for High Severity */}
                {event.severity === 'high' && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ${details.dotColor} opacity-30`}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <HeatWaveRipple dataPoint={event} index={index} />
              </motion.div>

              {/* Event Card */}
              <motion.div
                className={`ml-6 flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  details.bgColor
                } ${isSelected ? 'ring-2 ring-blue-400 shadow-lg' : ''} ${
                  isHovered ? 'shadow-md transform -translate-y-1' : ''
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Event Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <details.Icon className={`w-4 h-4 ${details.color}`} />
                    <span className={`text-xs font-bold px-2 py-1 rounded ${details.bgColor} ${details.borderColor} border`}>
                      {details.label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${severityConfig[event.severity].bgColor} ${severityConfig[event.severity].borderColor} border`}>
                      {severityConfig[event.severity].label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{formatTime(event.time)}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(event.time).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="space-y-2">
                  <h4 className={`font-semibold ${details.color}`}>{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  
                  {/* Additional Details */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    {event.location && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.team && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{event.team}</span>
                      </div>
                    )}
                    {event.duration && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{event.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                        Share Report
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Timeline End */}
        <div className="absolute left-6 bottom-0 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Event Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500">EVENT TYPE</label>
                <p className="font-medium">{getEventDetails(selectedEvent).label}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">SEVERITY</label>
                <p className={`font-medium ${severityConfig[selectedEvent.severity].color}`}>
                  {severityConfig[selectedEvent.severity].label}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">TIME</label>
                <p className="font-medium">{new Date(selectedEvent.time).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">DESCRIPTION</label>
                <p className="font-medium">{selectedEvent.title}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
