import { TFunction } from "i18next";
import React from "react";

type HomeHeaderSectionProps = {
  t: TFunction<"translation", undefined>;
};

export default function HomeHeaderSection({ t }: HomeHeaderSectionProps) {
  return (
    <div
      className="relative h-100 flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/assets/images/bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {t("home.hero.title")}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          {t("home.hero.subtitle")}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          {t("home.hero.ctaButton")}
        </button>
      </div>
    </div>
  );
}
