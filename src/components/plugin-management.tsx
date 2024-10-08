import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { pluginManager, Plugin } from './plugin-system';

export default function PluginManagement() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    setPlugins(pluginManager.getLoadedPlugins());
  }, []);

  const handleActivate = async (plugin: Plugin) => {
    await pluginManager.activatePlugin(plugin.name);
    setPlugins([...plugins]); // Force re-render
  };

  const handleDeactivate = async (plugin: Plugin) => {
    await pluginManager.deactivatePlugin(plugin.name);
    setPlugins([...plugins]); // Force re-render
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Plugin Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plugins.map(plugin => (
            <TableRow key={plugin.name}>
              <TableCell>{plugin.name}</TableCell>
              <TableCell>{plugin.version}</TableCell>
              <TableCell>{plugin.description}</TableCell>
              <TableCell>
                <Button onClick={() => handleActivate(plugin)} className="mr-2">Activate</Button>
                <Button onClick={() => handleDeactivate(plugin)} variant="outline">Deactivate</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}