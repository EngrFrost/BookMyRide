import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../../services/api'
import type { Vehicle, VehicleCategory, VehicleStatus } from '../../types'
import { VEHICLE_CATEGORY_LABELS, VEHICLE_STATUS_LABELS } from '../../types'
import { Badge, Button, GlassCard, Input, Modal, Select, Skeleton, toast, vehicleStatusTone } from '../../components/ui'

type VehicleForm = {
  name: string
  category: VehicleCategory
  description: string
  imageUrl: string
  status: VehicleStatus
}

const emptyForm: VehicleForm = {
  name: '',
  category: 'FOUR_SEATER',
  description: '',
  imageUrl: '',
  status: 'AVAILABLE',
}

export function ManageVehicles() {
  const location = useLocation()
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [form, setForm] = useState<VehicleForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setVehicles(await api.listVehicles())
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if ((location.state as { openCreate?: boolean } | null)?.openCreate) {
      openCreate()
      window.history.replaceState({}, '')
    }
  }, [location.state])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(vehicle: Vehicle) {
    setEditing(vehicle)
    setForm({
      name: vehicle.name,
      category: vehicle.category,
      description: vehicle.description ?? '',
      imageUrl: vehicle.imageUrl ?? '',
      status: vehicle.status,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('Vehicle name is required.')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await api.updateVehicle(editing.id, {
          name: form.name.trim(),
          category: form.category,
          description: form.description || null,
          imageUrl: form.imageUrl || null,
          status: form.status,
        })
        toast.success('Vehicle updated.')
      } else {
        await api.createVehicle({
          name: form.name.trim(),
          category: form.category,
          description: form.description || null,
          imageUrl: form.imageUrl || null,
          status: form.status,
        })
        toast.success('Vehicle added.')
      }
      setModalOpen(false)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(vehicle: Vehicle) {
    if (!confirm(`Delete ${vehicle.name}? This cannot be undone.`)) return
    try {
      await api.deleteVehicle(vehicle.id)
      toast.success('Vehicle deleted.')
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed.')
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-headline-lg md:text-headline-xl">
          Vehicle <span className="text-primary">Management</span>
        </h1>
        <Button onClick={openCreate}>Add vehicle</Button>
      </div>

      <GlassCard className="mt-8 overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-body-md">
            <thead className="border-b border-white/[0.08] bg-white/[0.03] text-label-md text-on-surface-variant">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {vehicles === null
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-5 py-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                : vehicles.map((v) => (
                    <tr key={v.id} className="transition-colors hover:bg-white/[0.03]">
                      <td className="px-5 py-3 font-medium">{v.name}</td>
                      <td className="px-5 py-3 text-on-surface-variant">
                        {VEHICLE_CATEGORY_LABELS[v.category]}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={vehicleStatusTone[v.status]}>
                          {VEHICLE_STATUS_LABELS[v.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(v)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(v)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit vehicle' : 'Add vehicle'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? 'Save changes' : 'Add vehicle'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Toyota Vios #3"
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as VehicleCategory }))}
            options={Object.entries(VEHICLE_CATEGORY_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as VehicleStatus }))}
            options={Object.entries(VEHICLE_STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Input
            label="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>
      </Modal>
    </div>
  )
}
