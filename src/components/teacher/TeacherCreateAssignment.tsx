import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockCourses } from '../../data/mockData';
import { Plus } from 'lucide-react';

export default function TeacherCreateAssignment() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Uppgift skapad!');
    setTitle('');
    setDescription('');
    setCourseId('');
    setDueDate('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Skapa ny uppgift</h1>
        <p className="text-gray-600">Skapa en ny uppgift för dina elever</p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="course">Kurs</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj en kurs" />
                </SelectTrigger>
                <SelectContent>
                  {mockCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                placeholder="T.ex. Algebra uppgift 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Beskrivning</Label>
              <Textarea
                id="description"
                placeholder="Beskriv uppgiften och vad eleverna ska göra"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Sista inlämningsdag</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={!title || !courseId || !dueDate}>
              <Plus className="w-4 h-4 mr-2" />
              Skapa uppgift
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
