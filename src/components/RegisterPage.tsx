import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const { register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password, role);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <GraduationCap className="w-12 h-12 text-blue-600 mb-2" />
          <h1 className="text-2xl">Skapa konto</h1>
          <p className="text-gray-600">Kom igång med EduPortal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Fullständigt namn</Label>
            <Input
              id="name"
              type="text"
              placeholder="Anna Andersson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Jag är en</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Elev</SelectItem>
                <SelectItem value="teacher">Lärare</SelectItem>
                <SelectItem value="parent">Förälder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Skapa konto
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Har du redan ett konto?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-600 hover:underline"
            >
              Logga in
            </button>
          </p>
          <button
            onClick={() => onNavigate('landing')}
            className="text-sm text-gray-600 hover:underline mt-2"
          >
            Tillbaka till startsidan
          </button>
        </div>
      </Card>
    </div>
  );
}
