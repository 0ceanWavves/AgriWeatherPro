import React, { useState } from 'react';
import { generateActionPlan } from '../../services/predictivePestService';

/**
 * Component that displays actionable pest management plans based on predictive analysis
 */
const PestActionPlan = ({ predictions, cropInfo }) => {
  const [selectedTab, setSelectedTab] = useState('summary');
  
  // Generate the action plan based on predictions
  const actionPlan = generateActionPlan(predictions, cropInfo);
  
  // Count actions by priority
  const countByPriority = {
    Critical: actionPlan.actions.immediate.filter(a => a.priority === 'Critical').length,
    High: actionPlan.actions.immediate.filter(a => a.priority === 'High').length + 
          actionPlan.actions.shortTerm.filter(a => a.priority === 'High').length,
    Medium: actionPlan.actions.immediate.filter(a => a.priority === 'Medium').length + 
            actionPlan.actions.shortTerm.filter(a => a.priority === 'Medium').length,
    Low: actionPlan.actions.shortTerm.filter(a => a.priority === 'Low').length,
    Planning: actionPlan.actions.longTerm.length
  };

  // Helper function to render priority badge with appropriate color
  const renderPriorityBadge = (priority) => {
    const colors = {
      Critical: 'bg-red-100 text-red-800 border-red-200',
      High: 'bg-orange-100 text-orange-800 border-orange-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Low: 'bg-green-100 text-green-800 border-green-200',
      Planning: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="mt-4">
      {/* Action Plan Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-4">
        <h3 className="font-semibold text-blue-800 mb-2">Action Plan Summary</h3>
        <p className="text-sm text-blue-700">{actionPlan.summary}</p>
        
        {/* Priority count pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(countByPriority).map(([priority, count]) => (
            count > 0 && (
              <div key={priority} className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${priority === 'Critical' ? 'bg-red-100 text-red-800' : 
                    priority === 'High' ? 'bg-orange-100 text-orange-800' : 
                    priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                    priority === 'Low' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {priority}: {count}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
      
      {/* Tabs for different sections */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              selectedTab === 'summary' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('summary')}
          >
            Summary View
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              selectedTab === 'timeline' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('timeline')}
          >
            Timeline
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              selectedTab === 'details' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('details')}
          >
            Detailed Controls
          </button>
        </div>
        
        <div className="p-4">
          {/* Summary View Tab */}
          {selectedTab === 'summary' && (
            <div className="space-y-4">
              {/* Immediate Actions Section */}
              {actionPlan.actions.immediate.length > 0 && (
                <div className="border-l-4 border-red-500 pl-3">
                  <h4 className="font-semibold text-red-800">Immediate Actions (0-3 days)</h4>
                  <ul className="mt-2 space-y-2">
                    {actionPlan.actions.immediate.map((action, index) => (
                      <li key={index} className="bg-white rounded p-2 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{action.pest}</span>
                          {renderPriorityBadge(action.priority)}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{action.action}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Short-term Actions Section */}
              {actionPlan.actions.shortTerm.length > 0 && (
                <div className="border-l-4 border-yellow-500 pl-3">
                  <h4 className="font-semibold text-yellow-800">Short-term Actions (4-7 days)</h4>
                  <ul className="mt-2 space-y-2">
                    {actionPlan.actions.shortTerm.map((action, index) => (
                      <li key={index} className="bg-white rounded p-2 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{action.pest}</span>
                          {renderPriorityBadge(action.priority)}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{action.action}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Long-term Actions Section */}
              {actionPlan.actions.longTerm.length > 0 && (
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-semibold text-blue-800">Long-term Planning</h4>
                  <ul className="mt-2 space-y-2">
                    {actionPlan.actions.longTerm.map((action, index) => (
                      <li key={index} className="bg-white rounded p-2 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{action.pest}</span>
                          {renderPriorityBadge(action.priority)}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{action.action}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* No Actions Case */}
              {actionPlan.actions.immediate.length === 0 && 
               actionPlan.actions.shortTerm.length === 0 && 
               actionPlan.actions.longTerm.length === 0 && (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No actions needed</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Continue regular monitoring of your crops. No pest threats detected at this time.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Timeline Tab */}
          {selectedTab === 'timeline' && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Action Timeline</h4>
              
              {Array.isArray(actionPlan.timeline) && actionPlan.timeline.length > 0 ? (
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline Events */}
                  <ul className="space-y-4">
                    {actionPlan.timeline.map((event, index) => {
                      // Format date for display
                      const eventDate = new Date(event.date);
                      const formattedDate = eventDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      });
                      
                      // Determine dot color based on priority
                      const dotColor = 
                        event.priority === 'Critical' ? 'bg-red-500' :
                        event.priority === 'High' ? 'bg-orange-500' :
                        event.priority === 'Medium' ? 'bg-yellow-500' :
                        event.priority === 'Low' ? 'bg-green-500' : 'bg-blue-500';
                        
                      return (
                        <li key={index} className="relative pl-20">
                          {/* Date Badge */}
                          <div className="absolute left-0 top-0 w-16 text-xs text-center py-1 bg-gray-100 rounded-full">
                            {formattedDate}
                          </div>
                          
                          {/* Timeline Dot */}
                          <div className={`absolute left-9 top-3 -ml-1.5 h-3 w-3 rounded-full ${dotColor}`}></div>
                          
                          {/* Event Content */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                            <div className="flex justify-between items-start">
                              <span className="font-medium">{event.pest}</span>
                              {renderPriorityBadge(event.priority)}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{event.action}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No timeline events available
                </div>
              )}
            </div>
          )}
          
          {/* Detailed Controls Tab */}
          {selectedTab === 'details' && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Pest Control Methods</h4>
              
              {actionPlan.actions.immediate.length > 0 || 
               actionPlan.actions.shortTerm.length > 0 || 
               actionPlan.actions.longTerm.length > 0 ? (
                <div className="space-y-6">
                  {/* Get unique list of pests from all action timeframes */}
                  {[...new Set([
                    ...actionPlan.actions.immediate.map(a => a.pest),
                    ...actionPlan.actions.shortTerm.map(a => a.pest),
                    ...actionPlan.actions.longTerm.map(a => a.pest)
                  ])].map(pestName => {
                    // Find this pest in any of the action lists
                    const pestAction = 
                      actionPlan.actions.immediate.find(a => a.pest === pestName) ||
                      actionPlan.actions.shortTerm.find(a => a.pest === pestName) ||
                      actionPlan.actions.longTerm.find(a => a.pest === pestName);
                      
                    if (!pestAction || !pestAction.details) return null;
                    
                    return (
                      <div key={pestName} className="bg-white rounded-lg border border-gray-200 p-4">
                        <h5 className="font-semibold text-gray-900 mb-2">{pestName} Control Methods</h5>
                        
                        <div className="space-y-3">
                          {/* Cultural Control Methods */}
                          {pestAction.details.cultural && pestAction.details.cultural.length > 0 && (
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-1">Cultural Controls</h6>
                              <ul className="text-sm text-gray-600 space-y-1 pl-4">
                                {pestAction.details.cultural.map((method, index) => (
                                  <li key={index} className="list-disc">{method}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Biological Control Methods */}
                          {pestAction.details.biological && pestAction.details.biological.length > 0 && (
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-1">Biological Controls</h6>
                              <ul className="text-sm text-gray-600 space-y-1 pl-4">
                                {pestAction.details.biological.map((method, index) => (
                                  <li key={index} className="list-disc">{method}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Chemical Control Methods */}
                          {pestAction.details.chemical && pestAction.details.chemical.length > 0 && (
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-1">Chemical Controls</h6>
                              <ul className="text-sm text-gray-600 space-y-1 pl-4">
                                {pestAction.details.chemical.map((method, index) => (
                                  <li key={index} className="list-disc">{method}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Monitoring Methods */}
                          {pestAction.details.monitoring && pestAction.details.monitoring.length > 0 && (
                            <div>
                              <h6 className="text-sm font-medium text-gray-700 mb-1">Monitoring Methods</h6>
                              <ul className="text-sm text-gray-600 space-y-1 pl-4">
                                {pestAction.details.monitoring.map((method, index) => (
                                  <li key={index} className="list-disc">{method}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No pest control details available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-right">
        Last updated: {new Date(actionPlan.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default PestActionPlan; 