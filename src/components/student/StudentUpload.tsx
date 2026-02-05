import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockAssignments } from '../../data/mockData';
import { Upload, FileText } from 'lucide-react';

export default function StudentUpload() {
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const pendingAssignments = mockAssignments.filter(a => a.status === 'pending');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Uppgift inlämnad!');
    setSelectedAssignment('');
    setComment('');
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Ladda upp uppgift</h1>
        <p className="text-gray-600">Lämna in dina uppgifter här</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl mb-6">Lämna in uppgift</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="assignment">Välj uppgift</Label>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj en uppgift" />
                </SelectTrigger>
                <SelectContent>
                  {pendingAssignments.map((assignment) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title} - {assignment.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file">Fil</Label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="comment">Kommentar (valfritt)</Label>
              <Textarea
                id="comment"
                placeholder="Lägg till en kommentar till din inlämning"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedAssignment || !file}>
              <Upload className="w-4 h-4 mr-2" />
              Lämna in uppgift
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl mb-6">Väntande uppgifter</h2>
          
          <div className="space-y-3">
            {pendingAssignments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Inga väntande uppgifter</p>
            ) : (
              pendingAssignments.map((assignment) => (
                <div key={assignment.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">{assignment.title}</p>
                  <p className="text-sm text-gray-600 mb-2">{assignment.courseName}</p>
                  <p className="text-sm text-gray-600">Förfaller: {assignment.dueDate}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
