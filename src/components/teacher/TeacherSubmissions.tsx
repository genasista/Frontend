import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { mockSubmissions } from '../../data/mockData';
import { FileText, Calendar } from 'lucide-react';

export default function TeacherSubmissions() {
  const pendingSubmissions = mockSubmissions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Rätta uppgifter</h1>
        <p className="text-gray-600">Inlämningar som väntar på rättning</p>
      </div>

      <div className="grid gap-4">
        {pendingSubmissions.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Inga väntande inlämningar</p>
          </Card>
        ) : (
          pendingSubmissions.map((submission) => (
            <Card key={submission.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl mb-1">{submission.assignmentTitle}</h3>
                  <p className="text-sm text-gray-600">{submission.courseName}</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Väntar</Badge>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Student: {submission.studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Inlämnad: {submission.submittedDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Rätta uppgift</Button>
                <Button variant="outline">Visa inlämning</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
