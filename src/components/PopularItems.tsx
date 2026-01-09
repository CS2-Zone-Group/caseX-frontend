"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

type SkinsType = {
  id: string;
  name: string;
  price: string;
  icon_url: string;
  float: string;
};

const skins: SkinsType[] = [
  {
    id: "AWP | Dragon Lore",
    name: "AWP | Dragon Lore",
    price: "$12,500.00",
    icon_url: "",
    float: "Factory New",
  },
  {
    id: "M4A4 | Howl",
    name: "M4A4 | Howl",
    price: "$4,200.00",
    icon_url: "",
    float: "Minimal Wear",
  },
  {
    id: "Karambit | Doppler",
    name: "Karambit | Doppler",
    price: "$1,100.00",
    icon_url: "",
    float: "Factory New",
  },
  {
    id: "Sport Gloves | Pandora's Box",
    name: "Sport Gloves | Pandora's Box",
    price: "$1,450.00",
    icon_url: "",
    float: "Field-Tested",
  },
];

const PopularItems = () => {
  const router = useRouter();
  const t = useTranslations("PopularItems");

  const goMarket = (id: string) => {
    router.push(`/marketplace?category=${id}`);
  };

  const tFloat = (floatKey: string) => {
    const conditionMap: Record<string, string> = {
      "Factory New": "skinConditions.factoryNew",
      "Minimal Wear": "skinConditions.minimalWear",
      "Field-Tested": "skinConditions.fieldTested",
      "Well-Worn": "skinConditions.wellWorn",
      "Battle-Scarred": "skinConditions.battleScarred",
    };
    return t(conditionMap[floatKey] as any) || floatKey;
  };

  return (
    <>
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 text-center text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-500">
            {t("title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skins.map((item, index) => (
              <div
                key={index}
                onClick={() => goMarket(item.id)}
                className="group/card cursor-pointer relative flex flex-col justify-between h-[420px] w-full bg-white dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500"></div>

                <div className="relative h-16 w-full overflow-hidden flex items-center justify-center mb-4">
                  <h1 className="absolute w-full px-2 text-center text-xl font-black italic uppercase tracking-tighter transition-transform duration-300 ease-in-out group-hover/card:translate-y-[170%] text-transparent [-webkit-text-stroke:1px_#9ca3af] dark:[-webkit-text-stroke:1px_#4b5563]">
                    {item.name}
                  </h1>
                  <h1 className="absolute w-full px-2 text-center text-xl font-black italic uppercase tracking-tighter text-green-500 transition-transform duration-300 ease-in-out -translate-y-[170%] group-hover/card:translate-y-0">
                    {item.name}
                  </h1>
                </div>

                <div className="flex justify-center items-center flex-1 overflow-hidden py-4">
                  <img
                    className="w-full h-40 object-contain drop-shadow-xl transition-transform duration-500 group-hover/card:scale-110 group-hover/card:rotate-3"
                    src={`https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}/360fx360f`}
                    alt={item.name}
                  />
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 dark:border-gray-800 pt-5 mt-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      {tFloat(item.float)}
                    </p>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {t("startFrom")}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.price}
                      </span>
                    </div>
                  </div>

                  <button className="group/btn relative w-12 h-12 bg-gray-100 dark:bg-black rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 text-gray-600 dark:text-gray-300 shadow-sm">
                    <span className="absolute flex items-center justify-center w-full h-full transition-transform duration-300 ease-in-out translate-x-0 group-hover/btn:translate-x-full">
                      <ArrowForwardIcon fontSize="small" />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full transition-transform duration-300 ease-in-out -translate-x-full group-hover/btn:translate-x-0">
                      <ArrowForwardIcon fontSize="small" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-lg font-bold tracking-wide"
            >
              {t("viewAllItems")}
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularItems;
