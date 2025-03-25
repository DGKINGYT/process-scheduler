import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Server, Plus, Trash2, Play } from 'lucide-react';

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

    return sortedProcesses.map(process => {
      const processStart = Math.max(currentTime, process.arrivalTime);
      currentTime = processStart + process.burstTime;
      
      return {
        ...process,
        startTime: processStart,
        completionTime: currentTime,
        turnAroundTime: currentTime - process.arrivalTime,
        waitingTime: processStart - process.arrivalTime
      };
    });
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
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="mr-2" /> Process Scheduler
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Process Input Form */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <Label>Process ID</Label>
            <Input 
              name="id"
              value={newProcess.id}
              onChange={handleInputChange}
              placeholder="Process ID"
              type="text"
            />
          </div>
          <div>
            <Label>Arrival Time</Label>
            <Input 
              name="arrivalTime"
              value={newProcess.arrivalTime}
              onChange={handleInputChange}
              placeholder="Arrival Time"
              type="number"
            />
          </div>
          <div>
            <Label>Burst Time</Label>
            <Input 
              name="burstTime"
              value={newProcess.burstTime}
              onChange={handleInputChange}
              placeholder="Burst Time"
              type="number"
            />
          </div>
          <div>
            <Label>Priority (Optional)</Label>
            <Input 
              name="priority"
              value={newProcess.priority}
              onChange={handleInputChange}
              placeholder="Priority"
              type="number"
            />
          </div>
        </div>

        {/* Add Process Button */}
        <Button 
          onClick={addProcess}
          className="mb-4"
        >
          <Plus className="mr-2" /> Add Process
        </Button>

        {/* Scheduling Algorithm Selector */}
        <div className="mb-4">
          <Label>Scheduling Algorithm</Label>
          <select 
            className="w-full p-2 border rounded"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            {Object.values(SCHEDULING_ALGORITHMS).map(algo => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>

        {/* Process List */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Processes</CardTitle>
          </CardHeader>
          <CardContent>
            {processes.length === 0 ? (
              <p>No processes added yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processes.map(process => (
                  <Card key={process.id} className="p-4 relative">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => removeProcess(process.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Simulate Button */}
        <Button 
          onClick={runSimulation}
          disabled={processes.length === 0}
        >
          <Play className="mr-2" /> Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcessSchedulerVisualization;