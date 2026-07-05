import { Rocket, BookOpen, Headphones, Laptop, MapPin, Coffee } from "lucide-react";

export default function CurrentStatus() {
  const statusItems = [
    { icon: <Rocket size={14} />, label: "Building", value: "Mortar" },
    { icon: <BookOpen size={14} />, label: "Reading", value: "Designing Data-Intensive\nApplications" },
    { icon: <Headphones size={14} />, label: "Listening", value: "Pink Floyd" },
    { icon: <Laptop size={14} />, label: "Learning", value: "Distributed Systems" },
    { icon: <MapPin size={14} />, label: "Location", value: "Allahabad, India" },
    { icon: <Coffee size={14} />, label: "Caffeine", value: "Always" },
  ];

  return (
    <div className="flex flex-col gap-4 font-mono text-sm text-gray-400">
      <h2 className="text-blue-400 mb-2">/ current status</h2>
      
      <ul className="flex flex-col gap-3">
        {statusItems.map((item, index) => (
          <li key={index} className="flex gap-4 items-start">
            <span className="text-gray-500 mt-1">{item.icon}</span>
            <span className="leading-snug">
              <span className="text-gray-300">{item.label}:</span>{" "}
              <span className="whitespace-pre-line">{item.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
