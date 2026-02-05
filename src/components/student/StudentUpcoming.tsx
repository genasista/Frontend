import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { upcomingCourses } from '../../data/mockData';
import { BookOpen, Calendar, User, Clock } from 'lucide-react';

export default function StudentUpcoming() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Kommande kurser</h1>
        <p className="text-gray-600">Kurser du kommer att börja snart</p>
      </div>

      {upcomingCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Inga kommande kurser</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingCourses.map((course) => (
            <Card key={course.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl">{course.name}</h3>
                    <Badge variant="outline" className="mt-1 bg-purple-50 text-purple-700 border-purple-200">
                      Kommande
                    </Badge>
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
                  <span>Startar: {course.startDate}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
