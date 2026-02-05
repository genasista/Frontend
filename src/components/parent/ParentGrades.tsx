import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { mockGrades } from '../../data/mockData';
import { TrendingUp } from 'lucide-react';

export default function ParentGrades() {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Barnets betyg</h1>
        <p className="text-gray-600">Översikt över ditt barns betyg och framsteg</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {['A', 'B', 'C', 'D'].map((grade) => {
          const count = mockGrades.filter(g => g.grade === grade).length;
          return (
            <Card key={grade} className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${getGradeColor(grade)}`}>
                <span className="text-xl">{grade}</span>
              </div>
              <p className="text-2xl">{count}</p>
              <p className="text-sm text-gray-600">betyg</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-xl">Betygshistorik</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Uppgift</TableHead>
              <TableHead>Kurs</TableHead>
              <TableHead>Betyg</TableHead>
              <TableHead>Datum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockGrades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell>{grade.assignmentTitle}</TableCell>
                <TableCell>{grade.courseName}</TableCell>
                <TableCell>
                  <Badge className={getGradeColor(grade.grade)}>
                    {grade.grade}
                  </Badge>
                </TableCell>
                <TableCell>{grade.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
