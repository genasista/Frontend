import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { mockAssignments } from '../../data/mockData';
import { Calendar, FileText } from 'lucide-react';

export default function StudentAssignments() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ej inlämnad';
      case 'submitted': return 'Inlämnad';
      case 'graded': return 'Rättad';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Mina uppgifter</h1>
        <p className="text-gray-600">Alla dina uppgifter och inlämningar</p>
      </div>

      <div className="grid gap-4">
        {mockAssignments.map((assignment) => (
          <Card key={assignment.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl mb-1">{assignment.title}</h3>
                <p className="text-sm text-gray-600">{assignment.courseName}</p>
              </div>
              <Badge className={getStatusColor(assignment.status)}>
                {getStatusText(assignment.status)}
              </Badge>
            </div>

            <p className="text-gray-700 mb-4">{assignment.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Förfaller: {assignment.dueDate}</span>
              </div>
              {assignment.submittedDate && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Inlämnad: {assignment.submittedDate}</span>
                </div>
              )}
            </div>

            {assignment.grade && (
              <div className="p-3 bg-green-50 rounded-lg mb-4">
                <p className="text-sm">Betyg: <span className="font-medium">{assignment.grade}</span></p>
              </div>
            )}

            {assignment.status === 'pending' && (
              <Button>Lämna in uppgift</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
