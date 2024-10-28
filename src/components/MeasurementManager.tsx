import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ScrollArea } from './ui/scroll-area'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Measurement {
  id: string
  name: string
  value: number
  unit: string
  date: string
}

interface MeasurementManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function MeasurementManager({ isOpen, onClose }: MeasurementManagerProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [newMeasurement, setNewMeasurement] = useState<Omit<Measurement, 'id'>>({
    name: '',
    value: 0,
    unit: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const storedMeasurements = localStorage.getItem('measurements')
    if (storedMeasurements) {
      setMeasurements(JSON.parse(storedMeasurements))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('measurements', JSON.stringify(measurements))
  }, [measurements])

  const handleAddMeasurement = () => {
    const measurement: Measurement = {
      ...newMeasurement,
      id: Date.now().toString()
    }
    setMeasurements([...measurements, measurement])
    setNewMeasurement({
      name: '',
      value: 0,
      unit: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleDeleteMeasurement = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id))
  }

  const groupedMeasurements = measurements.reduce((acc, measurement) => {
    if (!acc[measurement.name]) {
      acc[measurement.name] = []
    }
    acc[measurement.name].push(measurement)
    return acc
  }, {} as Record<string, Measurement[]>)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerenciador de Medidas</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Adicionar Nova Medida</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Medida</Label>
              <Input
                id="name"
                value={newMeasurement.name}
                onChange={e => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
              />
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                type="number"
                value={newMeasurement.value}
                onChange={e => setNewMeasurement({ ...newMeasurement, value: parseFloat(e.target.value) })}
              />
              <Label htmlFor="unit">Unidade</Label>
              <Input
                id="unit"
                value={newMeasurement.unit}
                onChange={e => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
              />
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newMeasurement.date}
                onChange={e => setNewMeasurement({ ...newMeasurement, date: e.target.value })}
              />
              <Button onClick={handleAddMeasurement}>Adicionar Medida</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Medidas Salvas</h3>
            <ScrollArea className="h-[300px]">
              {Object.entries(groupedMeasurements).map(([name, measurements]) => (
                <div key={name} className="mb-4">
                  <h4 className="font-semibold">{name}</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={measurements}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <ul>
                    {measurements.map(m => (
                      <li key={m.id} className="flex justify-between items-center">
                        <span>{m.value} {m.unit} ({m.date})</span>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteMeasurement(m.id)}>
                          Excluir
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
