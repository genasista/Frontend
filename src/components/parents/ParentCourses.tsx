import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { mockCourses } from '../../data/mockData';
import { BookOpen, Calendar, User } from 'lucide-react';

export default function ParentCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Barnets kurser</h1>
        <p className="text-gray-600">Översikt över ditt barns aktiva kurser</p>
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

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Lärare: {course.teacher}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{course.startDate} - {course.endDate}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
