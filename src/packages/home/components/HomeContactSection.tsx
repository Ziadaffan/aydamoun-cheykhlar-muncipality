"use client";

import MapCard from "@/packages/common/components/MapCard";

interface ContactInfo {
  id: number;
  icon: string;
  titleKey: string;
  valueKey: string;
}

const contactInfo: ContactInfo[] = [
  {
    id: 1,
    icon: "🕒",
    titleKey: "home.contact.info.timing.title",
    valueKey: "home.contact.info.timing.value",
  },
  {
    id: 2,
    icon: "📞",
    titleKey: "home.contact.info.phone.title",
    valueKey: "home.contact.info.phone.value",
  },
  {
    id: 3,
    icon: "✉️",
    titleKey: "home.contact.info.email.title",
    valueKey: "home.contact.info.email.value",
  },
];

interface HomeContactSectionProps {
  t: (key: string) => string;
}

export default function HomeContactSection({ t }: HomeContactSectionProps) {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("home.contact.title")}
          </h2>
          <p className="text-xl text-gray-600">{t("home.contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <div
                key={info.id}
                className="flex items-start space-x-4 p-6 bg-gray-100 rounded-lg"
              >
                <div className="text-3xl">{info.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t(info.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(info.valueKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <MapCard />
          </div>
        </div>
      </div>
    </div>
  );
}
