import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const historyData = [
  {
    id: '1',
    title: 'Geometri test',
    courseName: 'Matematik 1c',
    dueDate: '2025-09-15',
    submissions: 24,
    avgGrade: 'B'
  },
  {
    id: '2',
    title: 'Newtons lagar',
    courseName: 'Fysik 1',
    dueDate: '2025-09-10',
    submissions: 20,
    avgGrade: 'A'
  },
  {
    id: '3',
    title: 'Trigonometri',
    courseName: 'Matematik 1c',
    dueDate: '2025-08-28',
    submissions: 23,
    avgGrade: 'C'
  }
];

export default function TeacherAssignmentHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Uppgiftshistorik</h1>
        <p className="text-gray-600">Tidigare uppgifter och statistik</p>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Uppgift</TableHead>
              <TableHead>Kurs</TableHead>
              <TableHead>Förfallodatum</TableHead>
              <TableHead>Inlämningar</TableHead>
              <TableHead>Medelbetyg</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.courseName}</TableCell>
                <TableCell>{item.dueDate}</TableCell>
                <TableCell>{item.submissions}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.avgGrade}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-gray-100 text-gray-800">Avslutad</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
