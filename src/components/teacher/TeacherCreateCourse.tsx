import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus } from 'lucide-react';

export default function TeacherCreateCourse() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Kurs skapad!');
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Skapa ny kurs</h1>
        <p className="text-gray-600">Skapa en ny kurs för dina elever</p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Kursnamn</Label>
              <Input
                id="name"
                placeholder="T.ex. Matematik 1c"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Beskrivning</Label>
              <Textarea
                id="description"
                placeholder="Beskriv kursens innehåll och mål"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Startdatum</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Slutdatum</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!name || !startDate || !endDate}>
              <Plus className="w-4 h-4 mr-2" />
              Skapa kurs
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
