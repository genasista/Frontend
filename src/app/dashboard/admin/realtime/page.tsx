import RealtimeWidget from "@/modules/realtime/components/RealTimeWidget";

export default function ControlCenterPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Realtime</h1>
      <RealtimeWidget />
    </div>
  );
}