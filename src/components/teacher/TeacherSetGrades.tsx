import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { mockSubmissions } from '../../data/mockData';

export default function TeacherSetGrades() {
  const [selectedSubmission, setSelectedSubmission] = useState('');
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Betyg satt!');
    setSelectedSubmission('');
    setGrade('');
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Sätta betyg</h1>
        <p className="text-gray-600">Betygsätt elevernas inlämningar</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl mb-6">Sätt betyg</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="submission">Välj inlämning</Label>
              <Select value={selectedSubmission} onValueChange={setSelectedSubmission}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj en inlämning" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubmissions.map((submission) => (
                    <SelectItem key={submission.id} value={submission.id}>
                      {submission.studentName} - {submission.assignmentTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grade">Betyg</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj betyg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A - Utmärkt</SelectItem>
                  <SelectItem value="B">B - Mycket bra</SelectItem>
                  <SelectItem value="C">C - Bra</SelectItem>
                  <SelectItem value="D">D - Godkänt</SelectItem>
                  <SelectItem value="F">F - Icke godkänt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="feedback">Feedback till eleven</Label>
              <Textarea
                id="feedback"
                placeholder="Ge feedback på elevens arbete"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedSubmission || !grade}>
              Sätt betyg
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl mb-6">Senaste inlämningar</h2>
          
          <div className="space-y-3">
            {mockSubmissions.slice(0, 5).map((submission) => (
              <div key={submission.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-1">{submission.studentName}</p>
                <p className="text-sm text-gray-600 mb-1">{submission.assignmentTitle}</p>
                <p className="text-sm text-gray-600">{submission.courseName}</p>
                {submission.grade && (
                  <p className="text-sm mt-2">Betyg: <span className="font-medium">{submission.grade}</span></p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
