import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LogEntry {
  timestamp: string;
  message: string;
  level: string;
  service?: string;
}

export default function LogViewer({ initialLogs }: { initialLogs: LogEntry[] }) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) ||
    log.level.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Log Viewer</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter logs..."
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          className="w-full"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Service</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log, index) => (
            <TableRow key={index}>
              <TableCell>{log.timestamp}</TableCell>
              <TableCell>{log.level}</TableCell>
              <TableCell>{log.message}</TableCell>
              <TableCell>{log.service}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={fetchLogs} className="mt-4">Refresh Logs</Button>
    </div>
  );
}