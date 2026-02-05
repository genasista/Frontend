import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { mockAssignments } from '../../data/mockData';
import { Calendar, Users } from 'lucide-react';

export default function TeacherAssignments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Mina uppgifter</h1>
          <p className="text-gray-600">Alla uppgifter du har skapat</p>
        </div>
        <Button>Skapa ny uppgift</Button>
      </div>

      <div className="grid gap-4">
        {mockAssignments.map((assignment) => (
          <Card key={assignment.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl mb-1">{assignment.title}</h3>
                <p className="text-sm text-gray-600">{assignment.courseName}</p>
              </div>
              <Badge variant="outline">Aktiv</Badge>
            </div>

            <p className="text-gray-700 mb-4">{assignment.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Förfaller: {assignment.dueDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>12 inlämningar</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">Redigera</Button>
              <Button variant="outline">Se inlämningar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
