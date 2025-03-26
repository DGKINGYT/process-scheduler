import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// Process states
const PROCESS_STATES = {
  NEW: 'New',
  READY: 'Ready',
  RUNNING: 'Running', 
  WAITING: 'Waiting',
  TERMINATED: 'Terminated'
};

// Scheduling algorithms
const SCHEDULING_ALGORITHMS = {
  FCFS: 'First-Come, First-Served (FCFS)',
  RR: 'Round Robin (RR)',
  SJF: 'Shortest Job First (SJF)',
  PRIORITY: 'Priority Scheduling'
};

const ProcessSchedulerVisualization = () => {
  const [processes, setProcesses] = useState([]);
  const [ganttData, setGanttData] = useState([]);
  const [newProcess, setNewProcess] = useState({
    id: '',
    arrivalTime: '',
    burstTime: '',
    priority: ''
  });
  const [algorithm, setAlgorithm] = useState(SCHEDULING_ALGORITHMS.FCFS);

  // Process input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProcess(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add process to list
  const addProcess = () => {
    // Validate input
    if (!newProcess.id || !newProcess.arrivalTime || !newProcess.burstTime) {
      alert('Please fill in all required fields');
      return;
    }

    const processToAdd = {
      id: newProcess.id,
      arrivalTime: parseInt(newProcess.arrivalTime),
      burstTime: parseInt(newProcess.burstTime),
      priority: newProcess.priority ? parseInt(newProcess.priority) : 0,
      state: PROCESS_STATES.NEW
    };

    // Check for duplicate process IDs
    if (processes.some(p => p.id === processToAdd.id)) {
      alert('A process with this ID already exists');
      return;
    }

    setProcesses(prev => [...prev, processToAdd]);
    
    // Reset input form
    setNewProcess({
      id: '',
      arrivalTime: '',
      burstTime: '',
      priority: ''
    });
  };

  // Remove process from list
  const removeProcess = (id) => {
    setProcesses(prev => prev.filter(process => process.id !== id));
  };

  // Simulate First-Come, First-Served (FCFS) scheduling
  const simulateFCFS = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    const ganttChartData = [];

    const scheduledProcesses = sortedProcesses.map(process => {
      const processStart = Math.max(currentTime, process.arrivalTime);
      currentTime = processStart + process.burstTime;
      
      // Prepare Gantt chart data
      ganttChartData.push({
        process: `P${process.id}`,
        start: processStart,
        end: currentTime
      });

      return {
        ...process,
        startTime: processStart,
        completionTime: currentTime,
        turnAroundTime: currentTime - process.arrivalTime,
        waitingTime: processStart - process.arrivalTime
      };
    });

    setGanttData(ganttChartData);
    return scheduledProcesses;
  };

  // Run scheduling simulation
  const runSimulation = () => {
    let result;
    switch(algorithm) {
      case SCHEDULING_ALGORITHMS.FCFS:
        result = simulateFCFS();
        break;
      default:
        alert('Selected algorithm not implemented yet');
        return;
    }

    // Update processes with simulation results
    setProcesses(result);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          Process Scheduler
        </h2>

        {/* Process Input Form */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Process ID</label>
            <input 
              name="id"
              value={newProcess.id}
              onChange={handleInputChange}
              placeholder="Process ID"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
            <input 
              name="arrivalTime"
              value={newProcess.arrivalTime}
              onChange={handleInputChange}
              placeholder="Arrival Time"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Burst Time</label>
            <input 
              name="burstTime"
              value={newProcess.burstTime}
              onChange={handleInputChange}
              placeholder="Burst Time"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority (Optional)</label>
            <input 
              name="priority"
              value={newProcess.priority}
              onChange={handleInputChange}
              placeholder="Priority"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Add Process Button */}
        <button 
          onClick={addProcess}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          + Add Process
        </button>

        {/* Scheduling Algorithm Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Scheduling Algorithm</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            {Object.values(SCHEDULING_ALGORITHMS).map(algo => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>

        {/* Process List */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Processes</h3>
          {processes.length === 0 ? (
            <p className="text-gray-500">No processes added yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processes.map(process => (
                <div key={process.id} className="bg-white shadow rounded-lg p-4 relative">
                  <button 
                    onClick={() => removeProcess(process.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <h4 className="font-bold mb-2">Process {process.id}</h4>
                  <p>Arrival Time: {process.arrivalTime}</p>
                  <p>Burst Time: {process.burstTime}</p>
                  {process.priority !== undefined && (
                    <p>Priority: {process.priority}</p>
                  )}
                  {process.completionTime && (
                    <>
                      <p>Completion Time: {process.completionTime}</p>
                      <p>Turn Around Time: {process.turnAroundTime}</p>
                      <p>Waiting Time: {process.waitingTime}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Simulate Button */}
        <button 
          onClick={runSimulation}
          disabled={processes.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ▶ Run Simulation
        </button>

        {/* Gantt Chart Visualization */}
        {ganttData.length > 0 && (
          <div className="mt-4 bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Gantt Chart</h3>
            <BarChart 
              width={730} 
              height={250} 
              data={ganttData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="process" 
                label={{ value: 'Processes', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Time', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="start" 
                stackId="a" 
                fill="#8884d8" 
                name="Start Time"
              />
              <Bar 
                dataKey="end" 
                stackId="a" 
                fill="#82ca9d" 
                name="End Time"
              />
            </BarChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessSchedulerVisualization;
