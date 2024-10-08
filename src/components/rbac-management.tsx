import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Role {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  name: string;
}

export default function RBACManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<{[key: string]: string[]}>({});
  const [newRoleName, setNewRoleName] = useState('');
  const [newPermissionName, setNewPermissionName] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    fetchRolePermissions();
  }, []);

  const fetchRoles = async () => {
    // Fetch roles from API
    const response = await fetch('/api/roles');
    const data = await response.json();
    setRoles(data);
  };

  const fetchPermissions = async () => {
    // Fetch permissions from API
    const response = await fetch('/api/permissions');
    const data = await response.json();
    setPermissions(data);
  };

  const fetchRolePermissions = async () => {
    // Fetch role permissions from API
    const response = await fetch('/api/role-permissions');
    const data = await response.json();
    setRolePermissions(data);
  };

  const handleAddRole = async () => {
    // Add new role via API
    await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRoleName }),
    });
    setNewRoleName('');
    fetchRoles();
  };

  const handleAddPermission = async () => {
    // Add new permission via API
    await fetch('/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPermissionName }),
    });
    setNewPermissionName('');
    fetchPermissions();
  };

  const handlePermissionChange = async (roleId: string, permissionId: string, isChecked: boolean) => {
    // Update role permission via API
    await fetch('/api/role-permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId, permissionId, hasPermission: isChecked }),
    });
    fetchRolePermissions();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">RBAC Management</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Roles</h2>
        <div className="flex mb-2">
          <Input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="New role name"
            className="mr-2"
          />
          <Button onClick={handleAddRole}>Add Role</Button>
        </div>
        <ul>
          {roles.map(role => (
            <li key={role.id}>{role.name}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Permissions</h2>
        <div className="flex mb-2">
          <Input
            type="text"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
            placeholder="New permission name"
            className="mr-2"
          />
          <Button onClick={handleAddPermission}>Add Permission</Button>
        </div>
        <ul>
          {permissions.map(permission => (
            <li key={permission.id}>{permission.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Role Permissions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role / Permission</TableHead>
              {permissions.map(permission => (
                <TableHead key={permission.id}>{permission.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                {permissions.map(permission => (
                  <TableCell key={permission.id}>
                    <Checkbox
                      checked={rolePermissions[role.id]?.includes(permission.id)}
                      onCheckedChange={(checked) => handlePermissionChange(role.id, permission.id, checked as boolean)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}