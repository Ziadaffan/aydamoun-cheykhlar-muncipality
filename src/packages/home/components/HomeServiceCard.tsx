import { TFunction } from "i18next";
import React, { useState } from "react";
import { ServiceCard } from "./HomeServicesSection";

type HomeServiceCardProps = {
  service: ServiceCard;
  t: TFunction<"translation", undefined>;
};

export default function HomeServiceCard({ service, t }: HomeServiceCardProps) {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  return (
    <div
      key={service.id}
      className={`bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 cursor-pointer ${
        isHovered === service.id
          ? "transform -translate-y-2 shadow-xl"
          : "hover:transform hover:-translate-y-1"
      }`}
      onMouseEnter={() => setIsHovered(service.id)}
      onMouseLeave={() => setIsHovered(null)}
    >
      <div className="text-4xl mb-4">{service.icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {t(service.titleKey)}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {t(service.descriptionKey)}
      </p>
    </div>
  );
}
