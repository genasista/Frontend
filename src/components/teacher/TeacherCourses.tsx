import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { mockCourses } from '../../data/mockData';
import { BookOpen, Calendar, Users } from 'lucide-react';

export default function TeacherCourses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Mina kurser</h1>
          <p className="text-gray-600">Alla kurser du undervisar</p>
        </div>
        <Button>Skapa ny kurs</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockCourses.map((course) => (
          <Card key={course.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl">{course.name}</h3>
                  <Badge variant="outline" className="mt-1">Aktiv</Badge>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{course.students} elever</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{course.startDate} - {course.endDate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">Redigera</Button>
              <Button variant="outline">Se elever</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
