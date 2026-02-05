import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const historyData = [
  {
    id: '1',
    name: 'Matematik 1b',
    startDate: '2024-08-15',
    endDate: '2025-01-15',
    students: 26,
    avgGrade: 'B'
  },
  {
    id: '2',
    name: 'Fysik 1',
    startDate: '2024-08-15',
    endDate: '2025-01-15',
    students: 22,
    avgGrade: 'A'
  },
  {
    id: '3',
    name: 'Matematik 1a',
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    students: 24,
    avgGrade: 'C'
  }
];

export default function TeacherCourseHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Kurshistorik</h1>
        <p className="text-gray-600">Tidigare kurser och statistik</p>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kurs</TableHead>
              <TableHead>Startdatum</TableHead>
              <TableHead>Slutdatum</TableHead>
              <TableHead>Antal elever</TableHead>
              <TableHead>Medelbetyg</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.startDate}</TableCell>
                <TableCell>{item.endDate}</TableCell>
                <TableCell>{item.students}</TableCell>
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
